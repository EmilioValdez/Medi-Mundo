import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dialog } from '@headlessui/react';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const toggleActive = async (item) => {
    try {
      await apiClient.put(`/equipment/${item.id}`, { is_active: !item.is_active });
      fetchData();
    } catch {
      alert('Error al cambiar disponibilidad.');
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

  return (
    <>
      <Helmet><title>Inventario — MediMundo Admin</title></Helmet>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
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
            <div className="px-5 py-16 text-center text-sm text-gray-500">
              No se encontró equipo.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Equipo</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Categoría</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Diario</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Semanal</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Mensual</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Cant.</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Estado</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {equipment.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        {item.serial_number && (
                          <div className="text-xs text-gray-400">S/N: {item.serial_number}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.category_name || '-'}</td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {item.price_daily != null ? formatMXN(item.price_daily) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {item.price_weekly != null ? formatMXN(item.price_weekly) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {item.price_monthly != null ? formatMXN(item.price_monthly) : '-'}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">{item.quantity_available ?? '-'}/{item.quantity_total ?? '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleActive(item)}
                          title="Cambiar disponibilidad"
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-opacity hover:opacity-75 ${
                            item.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${item.is_active !== false ? 'bg-green-500' : 'bg-red-500'}`} />
                          {item.is_active !== false ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                            title="Editar"
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

      {/* Modal */}
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
                <button type="button" onClick={() => setModalOpen(false)} className="btn-white flex-1">
                  Cancelar
                </button>
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
