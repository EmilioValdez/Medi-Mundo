import type { Metadata } from "next";
import Link from "next/link";
import { waLink, WA_MESSAGES } from "@/lib/whatsapp";
import { getOxygenRefills } from "@/lib/api";
import {
  BUSINESS,
  MAPS_DIRECTIONS_URL,
  SCHEDULE,
  formatHours,
} from "@/lib/business";
import StoreHours from "@/components/StoreHours";
import { GoogleRatingBadge } from "@/components/GoogleRating";
import { pageTitle } from "@/lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Recarga de Tanques de Oxígeno en Querétaro"),
  description:
    "Recarga de tanques de oxígeno medicinal en Querétaro, lista el mismo día. Precios por tamaño de cilindro, tabla de duración y horario. Plaza de las Américas.",
  alternates: { canonical: "https://medimundo.mx/recargas" },
  openGraph: {
    title: "Recarga de Oxígeno Medicinal en Querétaro | MediMundo",
    description:
      "Recarga de tanques de oxígeno medicinal en Querétaro, lista el mismo día. Precios por tamaño de cilindro y tabla de duración.",
    url: "https://medimundo.mx/recargas",
    images: [{ url: "https://medimundo.mx/images/fondo-recargas-oxigeno.jpg" }],
  },
};

type Refill = { litros: number; precio: number };

/** Columnas de la tabla de duración (litros por minuto). */
const LPM_COLUMNS = [1, 2, 3, 4, 5, 6, 8, 10];

/**
 * Duración teórica a tanque lleno: litros ÷ (LPM × 60).
 * Se calcula a partir de los MISMOS tamaños de la lista de precios (Neon),
 * así la tabla y los precios nunca se contradicen.
 */
function duration(litros: number, lpm: number): string {
  const totalMin = Math.floor(litros / lpm);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${String(m).padStart(2, "0")} min`;
}

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
}

function formatL(n: number) {
  return n.toLocaleString("es-MX");
}

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function buildFaqs(refills: Refill[]) {
  const sorted = [...refills].sort((a, b) => a.precio - b.precio);
  const cheapest = sorted[0];
  const priciest = sorted[sorted.length - 1];
  const sizes = [...refills].sort((a, b) => a.litros - b.litros).map((r) => `${formatL(r.litros)} L`);
  const example = refills.find((r) => r.litros === 682) ?? refills[refills.length - 1];
  const hours = SCHEDULE.map((s) => `${s.label}: ${formatHours(s)}`).join(" · ");

  const faqs: { q: string; a: string }[] = [];
  if (cheapest && priciest) {
    faqs.push({
      q: "¿Cuánto cuesta recargar un tanque de oxígeno en Querétaro?",
      a: `Depende del tamaño del cilindro. En MediMundo la recarga va desde ${formatMXN(cheapest.precio)} (${formatL(cheapest.litros)} litros) hasta ${formatMXN(priciest.precio)} (${formatL(priciest.litros)} litros). Los precios de todos los tamaños están en esta página, sin cobros ocultos.`,
    });
  }
  faqs.push({
    q: "¿Cuánto tarda la recarga?",
    a: "Tu tanque queda listo el mismo día. Escríbenos por WhatsApp antes de venir para confirmarte el tiempo según el tamaño de tu cilindro.",
  });
  if (example) {
    faqs.push({
      q: "¿Cuánto me dura un tanque de oxígeno?",
      a: `Divide los litros del tanque entre los litros por minuto (LPM) que te indicó tu médico, y el resultado entre 60 para obtener horas. Por ejemplo, un tanque de ${formatL(example.litros)} L a 2 LPM dura aproximadamente ${duration(example.litros, 2)}. En la práctica conviene calcular un poco menos, porque el tanque no se vacía al 100%.`,
    });
  }
  faqs.push({
    q: "¿Cuál es su horario para recargas?",
    a: `${hours}. No abrimos 24 horas, así que te recomendamos recargar antes de que tu tanque baje de la mitad.`,
  });
  faqs.push({
    q: "¿Dónde están ubicados?",
    a: `En ${BUSINESS.addressLine1}, ${BUSINESS.addressLine2}. Puedes abrir la ruta en Google Maps desde esta página.`,
  });
  faqs.push({
    q: "¿Recargan a domicilio?",
    a: "No. Las recargas de oxígeno se hacen únicamente en nuestra tienda de Plaza de las Américas: trae tu tanque en nuestro horario y te lo llevas recargado el mismo día. Lo que sí entregamos a domicilio es el equipo en renta (concentradores, camas, sillas de ruedas, etc.): $500 en zona céntrica y, fuera de ella, según la zona.",
  });
  if (sizes.length) {
    faqs.push({
      q: "¿Qué tamaños de tanque recargan?",
      a: `Recargamos cilindros de ${sizes.join(", ")}. Si no sabes el tamaño del tuyo, revisa la etiqueta del cilindro o mándanos una foto por WhatsApp.`,
    });
  }
  faqs.push({
    q: "¿Me conviene más rentar un concentrador?",
    a: "Si recargas varias veces por semana o usas oxígeno de forma continua, un concentrador puede salirte más barato y no depende de recargas. Rentamos concentradores estacionarios y portátiles Inogen.",
  });
  return faqs;
}

export default async function RecargasPage() {
  // Precios SIEMPRE desde Neon (/api/oxygen-refills). Si la API falla no se
  // inventan precios: se muestra un aviso para cotizar por WhatsApp.
  const refills = ((await getOxygenRefills()) as Refill[]) ?? [];
  const hasPrices = refills.length > 0;
  const bySize = [...refills].sort((a, b) => b.litros - a.litros);
  const faqs = buildFaqs(refills);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Recarga de tanques de oxígeno medicinal",
      name: "Recarga de Tanques de Oxígeno — MediMundo Querétaro",
      description:
        "Recarga de tanques de oxígeno medicinal en Querétaro, lista el mismo día. Todos los tamaños de cilindro.",
      provider: { "@type": "MedicalBusiness", name: "MediMundo", url: "https://medimundo.mx" },
      areaServed: [
        { "@type": "City", name: "Querétaro" },
        { "@type": "City", name: "Corregidora" },
        { "@type": "City", name: "El Marqués" },
      ],
      url: "https://medimundo.mx/recargas",
      ...(hasPrices && {
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Recargas de oxígeno por tamaño de cilindro",
          itemListElement: bySize.map((r) => ({
            "@type": "Offer",
            priceCurrency: "MXN",
            price: r.precio,
            availability: "https://schema.org/InStock",
            itemOffered: { "@type": "Service", name: `Recarga de ${formatL(r.litros)} litros de oxígeno` },
          })),
        },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero + precios — fondo: foto de tanques de oxígeno con velo para legibilidad */}
      <section
        className="relative bg-cover bg-center"
        style={{ backgroundImage: "url(/images/fondo-recargas-oxigeno.webp)", backgroundPosition: "center 62%" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.93) 0%, rgba(255,255,255,0.78) 40%, rgba(255,255,255,0.25) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="lg:grid lg:grid-cols-5 lg:gap-14">
            <div className="mb-10 lg:col-span-2 lg:mb-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-500">
                Oxígeno medicinal certificado
              </p>
              <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                Recarga de tanques de oxígeno en Querétaro
              </h1>
              <p className="mt-4 leading-relaxed text-gray-700">
                Trae tu cilindro a nuestra tienda en Plaza de las Américas y llévatelo recargado el mismo día.
                Precios claros por tamaño, sin cobros ocultos.
              </p>

              <div className="mt-6">
                <GoogleRatingBadge />
              </div>

              <a
                href={waLink(WA_MESSAGES.recargas)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-6 inline-flex w-full justify-center sm:w-auto"
              >
                <WhatsAppIcon />
                Preguntar disponibilidad
              </a>

              <div className="mt-8">
                <h2 className="mb-2 text-sm font-semibold text-gray-900">Horario de recargas</h2>
                <StoreHours />
                <p className="mt-3 text-sm text-gray-600">
                  {BUSINESS.addressLine1}, {BUSINESS.addressLine2}{" "}
                  <a href={MAPS_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 hover:underline">
                    Cómo llegar →
                  </a>
                </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Precios de recarga por tamaño de tanque</h2>
              {hasPrices ? (
                <div className="space-y-3">
                  {bySize.map((r) => (
                    <div
                      key={r.litros}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white py-4 pl-6 pr-20 shadow-sm transition-colors hover:border-primary-200 lg:pr-6"
                    >
                      <div className="leading-tight">
                        <p className="text-xl font-extrabold text-gray-900">{formatL(r.litros)}</p>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">litros</p>
                      </div>
                      <span className="shrink-0 text-2xl font-extrabold text-primary-600">{formatMXN(r.precio)}</span>
                      <a
                        href={waLink(`Hola, me interesa una recarga de oxígeno de *${formatL(r.litros)} litros*. ¿Está disponible?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp shrink-0 px-5 py-2 text-sm"
                      >
                        Pedir
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-gray-800">
                  No pudimos cargar la lista de precios en este momento. Escríbenos por WhatsApp con el tamaño
                  de tu tanque y te damos el precio al instante.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabla de duración — mismos tamaños que la lista de precios */}
      {hasPrices && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">¿Cuánto dura cada tanque?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-500">
            Duración aproximada con el tanque lleno, según los litros por minuto (LPM) que indicó tu médico.
            En la práctica calcula un poco menos, porque el cilindro no se vacía al 100%.
          </p>
          <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full whitespace-nowrap text-sm">
              <thead>
                <tr className="bg-primary-600 text-white">
                  <th scope="col" className="sticky left-0 z-10 bg-primary-600 px-4 py-3 text-left font-semibold">Tanque</th>
                  {LPM_COLUMNS.map((lpm) => (
                    <th key={lpm} scope="col" className="px-4 py-3 text-center font-semibold">{lpm} LPM</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bySize.map((r, i) => {
                  const bg = i % 2 === 0 ? "bg-white" : "bg-gray-50";
                  return (
                    <tr key={r.litros} className={bg}>
                      <th scope="row" className={`sticky left-0 z-10 px-4 py-3 text-left font-semibold text-gray-900 ${bg}`}>
                        {formatL(r.litros)} L
                      </th>
                      {LPM_COLUMNS.map((lpm) => (
                        <td key={lpm} className="px-4 py-3 text-center text-gray-600">{duration(r.litros, lpm)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-xs text-gray-400">
            Valores de referencia. Consulta siempre con tu médico el flujo indicado.{" "}
            <Link href="/blog/cuanto-dura-tanque-oxigeno-queretaro" className="text-primary-600 hover:underline">
              Guía completa de duración
            </Link>
          </p>
        </section>
      )}

      {/* Cómo funciona */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">¿Cómo funciona?</h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { t: "Escríbenos o ven a la tienda", d: "Dinos el tamaño de tu tanque por WhatsApp o tráelo directo en nuestro horario." },
              { t: "Lo recargamos", d: "Con oxígeno medicinal certificado, en nuestra tienda de Plaza de las Américas." },
              { t: "Te lo llevas el mismo día", d: "Listo para seguir con la terapia de tu paciente sin interrupciones." },
            ].map((s, i) => (
              <li key={s.t} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 font-semibold text-gray-900">{s.t}</h3>
                <p className="mt-1 text-sm text-gray-600">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Alternativa: concentrador */}
      <section className="mx-auto max-w-5xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-sky-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900">¿Recargas varias veces por semana?</h2>
            <p className="mt-1 text-sm text-gray-600">
              Un concentrador de oxígeno no necesita recargas y puede salirte más barato a mediano plazo.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href="/equipo/6" className="btn-primary">Concentrador estacionario</Link>
            <Link href="/inogen" className="inline-flex items-center rounded-lg border border-primary-600 px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-white">
              Portátiles Inogen
            </Link>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Preguntas frecuentes</h2>
        <div className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                {f.q}
                <span className="text-primary-600 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
