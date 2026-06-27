"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "@/lib/adminAuth";
import { IconPlus, IconPencil, IconTrash, IconSearch, fmt, Modal, Spinner } from "@/lib/icons";
import Image from "next/image";

interface Category { id: number; name: string; }
interface Equipment {
  id: number; name: string; category_id?: number; category_name?: string;
  price_daily?: number; price_biweekly?: number; price_monthly?: number; price_sale?: number;
  deposit?: number; quantity_available?: number; quantity_total?: number;
  serial_number?: string; condition?: string; description?: string;
  images?: string[]; is_active?: boolean;
}

const emptyForm = {
  name: "", category_id: "", description: "", price_daily: "", price_biweekly: "",
  price_monthly: "", price_sale: "", deposit: "", quantity_total: "1", quantity_available: "1",
  serial_number: "", condition: "available", image_url: "", is_active: true,
};

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

function SectionTable({
  items, mode, savingId, patchItem, openEdit, handleDelete,
}: {
  items: Equipment[];
  mode: "rental" | "catalog";
  savingId: number | null;
  patchItem: (id: number, patch: Record<string, unknown>) => void;
  openEdit: (item: Equipment) => void;
  handleDelete: (item: Equipment) => void;
}) {
  const rentalHeaders = ["Equipo", "Categoría", "Diario", "Quincenal", "Mensual", "Disponibles", "Condición", "Activo", ""];
  const catalogHeaders = ["Equipo", "Categoría", "Disponibles", "Condición", "Activo", ""];
  const headers = mode === "rental" ? rentalHeaders : catalogHeaders;

  const rightAligned = new Set(["Diario", "Quincenal", "Mensual"]);
  const centerAligned = new Set(["Disponibles", "Condición", "Activo"]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map((h) => (
              <th key={h} className={`px-4 py-3 font-medium text-gray-500 ${rightAligned.has(h) ? "text-right" : centerAligned.has(h) ? "text-center" : h === "" ? "text-right" : "text-left"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${savingId === item.id ? "opacity-60" : ""}`}>
              <td className="px-4 py-3">
                <div className="font-semibold text-gray-900">{item.name}</div>
                {item.serial_number && <div className="text-xs text-gray-400">S/N: {item.serial_number}</div>}
              </td>
              <td className="px-4 py-3 text-gray-500">{item.category_name || "-"}</td>

              {mode === "rental" && (
                <>
                  <td className="px-4 py-3 text-right">
                    <EditableCell value={item.price_daily} onSave={(v) => patchItem(item.id, { price_daily: v })} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <EditableCell value={item.price_biweekly} onSave={(v) => patchItem(item.id, { price_biweekly: v })} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <EditableCell value={item.price_monthly} onSave={(v) => patchItem(item.id, { price_monthly: v })} />
                  </td>
                </>
              )}

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
  );
}

export default function InventarioPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [addMode, setAddMode] = useState<"rental" | "catalog">("rental");
  const [includeOther, setIncludeOther] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [eqRes, catRes] = await Promise.all([
      apiFetch("/equipment").then((r) => r.ok ? r.json() : []).catch(() => []),
      apiFetch("/categories").then((r) => r.ok ? r.json() : []).catch(() => []),
    ]);
    setEquipment(Array.isArray(eqRes) ? eqRes : []);
    setCategories(Array.isArray(catRes) ? catRes : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const hasRentalPrices = (e: Equipment) => (e.price_daily ?? 0) > 0 || (e.price_biweekly ?? 0) > 0 || (e.price_monthly ?? 0) > 0;
  const rentalItems = equipment.filter(hasRentalPrices);
  const catalogItems = equipment; // /catalogo shows all products

  const searchLower = search.trim().toLowerCase();
  const filteredRental = searchLower
    ? rentalItems.filter((e) => e.name.toLowerCase().includes(searchLower) || (e.category_name || "").toLowerCase().includes(searchLower))
    : rentalItems;
  const filteredCatalog = searchLower
    ? catalogItems.filter((e) => e.name.toLowerCase().includes(searchLower) || (e.category_name || "").toLowerCase().includes(searchLower))
    : catalogItems;

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

  const openCreate = (mode: "rental" | "catalog") => {
    setEditing(null);
    setAddMode(mode);
    setIncludeOther(false);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (item: Equipment) => {
    setEditing(item);
    setForm({
      name: item.name || "", category_id: String(item.category_id || ""),
      description: item.description || "",
      price_daily: String(item.price_daily ?? ""), price_biweekly: String(item.price_biweekly ?? ""),
      price_monthly: String(item.price_monthly ?? ""), price_sale: String(item.price_sale ?? ""),
      deposit: String(item.deposit ?? ""),
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

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await apiFetch("/upload/image", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setForm((prev) => ({ ...prev, image_url: url }));
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d?.detail || "Error al subir imagen.");
      }
    } catch {
      alert("Error de red al subir imagen.");
    }
    setUploadingImg(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category_id) { alert("Por favor selecciona una categoría."); return; }
    setSaving(true);
    const forceRentalOnly = !editing && addMode === "rental" && !includeOther;
    const forceCatalogOnly = !editing && addMode === "catalog" && !includeOther;
    const payload = {
      name: form.name, category_id: Number(form.category_id) || null,
      description: form.description,
      price_daily: forceCatalogOnly ? 0 : (form.price_daily !== "" ? Number(form.price_daily) : 0),
      price_biweekly: forceCatalogOnly ? 0 : (form.price_biweekly !== "" ? Number(form.price_biweekly) : 0),
      price_monthly: forceCatalogOnly ? 0 : (form.price_monthly !== "" ? Number(form.price_monthly) : 0),
      price_sale: forceRentalOnly ? 0 : (form.price_sale !== "" ? Number(form.price_sale) : 0),
      deposit: form.deposit !== "" ? Number(form.deposit) : 0,
      quantity_total: Number(form.quantity_total) || 1,
      quantity_available: Number(form.quantity_available) || 1,
      serial_number: form.serial_number, condition: form.condition || "available",
      images: form.image_url ? [form.image_url] : null, is_active: form.is_active,
    };
    const res = editing
      ? await apiFetch(`/equipment/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) }).catch(() => null)
      : await apiFetch("/equipment", { method: "POST", body: JSON.stringify(payload) }).catch(() => null);
    if (res?.ok) { setModalOpen(false); fetchData(); }
    else {
      const text = await res?.text().catch(() => "");
      let msg = "Error al guardar.";
      try {
        const d = JSON.parse(text || "{}");
        if (typeof d.detail === "string") msg = d.detail;
        else if (Array.isArray(d.detail)) msg = d.detail.map((e: {msg: string}) => e.msg).join(", ");
      } catch { if (text) msg = `Error ${res?.status}: ${text.slice(0, 200)}`; }
      alert(msg);
    }
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
        <div className="flex gap-2">
          <button onClick={() => openCreate("rental")} className="btn-primary flex items-center gap-2 text-sm">
            <IconPlus /> Agregar Renta
          </button>
          <button onClick={() => openCreate("catalog")} className="btn-violet flex items-center gap-2 text-sm">
            <IconPlus /> Agregar Catálogo
          </button>
        </div>
      </div>

      <div className="relative max-w-xs mb-6">
        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Buscar equipo..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="input-field with-icon" />
      </div>

      {loading ? <Spinner /> : (
        <div className="space-y-8">
          {/* ── Sección Renta ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-gray-800">Productos en Renta</h2>
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">{filteredRental.length}</span>
              </div>
              <button onClick={() => openCreate("rental")}
                className="flex items-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg px-2.5 py-1.5 transition-colors border border-sky-200">
                <IconPlus className="h-3.5 w-3.5" /> Agregar para Renta
              </button>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {filteredRental.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">Sin resultados.</div>
              ) : (
                <SectionTable items={filteredRental} mode="rental" savingId={savingId}
                  patchItem={patchItem} openEdit={openEdit} handleDelete={handleDelete} />
              )}
            </div>
          </div>

          {/* ── Sección Catálogo ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-gray-800">Catálogo (Venta)</h2>
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">{filteredCatalog.length}</span>
              </div>
              <button onClick={() => openCreate("catalog")}
                className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg px-2.5 py-1.5 transition-colors border border-violet-200">
                <IconPlus className="h-3.5 w-3.5" /> Agregar para Catálogo
              </button>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {filteredCatalog.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">Sin resultados.</div>
              ) : (
                <SectionTable items={filteredCatalog} mode="catalog" savingId={savingId}
                  patchItem={patchItem} openEdit={openEdit} handleDelete={handleDelete} />
              )}
            </div>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar equipo" : addMode === "rental" ? "Agregar para Renta" : "Agregar para Catálogo"}>
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

          {(editing || addMode === "rental" || includeOther) && (
            <div className="rounded-lg border border-sky-100 bg-sky-50 p-3 space-y-3">
              <p className="text-xs font-semibold text-sky-700 uppercase tracking-wide">Precios de renta</p>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="label-field">Diario</label>
                  <input name="price_daily" type="number" step="0.01" min="0" value={form.price_daily} onChange={handleChange} className="input-field" /></div>
                <div><label className="label-field">Quincenal</label>
                  <input name="price_biweekly" type="number" step="0.01" min="0" value={form.price_biweekly} onChange={handleChange} className="input-field" /></div>
                <div><label className="label-field">Mensual</label>
                  <input name="price_monthly" type="number" step="0.01" min="0" value={form.price_monthly} onChange={handleChange} className="input-field" /></div>
              </div>
            </div>
          )}

          {(editing || addMode === "catalog" || includeOther) && (
            <div className="rounded-lg border border-violet-100 bg-violet-50 p-3 space-y-3">
              <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Precio de venta (catálogo)</p>
              <input name="price_sale" type="number" step="0.01" min="0" value={form.price_sale} onChange={handleChange} className="input-field" />
            </div>
          )}

          {!editing && (
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-gray-300 px-3 py-2 hover:bg-gray-50 transition-colors">
              <input type="checkbox" checked={includeOther} onChange={(e) => setIncludeOther(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
              <span className="text-sm text-gray-600">
                {addMode === "rental"
                  ? "También incluir en Catálogo (agregar precio de venta)"
                  : "También incluir en Rentas (agregar precios de renta)"}
              </span>
            </label>
          )}

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
          <div>
            <label className="label-field">Imagen</label>
            <div className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImg}
                  className="btn-white w-full flex items-center justify-center gap-2 text-sm">
                  {uploadingImg ? <Spinner /> : null}
                  {uploadingImg ? "Subiendo..." : "Seleccionar imagen…"}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                <input name="image_url" type="text" value={form.image_url} onChange={handleChange}
                  className="input-field text-xs text-gray-400" placeholder="O pega una URL aquí..." />
              </div>
              {form.image_url && (
                <div className="relative h-20 w-20 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                  <Image src={form.image_url} alt="preview" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>
          </div>
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
