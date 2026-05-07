import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import formatMXN from '../../utils/formatMXN';

function PriceCell({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? '');

  useEffect(() => { setVal(value ?? ''); }, [value]);

  if (editing) {
    return (
      <input
        type="number"
        className="w-24 rounded border border-primary-400 px-2 py-1 text-sm focus:outline-none"
        value={val}
        autoFocus
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => { setEditing(false); onSave(val === '' ? null : Number(val)); }}
        onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') { setEditing(false); setVal(value ?? ''); } }}
      />
    );
  }
  return (
    <span
      className="cursor-pointer rounded px-2 py-1 hover:bg-primary-50 text-sm"
      onClick={() => setEditing(true)}
      title="Clic para editar"
    >
      {value != null ? formatMXN(value) : <span className="text-gray-300">—</span>}
    </span>
  );
}

function ActiveToggle({ value, onSave }) {
  return (
    <button
      onClick={() => onSave(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function InogenPage() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [editingIncludes, setEditingIncludes] = useState(null);
  const [includesText, setIncludesText] = useState('');

  useEffect(() => {
    apiClient.get('/inogen/')
      .then((r) => setModels(r.data))
      .finally(() => setLoading(false));
  }, []);

  const patch = async (id, data) => {
    setSavingId(id);
    try {
      const res = await apiClient.put(`/inogen/${id}`, data);
      setModels((prev) => prev.map((m) => (m.id === id ? res.data : m)));
    } finally {
      setSavingId(null);
    }
  };

  const openIncludes = (model) => {
    setEditingIncludes(model.id);
    setIncludesText((model.includes || []).join('\n'));
  };

  const saveIncludes = (id) => {
    const list = includesText.split('\n').map((s) => s.trim()).filter(Boolean);
    patch(id, { includes: list });
    setEditingIncludes(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Concentradores Inogen</h1>
        <p className="text-sm text-gray-500 mt-1">Haz clic en cualquier precio para editarlo.</p>
      </div>

      <div className="space-y-6">
        {models.map((model) => (
          <div key={model.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 bg-gray-50 border-b border-gray-200 px-5 py-4">
              <div className="flex items-center gap-4">
                <img
                  src={model.image}
                  alt={model.name}
                  className="h-14 w-14 object-contain bg-white rounded-lg border border-gray-100 p-1"
                />
                <div>
                  <h2 className="font-semibold text-gray-900">{model.name}</h2>
                  {model.faa_label && (
                    <p className="text-xs text-gray-500 mt-0.5">{model.faa_label}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {savingId === model.id && (
                  <span className="text-xs text-primary-600 animate-pulse">Guardando…</span>
                )}
                <ActiveToggle value={model.is_active} onSave={(v) => patch(model.id, { is_active: v })} />
                <span className="text-xs text-gray-500">{model.is_active ? 'Activo' : 'Oculto'}</span>
              </div>
            </div>

            {/* Prices */}
            <div className="px-5 py-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                    <th className="pb-2 font-medium">Mensual</th>
                    <th className="pb-2 font-medium">Quincenal</th>
                    <th className="pb-2 font-medium">Semanal</th>
                    <th className="pb-2 font-medium">Depósito</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <PriceCell
                        value={model.price_monthly}
                        onSave={(v) => patch(model.id, { price_monthly: v })}
                      />
                    </td>
                    <td>
                      <PriceCell
                        value={model.price_biweekly}
                        onSave={(v) => patch(model.id, { price_biweekly: v })}
                      />
                    </td>
                    <td>
                      <PriceCell
                        value={model.price_weekly}
                        onSave={(v) => patch(model.id, { price_weekly: v })}
                      />
                    </td>
                    <td>
                      <PriceCell
                        value={model.deposit}
                        onSave={(v) => patch(model.id, { deposit: v })}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Includes */}
            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Incluye</span>
                {editingIncludes === model.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveIncludes(model.id)}
                      className="rounded bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingIncludes(null)}
                      className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openIncludes(model)}
                    className="text-xs text-primary-600 hover:underline"
                  >
                    Editar
                  </button>
                )}
              </div>

              {editingIncludes === model.id ? (
                <textarea
                  className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-primary-400 focus:outline-none"
                  rows={6}
                  value={includesText}
                  onChange={(e) => setIncludesText(e.target.value)}
                  placeholder="Un elemento por línea"
                />
              ) : (
                <ul className="space-y-1">
                  {(model.includes || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
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
