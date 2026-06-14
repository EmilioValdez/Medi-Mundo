"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/adminAuth";
import { IconPlus, IconPencil, IconTrash, Modal, Spinner } from "@/lib/icons";

interface Category { id: number; name: string; slug: string; description?: string; image_url?: string; }
const emptyForm = { name: "", slug: "", description: "", image_url: "" };

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const d = await apiFetch("/categories").then((r) => r.ok ? r.json() : []).catch(() => []);
    setCategories(Array.isArray(d) ? d : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name || "", slug: cat.slug || "", description: cat.description || "", image_url: cat.image_url || "" });
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const update: typeof emptyForm = { ...form, [name]: value };
    if (name === "name" && !editing) {
      update.slug = value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    setForm(update);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const res = editing
      ? await apiFetch(`/categories/${editing.id}`, { method: "PUT", body: JSON.stringify(form) }).catch(() => null)
      : await apiFetch("/categories", { method: "POST", body: JSON.stringify(form) }).catch(() => null);
    if (res?.ok) { setModalOpen(false); fetchData(); }
    else { const d = await res?.json().catch(() => ({})); alert(d?.detail || "Error al guardar."); }
    setSaving(false);
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    const res = await apiFetch(`/categories/${cat.id}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) fetchData(); else alert("Error al eliminar. Verifica que no tenga equipo asociado.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <IconPlus /> Agregar categoría
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? <Spinner /> : categories.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">No hay categorías. Crea la primera.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Nombre", "Slug", "Descripción", "Acciones"].map((h) => (
                    <th key={h} className={`px-4 py-3 font-medium text-gray-500 ${h === "Acciones" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">#{cat.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{cat.description || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(cat)} title="Editar"
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-sky-600">
                          <IconPencil />
                        </button>
                        <button onClick={() => handleDelete(cat)} title="Eliminar"
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                          <IconTrash />
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar categoría" : "Nueva categoría"} maxWidth="max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label-field">Nombre *</label>
            <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Sillas de ruedas" /></div>
          <div><label className="label-field">Slug *</label>
            <input name="slug" required value={form.slug} onChange={handleChange} className="input-field font-mono text-xs" placeholder="sillas-de-ruedas" /></div>
          <div><label className="label-field">Descripción</label>
            <textarea name="description" rows={2} value={form.description} onChange={handleChange} className="input-field" /></div>
          <div><label className="label-field">URL de imagen</label>
            <input name="image_url" type="url" value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://..." /></div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-white flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? "Guardando..." : editing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
