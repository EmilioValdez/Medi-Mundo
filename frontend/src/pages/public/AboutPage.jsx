import { Helmet } from 'react-helmet-async';
import { ShieldCheckIcon, SparklesIcon, HeartIcon, TruckIcon } from '@heroicons/react/24/outline';

import { waLink, WA_MESSAGES } from '../../utils/whatsapp';

const values = [
  { icon: ShieldCheckIcon, title: 'Seguridad', desc: 'Todos nuestros equipos pasan por un riguroso protocolo de limpieza y desinfección antes de cada entrega.' },
  { icon: HeartIcon, title: 'Cuidado', desc: 'Nos preocupamos genuinamente por la recuperación y bienestar de nuestros clientes.' },
  { icon: TruckIcon, title: 'Puntualidad', desc: 'Entregas y recolecciones a tiempo, sin complicaciones para ti ni tu familia.' },
  { icon: SparklesIcon, title: 'Calidad', desc: 'Equipo médico de marcas reconocidas, en excelente estado y con mantenimiento constante.' },
];

const sanitizationSteps = [
  'Desmontaje y limpieza profunda de cada componente',
  'Desinfección con soluciones hospitalarias certificadas',
  'Inspección técnica y funcional completa',
  'Empacado en material limpio para transporte seguro',
  'Verificación final antes de entrega al cliente',
];

const testimonials = [
  {
    name: 'María González',
    text: 'Excelente servicio. La cama hospitalaria llegó en perfecto estado y sanitizada. Me ayudaron a instalarla y explicaron todo el funcionamiento.',
    location: 'Juriquilla, Querétaro',
  },
  {
    name: 'Roberto Martínez',
    text: 'Necesitábamos un concentrador de oxígeno con urgencia y nos lo entregaron el mismo día. Muy profesionales y atentos.',
    location: 'Centro, Querétaro',
  },
  {
    name: 'Ana Luisa Ramírez',
    text: 'La silla de ruedas que rentamos para mi mamá estaba como nueva. El precio es muy accesible comparado con la compra. Totalmente recomendados.',
    location: 'El Pueblito, Corregidora',
  },
];

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Nosotros — MediMundo</title>
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold sm:text-4xl">Sobre MediMundo</h1>
            <p className="mt-4 text-lg text-primary-100">
              Somos una empresa queretana dedicada a facilitar el acceso a equipo médico de calidad
              mediante renta a domicilio. Nuestro compromiso es brindar equipos sanitizados,
              en perfecto estado, con entrega rápida y soporte continuo.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-watermark mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Nuestros valores</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">{v.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sanitization process */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              Proceso de sanitización
            </h2>
            <p className="mt-2 text-center text-gray-500">
              Cada equipo pasa por un protocolo de sanitización antes de ser entregado.
            </p>
            <ol className="mt-10 space-y-4">
              {sanitizationSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Lo que dicen nuestros clientes
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 italic">"{t.text}"</p>
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">¿Listo para rentar?</h2>
          <p className="mt-3 text-primary-100">Contáctanos y recibe tu equipo sanitizado a domicilio.</p>
          <a
            href={waLink(WA_MESSAGES.rentas)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 text-base px-8 py-3"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
