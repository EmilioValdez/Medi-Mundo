# MediMundo — reglas del repo

Sitio en producción: https://medimundo.mx (Railway, Dockerfile; backend FastAPI + frontend Next.js; DB en Neon).

## Neon es la fuente de verdad del contenido
- **Blogs:** `backend/scripts/seed_blog.py` solo INSERTA posts nuevos desde `docs/*.md`; nunca sobrescribe uno existente.
  Hasta nov 2026 los sobrescribía en cada deploy y revertía cualquier corrección (así volvieron los precios viejos de abril).
- Para corregir texto de un blog ya publicado: agrega `(slug, texto_viejo, texto_nuevo)` en
  `backend/scripts/blog_content_fixes.py` (idempotente, corre en cada arranque) o edítalo directo en Neon.
- **Precios:** salen de Neon (`equipment`, `inogen_models`, `oxygen_refills`). No escribas precios a mano en páginas
  ni en listas de respaldo dentro del código. En blogs, usa los mismos precios del catálogo.

## Secciones críticas (no se pueden perder)
`frontend/scripts/check-critical.mjs` corre antes de cada `npm run build` y hace FALLAR el build si falta algo:
mapa + horario + reseñas en el footer de todas las páginas, la página /recargas completa, el logro 4.9 en /conocenos
y las rutas indexadas. Ya pasó una vez: la migración Vite → Next.js (commit `e9b03a4`, jun 2026) borró el mapa,
el horario y /respiratorio sin que nadie lo notara. Si quitas algo a propósito, actualiza esa lista en el mismo commit.

## Leyenda de productos
Todo producto del catálogo (renta o venta, incluidos los nuevos: oxímetros, baumanómetros, etc.) muestra la leyenda
de `frontend/src/components/ProductImageDisclaimer.tsx`: imagen ilustrativa; marca, modelo y color pueden variar
según disponibilidad en tienda; sujeto a disponibilidad. Cualquier página o tarjeta nueva que muestre productos debe
incluir `<ProductImageDisclaimer />`. El texto se cambia solo en ese archivo.

## Datos del negocio
Dirección, teléfono, horario, mapa y calificación de Google viven SOLO en `frontend/src/lib/business.ts`.
Actualiza ahí la calificación y el número de reseñas cuando cambien.
