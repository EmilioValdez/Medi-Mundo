import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../api/client';
import EquipmentCard from '../../components/public/EquipmentCard';

const WA_NUMBER = '524422237757';

const steps = [
  { icon: MagnifyingGlassIcon, title: 'Elige', desc: 'Explora nuestro catálogo y encuentra el equipo que necesitas.' },
  { icon: ClipboardDocumentCheckIcon, title: 'Solicita', desc: 'Envía tu solicitud de renta en línea o por WhatsApp.' },
  { icon: TruckIcon, title: 'Recibe', desc: 'Te lo entregamos sanitizado a domicilio en Querétaro.' },
  { icon: ArrowPathIcon, title: 'Devuelve', desc: 'Al finalizar tu renta, pasamos a recogerlo sin costo.' },
];

const trustSignals = [
  { icon: ShieldCheckIcon, title: 'Equipo sanitizado', desc: 'Protocolo de limpieza y desinfección certificado.' },
  { icon: ClockIcon, title: 'Entrega rápida', desc: 'Entrega el mismo día o al día siguiente en zona metropolitana.' },
  { icon: WrenchScrewdriverIcon, title: 'Soporte técnico', desc: 'Asistencia continua durante toda tu renta.' },
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, eqRes] = await Promise.all([
          apiClient.get('/categories/'),
          apiClient.get('/equipment/', { params: { active_only: true } }),
        ]);
        const cats = Array.isArray(catRes.data) ? catRes.data : [];
        setCategories(cats.slice(0, 8));
        const eqs = Array.isArray(eqRes.data) ? eqRes.data : [];
        setFeatured(eqs.slice(0, 6));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryIcons = {
    'sillas-de-ruedas': '♿',
    'camas-hospitalarias': '🛏️',
    'andaderas-bastones': '🦯',
    'concentradores-de-oxigeno': '💨',
    'cpap-bipap': '😴',
    'nebulizadores': '💊',
    'muletas': '🩼',
    'colchones-antiescaras': '🛋️',
  };

  return (
    <>
      <Helmet>
        <title>MediMundo — Renta de Equipo Médico a Domicilio</title>
        <meta name="description" content="Renta de equipo médico sanitizado a domicilio en Querétaro. Sillas de ruedas, camas hospitalarias, oxígeno y más. Entrega rápida." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg, #E53429 0%, #B22A22 40%, #1a1a8a 75%, #0000FF 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white" />
        </div>
        {/* Logo watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
          <img src="/logo-medimundo.png" alt="" className="h-[400px] w-auto" />
        </div>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Equipo médico en renta
              <span className="block text-primary-200">a domicilio en Querétaro</span>
            </h1>
            <p className="mt-5 text-lg text-primary-100 sm:text-xl">
              Sillas de ruedas, camas hospitalarias, concentradores de oxígeno y más.
              Sanitizados, con entrega rápida y soporte continuo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo" className="btn-white text-base px-7 py-3">
                Ver catálogo
              </Link>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me interesa rentar equipo médico.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-base px-7 py-3"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-watermark mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Categorías de equipo</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-gray-500">
            Encuentra el equipo médico que necesitas para tu recuperación o cuidado en casa.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.id}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-blue-50 text-4xl shadow-sm">
                  {categoryIcons[cat.slug] || '\uD83C\uDFE5'}
                </span>
                <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-primary-50/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">¿Cómo funciona?</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-gray-500">
            Rentar equipo médico nunca fue tan fácil. En 4 sencillos pasos.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
                  <step.icon className="h-8 w-8" />
                </div>
                <span className="mt-1 text-xs font-bold text-primary-600">Paso {i + 1}</span>
                <h3 className="mt-2 text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured equipment */}
      {featured.length > 0 && (
        <section className="bg-watermark mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Equipo destacado</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/catalogo" className="btn-primary text-base px-8 py-3">
              Ver todo el catálogo
            </Link>
          </div>
        </section>
      )}

      {/* Trust signals */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">¿Por qué elegirnos?</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {trustSignals.map((t, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-600/20">
                  <t.icon className="h-7 w-7 text-primary-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            ¿Necesitas equipo médico en renta?
          </h2>
          <p className="mt-3 text-primary-100">
            Contáctanos ahora y recibe tu equipo sanitizado a domicilio en Querétaro.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/catalogo" className="btn-white text-base px-7 py-3">
              Ver catálogo
            </Link>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, necesito rentar equipo médico.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-base px-7 py-3"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
