import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import formatMXN from '../../utils/formatMXN';
import { waLink } from '../../utils/whatsapp';
import apiClient from '../../api/client';

function WaIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ModelCard({ model }) {
  const waMsg = waLink(`Hola, me interesa rentar el *${model.name}*. ¿Está disponible?`);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center h-44 bg-white px-6 pt-5">
        <img
          src={model.image}
          alt={`Concentrador de oxígeno ${model.name} — renta en Querétaro`}
          className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-4">
        <h2 className="text-xl font-bold text-gray-900">{model.name}</h2>

        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 flex items-baseline justify-between" style={{ backgroundColor: '#243e8c' }}>
            <span className="text-sm font-medium text-primary-100">Mensual</span>
            <span className="text-2xl font-extrabold text-white">
              {formatMXN(model.price_monthly)}
            </span>
          </div>
          {(model.price_biweekly || model.price_weekly) && (
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              {model.price_biweekly && (
                <div className="px-4 py-2.5 text-center">
                  <div className="text-xs text-gray-500">Quincenal</div>
                  <div className="text-sm font-bold text-gray-900">{formatMXN(model.price_biweekly)}</div>
                </div>
              )}
              {model.price_weekly && (
                <div className="px-4 py-2.5 text-center">
                  <div className="text-xs text-gray-500">Semanal</div>
                  <div className="text-sm font-bold text-gray-900">{formatMXN(model.price_weekly)}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Incluye</p>
          <ul className="space-y-1.5">
            {(model.includes || []).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#243e8c' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-2.5 flex items-center gap-2">
          <svg className="h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span className="text-xs text-amber-800">
            Depósito en garantía: <span className="font-semibold">{formatMXN(model.deposit)}</span> (reembolsable)
          </span>
        </div>

        {model.faa_label && (
          <div className={`rounded-lg px-4 py-2.5 flex items-center gap-2 ${
            model.faa_approved ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200'
          }`}>
            <svg className={`h-4 w-4 shrink-0 ${model.faa_approved ? '' : 'text-gray-500'}`} style={model.faa_approved ? { color: '#243e8c' } : {}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            <span className={`text-xs ${model.faa_approved ? '' : 'text-gray-600'}`} style={model.faa_approved ? { color: '#243e8c' } : {}}>
              {model.faa_label}
            </span>
          </div>
        )}

        <a
          href={waMsg}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mt-auto justify-center py-3 text-sm"
        >
          <WaIcon />
          Preguntar por {model.name}
        </a>
      </div>
    </div>
  );
}

const G5_SPECS = [
  { label: 'Peso', value: '2.2 kg (4.7 lbs)' },
  { label: 'Dimensiones', value: '18.26cm x 20.7cm x 8.31cm' },
  { label: 'Flujo', value: 'de 1 – 6 litros por minuto' },
  { label: 'Ruido', value: '<38 dBA en ajuste 2' },
  { label: 'Batería chica', value: 'Dura 6.5 hrs en 1LPM' },
  { label: 'Batería grande', value: 'Dura 13 hrs en 1LPM' },
  { label: 'Consumo conectado', value: '40W a 120W en AC y DC' },
  { label: 'Operación', value: 'Controles intuitivos y pantalla LCD de fácil lectura' },
];

const PACKAGE_DATA = {
  basico: {
    id: 'basico', label: 'Paquete Básico', model: 'Inogen One G5', price: 69000,
    image: '/images/inogen-g5-png.webp',
    description: 'Concentrador de Oxígeno portátil Inogen G5. 3 Años de Garantía. Aprobado por la FDA, cumple con los estándares FAA para su uso en aviones, incluye accesorios, requiere mantenimiento mínimo, controles intuitivos y pantalla LCD de fácil lectura.',
    features: [
      { text: '3 Años de garantía', highlight: true, icon: 'warranty' },
      { text: 'Cumple con normas de la FAA', icon: 'faa' },
      { text: '2.2 kg (4.7 lbs)', icon: 'weight' },
      { text: 'Flujo de 1-6 (LPM)', icon: 'flow' },
      { text: '1 Batería chica (Dura 6.5 hrs)', icon: 'battery' },
    ],
    includes: [
      { label: 'Equipo', image: '/images/inogen-g5-png.webp' },
      { label: 'Mochila de transporte', image: '/images/mochila-transporte-g5.jpg' },
      { label: 'Cargador (AC) de pared', image: '/images/inogen-one-g5-cargador-pared.jpg' },
      { label: 'Cargador (DC) para auto', image: '/images/inogen-one-g5-cargador-auto.jpg' },
      { label: 'Una (1) Batería chica', image: '/images/inogen-one-g5-bateria-chica.jpg' },
    ],
    specs: G5_SPECS,
  },
  plus: {
    id: 'plus', label: 'Paquete Plus', model: 'Inogen One G5', price: 74500,
    image: '/images/inogen-g5-png.webp',
    description: 'Concentrador de Oxígeno portátil Inogen G5. 3 Años de Garantía. Paquete Plus con mayor autonomía de batería para viajes y uso prolongado.',
    features: [
      { text: '3 Años de garantía', highlight: true, icon: 'warranty' },
      { text: 'Cumple con normas de la FAA', icon: 'faa' },
      { text: '2.2 kg (4.7 lbs)', icon: 'weight' },
      { text: 'Flujo de 1-6 (LPM)', icon: 'flow' },
      { text: '2 Baterías chicas (Dura 6.5 hrs c/u)', icon: 'battery' },
    ],
    includes: [
      { label: 'Equipo', image: '/images/inogen-g5-png.webp' },
      { label: 'Mochila de transporte', image: '/images/mochila-transporte-g5.jpg' },
      { label: 'Cargador (AC) de pared', image: '/images/inogen-one-g5-cargador-pared.jpg' },
      { label: 'Cargador (DC) para auto', image: '/images/inogen-one-g5-cargador-auto.jpg' },
      { label: 'Dos (2) Baterías chicas', image: '/images/inogen-one-g5-bateria-chica.jpg' },
    ],
    specs: G5_SPECS,
  },
  tres: {
    id: 'tres', label: 'Paquete Tres', model: 'Inogen One G5', price: 83000,
    image: '/images/inogen-g5-png.webp',
    description: 'Concentrador de Oxígeno portátil Inogen G5. 3 Años de Garantía. Paquete Tres con batería grande para máxima autonomía.',
    features: [
      { text: '3 Años de garantía', highlight: true, icon: 'warranty' },
      { text: 'Cumple con normas de la FAA', icon: 'faa' },
      { text: '2.2 kg (4.7 lbs)', icon: 'weight' },
      { text: 'Flujo de 1-6 (LPM)', icon: 'flow' },
      { text: '1 Batería grande (Dura 13 hrs)', icon: 'battery' },
    ],
    includes: [
      { label: 'Equipo', image: '/images/inogen-g5-png.webp' },
      { label: 'Mochila de transporte', image: '/images/mochila-transporte-g5.jpg' },
      { label: 'Cargador (AC) de pared', image: '/images/inogen-one-g5-cargador-pared.jpg' },
      { label: 'Cargador (DC) para auto', image: '/images/inogen-one-g5-cargador-auto.jpg' },
      { label: 'Una (1) Batería grande', image: null },
    ],
    specs: G5_SPECS,
  },
  cuatro: {
    id: 'cuatro', label: 'Paquete Cuatro', model: 'Inogen One G5', price: 88000,
    image: '/images/inogen-g5-png.webp',
    description: 'Concentrador de Oxígeno portátil Inogen G5. 3 Años de Garantía. Paquete más completo con batería grande y batería chica extra.',
    features: [
      { text: '3 Años de garantía', highlight: true, icon: 'warranty' },
      { text: 'Cumple con normas de la FAA', icon: 'faa' },
      { text: '2.2 kg (4.7 lbs)', icon: 'weight' },
      { text: 'Flujo de 1-6 (LPM)', icon: 'flow' },
      { text: '1 Batería grande + 1 Batería chica', icon: 'battery' },
    ],
    includes: [
      { label: 'Equipo', image: '/images/inogen-g5-png.webp' },
      { label: 'Mochila de transporte', image: '/images/mochila-transporte-g5.jpg' },
      { label: 'Cargador (AC) de pared', image: '/images/inogen-one-g5-cargador-pared.jpg' },
      { label: 'Cargador (DC) para auto', image: '/images/inogen-one-g5-cargador-auto.jpg' },
      { label: 'Una (1) Batería grande', image: null },
      { label: 'Una (1) Batería chica', image: '/images/inogen-one-g5-bateria-chica.jpg' },
    ],
    specs: G5_SPECS,
  },
};

const PACKAGES = [
  { id: 'basico', label: 'Paquete Básico' },
  { id: 'plus', label: 'Paquete Plus' },
  { id: 'tres', label: 'Paquete Tres' },
  { id: 'cuatro', label: 'Paquete Cuatro' },
];

function ImagePlaceholder({ className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-50 text-gray-300 rounded-xl ${className}`}>
      <svg className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 21h18" />
      </svg>
      <span className="text-xs">Próximamente</span>
    </div>
  );
}

function FeatureIcon({ type, highlight }) {
  const iconStyle = { color: highlight ? '#243e8c' : '#9ca3af' };
  const cls = 'h-5 w-5 shrink-0';

  if (type === 'warranty') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
  if (type === 'faa') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
  );
  if (type === 'weight') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.59 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
    </svg>
  );
  if (type === 'flow') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  );
  if (type === 'battery') return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <rect x="2" y="8" width="15" height="8" rx="1.5" />
      <path strokeLinecap="round" d="M17 11.5h2a.5.5 0 0 1 .5.5v0a.5.5 0 0 1-.5.5h-2" />
      <line x1="5" y1="11" x2="5" y2="13" strokeLinecap="round" />
      <line x1="8" y1="11" x2="8" y2="13" strokeLinecap="round" />
    </svg>
  );
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function PackageDetailView({ pkg, onBack }) {
  const waMsg = waLink(`Hola, me interesa el *Inogen One G5 ${pkg.label}*. ¿Pueden darme más información y disponibilidad?`);

  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver a paquetes
      </button>

      {/* Hero: image + info */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">

        {/* Product image with credentials overlay */}
        <div className="relative flex items-center justify-center rounded-2xl bg-white border border-gray-100 p-8 min-h-80 overflow-hidden">
          {pkg.image
            ? <img src={pkg.image} alt={pkg.model} className="max-h-80 w-auto object-contain" />
            : <ImagePlaceholder className="w-full h-80" />
          }
          <img
            src="/images/credenciales-fda-faa-garantia-inogen.svg"
            alt="FDA Approved - FAA - Garantía 3 Años Inogen"
            className="absolute left-2 bottom-2 w-44 pointer-events-none select-none"
          />
        </div>

        {/* Info column */}
        <div>
          <span className="inline-block rounded-full text-xs font-semibold px-3 py-1 mb-3 text-white" style={{ backgroundColor: '#243e8c' }}>
            Nuevo
          </span>
          <h2 className="text-3xl font-bold text-gray-900">{pkg.model}</h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">{pkg.description}</p>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-1.5">
            <span className="text-5xl font-black" style={{ color: '#243e8c' }}>
              ${pkg.price.toLocaleString('es-MX')}
            </span>
            <span className="text-xl font-semibold text-gray-500">MXN</span>
          </div>
          <p className="text-sm mt-1.5">
            <span className="font-bold text-gray-900">Paquete:</span>{' '}
            <span className="text-gray-500">{pkg.label.replace('Paquete ', '')}</span>
          </p>

          {/* Features with icons */}
          <ul className="mt-5 space-y-3">
            {pkg.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <FeatureIcon type={f.icon} highlight={f.highlight} />
                <span
                  className={f.highlight ? 'font-bold text-base' : 'text-sm text-gray-600'}
                  style={f.highlight ? { color: '#243e8c' } : {}}
                >
                  {f.text}
                </span>
              </li>
            ))}
          </ul>

          <a
            href={waMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 inline-flex items-center gap-2 px-6 py-3"
          >
            <WaIcon />
            Consultar por WhatsApp
          </a>
        </div>
      </div>

      {/* What's included */}
      <div className="border-t border-gray-100 pt-10">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-1">¿Qué incluye en paquete?</h3>
        <p className="text-center text-sm text-gray-400 mb-8">Las fotografías pueden verse diferentes al producto real</p>
        <div className="flex flex-wrap justify-center gap-6">
          {pkg.includes.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 w-32">
              <div className="h-28 w-28 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden">
                {item.image
                  ? <img src={item.image} alt={item.label} className="h-full w-full object-contain p-2" />
                  : <ImagePlaceholder className="h-full w-full" />
                }
              </div>
              <span className="text-xs text-center text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Specs */}
      <div className="border-t border-gray-100 pt-10 mt-10">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center h-72">
            <ImagePlaceholder className="h-full w-full" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Especificaciones:</h3>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              El Inogen One G5 es un concentrador de oxígeno portátil conocido por su eficiencia y portabilidad.
              Aquí hay información adicional importante sobre el dispositivo:
            </p>
            <ul className="space-y-2.5">
              {pkg.specs.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-gray-500 shrink-0 w-36">{s.label}:</span>
                  <span className="font-bold text-gray-900">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const SIDEBAR = [
  {
    id: 'paquetes', label: 'Paquetes',
    subs: PACKAGES.map((p) => ({ id: p.id, label: p.label })),
  },
  {
    id: 'g2', label: 'Inogen G2',
    subs: [
      { id: 'concentrador', label: 'Todos los productos' },
      { id: 'bateria', label: 'Baterías Inogen G2' },
      { id: 'accesorio', label: 'Accesorios Inogen G2' },
    ],
  },
  {
    id: 'g3', label: 'Inogen G3',
    subs: [
      { id: 'concentrador', label: 'Todos los productos' },
      { id: 'bateria', label: 'Baterías Inogen G3' },
      { id: 'accesorio', label: 'Accesorios Inogen G3' },
    ],
  },
  {
    id: 'g4', label: 'Inogen G4',
    subs: [
      { id: 'concentrador', label: 'Todos los productos' },
      { id: 'bateria', label: 'Baterías Inogen G4' },
      { id: 'accesorio', label: 'Accesorios Inogen G4' },
    ],
  },
  {
    id: 'g5', label: 'Inogen G5',
    subs: [
      { id: 'concentrador', label: 'Todos los productos' },
      { id: 'bateria', label: 'Baterías Inogen G5' },
      { id: 'accesorio', label: 'Accesorios Inogen G5' },
    ],
  },
  {
    id: 'at-home', label: 'Inogen At Home',
    subs: [
      { id: 'concentrador', label: 'Todos los productos' },
      { id: 'accesorio', label: 'Accesorios At Home' },
    ],
  },
];

export default function RespiratoryPage() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('paquetes');
  const [selectedSubcat, setSelectedSubcat] = useState('all');

  useEffect(() => {
    apiClient.get('/inogen/')
      .then((r) => setModels(r.data.filter((m) => m.is_active)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSidebarClick = (modelId, subcatId) => {
    setSelectedModel(modelId);
    setSelectedSubcat(subcatId);
  };

  const showPackages = selectedModel === 'paquetes';
  const showPackageDetail = showPackages && selectedSubcat !== 'all' && !!PACKAGE_DATA[selectedSubcat];
  const showConcentrators = !showPackages && selectedSubcat === 'concentrador';

  const visibleModels = (!showPackages && selectedModel)
    ? models.filter((m) => m.model_id === selectedModel)
    : models;

  return (
    <>
      <Helmet>
        <title>Concentradores de Oxígeno Inogen — MediMundo Querétaro</title>
        <meta
          name="description"
          content="Renta de concentradores de oxígeno portátiles Inogen One G2, G3, G4, G5 y Inogen At Home. Entrega a domicilio en Querétaro. Aprobados FAA."
        />
        <link rel="canonical" href="https://medimundo.mx/respiratorio" />
        <meta property="og:title" content="Concentradores de Oxígeno Inogen en Querétaro | MediMundo" />
        <meta property="og:description" content="Renta de concentradores de oxígeno portátiles Inogen One G2, G3, G4, G5 y Inogen At Home. Entrega a domicilio en Querétaro. Aprobados FAA." />
        <meta property="og:url" content="https://medimundo.mx/respiratorio" />
        <meta property="og:image" content="https://medimundo.mx/images/concentrador-oxigeno-portatil-inogen-one-g5-renta-queretaro.jpg" />
      </Helmet>

      {/* Hero banner */}
      <div
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/images/inogen-bg-forest.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1>
            <img
              src="/images/inogen-one-logo.svg"
              alt="Inogen One — Concentradores de Oxígeno"
              className="h-24 sm:h-32 lg:h-40 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,1)) drop-shadow(0 0 20px rgba(0,0,0,0.85)) drop-shadow(0 0 40px rgba(0,0,0,0.5))' }}
            />
          </h1>
          <p className="mt-3 max-w-2xl text-slate-200 sm:text-lg">
            Concentradores de oxígeno portátiles y fijos. Ligeros y eficientes, diseñados para brindar libertad, comodidad y movilidad a personas con necesidades respiratorias.
          </p>
        </div>
      </div>

      {/* Catalog: sidebar + products */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-10">

          {/* Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <h2 className="text-base font-bold text-gray-900 mb-4">Categorías</h2>
            <div className="space-y-5">
              {SIDEBAR.map((group) => (
                <div key={group.id}>
                  <button
                    onClick={() => handleSidebarClick(group.id, group.id === 'paquetes' ? 'all' : 'concentrador')}
                    className="text-sm font-bold mb-1.5 block text-left w-full transition-opacity hover:opacity-75"
                    style={{ color: '#243e8c' }}
                  >
                    {group.label}
                  </button>
                  <ul className="space-y-1 pl-1">
                    {group.subs.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => handleSidebarClick(group.id, sub.id)}
                          className="text-sm text-left w-full transition-colors"
                          style={
                            selectedModel === group.id && selectedSubcat === sub.id
                              ? { color: '#243e8c', fontWeight: 600 }
                              : {}
                          }
                        >
                          <span className={selectedModel === group.id && selectedSubcat === sub.id ? '' : 'text-gray-600 hover:text-gray-900'}>
                            {sub.label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
            ) : showPackageDetail ? (
              <PackageDetailView
                pkg={PACKAGE_DATA[selectedSubcat]}
                onBack={() => setSelectedSubcat('all')}
              />
            ) : showPackages ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {PACKAGES.map((pkg) => {
                  const pkgData = PACKAGE_DATA[pkg.id];
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedSubcat(pkg.id)}
                      className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
                    >
                      <div className="flex items-center justify-center h-44 bg-white px-6 pt-5">
                        <img
                          src={pkgData.image}
                          alt={pkg.label}
                          className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Inogen One G5</p>
                          <h3 className="text-lg font-bold text-gray-900">{pkg.label}</h3>
                        </div>
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                          <div className="px-4 py-3 text-center" style={{ backgroundColor: '#243e8c' }}>
                            <span className="text-sm font-medium text-white/80">Precio</span>
                            <p className="text-xl font-bold text-white mt-0.5">
                              ${pkgData.price.toLocaleString('es-MX')} MXN
                            </p>
                          </div>
                        </div>
                        <ul className="space-y-1.5 flex-1">
                          {pkgData.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="h-3.5 w-3.5 shrink-0" style={{ color: '#243e8c' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              {f.text}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#243e8c' }}>
                          Ver detalles
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : showConcentrators ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleModels.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
                <p className="mt-10 text-center text-sm text-gray-500">
                  Todos los precios incluyen entrega y recogida en zona metropolitana de Querétaro.
                  Para zonas foráneas consultar costo adicional.
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8" style={{ color: '#243e8c' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Próximamente</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Estamos preparando esta sección. Contáctanos por WhatsApp para consultar disponibilidad.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
