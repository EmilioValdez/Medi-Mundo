import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dialog } from '@headlessui/react';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import formatMXN from '../../utils/formatMXN';

const emptyForm = {
  name: '',
  category_id: '',
  description: '',
  price_daily: '',
  price_weekly: '',
  price_monthly: '',
  deposit: '',
  quantity_total: 1,
  quantity_available: 1,
  serial_number: '',
  condition: 'available',
  image_url: '',
  is_active: true,
};

/* ── Inline editable cell ── */
function EditableCell({ value, onSave, prefix = '$', type = 'number' }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? '');
  const inputRef = useRef(null);

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commit = async () => {
    setEditing(false);
    const num = parseFloat(val);
    if (!isNaN(num) && num !== value) await onSave(num);
    else setVal(value ?? '');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setEditing(false); setVal(value ?? ''); }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min="0"
        step="1"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKey}
        className="w-24 rounded border border-primary-400 px-2 py-1 text-right text-sm font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      title="Clic para editar"
      className="group flex items-center justify-end gap-1 rounded px-1 py-0.5 hover:bg-primary-50 transition-colors"
    >
      <span className="text-gray-700 font-medium">
        {value != null && value !== '' ? formatMXN(value) : <span className="text-gray-300">—</span>}
      </span>
      <PencilSquareIcon className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
}

/* ── Inline quantity cell ── */
function QuantityCell({ available, total, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(available ?? 0);
  const inputRef = useRef(null);

  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commit = async () => {
    setEditing(false);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num !== available) await onSave(num);
    else setVal(available ?? 0);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { setEditing(false); setVal(available ?? 0); }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min="0"
        max={total}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKey}
        className="w-16 rounded border border-primary-400 px-2 py-1 text-center text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      title="Clic para editar disponibles"
      className="group flex items-center justify-center gap-1 rounded px-1 py-0.5 hover:bg-primary-50 transition-colors"
    >
      <span className={`font-medium ${available === 0 ? 'text-red-600' : 'text-gray-700'}`}>
        {available ?? '-'}/{total ?? '-'}
      </span>
      <PencilSquareIcon className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
}

export default function InventoryPage() {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (filterCat) params.category_id = filterCat;
      const [eqRes, catRes] = await Promise.all([
        apiClient.get('/equipment/', { params }),
        apiClient.get('/categories/'),
      ]);
      setEquipment(Array.isArray(eqRes.data) ? eqRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [search, filterCat]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const patchItem = async (id, patch) => {
    setSavingId(id);
    try {
      await apiClient.put(`/equipment/${id}`, patch);
      setEquipment((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
      );
    } catch {
      alert('Error al guardar. Intenta de nuevo.');
      fetchData();
    } finally {
      setSavingId(null);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || '',
      category_id: item.category_id || '',
      description: item.description || '',
      price_daily: item.price_daily ?? '',
      price_weekly: item.price_weekly ?? '',
      price_monthly: item.price_monthly ?? '',
      deposit: item.deposit ?? '',
      quantity_total: item.quantity_total ?? 1,
      quantity_available: item.quantity_available ?? 1,
      serial_number: item.serial_number || '',
      condition: item.condition || 'available',
      image_url: item.images?.[0] || '',
      is_active: item.is_active !== false,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category_id: Number(form.category_id) || null,
        description: form.description,
        price_daily: form.price_daily !== '' ? Number(form.price_daily) : null,
        price_weekly: form.price_weekly !== '' ? Number(form.price_weekly) : null,
        price_monthly: form.price_monthly !== '' ? Number(form.price_monthly) : null,
        deposit: form.deposit !== '' ? Number(form.deposit) : null,
        quantity_total: Number(form.quantity_total) || 1,
        quantity_available: Number(form.quantity_available) || 1,
        serial_number: form.serial_number,
        condition: form.condition || 'available',
        images: form.image_url ? [form.image_url] : null,
        is_active: form.is_active,
      };
      if (editing) {
        await apiClient.put(`/equipment/${editing.id}`, payload);
      } else {
        await apiClient.post('/equipment/', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`¿Eliminar "${item.name}"?`)) return;
    try {
      await apiClient.delete(`/equipment/${item.id}`);
      fetchData();
    } catch {
      alert('Error al eliminar.');
    }
  };

  const conditionLabel = {
    available: { label: 'Disponible', cls: 'bg-green-100 text-green-700' },
    rented:    { label: 'Rentado',    cls: 'bg-blue-100 text-blue-700' },
    maintenance: { label: 'Mantenimiento', cls: 'bg-yellow-100 text-yellow-700' },
  };

  return (
    <>
      <Helmet><title>Inventario — MediMundo Admin</title></Helmet>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
            <p className="text-xs text-gray-400 mt-0.5">Haz clic en cualquier precio o cantidad para editarlo directamente.</p>
          </div>
          <button onClick={openCreate} className="btn-primary">
            <PlusIcon className="h-5 w-5" />
            Agregar equipo
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : equipment.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-gray-500">No se encontró equipo.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Equipo</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Categoría</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Diario</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Semanal</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Mensual</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Disponibles</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Condición</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Activo</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Editar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {equipment.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${savingId === item.id ? 'opacity-60' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        {item.serial_number && (
                          <div className="text-xs text-gray-400">S/N: {item.serial_number}</div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-gray-500">{item.category_name || '-'}</td>

                      <td className="px-4 py-3 text-right">
                        <EditableCell
                          value={item.price_daily}
                          onSave={(v) => patchItem(item.id, { price_daily: v })}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <EditableCell
                          value={item.price_weekly}
                          onSave={(v) => patchItem(item.id, { price_weekly: v })}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <EditableCell
                          value={item.price_monthly}
                          onSave={(v) => patchItem(item.id, { price_monthly: v })}
                        />
                      </td>

                      <td className="px-4 py-3 text-center">
                        <QuantityCell
                          available={item.quantity_available}
                          total={item.quantity_total}
                          onSave={(v) => patchItem(item.id, { quantity_available: v })}
                        />
                      </td>

                      <td className="px-4 py-3 text-center">
                        <select
                          value={item.condition || 'available'}
                          onChange={(e) => patchItem(item.id, { condition: e.target.value })}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 cursor-pointer focus:ring-1 focus:ring-primary-400 ${conditionLabel[item.condition]?.cls || 'bg-gray-100 text-gray-600'}`}
                        >
                          <option value="available">Disponible</option>
                          <option value="rented">Rentado</option>
                          <option value="maintenance">Mantenimiento</option>
                        </select>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => patchItem(item.id, { is_active: !item.is_active })}
                          title="Cambiar visibilidad"
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${
                            item.is_active !== false ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            item.is_active !== false ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                            title="Editar todo"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal — edición completa */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-bold text-gray-900">
                {editing ? 'Editar equipo' : 'Agregar equipo'}
              </Dialog.Title>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Nombre *</label>
                <input name="name" required value={form.name} onChange={handleChange} className="input-field" />
              </div>

              <div>
                <label className="label-field">Categoría *</label>
                <select name="category_id" required value={form.category_id} onChange={handleChange} className="input-field">
                  <option value="">Seleccionar...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-field">Descripción</label>
                <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="input-field" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label-field">Precio diario</label>
                  <input name="price_daily" type="number" step="0.01" min="0" value={form.price_daily} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Precio semanal</label>
                  <input name="price_weekly" type="number" step="0.01" min="0" value={form.price_weekly} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Precio mensual</label>
                  <input name="price_monthly" type="number" step="0.01" min="0" value={form.price_monthly} onChange={handleChange} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label-field">Depósito</label>
                  <input name="deposit" type="number" step="0.01" min="0" value={form.deposit} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Cant. total</label>
                  <input name="quantity_total" type="number" min="0" value={form.quantity_total} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="label-field">Cant. disponible</label>
                  <input name="quantity_available" type="number" min="0" value={form.quantity_available} onChange={handleChange} className="input-field" />
                </div>
              </div>

              <div>
                <label className="label-field">Condición</label>
                <select name="condition" value={form.condition} onChange={handleChange} className="input-field">
                  <option value="available">Disponible</option>
                  <option value="rented">Rentado</option>
                  <option value="maintenance">En mantenimiento</option>
                </select>
              </div>

              <div>
                <label className="label-field">No. de serie</label>
                <input name="serial_number" value={form.serial_number} onChange={handleChange} className="input-field" />
              </div>

              <div>
                <label className="label-field">URL de imagen</label>
                <input name="image_url" type="url" value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://..." />
              </div>

              <div className="flex items-center gap-2">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="text-sm text-gray-700">Activo (visible en el sitio)</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-white flex-1">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
