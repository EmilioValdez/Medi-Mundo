import { Helmet } from 'react-helmet-async';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

import { waLink, WA_MESSAGES } from '../../utils/whatsapp';

const contactInfo = [
  {
    icon: PhoneIcon,
    title: 'Teléfono / WhatsApp',
    lines: ['442 615 66 49'],
    link: waLink(WA_MESSAGES.contacto),
    linkText: 'Enviar WhatsApp',
  },
  {
    icon: EnvelopeIcon,
    title: 'Correo electrónico',
    lines: ['medicasaqro@gmail.com'],
    link: 'mailto:medicasaqro@gmail.com',
    linkText: 'Enviar correo',
  },
  {
    icon: MapPinIcon,
    title: 'Ubicación',
    lines: ['Av. Canadá 212, Plaza de las Américas', 'Col. Carretas, Querétaro'],
  },
  {
    icon: ClockIcon,
    title: 'Horario de atención',
    lines: ['Lunes a Viernes: 10:00 - 19:00', 'Sábado: 10:00 - 15:00', 'Domingo: Cerrado'],
  },
];

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contacto — MediMundo</title>
      </Helmet>

      <section className="bg-gradient-to-br from-primary-700 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Contacto</h1>
          <p className="mt-3 text-lg text-primary-100">
            Estamos para ayudarte. Contáctanos por el medio que prefieras.
          </p>
        </div>
      </section>

      <section className="bg-watermark mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((c, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <c.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{c.title}</h3>
              {c.lines.map((line, j) => (
                <p key={j} className="mt-1 text-sm text-gray-500">{line}</p>
              ))}
              {c.link && (
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  {c.linkText} &rarr;
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Big WhatsApp CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-10 text-center text-white">
          <svg className="mx-auto h-16 w-16 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <h2 className="text-2xl font-bold sm:text-3xl">La forma más rápida de contactarnos</h2>
          <p className="mt-2 text-green-100 text-lg">
            Escríbenos por WhatsApp y te respondemos en minutos.
          </p>
          <a
            href={waLink(WA_MESSAGES.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-green-600 shadow-lg transition-all hover:bg-green-50"
          >
            Abrir WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
