"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/adminAuth";
import { IconSearch, IconEye, IconTrash, Modal, Spinner } from "@/lib/icons";

interface Customer { id: number; name: string; phone?: string; email?: string; address?: string; }
interface CustomerDetail extends Customer { bookings?: Booking[]; }
interface Booking { id: number; status: string; equipment_name?: string; start_date?: string; end_date?: string; }

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente", confirmed: "Confirmada", active: "Activa",
  completed: "Completada", cancelled: "Cancelada",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700", completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Customer | null>(null);
  const [detailData, setDetailData] = useState<CustomerDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const qs = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    const d = await apiFetch(`/customers${qs}`).then((r) => r.ok ? r.json() : []).catch(() => []);
    setCustomers(Array.isArray(d) ? d : []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openDetail = async (c: Customer) => {
    setDetail(c); setDetailLoading(true); setDetailData(null);
    const d = await apiFetch(`/customers/${c.id}`).then((r) => r.ok ? r.json() : null).catch(() => null);
    setDetailData(d); setDetailLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    const res = await apiFetch(`/customers/${id}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) { fetchData(); if (detail?.id === id) setDetail(null); }
    else alert("Error al eliminar.");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Clientes</h1>

      <div className="mb-6 max-w-sm">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre, teléfono..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field with-icon" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? <Spinner /> : customers.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">No se encontraron clientes.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Nombre", "Teléfono", "Correo", "Dirección", "Acciones"].map((h) => (
                    <th key={h} className={`px-4 py-3 font-medium text-gray-500 ${h === "Acciones" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">#{c.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3">
                      {c.phone
                        ? <a href={`https://wa.me/52${c.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{c.phone}</a>
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.email || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{c.address || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openDetail(c)} title="Ver detalle"
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-sky-600">
                          <IconEye />
                        </button>
                        <button onClick={() => handleDelete(c.id)} title="Eliminar"
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

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Cliente #${detail?.id}`} maxWidth="max-w-md">
        {detailLoading ? <Spinner /> : (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Nombre</span><span className="font-medium text-gray-900">{detail?.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Teléfono</span>
              {detail?.phone
                ? <a href={`https://wa.me/52${detail.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{detail.phone}</a>
                : <span className="text-gray-900">-</span>}
            </div>
            <div className="flex justify-between"><span className="text-gray-500">Correo</span><span className="text-gray-900">{detail?.email || "-"}</span></div>
            {detailData?.address && (
              <div><span className="text-gray-500">Dirección</span><p className="mt-0.5 text-gray-900">{detailData.address}</p></div>
            )}
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Historial de rentas</h4>
              {(detailData?.bookings || []).length === 0
                ? <p className="text-gray-500 text-xs">Sin historial de rentas.</p>
                : (
                  <div className="space-y-2">
                    {(detailData?.bookings || []).map((b) => (
                      <div key={b.id} className="rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-900">#{b.id} — {b.equipment_name || "Equipo"}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-700"}`}>
                            {STATUS_LABELS[b.status] || b.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{b.start_date} — {b.end_date}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
