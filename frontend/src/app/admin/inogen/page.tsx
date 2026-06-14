"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/adminAuth";
import { fmt, Spinner } from "@/lib/icons";

interface InogenModel {
  id: number; name: string; image?: string; faa_label?: string;
  price_monthly?: number; price_biweekly?: number; price_weekly?: number;
  deposit?: number; is_active?: boolean; includes?: string[];
}

function PriceCell({ value, onSave }: { value?: number; onSave: (v: number | null) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(value ?? ""));

  useEffect(() => { setVal(String(value ?? "")); }, [value]);

  if (editing) return (
    <input type="number" autoFocus className="w-24 rounded border border-sky-400 px-2 py-1 text-sm focus:outline-none"
      value={val} onChange={(e) => setVal(e.target.value)}
      onBlur={() => { setEditing(false); onSave(val === "" ? null : Number(val)); }}
      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") { setEditing(false); setVal(String(value ?? "")); } }}
    />
  );

  return (
    <span onClick={() => setEditing(true)} title="Clic para editar"
      className="cursor-pointer rounded px-2 py-1 hover:bg-sky-50 text-sm font-medium">
      {value != null ? fmt(value) : <span className="text-gray-300">—</span>}
    </span>
  );
}

export default function InogenAdminPage() {
  const [models, setModels] = useState<InogenModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingIncludes, setEditingIncludes] = useState<number | null>(null);
  const [includesText, setIncludesText] = useState("");

  useEffect(() => {
    apiFetch("/inogen").then((r) => r.ok ? r.json() : []).then(setModels).catch(() => setModels([])).finally(() => setLoading(false));
  }, []);

  const patch = async (id: number, data: Record<string, unknown>) => {
    setSavingId(id);
    const res = await apiFetch(`/inogen/${id}`, { method: "PUT", body: JSON.stringify(data) }).catch(() => null);
    if (res?.ok) {
      const updated = await res.json();
      setModels((prev) => prev.map((m) => m.id === id ? updated : m));
    }
    setSavingId(null);
  };

  const openIncludes = (model: InogenModel) => {
    setEditingIncludes(model.id);
    setIncludesText((model.includes || []).join("\n"));
  };

  const saveIncludes = (id: number) => {
    const list = includesText.split("\n").map((s) => s.trim()).filter(Boolean);
    patch(id, { includes: list });
    setEditingIncludes(null);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Concentradores Inogen</h1>
        <p className="text-sm text-gray-500 mt-1">Haz clic en cualquier precio para editarlo directamente.</p>
      </div>

      <div className="space-y-6">
        {models.map((model) => (
          <div key={model.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-4 bg-gray-50 border-b border-gray-200 px-5 py-4">
              <div className="flex items-center gap-4">
                {model.image && (
                  <img src={model.image} alt={model.name}
                    className="h-14 w-14 object-contain bg-white rounded-lg border border-gray-100 p-1" />
                )}
                <div>
                  <h2 className="font-semibold text-gray-900">{model.name}</h2>
                  {model.faa_label && <p className="text-xs text-gray-500 mt-0.5">{model.faa_label}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {savingId === model.id && <span className="text-xs text-sky-600 animate-pulse">Guardando…</span>}
                <button onClick={() => patch(model.id, { is_active: !model.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${model.is_active ? "bg-green-500" : "bg-gray-300"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${model.is_active ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className="text-xs text-gray-500">{model.is_active ? "Activo" : "Oculto"}</span>
              </div>
            </div>

            <div className="px-5 py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                    {["Mensual", "Quincenal", "Semanal", "Depósito"].map((h) => (
                      <th key={h} className="pb-2 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><PriceCell value={model.price_monthly} onSave={(v) => patch(model.id, { price_monthly: v })} /></td>
                    <td><PriceCell value={model.price_biweekly} onSave={(v) => patch(model.id, { price_biweekly: v })} /></td>
                    <td><PriceCell value={model.price_weekly} onSave={(v) => patch(model.id, { price_weekly: v })} /></td>
                    <td><PriceCell value={model.deposit} onSave={(v) => patch(model.id, { deposit: v })} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Incluye</span>
                {editingIncludes === model.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => saveIncludes(model.id)}
                      className="rounded bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-700">Guardar</button>
                    <button onClick={() => setEditingIncludes(null)}
                      className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => openIncludes(model)} className="text-xs text-sky-600 hover:underline">Editar</button>
                )}
              </div>
              {editingIncludes === model.id ? (
                <textarea className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-sky-400 focus:outline-none"
                  rows={6} value={includesText} onChange={(e) => setIncludesText(e.target.value)}
                  placeholder="Un elemento por línea" />
              ) : (
                <ul className="space-y-1">
                  {(model.includes || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
