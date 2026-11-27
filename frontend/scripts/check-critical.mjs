#!/usr/bin/env node
/**
 * Guardia de secciones críticas — corre automáticamente antes de `npm run build`
 * (script "prebuild"), incluido el build de Docker en Railway.
 *
 * Por qué existe: en la migración Vite → Next.js (commit e9b03a4, 11 jun 2026)
 * se perdieron sin que nadie lo notara el mapa + horario que salía en todas las
 * páginas, /respiratorio y otras piezas. Si un rediseño o migración vuelve a
 * quitar algo de esta lista, el build FALLA con un mensaje claro en vez de
 * publicarse roto.
 *
 * Si quitas algo A PROPÓSITO, actualiza esta lista en el mismo commit.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : null);

const CHECKS = [
  // Mapa + horario + reseñas en TODAS las páginas públicas
  { file: "src/app/(public)/layout.tsx", must: ["<Footer", "<ScrollToTop"], why: "el layout público debe renderizar el Footer y ScrollToTop (cada página nueva abre hasta arriba)" },
  { file: "src/app/layout.tsx", must: ['data-scroll-behavior="smooth"', 'template: "%s | MediMundo"'], why: "scroll al inicio + plantilla de título con la marca una sola vez" },

  // Títulos de Google: la marca UNA sola vez (antes salía 3 veces). Todas usan pageTitle() de lib/seo.ts.
  ...["page.tsx", "rentas/page.tsx", "catalogo/page.tsx", "inogen/page.tsx", "recargas/page.tsx", "conocenos/page.tsx", "blog/page.tsx", "blog/[slug]/page.tsx", "equipo/[id]/page.tsx"].map(
    (p) => ({ file: `src/app/(public)/${p}`, must: ["pageTitle("], mustNot: ["| MediMundo Querétaro`"], why: "el título debe armarse con pageTitle() para no repetir la marca" })
  ),
  { file: "src/components/Footer.tsx", must: ["<LocationSection"], why: "el Footer debe incluir mapa + horario (LocationSection)" },
  {
    file: "src/components/LocationSection.tsx",
    must: ["MAPS_EMBED_SRC", "<StoreHours", "<GoogleRatingBadge", "MAPS_DIRECTIONS_URL"],
    why: "LocationSection debe tener mapa, horario, reseñas y botón Cómo llegar",
  },
  {
    file: "src/lib/business.ts",
    must: ["SCHEDULE", "GOOGLE_REVIEWS", "MAPS_EMBED_SRC", "Av. Canadá 230", "76059"],
    why: "fuente única de datos del negocio; la dirección debe coincidir con el Perfil de Negocio de Google",
  },
  // La dirección NO se escribe a mano en otros archivos (en nov 2026 el schema y 20 blogs decían "212").
  ...["src/app/layout.tsx", "src/app/(public)/blog/[slug]/page.tsx", "src/components/Footer.tsx", "src/app/(public)/conocenos/conocenos-content.tsx"].map(
    (file) => ({ file, must: ["BUSINESS"], mustNot: ["Canadá 212", "Canadá 230"], why: "usar BUSINESS de lib/business.ts, no escribir la dirección a mano" })
  ),
  { file: "src/app/(public)/recargas/page.tsx", must: ["únicamente en nuestra tienda"], why: "las recargas son solo en tienda (no a domicilio)" },

  // Página de recargas (pilar #2)
  {
    file: "src/app/(public)/recargas/page.tsx",
    must: ["getOxygenRefills", "<StoreHours", "FAQPage", "MAPS_DIRECTIONS_URL", "fondo-recargas-oxigeno"],
    mustNot: ["FALLBACK_RECARGAS"],
    why: "recargas debe tener precios de Neon, horario, FAQ y ruta; sin precios inventados de respaldo",
  },
  {
    file: "src/app/(public)/conocenos/conocenos-content.tsx",
    must: ["<GoogleRatingAchievement", "Reseña en Google Maps"],
    mustNot: ["María González", "Roberto Martínez", "Ana Luisa Ramírez"],
    why: "Conócenos debe mostrar el logro de reseñas y SOLO testimonios reales de Google (los 3 inventados no pueden volver)",
  },

  // Leyenda "imagen ilustrativa / sujeto a disponibilidad" en TODOS los productos
  { file: "src/components/ProductImageDisclaimer.tsx", must: ["sujetos a disponibilidad"], why: "texto de la leyenda de productos" },
  { file: "src/app/(public)/equipo/[id]/equipment-detail.tsx", must: ["<ProductImageDisclaimer"], why: "cada ficha de producto debe llevar la leyenda de imagen ilustrativa" },
  { file: "src/app/(public)/catalogo/catalog-content.tsx", must: ["<ProductImageDisclaimer"], why: "el catálogo debe llevar la leyenda de imagen ilustrativa" },
  { file: "src/app/(public)/rentas/page.tsx", must: ["<ProductImageDisclaimer"], why: "rentas debe llevar la leyenda de imagen ilustrativa" },

  // Rutas que Google ya tiene indexadas: no pueden desaparecer
  ...["page.tsx", "rentas/page.tsx", "catalogo/page.tsx", "inogen/page.tsx", "recargas/page.tsx", "conocenos/page.tsx", "blog/page.tsx"].map(
    (p) => ({ file: `src/app/(public)/${p}`, must: [], why: "ruta indexada en Google" })
  ),
];

// Backend: el seed de blogs NO debe sobrescribir posts existentes en Neon.
// (Solo se verifica si el backend está disponible; el build de Docker del
// frontend no lo copia.)
const seedBlog = join(root, "..", "backend", "scripts", "seed_blog.py");
if (existsSync(seedBlog)) {
  const src = readFileSync(seedBlog, "utf8");
  if (/setattr\(existing/.test(src)) {
    CHECKS.push({ file: "../backend/scripts/seed_blog.py", forceFail: true, why: "seed_blog.py vuelve a sobrescribir blogs existentes en Neon (setattr(existing...)); usa blog_content_fixes.py" });
  }
}

const errors = [];
for (const c of CHECKS) {
  if (c.forceFail) { errors.push(`✗ ${c.file}: ${c.why}`); continue; }
  const src = read(c.file);
  if (src === null) { errors.push(`✗ FALTA ${c.file} — ${c.why}`); continue; }
  for (const m of c.must ?? []) if (!src.includes(m)) errors.push(`✗ ${c.file} no contiene "${m}" — ${c.why}`);
  for (const m of c.mustNot ?? []) if (src.includes(m)) errors.push(`✗ ${c.file} contiene "${m}" — ${c.why}`);
}

if (errors.length) {
  console.error("\n🚫 check-critical: se quitó algo importante del sitio\n");
  for (const e of errors) console.error("  " + e);
  console.error("\nSi fue intencional, actualiza frontend/scripts/check-critical.mjs en el mismo commit.\n");
  process.exit(1);
}
console.log(`✓ check-critical: ${CHECKS.length} verificaciones OK`);
