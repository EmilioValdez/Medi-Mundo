import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import StatsCard from '../../components/admin/StatsCard';
import formatMXN from '../../utils/formatMXN';

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  active: 'Activa',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [kpiRes, bookRes] = await Promise.all([
          apiClient.get('/dashboard/kpis'),
          apiClient.get('/bookings/', { params: { limit: 10 } }),
        ]);
        setKpis(kpiRes.data);
        setBookings(Array.isArray(bookRes.data) ? bookRes.data : []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Dashboard — MediMundo Admin</title></Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* KPI Grid */}
        {kpis && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatsCard icon={CalendarDaysIcon} label="Rentas activas" value={kpis.active_rentals || 0} color="green" />
            <StatsCard icon={ClockIcon} label="Solicitudes pendientes" value={kpis.pending_requests || 0} color="amber" />
            <StatsCard icon={CurrencyDollarIcon} label="Ingresos del mes" value={formatMXN(kpis.revenue_month || 0)} color="primary" />
            <StatsCard icon={CubeIcon} label="Total equipo" value={kpis.total_equipment || 0} color="accent" />
            <StatsCard icon={UsersIcon} label="Total clientes" value={kpis.total_customers || 0} color="purple" />
            <StatsCard icon={ChartBarIcon} label="Tasa de utilización" value={`${kpis.utilization_rate || 0}%`} color="primary" />
          </div>
        )}

        {/* Recent bookings */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">Reservas recientes</h2>
          </div>
          {bookings.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-gray-500">
              No hay reservas registradas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">ID</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Cliente</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Equipo</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Fechas</th>
                    <th className="px-5 py-3 text-left font-medium text-gray-500">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.slice(0, 10).map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">#{b.id}</td>
                      <td className="px-5 py-3 text-gray-700">{b.customer_name || b.customer?.name || '-'}</td>
                      <td className="px-5 py-3 text-gray-700">{b.equipment_name || b.equipment?.name || '-'}</td>
                      <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                        {b.start_date} — {b.end_date}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[b.status] || 'bg-gray-100 text-gray-700'}`}>
                          {statusLabels[b.status] || b.status}
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
    </>
  );
}
