import { Helmet } from 'react-helmet-async';

const WA_NUMBER = '524422237757';

const RECARGAS = [
  { litros: 10000, precio: 800 },
  { litros: 9500,  precio: 800 },
  { litros: 7000,  precio: 520 },
  { litros: 6000,  precio: 520 },
  { litros: 4300,  precio: 500 },
  { litros: 3455,  precio: 350 },
  { litros: 2459,  precio: 300 },
  { litros: 1750,  precio: 220 },
  { litros: 682,   precio: 160 },
  { litros: 425,   precio: 100 },
  { litros: 255,   precio: 100 },
  { litros: 170,   precio: 100 },
];

const BULLETS = [
  'Oxígeno medicinal certificado (NOM)',
  'Servicio rápido el mismo día',
  'Todos los tamaños de cilindro',
  'Precios claros, sin cobros ocultos',
];

function formatMXN(n) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

function OxygenIcon() {
  return (
    <svg className="h-6 w-6 text-primary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M5.636 5.636l1.414 1.414M16.95 16.95l1.414 1.414M3 12h2m14 0h2M5.636 18.364l1.414-1.414M16.95 7.05l1.414-1.414" />
      <circle cx="12" cy="12" r="4" strokeWidth={1.8} />
    </svg>
  );
}

export default function OxygenRefillPage() {
  const waGeneral = encodeURIComponent('Hola, me interesa una recarga de oxígeno. ¿Pueden orientarme?');

  return (
    <>
      <Helmet>
        <title>Recargas de Oxígeno — MediMundo Querétaro</title>
        <meta
          name="description"
          content="Recarga de tanques de oxígeno medicinal en Querétaro. Todos los tamaños disponibles. Servicio rápido en tienda, oxígeno certificado."
        />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-14">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 mb-10 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-2">
              Servicio en tienda
            </p>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl leading-tight">
              Recarga de Tanques de Oxígeno
            </h1>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Servicio de recarga de tanques de oxígeno medicinal certificado.
              Garantizamos pureza y seguridad para el cuidado de tus pacientes,
              con atención rápida en nuestra tienda de Querétaro.
            </p>

            <ul className="mt-6 space-y-3">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <svg className="h-3 w-3 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waGeneral}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-8 inline-flex w-full justify-center sm:w-auto"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Preguntar disponibilidad
            </a>
          </div>

          {/* ── Right column: refill rows ── */}
          <div className="lg:col-span-3 space-y-3">
            {RECARGAS.map((r) => {
              const waMsg = encodeURIComponent(
                `Hola, me interesa una recarga de oxígeno de ${r.litros.toLocaleString('es-MX')} litros. ¿Está disponible?`
              );
              return (
                <div
                  key={r.litros}
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 hover:border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  {/* Left: icon + label */}
                  <div className="flex items-center gap-3 min-w-0">
                    <OxygenIcon />
                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {r.litros.toLocaleString('es-MX')}{' '}
                        <span className="font-semibold text-gray-500">Litros</span>
                      </p>
                      <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <span className="h-3.5 w-3.5 rounded-full bg-green-400 inline-block shrink-0" />
                        Recarga en tienda
                      </p>
                    </div>
                  </div>

                  {/* Right: price + button */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xl font-extrabold text-primary-600">
                      {formatMXN(r.precio)}
                    </span>
                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp py-2 px-4 text-xs"
                    >
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Pedir
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}
