import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import formatMXN from '../../utils/formatMXN';
import { isRentalItem } from '../../utils/rentalItems';
import { waLink, WA_MESSAGES, trackWAClick } from '../../utils/whatsapp';

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    start_date: '',
    end_date: '',
    delivery_address: '',
    notes: '',
  });

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/equipment/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => setError('No se pudo cargar el equipo.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post('/bookings/request', {
        ...form,
        equipment_id: Number(id),
      });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al enviar la solicitud. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const waMessage = item
    ? waLink(`Hola, me interesa rentar: *${item.name}*. Fechas: ${form.start_date || '(por definir)'} a ${form.end_date || '(por definir)'}.`)
    : waLink(WA_MESSAGES.catalogo);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 mb-6">
          <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipo no encontrado</h2>
        <p className="text-gray-500 mb-6">
          {error || 'Lo sentimos, el equipo que buscas no existe o ya no est\u00e1 disponible.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/catalogo" className="btn-primary px-6 py-2.5">
            Ver cat\u00e1logo completo
          </Link>
          <a
            href={waLink(WA_MESSAGES.noEncontro)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWAClick('detalle_no_encontro')}
            className="btn-whatsapp px-6 py-2.5"
          >
            Preguntar por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const images = item.images?.length ? item.images : (item.image_url ? [item.image_url] : []);

  return (
    <>
      <Helmet>
        <title>{item.name} — MediMundo</title>
      </Helmet>

      <div className="bg-watermark mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link to="/catalogo" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
          <ArrowLeftIcon className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={`${item.name} en renta en Querétaro — MediMundo`}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-red-50 to-blue-50 text-gray-400">
                  <span className="text-7xl mb-3">{'\uD83C\uDFE5'}</span>
                  <span className="text-sm font-medium text-gray-500">{item.category_name || 'Equipo m\u00e9dico'}</span>
                  <span className="text-xs text-gray-400 mt-1">Imagen no disponible</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      i === selectedImage ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`${item.name} — imagen ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {item.category_name && (
              <span className="mb-2 inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 uppercase tracking-wider">
                {item.category_name}
              </span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{item.name}</h1>

            {/* Availability */}
            {item.available !== undefined && (
              <div className="mt-3">
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                  item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`} />
                  {item.available ? 'Disponible' : 'No disponible'}
                </span>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <p className="mt-4 text-gray-600 leading-relaxed">{item.description}</p>
            )}

            {/* Pricing table — only for rental items */}
            {isRentalItem(item.name) && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Precios de renta</h3>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-500">Periodo</th>
                        <th className="px-4 py-2.5 text-right font-medium text-gray-500">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {item.price_daily != null && (
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Diario</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatMXN(item.price_daily)}</td>
                        </tr>
                      )}
                      {item.price_weekly != null && (
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Semanal</td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatMXN(item.price_weekly)}</td>
                        </tr>
                      )}
                      {item.price_monthly != null && (
                        <tr className="bg-primary-50/50">
                          <td className="px-4 py-3 font-medium text-primary-700">Mensual</td>
                          <td className="px-4 py-3 text-right font-bold text-primary-700">{formatMXN(item.price_monthly)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {item.deposit != null && (
                  <p className="mt-2 text-xs text-gray-500">
                    Dep&oacute;sito en garant&iacute;a: <span className="font-semibold">{formatMXN(item.deposit)}</span> (reembolsable)
                  </p>
                )}
              </div>
            )}

            {/* Specs */}
            {(item.serial_number || item.condition) && (
              <div className="mt-6 space-y-1 text-sm text-gray-600">
                {item.condition && <p><span className="font-medium text-gray-700">Condición:</span> {item.condition}</p>}
                {item.serial_number && <p><span className="font-medium text-gray-700">No. serie:</span> {item.serial_number}</p>}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => { setModalOpen(true); setSuccess(false); }}
                className="btn-primary text-base px-8 py-3"
              >
                Solicitar renta
              </button>
              <a
                href={waMessage}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWAClick('detalle_cotizar')}
                className="btn-whatsapp text-base px-6 py-3"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rental request modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-bold text-gray-900">
                {success ? 'Solicitud enviada' : 'Solicitar renta'}
              </Dialog.Title>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Solicitud recibida</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Nos comunicaremos contigo a la brevedad para confirmar tu renta.
                  También puedes escribirnos por WhatsApp para agilizar el proceso.
                </p>
                <a
                  href={waMessage}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWAClick('detalle_cta')}
                  className="btn-whatsapp mt-4"
                >
                  Escribir por WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">
                  Equipo: <span className="font-medium text-gray-900">{item.name}</span>
                </p>

                <div>
                  <label className="label-field">Nombre completo *</label>
                  <input name="customer_name" required value={form.customer_name} onChange={handleChange} className="input-field" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-field">Teléfono *</label>
                    <input name="customer_phone" type="tel" required value={form.customer_phone} onChange={handleChange} className="input-field" placeholder="442..." />
                  </div>
                  <div>
                    <label className="label-field">Correo</label>
                    <input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} className="input-field" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-field">Fecha inicio *</label>
                    <input name="start_date" type="date" required value={form.start_date} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="label-field">Fecha fin *</label>
                    <input name="end_date" type="date" required value={form.end_date} onChange={handleChange} className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="label-field">Dirección de entrega *</label>
                  <input name="delivery_address" required value={form.delivery_address} onChange={handleChange} className="input-field" placeholder="Calle, colonia, código postal" />
                </div>

                <div>
                  <label className="label-field">Notas adicionales</label>
                  <textarea name="notes" rows={2} value={form.notes} onChange={handleChange} className="input-field" />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                  {submitting ? 'Enviando...' : 'Enviar solicitud'}
                </button>
              </form>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
