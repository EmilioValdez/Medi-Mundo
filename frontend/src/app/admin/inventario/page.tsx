"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "@/lib/adminAuth";
import { IconPlus, IconPencil, IconTrash, IconX, IconSearch, fmt, Modal, Spinner } from "@/lib/icons";

interface Category { id: number; name: string; }
interface Equipment {
  id: number; name: string; category_id?: number; category_name?: string;
  price_daily?: number; price_weekly?: number; price_monthly?: number;
  deposit?: number; quantity_available?: number; quantity_total?: number;
  serial_number?: string; condition?: string; description?: string;
  images?: string[]; is_active?: boolean;
}

const emptyForm = {
  name: "", category_id: "", description: "", price_daily: "", price_weekly: "",
  price_monthly: "", deposit: "", quantity_total: "1", quantity_available: "1",
  serial_number: "", condition: "available", image_url: "", is_active: true,
};

/* ── Inline editable price cell ── */
function EditableCell({ value, onSave }: { value?: number; onSave: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(value ?? ""));
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.select(); }, [editing]);

  const commit = () => {
    setEditing(false);
    const n = parseFloat(val);
    if (!isNaN(n) && n !== value) onSave(n);
    else setVal(String(value ?? ""));
  };

  if (editing) return (
    <input ref={ref} type="number" min="0" step="1" value={val}
      onChange={(e) => setVal(e.target.value)} onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setEditing(false); setVal(String(value ?? "")); } }}
      className="w-24 rounded border border-sky-400 px-2 py-1 text-right text-sm font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-sky-500"
    />
  );

  return (
    <button onClick={() => setEditing(true)} title="Clic para editar"
      className="group flex items-center justify-end gap-1 rounded px-1 py-0.5 hover:bg-sky-50 transition-colors">
      <span className="text-gray-700 font-medium">{value != null ? fmt(value) : <span className="text-gray-300">—</span>}</span>
      <IconPencil className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
}

/* ── Inline quantity cell ── */
function QuantityCell({ available, total, onSave }: { available?: number; total?: number; onSave: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(available ?? 0));
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.select(); }, [editing]);

  const commit = () => {
    setEditing(false);
    const n = parseInt(val, 10);
    if (!isNaN(n) && n !== available) onSave(n);
    else setVal(String(available ?? 0));
  };

  if (editing) return (
    <input ref={ref} type="number" min="0" value={val}
      onChange={(e) => setVal(e.target.value)} onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setEditing(false); setVal(String(available ?? 0)); } }}
      className="w-16 rounded border border-sky-400 px-2 py-1 text-center text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500"
    />
  );

  return (
    <button onClick={() => setEditing(true)} title="Clic para editar disponibles"
      className="group flex items-center justify-center gap-1 rounded px-1 py-0.5 hover:bg-sky-50 transition-colors">
      <span className={`font-medium ${available === 0 ? "text-red-600" : "text-gray-700"}`}>
        {available ?? "-"}/{total ?? "-"}
      </span>
      <IconPencil className="h-3 w-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
}

const conditionMeta: Record<string, { label: string; cls: string }> = {
  available:   { label: "Disponible",    cls: "bg-green-100 text-green-700" },
  rented:      { label: "Rentado",       cls: "bg-blue-100 text-blue-700" },
  maintenance: { label: "Mantenimiento", cls: "bg-yellow-100 text-yellow-700" },
};

export default function InventarioPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (search.trim()) qs.set("search", search.trim());
    if (filterCat) qs.set("category_id", filterCat);
    const q = qs.toString() ? `?${qs}` : "";
    const [eqRes, catRes] = await Promise.all([
      apiFetch(`/equipment${q}`).then((r) => r.ok ? r.json() : []).catch(() => []),
      apiFetch("/categories").then((r) => r.ok ? r.json() : []).catch(() => []),
    ]);
    setEquipment(Array.isArray(eqRes) ? eqRes : []);
    setCategories(Array.isArray(catRes) ? catRes : []);
    setLoading(false);
  }, [search, filterCat]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const patchItem = async (id: number, patch: Record<string, unknown>) => {
    setSavingId(id);
    try {
      const res = await apiFetch(`/equipment/${id}`, { method: "PUT", body: JSON.stringify(patch) });
      if (res.ok) {
        const updated = await res.json();
        setEquipment((prev) => prev.map((e) => e.id === id ? { ...e, ...updated } : e));
      } else if (res.status === 401) {
        alert("Sesión expirada. Por favor vuelve a iniciar sesión.");
        window.location.href = "/admin/login";
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.detail || `Error ${res.status} al guardar.`);
        fetchData();
      }
    } catch {
      alert("Error de red. Verifica tu conexión.");
      fetchData();
    }
    setSavingId(null);
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item: Equipment) => {
    setEditing(item);
    setForm({
      name: item.name || "", category_id: String(item.category_id || ""),
      description: item.description || "",
      price_daily: String(item.price_daily ?? ""), price_weekly: String(item.price_weekly ?? ""),
      price_monthly: String(item.price_monthly ?? ""), deposit: String(item.deposit ?? ""),
      quantity_total: String(item.quantity_total ?? 1),
      quantity_available: String(item.quantity_available ?? 1),
      serial_number: item.serial_number || "",
      condition: item.condition || "available",
      image_url: item.images?.[0] || "",
      is_active: item.is_active !== false,
    });
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = {
      name: form.name, category_id: Number(form.category_id) || null,
      description: form.description,
      price_daily: form.price_daily !== "" ? Number(form.price_daily) : null,
      price_weekly: form.price_weekly !== "" ? Number(form.price_weekly) : null,
      price_monthly: form.price_monthly !== "" ? Number(form.price_monthly) : null,
      deposit: form.deposit !== "" ? Number(form.deposit) : null,
      quantity_total: Number(form.quantity_total) || 1,
      quantity_available: Number(form.quantity_available) || 1,
      serial_number: form.serial_number, condition: form.condition || "available",
      images: form.image_url ? [form.image_url] : null, is_active: form.is_active,
    };
    const res = editing
      ? await apiFetch(`/equipment/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) }).catch(() => null)
      : await apiFetch("/equipment", { method: "POST", body: JSON.stringify(payload) }).catch(() => null);
    if (res?.ok) { setModalOpen(false); fetchData(); }
    else { const d = await res?.json().catch(() => ({})); alert(d?.detail || "Error al guardar."); }
    setSaving(false);
  };

  const handleDelete = async (item: Equipment) => {
    if (!window.confirm(`¿Eliminar "${item.name}"?`)) return;
    const res = await apiFetch(`/equipment/${item.id}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) fetchData(); else alert("Error al eliminar.");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="text-xs text-gray-400 mt-0.5">Haz clic en cualquier precio o cantidad para editarlo directamente.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <IconPlus /> Agregar equipo
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar equipo..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="input-field w-auto">
          <option value="">Todas las categorías</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? <Spinner /> : equipment.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">No se encontró equipo.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Equipo", "Categoría", "Diario", "Semanal", "Mensual", "Disponibles", "Condición", "Activo", ""].map((h) => (
                    <th key={h} className={`px-4 py-3 font-medium text-gray-500 ${h === "Diario" || h === "Semanal" || h === "Mensual" ? "text-right" : h === "Disponibles" || h === "Condición" || h === "Activo" ? "text-center" : h === "" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {equipment.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${savingId === item.id ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      {item.serial_number && <div className="text-xs text-gray-400">S/N: {item.serial_number}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.category_name || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <EditableCell value={item.price_daily} onSave={(v) => patchItem(item.id, { price_daily: v })} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <EditableCell value={item.price_weekly} onSave={(v) => patchItem(item.id, { price_weekly: v })} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <EditableCell value={item.price_monthly} onSave={(v) => patchItem(item.id, { price_monthly: v })} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <QuantityCell available={item.quantity_available} total={item.quantity_total}
                        onSave={(v) => patchItem(item.id, { quantity_available: v })} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select value={item.condition || "available"}
                        onChange={(e) => patchItem(item.id, { condition: e.target.value })}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 cursor-pointer focus:ring-1 focus:ring-sky-400 ${conditionMeta[item.condition ?? ""]?.cls || "bg-gray-100 text-gray-600"}`}>
                        <option value="available">Disponible</option>
                        <option value="rented">Rentado</option>
                        <option value="maintenance">Mantenimiento</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => patchItem(item.id, { is_active: !item.is_active })}
                        title="Cambiar visibilidad"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 ${item.is_active !== false ? "bg-sky-600" : "bg-gray-200"}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${item.is_active !== false ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(item)} title="Editar todo"
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-sky-600">
                          <IconPencil />
                        </button>
                        <button onClick={() => handleDelete(item)} title="Eliminar"
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar equipo" : "Agregar equipo"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label-field">Nombre *</label>
            <input name="name" required value={form.name} onChange={handleChange} className="input-field" /></div>
          <div><label className="label-field">Categoría *</label>
            <select name="category_id" required value={form.category_id} onChange={handleChange} className="input-field">
              <option value="">Seleccionar...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select></div>
          <div><label className="label-field">Descripción</label>
            <textarea name="description" rows={2} value={form.description} onChange={handleChange} className="input-field" /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label-field">Precio diario</label>
              <input name="price_daily" type="number" step="0.01" min="0" value={form.price_daily} onChange={handleChange} className="input-field" /></div>
            <div><label className="label-field">Precio semanal</label>
              <input name="price_weekly" type="number" step="0.01" min="0" value={form.price_weekly} onChange={handleChange} className="input-field" /></div>
            <div><label className="label-field">Precio mensual</label>
              <input name="price_monthly" type="number" step="0.01" min="0" value={form.price_monthly} onChange={handleChange} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label-field">Depósito</label>
              <input name="deposit" type="number" step="0.01" min="0" value={form.deposit} onChange={handleChange} className="input-field" /></div>
            <div><label className="label-field">Cant. total</label>
              <input name="quantity_total" type="number" min="0" value={form.quantity_total} onChange={handleChange} className="input-field" /></div>
            <div><label className="label-field">Cant. disponible</label>
              <input name="quantity_available" type="number" min="0" value={form.quantity_available} onChange={handleChange} className="input-field" /></div>
          </div>
          <div><label className="label-field">Condición</label>
            <select name="condition" value={form.condition} onChange={handleChange} className="input-field">
              <option value="available">Disponible</option>
              <option value="rented">Rentado</option>
              <option value="maintenance">En mantenimiento</option>
            </select></div>
          <div><label className="label-field">No. de serie</label>
            <input name="serial_number" value={form.serial_number} onChange={handleChange} className="input-field" /></div>
          <div><label className="label-field">URL de imagen</label>
            <input name="image_url" type="url" value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://..." /></div>
          <div className="flex items-center gap-2">
            <input name="is_active" type="checkbox" checked={form.is_active as boolean}
              onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
            <label className="text-sm text-gray-700">Activo (visible en el sitio)</label>
          </div>
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
