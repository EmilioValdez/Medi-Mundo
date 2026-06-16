"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/adminAuth";
import { fmt, Spinner } from "@/lib/icons";

interface OxygenRefill {
  id: number;
  litros: number;
  precio: number;
  is_active?: boolean;
}

function PriceCell({ value, onSave }: { value?: number; onSave: (v: number | null) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(value ?? ""));

  useEffect(() => { setVal(String(value ?? "")); }, [value]);

  if (editing) return (
    <input type="number" autoFocus className="w-28 rounded border border-sky-400 px-2 py-1 text-sm focus:outline-none"
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

export default function RecargasAdminPage() {
  const [refills, setRefills] = useState<OxygenRefill[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    apiFetch("/oxygen-refills").then((r) => r.ok ? r.json() : []).then(setRefills).catch(() => setRefills([])).finally(() => setLoading(false));
  }, []);

  const patch = async (id: number, data: Record<string, unknown>) => {
    setSavingId(id);
    const res = await apiFetch(`/oxygen-refills/${id}`, { method: "PUT", body: JSON.stringify(data) }).catch(() => null);
    if (res?.ok) {
      const updated = await res.json();
      setRefills((prev) => prev.map((r) => r.id === id ? updated : r));
    }
    setSavingId(null);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Recargas de Oxígeno</h1>
        <p className="text-sm text-gray-500 mt-1">Haz clic en cualquier precio para editarlo directamente.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-200">
              <th className="px-5 py-3 font-medium">Litros</th>
              <th className="px-5 py-3 font-medium">Precio</th>
              <th className="px-5 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {refills.map((r) => (
              <tr key={r.id}>
                <td className="px-5 py-3 font-semibold text-gray-900">{r.litros.toLocaleString("es-MX")} L</td>
                <td className="px-5 py-3">
                  <PriceCell value={r.precio} onSave={(v) => patch(r.id, { precio: v })} />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {savingId === r.id && <span className="text-xs text-sky-600 animate-pulse">Guardando…</span>}
                    <button onClick={() => patch(r.id, { is_active: !r.is_active })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${r.is_active ? "bg-green-500" : "bg-gray-300"}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${r.is_active ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <span className="text-xs text-gray-500">{r.is_active ? "Activo" : "Oculto"}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
