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

const VENTAJAS = [
  {
    titulo: 'Oxígeno medicinal certificado',
    desc: 'Nuestro oxígeno cumple con las normas oficiales mexicanas para uso médico, garantizando pureza y seguridad.',
  },
  {
    titulo: 'Servicio rápido en tienda',
    desc: 'Recarga disponible el mismo día. Sin esperas largas, entras y sales con tu tanque listo.',
  },
  {
    titulo: 'Todos los tamaños de tanque',
    desc: 'Desde tanques de 170 hasta 10,000 litros. Atendemos cualquier tipo de cilindro.',
  },
  {
    titulo: 'Precios accesibles',
    desc: 'Tarifas claras y sin cobros ocultos. El mejor precio en Querétaro para recarga de oxígeno medicinal.',
  },
];

function formatMXN(n) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

export default function OxygenRefillPage() {
  const waMsg = encodeURIComponent('Hola, me interesa una recarga de oxígeno. ¿Pueden orientarme?');

  return (
    <>
      <Helmet>
        <title>Recargas de Oxígeno — MediMundo Querétaro</title>
        <meta
          name="description"
          content="Recarga de tanques de oxígeno medicinal en Querétaro. Todos los tamaños disponibles. Servicio rápido en tienda, oxígeno certificado."
        />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-200">Servicio en tienda</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl">Recargas de Oxígeno</h1>
          <p className="mt-3 max-w-2xl text-primary-100 sm:text-lg">
            Oxígeno medicinal certificado para todos los tamaños de tanque.
            Servicio rápido, precios claros y atención personalizada en Querétaro.
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 inline-flex text-base px-7 py-3"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Preguntar disponibilidad
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-14">

        {/* ¿Por qué nosotros? */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl text-center">¿Por qué elegirnos?</h2>
          <p className="mt-2 text-center text-gray-500 max-w-xl mx-auto">
            Somos el aliado de confianza para el cuidado respiratorio en Querétaro.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VENTAJAS.map((v, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 mb-3">
                  <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">{v.titulo}</h3>
                <p className="mt-1 text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Price table */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl text-center">Precios de recarga</h2>
          <p className="mt-2 text-center text-gray-500">Recarga en tienda · Av. Canadá 230, Plaza de las Américas, Querétaro</p>

          <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Capacidad</th>
                  <th className="px-5 py-3 text-left font-semibold">Servicio</th>
                  <th className="px-5 py-3 text-right font-semibold">Precio</th>
                  <th className="px-5 py-3 text-right font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {RECARGAS.map((r, i) => (
                  <tr key={r.litros} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">
                      {r.litros.toLocaleString('es-MX')}{' '}
                      <span className="font-normal text-gray-500">Litros</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">Recarga en tienda</td>
                    <td className="px-5 py-3.5 text-right font-bold text-primary-600">
                      {r.precio !== null ? formatMXN(r.precio) : 'Consultar'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hola, me interesa una recarga de oxígeno de ${r.litros.toLocaleString('es-MX')} litros. ¿Está disponible?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp text-xs py-1.5 px-3"
                      >
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Pedir
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </>
  );
}
