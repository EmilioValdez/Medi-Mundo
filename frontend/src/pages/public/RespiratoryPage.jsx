import { Helmet } from 'react-helmet-async';
import formatMXN from '../../utils/formatMXN';

const WA_NUMBER = '524422237757';

const MODELS = [
  {
    id: 'g2',
    name: 'Inogen One G2',
    image: '/images/concentrador-oxigeno-portatil-inogen-one-g2-renta-queretaro.jpg',
    monthly: 3690,
    biweekly: null,
    weekly: null,
    deposit: 25000,
    faaLabel: 'Aprobado por FAA — apto para avión comercial',
    faaApproved: true,
    includes: [
      'Equipo',
      'Cargador de Pared y Auto',
      'Carrito de Traslado',
      '(2) baterías chicas de 12 celdas  ó  (1) batería grande de 24 celdas',
    ],
  },
  {
    id: 'g3',
    name: 'Inogen One G3',
    image: '/images/concentrador-oxigeno-portatil-inogen-one-g3-renta-queretaro.jpg',
    monthly: 4990,
    biweekly: 3990,
    weekly: 2590,
    deposit: 30000,
    faaLabel: 'Aprobado por FAA — apto para avión comercial',
    faaApproved: true,
    includes: [
      'Equipo',
      'Cargador de Pared y Auto',
      'Mochila de Traslado',
      '(2) baterías chicas de 8 celdas  ó  (1) batería grande de 16 celdas',
    ],
  },
  {
    id: 'g4',
    name: 'Inogen One G4',
    image: '/images/concentrador-oxigeno-portatil-inogen-one-g4-renta-queretaro.jpg',
    monthly: 4990,
    biweekly: 3990,
    weekly: 2590,
    deposit: 30000,
    faaLabel: 'Fabricado bajo normas FAA — verifique con su aerolínea',
    faaApproved: false,
    includes: [
      'Equipo',
      'Cargador de Pared y Auto',
      'Mochila de Traslado',
      '(2) baterías chicas de 8 celdas',
    ],
  },
  {
    id: 'g5',
    name: 'Inogen One G5',
    image: '/images/concentrador-oxigeno-portatil-inogen-one-g5-renta-queretaro.jpg',
    monthly: 6590,
    biweekly: 4590,
    weekly: 2590,
    deposit: 40000,
    faaLabel: 'Fabricado bajo normas FAA — verifique con su aerolínea',
    faaApproved: false,
    includes: [
      'Equipo',
      'Cargador de Pared y Auto',
      'Mochila de Traslado',
      '(2) baterías chicas de 8 celdas  ó  (1) batería grande de 16 celdas',
    ],
  },
  {
    id: 'at-home',
    name: 'Inogen At Home',
    image: '/images/concentrador-oxigeno-estacionario-inogen-at-home-renta-queretaro.jpg',
    monthly: 3000,
    biweekly: null,
    weekly: null,
    deposit: 6000,
    faaLabel: null,
    faaApproved: false,
    includes: [
      'Equipo',
      'Cable de conexión a pared',
      'Peso 8.2 kg — compacto y fácil de mover',
      'Hasta 5 LPM en flujo continuo',
      'Ruido menor a 40 dB en nivel 2',
      'Inteligente, bajo consumo energético',
    ],
  },
];

function WaIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ModelCard({ model }) {
  const waMsg = encodeURIComponent(
    `Hola, me interesa rentar el ${model.name}. ¿Pueden darme más información?`
  );

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={model.image}
          alt={model.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Name */}
        <h2 className="text-xl font-bold text-gray-900">{model.name}</h2>

        {/* Prices */}
        <div className="rounded-xl border border-gray-100 overflow-hidden">
          <div className="bg-primary-600 px-4 py-3 flex items-baseline justify-between">
            <span className="text-sm font-medium text-primary-100">Mensual</span>
            <span className="text-2xl font-extrabold text-white">
              {formatMXN(model.monthly)}
            </span>
          </div>
          {(model.biweekly || model.weekly) && (
            <div className="grid grid-cols-2 divide-x divide-gray-100">
              {model.biweekly && (
                <div className="px-4 py-2.5 text-center">
                  <div className="text-xs text-gray-500">Quincenal</div>
                  <div className="text-sm font-bold text-gray-900">{formatMXN(model.biweekly)}</div>
                </div>
              )}
              {model.weekly && (
                <div className="px-4 py-2.5 text-center">
                  <div className="text-xs text-gray-500">Semanal</div>
                  <div className="text-sm font-bold text-gray-900">{formatMXN(model.weekly)}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Included */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Incluye</p>
          <ul className="space-y-1.5">
            {model.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Deposit */}
        <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-2.5 flex items-center gap-2">
          <svg className="h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span className="text-xs text-amber-800">
            Depósito en garantía: <span className="font-semibold">{formatMXN(model.deposit)}</span> (reembolsable)
          </span>
        </div>

        {/* FAA */}
        {model.faaLabel && (
          <div className={`rounded-lg px-4 py-2.5 flex items-center gap-2 ${
            model.faaApproved
              ? 'bg-blue-50 border border-blue-100'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <svg className={`h-4 w-4 shrink-0 ${model.faaApproved ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            <span className={`text-xs ${model.faaApproved ? 'text-blue-800' : 'text-gray-600'}`}>
              {model.faaLabel}
            </span>
          </div>
        )}

        {/* CTA */}
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
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

export default function RespiratoryPage() {
  return (
    <>
      <Helmet>
        <title>Concentradores de Oxígeno Inogen — MediMundo Querétaro</title>
        <meta
          name="description"
          content="Renta de concentradores de oxígeno portátiles Inogen One G2, G3, G4, G5 y Inogen At Home. Entrega a domicilio en Querétaro. Aprobados FAA."
        />
      </Helmet>

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-200">Renta de equipo respiratorio</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl">Concentradores de Oxígeno Inogen</h1>
          <p className="mt-3 max-w-2xl text-primary-100 sm:text-lg">
            Oxígeno portátil y estacionario con entrega a domicilio en Querétaro.
            Equipos certificados, silenciosos y de larga duración.
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODELS.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-10 text-center text-sm text-gray-500">
          Todos los precios incluyen entrega y recogida en zona metropolitana de Querétaro.
          Para zonas foráneas consultar costo adicional.
        </p>
      </div>
    </>
  );
}
