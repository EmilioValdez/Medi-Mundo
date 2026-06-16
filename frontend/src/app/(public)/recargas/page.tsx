import type { Metadata } from "next";
import { waLink, WA_MESSAGES } from "@/lib/whatsapp";
import { getOxygenRefills } from "@/lib/api";

export const metadata: Metadata = {
  title: "Recargas de Oxígeno — MediMundo Querétaro",
  description:
    "Recarga de tanques de oxígeno medicinal en Querétaro. Todos los tamaños disponibles. Servicio rápido en tienda, oxígeno certificado.",
  alternates: { canonical: "https://medimundo.mx/recargas" },
  openGraph: {
    title: "Recargas de Oxígeno Medicinal en Querétaro | MediMundo",
    description:
      "Recarga de tanques de oxígeno medicinal en Querétaro. Todos los tamaños disponibles. Servicio rápido en tienda, oxígeno certificado.",
    url: "https://medimundo.mx/recargas",
    images: [{ url: "https://medimundo.mx/images/fondo-recargas-oxigeno.jpg" }],
  },
};

const FALLBACK_RECARGAS = [
  { litros: 10000, precio: 800 },
  { litros: 9500,  precio: 800 },
  { litros: 6000,  precio: 520 },
  { litros: 4300,  precio: 500 },
  { litros: 2459,  precio: 300 },
  { litros: 1750,  precio: 220 },
  { litros: 682,   precio: 160 },
  { litros: 425,   precio: 100 },
];

const BULLETS = [
  "Oxígeno medicinal certificado (NOM)",
  "Servicio rápido el mismo día",
  "Todos los tamaños de cilindro",
  "Precios claros, sin cobros ocultos",
];

const DURATION_ROWS = [
  { litros: "9,500 L", vals: ["150 Hrs","75 Hrs","50 Hrs","37.50 Hrs","30 Hrs","25 Hrs","21.42 Hrs","18.75 Hrs","16.66 Hrs","15 Hrs"] },
  { litros: "4,300 L", vals: ["70 Hrs","35 Hrs","23 Hrs","17 Hrs","14 Hrs","12 Hrs","10 Hrs","8.30 Hrs","7.30 Hrs","7 Hrs"] },
  { litros: "1,700 L", vals: ["29 Hrs","14 Hrs","10 Hrs","7 Hrs","5.50 Hrs","4.50 Hrs","4.10 Hrs","3.30 Hrs","3.10 Hrs","2.50 Hrs"] },
  { litros: "682 L",   vals: ["11.20 Hrs","5.40 Hrs","3.45 Hrs","2.50 Hrs","2.15 Hrs","1.50 Hrs","1.30 Hrs","1.25 Hrs","1.15 Hrs","1.10 Hrs"] },
  { litros: "425 L",   vals: ["7 Hrs","3.25 Hrs","2.15 Hrs","1.40 Hrs","1.20 Hrs","1.10 Hrs","1 Hr","50 Min","45 Min","40 Min"] },
  { litros: "248 L",   vals: ["4 Hrs","2 Hrs","1.20 Hrs","1 Hr","50 Min","40 Min","35 Min","30 Min","25 Min","20 Min"] },
];

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

function OxygenIcon() {
  return (
    <svg className="h-6 w-6 text-primary-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M5.636 5.636l1.414 1.414M16.95 16.95l1.414 1.414M3 12h2m14 0h2M5.636 18.364l1.414-1.414M16.95 7.05l1.414-1.414" />
      <circle cx="12" cy="12" r="4" strokeWidth={1.8} />
    </svg>
  );
}

export default async function RecargasPage() {
  const refills = (await getOxygenRefills()) as { litros: number; precio: number }[];
  const RECARGAS = refills.length > 0 ? refills : FALLBACK_RECARGAS;
  const waGeneral = waLink(WA_MESSAGES.recargas);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url(/images/fondo-recargas-oxigeno.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen" style={{ background: "rgba(255,255,255,0.72)" }}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-14">

            {/* Left column */}
            <div className="lg:col-span-2 mb-10 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-2">
                Servicio en tienda
              </p>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl leading-tight">
                Recarga de Tanques de Oxígeno
              </h1>
              <p className="mt-4 text-gray-700 leading-relaxed font-medium">
                Servicio de recarga de tanques de oxígeno medicinal certificado.
                Garantizamos pureza y seguridad para el cuidado de tus pacientes,
                con atención rápida en nuestra tienda de Querétaro.
              </p>

              <ul className="mt-6 space-y-3">
                {BULLETS.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-gray-800 font-medium">
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
                href={waGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-8 inline-flex w-full justify-center sm:w-auto"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Preguntar disponibilidad
              </a>
            </div>

            {/* Right column: refill list */}
            <div className="lg:col-span-3 space-y-3">
              {RECARGAS.map((r) => {
                const waMsg = waLink(`Hola, me interesa una recarga de oxígeno de *${r.litros.toLocaleString("es-MX")} litros*. ¿Está disponible?`);
                return (
                  <div
                    key={r.litros}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white/90 px-6 py-4 hover:border-primary-200 hover:bg-primary-50/60 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50">
                        <OxygenIcon />
                      </div>
                      <div className="leading-tight">
                        <p className="text-xl font-extrabold text-gray-900">{r.litros.toLocaleString("es-MX")}</p>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">litros</p>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold text-primary-600 shrink-0">
                      {formatMXN(r.precio)}
                    </span>
                    <a
                      href={waMsg}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp py-2 px-5 text-sm shrink-0"
                    >
                      Pedir
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Duration table */}
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl text-center">
              Tabla de referencia de duración
            </h2>
            <p className="mt-2 text-center text-gray-500 max-w-2xl mx-auto text-sm">
              Duración estimada de un tanque según su capacidad y los litros por minuto (LPM) indicados por el médico.
              El tiempo puede variar según el equipo y condiciones de uso.
            </p>

            <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-primary-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold sticky left-0 bg-primary-600 z-10">Capacidad</th>
                    {["1 LPM","2 LPM","3 LPM","4 LPM","5 LPM","6 LPM","7 LPM","8 LPM","9 LPM","10 LPM"].map((lpm) => (
                      <th key={lpm} className="px-4 py-3 text-center font-semibold">{lpm}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {DURATION_ROWS.map((row, i) => (
                    <tr key={row.litros} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className={`px-4 py-3 font-semibold text-gray-900 sticky left-0 z-10 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        {row.litros}
                      </td>
                      {row.vals.map((v, j) => (
                        <td key={j} className="px-4 py-3 text-center text-gray-600">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-gray-400 text-center">
              LPM = Litros Por Minuto · Valores de referencia. Consulta con tu médico la dosis indicada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
