"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/adminAuth";
import { IconEye, IconTrash, fmt, Modal, Spinner } from "@/lib/icons";

interface Booking {
  id: number; status: string; customer_name?: string; customer_phone?: string;
  customer_email?: string; equipment_name?: string; start_date?: string;
  end_date?: string; delivery_address?: string; notes?: string; total_amount?: number;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente", confirmed: "Confirmada", active: "Activa",
  completed: "Completada", cancelled: "Cancelada",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700", completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};
const TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"], confirmed: ["active", "cancelled"],
  active: ["completed", "cancelled"], completed: [], cancelled: [],
};

export default function ReservasPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<Booking | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const qs = statusFilter ? `?status=${statusFilter}` : "";
    const d = await apiFetch(`/bookings${qs}`).then((r) => r.ok ? r.json() : []).catch(() => []);
    setBookings(Array.isArray(d) ? d : []);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (b: Booking, newStatus: string) => {
    const res = await apiFetch(`/bookings/${b.id}`, { method: "PUT", body: JSON.stringify({ status: newStatus }) }).catch(() => null);
    if (res?.ok) {
      fetchData();
      if (detail?.id === b.id) setDetail({ ...b, status: newStatus });
    } else alert("Error al actualizar estado.");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar esta reserva?")) return;
    const res = await apiFetch(`/bookings/${id}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) { fetchData(); if (detail?.id === id) setDetail(null); }
    else alert("Error al eliminar.");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? <Spinner /> : bookings.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500">No hay reservas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Cliente", "Teléfono", "Equipo", "Fechas", "Estado", "Acciones"].map((h) => (
                    <th key={h} className={`px-4 py-3 font-medium text-gray-500 ${h === "Acciones" ? "text-right" : h === "Estado" ? "text-center" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">#{b.id}</td>
                    <td className="px-4 py-3 text-gray-700">{b.customer_name || "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{b.customer_phone || "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{b.equipment_name || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{b.start_date} — {b.end_date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-700"}`}>
                        {STATUS_LABELS[b.status] || b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setDetail(b)} title="Ver detalle"
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-sky-600">
                          <IconEye />
                        </button>
                        {(TRANSITIONS[b.status] || []).map((next) => (
                          <button key={next} onClick={() => updateStatus(b, next)}
                            className={`rounded-lg px-2 py-1 text-xs font-medium ${next === "cancelled" ? "text-red-600 hover:bg-red-50" : "text-sky-600 hover:bg-sky-50"}`}>
                            {STATUS_LABELS[next]}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Reserva #${detail?.id}`} maxWidth="max-w-md">
        {detail && (
          <div className="space-y-3 text-sm">
            <Row label="Estado">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[detail.status]}`}>
                {STATUS_LABELS[detail.status] || detail.status}
              </span>
            </Row>
            <Row label="Cliente"><span className="font-medium text-gray-900">{detail.customer_name}</span></Row>
            <Row label="Teléfono">
              {detail.customer_phone
                ? <a href={`https://wa.me/52${detail.customer_phone}`} target="_blank" rel="noopener noreferrer" className="font-medium text-green-600 hover:underline">{detail.customer_phone}</a>
                : "-"}
            </Row>
            {detail.customer_email && <Row label="Correo"><span>{detail.customer_email}</span></Row>}
            <Row label="Equipo"><span>{detail.equipment_name}</span></Row>
            <Row label="Inicio"><span>{detail.start_date}</span></Row>
            <Row label="Fin"><span>{detail.end_date}</span></Row>
            {detail.delivery_address && (
              <div><span className="text-gray-500">Dirección</span><p className="mt-0.5 text-gray-900">{detail.delivery_address}</p></div>
            )}
            {detail.notes && (
              <div><span className="text-gray-500">Notas</span><p className="mt-0.5 text-gray-900">{detail.notes}</p></div>
            )}
            {detail.total_amount != null && (
              <div className="flex justify-between border-t pt-3">
                <span className="font-medium text-gray-700">Total</span>
                <span className="text-lg font-bold text-gray-900">{fmt(detail.total_amount)}</span>
              </div>
            )}
            {(TRANSITIONS[detail.status] || []).length > 0 && (
              <div className="flex flex-wrap gap-2 border-t pt-4">
                {(TRANSITIONS[detail.status] || []).map((next) => (
                  <button key={next} onClick={() => updateStatus(detail, next)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${next === "cancelled" ? "bg-red-50 text-red-600 hover:bg-red-100" : "btn-primary"}`}>
                    → {STATUS_LABELS[next]}
                  </button>
                ))}
              </div>
            )}
            <div className="border-t pt-4">
              <button onClick={() => handleDelete(detail.id)} className="w-full rounded-lg border border-red-200 py-2 text-xs font-medium text-red-600 hover:bg-red-50">
                Eliminar reserva
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <div className="text-gray-900">{children}</div>
    </div>
  );
}
