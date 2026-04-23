import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
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

const transitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['active', 'cancelled'],
  active: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const transitionBtnClass = {
  confirmed: 'btn-accent',
  active: 'btn-primary',
  completed: 'btn-white',
  cancelled: 'btn-danger',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [detailModal, setDetailModal] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await apiClient.get('/bookings/', { params });
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (booking, newStatus) => {
    try {
      await apiClient.put(`/bookings/${booking.id}`, { status: newStatus });
      fetchData();
      if (detailModal?.id === booking.id) {
        setDetailModal({ ...detailModal, status: newStatus });
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al actualizar estado.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta reserva?')) return;
    try {
      await apiClient.delete(`/bookings/${id}`);
      fetchData();
      if (detailModal?.id === id) setDetailModal(null);
    } catch {
      alert('Error al eliminar.');
    }
  };

  return (
    <>
      <Helmet><title>Reservas — MediMundo Admin</title></Helmet>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-gray-500">No hay reservas.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Cliente</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Teléfono</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Equipo</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Fechas</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500">Estado</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">#{b.id}</td>
                      <td className="px-4 py-3 text-gray-700">{b.customer_name || '-'}</td>
                      <td className="px-4 py-3 text-gray-500">{b.customer_phone || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{b.equipment_name || b.equipment?.name || '-'}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {b.start_date} — {b.end_date}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[b.status] || 'bg-gray-100 text-gray-700'}`}>
                          {statusLabels[b.status] || b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setDetailModal(b)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                            title="Ver detalle"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {(transitions[b.status] || []).map((next) => (
                            <button
                              key={next}
                              onClick={() => updateStatus(b, next)}
                              className={`rounded-lg px-2 py-1 text-xs font-medium ${
                                next === 'cancelled'
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-primary-600 hover:bg-primary-50'
                              }`}
                            >
                              {statusLabels[next]}
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
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailModal} onClose={() => setDetailModal(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-bold text-gray-900">
                Reserva #{detailModal?.id}
              </Dialog.Title>
              <button onClick={() => setDetailModal(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {detailModal && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[detailModal.status]}`}>
                    {statusLabels[detailModal.status] || detailModal.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cliente</span>
                  <span className="font-medium text-gray-900">{detailModal.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Teléfono</span>
                  <a href={`https://wa.me/52${detailModal.customer_phone}`} target="_blank" rel="noopener noreferrer" className="font-medium text-green-600 hover:underline">
                    {detailModal.customer_phone}
                  </a>
                </div>
                {detailModal.customer_email && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Correo</span>
                    <span className="text-gray-900">{detailModal.customer_email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Equipo</span>
                  <span className="text-gray-900">{detailModal.equipment_name || detailModal.equipment?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha inicio</span>
                  <span className="text-gray-900">{detailModal.start_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha fin</span>
                  <span className="text-gray-900">{detailModal.end_date}</span>
                </div>
                {detailModal.delivery_address && (
                  <div>
                    <span className="text-gray-500">Dirección de entrega</span>
                    <p className="mt-0.5 text-gray-900">{detailModal.delivery_address}</p>
                  </div>
                )}
                {detailModal.notes && (
                  <div>
                    <span className="text-gray-500">Notas</span>
                    <p className="mt-0.5 text-gray-900">{detailModal.notes}</p>
                  </div>
                )}
                {detailModal.total_amount != null && (
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-medium text-gray-700">Total</span>
                    <span className="text-lg font-bold text-gray-900">{formatMXN(detailModal.total_amount)}</span>
                  </div>
                )}

                {/* Status transitions */}
                {(transitions[detailModal.status] || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 border-t pt-4">
                    {(transitions[detailModal.status] || []).map((next) => (
                      <button
                        key={next}
                        onClick={() => updateStatus(detailModal, next)}
                        className={transitionBtnClass[next] || 'btn-primary'}
                      >
                        Cambiar a: {statusLabels[next]}
                      </button>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4">
                  <button onClick={() => handleDelete(detailModal.id)} className="btn-danger w-full text-xs">
                    Eliminar reserva
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
