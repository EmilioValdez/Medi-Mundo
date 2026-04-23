import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dialog } from '@headlessui/react';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', image_url: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/categories/');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', image_url: '' });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image_url: cat.image_url || '',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const update = { ...form, [name]: value };
    // Auto-generate slug from name
    if (name === 'name' && !editing) {
      update.slug = value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    setForm(update);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await apiClient.put(`/categories/${editing.id}`, form);
      } else {
        await apiClient.post('/categories/', form);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    try {
      await apiClient.delete(`/categories/${cat.id}`);
      fetchData();
    } catch {
      alert('Error al eliminar. Verifica que no tenga equipo asociado.');
    }
  };

  return (
    <>
      <Helmet><title>Categorías — MediMundo Admin</title></Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <button onClick={openCreate} className="btn-primary">
            <PlusIcon className="h-5 w-5" />
            Agregar categoría
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : categories.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-gray-500">
              No hay categorías. Crea la primera.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Nombre</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Slug</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Descripción</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">#{cat.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{cat.description || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEdit(cat)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                            title="Editar"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
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
          <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-bold text-gray-900">
                {editing ? 'Editar categoría' : 'Nueva categoría'}
              </Dialog.Title>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">Nombre *</label>
                <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Sillas de ruedas" />
              </div>

              <div>
                <label className="label-field">Slug *</label>
                <input name="slug" required value={form.slug} onChange={handleChange} className="input-field font-mono text-xs" placeholder="sillas-de-ruedas" />
              </div>

              <div>
                <label className="label-field">Descripción</label>
                <textarea name="description" rows={2} value={form.description} onChange={handleChange} className="input-field" />
              </div>

              <div>
                <label className="label-field">URL de imagen</label>
                <input name="image_url" type="url" value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://..." />
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
