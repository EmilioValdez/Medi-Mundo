"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/adminAuth";

const STATUS_LABELS: Record<string, string> = { pending: "Pendiente", confirmed: "Confirmada", active: "Activa", completed: "Completada", cancelled: "Cancelada" };
const STATUS_COLORS: Record<string, string> = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700", active: "bg-green-100 text-green-700", completed: "bg-gray-100 text-gray-700", cancelled: "bg-red-100 text-red-700" };

function fmt(n: number) { return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n); }

function KPICard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`rounded-xl border bg-white p-5 shadow-sm border-l-4 ${color}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<Record<string, number> | null>(null);
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/dashboard/kpis").then((r) => r.ok ? r.json() : null).catch(() => null),
      apiFetch("/bookings/?limit=10").then((r) => r.ok ? r.json() : []).catch(() => []),
    ]).then(([k, b]) => { setKpis(k); setBookings(Array.isArray(b) ? b : []); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      {kpis && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <KPICard label="Rentas activas" value={kpis.active_rentals ?? 0} color="border-green-400" />
          <KPICard label="Solicitudes pendientes" value={kpis.pending_requests ?? 0} color="border-amber-400" />
          <KPICard label="Ingresos del mes" value={fmt(kpis.revenue_month ?? 0)} color="border-sky-400" />
          <KPICard label="Total equipo" value={kpis.total_equipment ?? 0} color="border-purple-400" />
          <KPICard label="Total clientes" value={kpis.total_customers ?? 0} color="border-indigo-400" />
          <KPICard label="Tasa de utilización" value={`${kpis.utilization_rate ?? 0}%`} color="border-teal-400" />
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Reservas recientes</h2>
        </div>
        {bookings.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-500">No hay reservas registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Cliente", "Equipo", "Fechas", "Estado"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b: Record<string, unknown>) => (
                  <tr key={b.id as number} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">#{b.id as number}</td>
                    <td className="px-5 py-3 text-gray-700">{b.customer_name as string || "-"}</td>
                    <td className="px-5 py-3 text-gray-700">{b.equipment_name as string || "-"}</td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{b.start_date as string} — {b.end_date as string}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[b.status as string] || "bg-gray-100 text-gray-700"}`}>
                        {STATUS_LABELS[b.status as string] || b.status as string}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
