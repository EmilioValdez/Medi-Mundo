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
      {/* Image */}
      <div className="flex items-center justify-center h-44 bg-white px-6 pt-5">
        <img
          src={model.image}
          alt={`Concentrador de oxígeno ${model.name} — renta en Querétaro`}
          className="h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
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

        {/* Included */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Incluye</p>
          <ul className="space-y-1.5">
            {(model.includes || []).map((item, i) => (
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
        {model.faa_label && (
          <div className={`rounded-lg px-4 py-2.5 flex items-center gap-2 ${
            model.faa_approved
              ? 'bg-blue-50 border border-blue-100'  /* keep subtle bg */
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <svg className={`h-4 w-4 shrink-0 ${model.faa_approved ? '' : 'text-gray-500'}`} style={model.faa_approved ? { color: '#243e8c' } : {}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            <span className={`text-xs ${model.faa_approved ? '' : 'text-gray-600'}`} style={model.faa_approved ? { color: '#243e8c' } : {}}>
              {model.faa_label}
            </span>
          </div>
        )}

        {/* CTA */}
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

const SIDEBAR = [
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
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSubcat, setSelectedSubcat] = useState('concentrador');

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

  const visibleModels = selectedModel
    ? models.filter((m) => m.model_id === selectedModel)
    : models;

  const showConcentrators = selectedSubcat === 'concentrador';


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
                    onClick={() => handleSidebarClick(group.id, 'concentrador')}
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
