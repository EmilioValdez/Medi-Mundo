"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/adminAuth";

interface Category { id: number; name: string; }
interface Equipment { id: number; name: string; category_id?: number; category_name?: string; price_monthly?: number; quantity_available?: number; quantity_total?: number; is_active?: boolean; }

const empty = { name: "", category_id: "", description: "", price_daily: "", price_weekly: "", price_monthly: "", deposit: "", quantity_total: "1", serial_number: "", condition: "", is_active: true };

function fmt(n: number | undefined) { return n != null ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n) : "-"; }

export default function InventarioPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean>>(empty);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    const [eq, cats] = await Promise.all([
      apiFetch(`/equipment/${params}`).then((r) => r.ok ? r.json() : []).catch(() => []),
      apiFetch("/categories/").then((r) => r.ok ? r.json() : []).catch(() => []),
    ]);
    setEquipment(Array.isArray(eq) ? eq : []);
    setCategories(Array.isArray(cats) ? cats : []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (e: Equipment) => {
    setEditing(e);
    setForm({
      name: e.name || "", category_id: String(e.category_id || ""), description: "",
      price_daily: "", price_weekly: "", price_monthly: String(e.price_monthly || ""),
      deposit: "", quantity_total: String(e.quantity_total || 1),
      serial_number: "", condition: "", is_active: e.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    const body = { ...form, category_id: Number(form.category_id) || null, price_daily: Number(form.price_daily) || null, price_weekly: Number(form.price_weekly) || null, price_monthly: Number(form.price_monthly) || null, deposit: Number(form.deposit) || null, quantity_total: Number(form.quantity_total) || 1 };
    const res = editing
      ? await apiFetch(`/equipment/${editing.id}`, { method: "PUT", body: JSON.stringify(body) })
      : await apiFetch("/equipment/", { method: "POST", body: JSON.stringify(body) });
    if (res.ok) { setModalOpen(false); fetchData(); }
    setSaving(false);
  };

  const handleToggle = async (e: Equipment) => {
    await apiFetch(`/equipment/${e.id}`, { method: "PUT", body: JSON.stringify({ is_active: !e.is_active }) });
    fetchData();
  };

  const field = (k: string) => ({ value: String(form[k] ?? ""), onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: ev.target.value })) });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
        <button onClick={openNew} className="btn-primary">+ Nuevo equipo</button>
      </div>

      <div className="mb-4 flex gap-2">
        <input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field max-w-xs" onKeyDown={(e) => e.key === "Enter" && fetchData()} />
        <button onClick={fetchData} className="btn-white">Buscar</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{["Equipo", "Categoría", "Precio/mes", "Stock", "Activo", ""].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {equipment.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{e.name}</td>
                  <td className="px-4 py-3 text-gray-500">{e.category_name || "-"}</td>
                  <td className="px-4 py-3 text-gray-700">{fmt(e.price_monthly)}</td>
                  <td className="px-4 py-3 text-gray-700">{e.quantity_available ?? "-"} / {e.quantity_total ?? "-"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(e)} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${e.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {e.is_active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(e)} className="text-sky-600 hover:underline text-xs font-medium">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {equipment.length === 0 && <div className="py-10 text-center text-sm text-gray-500">No se encontró equipo.</div>}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editing ? "Editar equipo" : "Nuevo equipo"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div><label className="label-field">Nombre *</label><input required className="input-field" {...field("name")} /></div>
              <div>
                <label className="label-field">Categoría</label>
                <select className="input-field" value={String(form.category_id)} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}>
                  <option value="">Sin categoría</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label-field">Precio diario</label><input type="number" className="input-field" {...field("price_daily")} /></div>
                <div><label className="label-field">Precio semanal</label><input type="number" className="input-field" {...field("price_weekly")} /></div>
                <div><label className="label-field">Precio mensual</label><input type="number" className="input-field" {...field("price_monthly")} /></div>
                <div><label className="label-field">Depósito</label><input type="number" className="input-field" {...field("deposit")} /></div>
                <div><label className="label-field">Cantidad total</label><input type="number" min="1" className="input-field" {...field("quantity_total")} /></div>
                <div><label className="label-field">No. serie</label><input className="input-field" {...field("serial_number")} /></div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={!!form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="active" className="text-sm text-gray-700">Activo</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-white flex-1">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? "Guardando..." : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
