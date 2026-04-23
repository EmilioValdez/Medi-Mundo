import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Dialog } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detailModal, setDetailModal] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [customerDetail, setCustomerDetail] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      const res = await apiClient.get('/customers/', { params });
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDetail = async (customer) => {
    setDetailModal(customer);
    setDetailLoading(true);
    try {
      const res = await apiClient.get(`/customers/${customer.id}`);
      setCustomerDetail(res.data);
    } catch {
      setCustomerDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return;
    try {
      await apiClient.delete(`/customers/${id}`);
      fetchData();
      if (detailModal?.id === id) setDetailModal(null);
    } catch {
      alert('Error al eliminar.');
    }
  };

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

  return (
    <>
      <Helmet><title>Clientes — MediMundo Admin</title></Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Clientes</h1>

        {/* Search */}
        <div className="mb-6 max-w-sm">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          ) : customers.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-gray-500">No se encontraron clientes.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Nombre</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Teléfono</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Correo</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Dirección</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">#{c.id}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{c.name}</td>
                      <td className="px-4 py-3">
                        {c.phone ? (
                          <a
                            href={`https://wa.me/52${c.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                          >
                            {c.phone}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{c.email || '-'}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{c.address || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openDetail(c)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                            title="Ver detalle"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4" />
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
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailModal} onClose={() => setDetailModal(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-bold text-gray-900">
                Cliente #{detailModal?.id}
              </Dialog.Title>
              <button onClick={() => setDetailModal(null)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nombre</span>
                  <span className="font-medium text-gray-900">{detailModal?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Teléfono</span>
                  <span className="text-gray-900">{detailModal?.phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Correo</span>
                  <span className="text-gray-900">{detailModal?.email || '-'}</span>
                </div>
                {(detailModal?.address || customerDetail?.address) && (
                  <div>
                    <span className="text-gray-500">Dirección</span>
                    <p className="mt-0.5 text-gray-900">{customerDetail?.address || detailModal?.address}</p>
                  </div>
                )}

                {/* Rental history */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Historial de rentas</h4>
                  {(customerDetail?.bookings || customerDetail?.rentals || []).length === 0 ? (
                    <p className="text-gray-500 text-xs">Sin historial de rentas.</p>
                  ) : (
                    <div className="space-y-2">
                      {(customerDetail?.bookings || customerDetail?.rentals || []).map((b) => (
                        <div key={b.id} className="rounded-lg border border-gray-200 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-900">#{b.id} — {b.equipment_name || b.equipment?.name || 'Equipo'}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[b.status] || 'bg-gray-100 text-gray-700'}`}>
                              {statusLabels[b.status] || b.status}
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
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
