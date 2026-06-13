"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/adminAuth";

const STATUS_LABELS: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmada", active: "Activa", completed: "Completada", cancelled: "Cancelada" };
const STATUS_COLORS: Record<string, string> = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700", active: "bg-green-100 text-green-700", completed: "bg-gray-100 text-gray-700", cancelled: "bg-red-100 text-red-700" };

export default function ReservasPage() {
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/bookings/?limit=50").then((r) => r.ok ? r.json() : []).catch(() => []).then((d) => { setBookings(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await apiFetch(`/bookings/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reservas</h1>
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{["ID", "Cliente", "Equipo", "Inicio", "Fin", "Estado", "Acción"].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b.id as number} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">#{b.id as number}</td>
                <td className="px-4 py-3 text-gray-700">{b.customer_name as string || "-"}</td>
                <td className="px-4 py-3 text-gray-700">{b.equipment_name as string || "-"}</td>
                <td className="px-4 py-3 text-gray-500">{b.start_date as string}</td>
                <td className="px-4 py-3 text-gray-500">{b.end_date as string}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[b.status as string] || "bg-gray-100 text-gray-700"}`}>
                    {STATUS_LABELS[b.status as string] || b.status as string}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select value={b.status as string} onChange={(e) => updateStatus(b.id as number, e.target.value)} className="text-xs rounded-lg border border-gray-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-400">
                    {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <div className="py-10 text-center text-sm text-gray-500">No hay reservas.</div>}
      </div>
    </div>
  );
}
