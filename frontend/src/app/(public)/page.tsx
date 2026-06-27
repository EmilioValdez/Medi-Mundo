import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getEquipment, getBlogPosts, getInogenModels } from "@/lib/api";
import ParallaxHero from "@/components/ParallaxHero";
import InogenSection from "@/components/InogenSection";
import EquipmentCard from "@/components/EquipmentCard";
import { waLink, WA_MESSAGES } from "@/lib/whatsapp";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Renta de Equipo Médico en Querétaro | MediMundo",
  description:
    "Renta de equipo médico sanitizado a domicilio en Querétaro. Camas hospitalarias, concentradores de oxígeno, sillas de ruedas y más. Entrega el mismo día.",
  alternates: { canonical: "https://medimundo.mx/" },
  openGraph: {
    title: "Renta de Equipo Médico en Querétaro | MediMundo",
    description:
      "Renta de equipo médico sanitizado a domicilio en Querétaro. Camas hospitalarias, concentradores de oxígeno, sillas de ruedas y más. Entrega el mismo día.",
    url: "https://medimundo.mx/",
    images: [{ url: "https://medimundo.mx/images/portada-hero-medimundo.webp" }],
  },
};

const CATEGORY_ORDER = [
  "camas-hospitalarias",
  "sillas-de-ruedas",
  "andaderas-bastones",
  "bano-seguridad",
  "equipos-apoyo",
  "concentradores-de-oxigeno",
];

const FEATURED_KEYWORDS = ["lujo", "eléctrica", "electrica", "ducha"];

export default async function HomePage() {
  const [categories, equipment, posts, inogenModels] = await Promise.all([
    getCategories(),
    getEquipment(),
    getBlogPosts(),
    getInogenModels(),
  ]);

  const activeInogenIds = (inogenModels as { model_id: string }[]).map((m) => m.model_id);

  const sorted = CATEGORY_ORDER.map((slug) =>
    (categories as { id: number; name: string; slug: string }[]).find((c) => c.slug === slug)
  ).filter(Boolean) as { id: number; name: string; slug: string }[];

  const allEquipment = equipment as { id: number; name: string; images?: string[]; price_monthly?: number; category_name?: string }[];

  const featured = FEATURED_KEYWORDS.reduce(
    (acc: typeof allEquipment, keyword: string) => {
      if (acc.length >= 3) return acc;
      const match = allEquipment.find(
        (e) => e.name.toLowerCase().includes(keyword) && !acc.some((x) => x.id === e.id)
      );
      if (match) acc.push(match);
      return acc;
    },
    []
  );

  const topPosts = (Array.isArray(posts) ? posts : []).slice(0, 3) as {
    slug: string;
    categoria?: string;
    titulo: string;
    resumen?: string;
  }[];

  return (
    <>
      <ParallaxHero />

      {/* Categories */}
      {sorted.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">Categorías de equipo</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-gray-500">
            Encuentra el equipo médico que necesitas para tu recuperación o cuidado en casa.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {sorted.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogo?categoria=${cat.id}`}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
              >
                <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Inogen carousel */}
      <InogenSection activeIds={activeInogenIds} />

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
            <Link href="/catalogo" className="btn-primary text-base px-8 py-3">
              Ver todo el catálogo
            </Link>
          </div>
        </section>
      )}

      {/* Blog preview */}
      {topPosts.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">Recursos útiles</p>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Guías para tu recuperación</h2>
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-1 shrink-0 text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors"
            >
              Ver todos los artículos
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {topPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-1 bg-gradient-to-r from-sky-500 to-sky-400" />
                <div className="flex flex-1 flex-col p-5">
                  {post.categoria && (
                    <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sky-600">
                      {post.categoria}
                    </span>
                  )}
                  <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-sky-600 transition-colors">
                    {post.titulo}
                  </h3>
                  {post.resumen && (
                    <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500">{post.resumen}</p>
                  )}
                  <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-sky-600">
                    Leer más
                    <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trust signals */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">¿Por qué elegirnos?</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {TRUST_SIGNALS.map((t, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-600/20">
                  <t.Icon />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sky-600">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            ¿Necesitas equipo médico en renta?
          </h2>
          <p className="mt-3 text-sky-100">
            Contáctanos ahora y recibe tu equipo sanitizado a domicilio en Querétaro.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Ver catálogo
            </Link>
            <a
              href={waLink(WA_MESSAGES.rentas)}
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


function IconShield() {
  return (
    <svg className="h-7 w-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="h-7 w-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg className="h-7 w-7 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  );
}


const TRUST_SIGNALS = [
  { Icon: IconShield, title: "Equipo sanitizado", desc: "Protocolo de limpieza y desinfección certificado." },
  { Icon: IconClock, title: "Entrega rápida", desc: "Entrega el mismo día o al día siguiente en zona metropolitana." },
  { Icon: IconWrench, title: "Soporte técnico", desc: "Asistencia continua durante toda tu renta." },
];
