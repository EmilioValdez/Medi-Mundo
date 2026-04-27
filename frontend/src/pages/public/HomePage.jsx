import { useState, useEffect, useRef } from 'react';
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
  { icon: ClipboardDocumentCheckIcon, title: 'Solicita', desc: 'Envía tu solicitud de renta por WhatsApp.' },
  { icon: TruckIcon, title: 'Recibe', desc: 'Te lo entregamos sanitizado a domicilio en Querétaro.' },
  { icon: ArrowPathIcon, title: 'Devuelve', desc: 'Al finalizar tu renta, pasamos a recogerlo sin costo.' },
];

const trustSignals = [
  { icon: ShieldCheckIcon, title: 'Equipo sanitizado', desc: 'Protocolo de limpieza y desinfección certificado.' },
  { icon: ClockIcon, title: 'Entrega rápida', desc: 'Entrega el mismo día o al día siguiente en zona metropolitana.' },
  { icon: WrenchScrewdriverIcon, title: 'Soporte técnico', desc: 'Asistencia continua durante toda tu renta.' },
];

const CATEGORY_ORDER = [
  'camas-hospitalarias',
  'concentradores-de-oxigeno',
  'equipos-apoyo',
  'bano-seguridad',
  'andaderas-bastones',
  'ortopedia',
];


function ParallaxHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      heroRef.current.style.backgroundPositionY = `calc(50% + ${scrollY * 0.45}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage: 'url(/images/portada-hero-medimundo.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 50%',
        backgroundRepeat: 'no-repeat',
        minHeight: '580px',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(2,132,199,0.55) 0%, rgba(56,189,248,0.35) 45%, rgba(255,255,255,0.15) 100%)',
        }}
      />

      {/* Logo — esquina superior derecha */}
      <div className="absolute top-0 right-0 z-10">
        <img
          src="/logo-medimundo.png?v=5"
          alt="MediMundo"
          className="w-72 sm:w-[26rem] lg:w-[32rem]"
          style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,1)) drop-shadow(0 0 20px rgba(0,0,0,0.85)) drop-shadow(0 0 40px rgba(0,0,0,0.5))' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow sm:text-5xl lg:text-6xl">
            Equipo médico en renta
            <span className="block text-blue-100">a domicilio en Querétaro</span>
          </h1>
          <p className="mt-5 text-lg text-blue-50 drop-shadow sm:text-xl">
            Camas hospitalarias, concentradores de oxígeno, sillas de ruedas y más.
            Sanitizados, con entrega rápida y soporte continuo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/rentas" className="btn-white text-base px-7 py-3">
              Productos en renta
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
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const INOGEN_MODELS = [
  {
    id: 'g2',
    name: 'Inogen One G2',
    tag: 'Portátil',
    tagline: 'Robusto y confiable para uso diario en casa o en movimiento.',
    features: ['Flujo de pulso inteligente', 'Batería de larga duración', 'Aprobado para vuelos'],
    image: '/images/inogen-g2-1.jpg',
  },
  {
    id: 'g3',
    name: 'Inogen One G3',
    tag: 'Portátil',
    tagline: 'Compacto y ligero, ideal para mantener tu ritmo de vida activo.',
    features: ['Solo 2.2 kg', 'Hasta 4.5 h de batería', 'Pantalla LED intuitiva'],
    image: '/images/inogen-g3-1.jpg',
  },
  {
    id: 'g4',
    name: 'Inogen One G4',
    tag: 'Ultra ligero',
    tagline: 'El más pequeño y discreto de la línea Inogen, cabe en cualquier bolso.',
    features: ['Solo 1.08 kg', 'Ultra compacto', 'Silencioso y discreto'],
    image: '/images/inogen-g4-1.jpg',
  },
  {
    id: 'g5',
    name: 'Inogen One G5',
    tag: 'Más reciente',
    tagline: 'La tecnología más avanzada: mayor autonomía y flujos de oxígeno superiores.',
    features: ['Hasta 13 h de autonomía', 'Aprobado por la FAA', '6 ajustes de flujo'],
    image: '/images/inogen-g5-1.jpg',
    highlight: true,
  },
  {
    id: 'at-home',
    name: 'Inogen At Home',
    tag: 'Para casa',
    tagline: 'Diseñado para uso continuo en el hogar, silencioso y sin interrupciones.',
    features: ['Operación 24/7', 'Flujo continuo', 'Bajo nivel de ruido'],
    image: '/images/inogen-at-home-1.jpg',
  },
];

function InogenSection() {
  const [current, setCurrent] = useState(0);
  const total = INOGEN_MODELS.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const m = INOGEN_MODELS[current];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/inogen-bg-forest.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-900/50" />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-blue-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300 ring-1 ring-blue-400/30">
            Concentradores de oxígeno
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            Línea Inogen — Oxígeno donde vayas
          </h2>
          <p className="mt-2 text-slate-400 max-w-xl mx-auto text-sm">
            Toda la familia Inogen disponible para renta. Desliza para conocer cada modelo.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center gap-4">

          {/* Prev button */}
          <button
            onClick={prev}
            className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
            aria-label="Modelo anterior"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Card */}
          <div className="flex-1 grid sm:grid-cols-2 gap-6 items-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 p-6 sm:p-8 min-h-[320px]">

            {/* Image */}
            <div className="flex items-center justify-center order-1 sm:order-2">
              <img
                key={m.id}
                src={m.image}
                alt={m.name}
                className="max-h-56 w-auto object-contain drop-shadow-2xl transition-opacity duration-300"
              />
            </div>

            {/* Info */}
            <div className="order-2 sm:order-1">
              <span className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide mb-3 ${
                m.highlight ? 'bg-blue-500 text-white' : 'bg-white/20 text-white'
              }`}>
                {m.tag}
              </span>
              <h3 className="text-2xl font-extrabold text-white leading-tight">{m.name}</h3>
              <p className="mt-2 text-slate-300 text-sm leading-relaxed">{m.tagline}</p>
              <ul className="mt-4 space-y-1.5">
                {m.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/respiratorio"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-300 hover:text-white transition-colors"
              >
                Ver detalles y precios
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
            aria-label="Siguiente modelo"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {INOGEN_MODELS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current
                  ? 'w-6 h-2.5 bg-blue-400'
                  : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ir al modelo ${i + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/respiratorio" className="btn-primary text-base px-7 py-3">
            Ver todos los modelos
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, me interesa rentar un concentrador de oxígeno Inogen.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-base px-7 py-3"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Preguntar disponibilidad
          </a>
        </div>

      </div>
    </section>
  );
}

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, eqRes] = await Promise.all([
          apiClient.get('/categories/'),
          apiClient.get('/equipment/', { params: { active_only: true } }),
        ]);
        const cats = Array.isArray(catRes.data) ? catRes.data : [];
        const sorted = CATEGORY_ORDER
          .map(slug => cats.find(c => c.slug === slug))
          .filter(Boolean);
        setCategories(sorted);
        const eqs = Array.isArray(eqRes.data) ? eqRes.data : [];
        const FEATURED_ORDER = ['lujo', 'eléctrica', 'electrica', 'ducha'];
        const picked = FEATURED_ORDER.reduce((acc, keyword) => {
          if (acc.length >= 3) return acc;
          const match = eqs.find(e =>
            e.name.toLowerCase().includes(keyword) &&
            !acc.some(x => x.id === e.id)
          );
          if (match) acc.push(match);
          return acc;
        }, []);
        setFeatured(picked);
      } catch {
        // silent
      }
    };
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>MediMundo — Renta de Equipo Médico a Domicilio</title>
        <meta name="description" content="Renta de equipo médico sanitizado a domicilio en Querétaro. Camas hospitalarias, oxígeno, movilidad y más. Entrega rápida." />
      </Helmet>

      {/* Hero with parallax */}
      <ParallaxHero />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Categorías de equipo</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-gray-500">
            Encuentra el equipo médico que necesitas para tu recuperación o cuidado en casa.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.id}`}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
              >
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

      {/* Inogen G5 spotlight — parallax */}
      <InogenSection />

      {/* Featured equipment */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
