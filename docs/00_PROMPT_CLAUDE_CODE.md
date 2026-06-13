# PROMPT MAESTRO — CLAUDE CODE
## Implementación de Blog y Contenido Web — Medimundo
**Fecha:** Abril 2026  
**Stack:** FastAPI (Python) + Jinja2 templates  
**Preparado por:** Claude (claude.ai)

---

## CONTEXTO DEL PROYECTO

Medimundo es una empresa de renta y venta de equipo médico ubicada en Querétaro con más de 20 años de operación. Está migrando su negocio a la web. Este prompt contiene todas las instrucciones para implementar el módulo de blog y contenido SEO en su plataforma FastAPI existente.

Toda la información, artículos, fotos y especificaciones están en la carpeta `content/medimundo/` de este repositorio.

---

## ESTRUCTURA DE ARCHIVOS ENTREGADOS

```
content/medimundo/
│
├── 01_brief_negocio.md          ← Perfil completo del negocio
├── 02_prd_blog_seo.md           ← PRD técnico completo
│
├── blog/
│   ├── calendario_editorial.md  ← Plan editorial 6 meses
│   └── articulos/
│       ├── 01_renta-cama-hospitalaria-queretaro.md
│       ├── 02_renta-concentrador-oxigeno-queretaro.md
│       ├── 03_ubicacion-entrega-domicilio-queretaro.md
│       └── 04_concentrador-oxigeno-renta-queretaro.md
│
├── fotos/
│   ├── registro_fotos.md        ← Nombres SEO y alt text de cada imagen
│   ├── README_fotos.md          ← Guía de fotografía pendiente
│   └── equipo/                  ← 20 imágenes listas para web
│
└── seo/
    └── palabras_clave.md        ← Keywords priorizadas
```

---

## TAREA 1 — MODELO DE BASE DE DATOS

Crear el modelo `BlogPost` en `app/models/blog.py`:

```python
from sqlalchemy import Column, Integer, String, Text, Boolean, Date
from app.database import Base

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    resumen = Column(String(300))           # Para meta description
    contenido = Column(Text, nullable=False) # Markdown o HTML
    categoria = Column(String(100))
    tags = Column(String(500))              # Separados por coma
    imagen_principal = Column(String(300))  # Path o URL
    alt_imagen = Column(String(200))        # Texto alternativo SEO
    fecha_publicacion = Column(Date)
    actualizado = Column(Date)
    activo = Column(Boolean, default=True)
    meta_title = Column(String(70))         # Max 60 chars ideal
    meta_description = Column(String(170))  # Max 160 chars ideal
```

---

## TAREA 2 — RUTAS DEL BLOG (FastAPI)

Crear `app/routers/blog.py` con las siguientes rutas:

```
GET  /blog                    → Listado paginado (9 artículos por página)
GET  /blog/{slug}             → Detalle de artículo
GET  /blog/categoria/{slug}   → Filtro por categoría
GET  /sitemap.xml             → Sitemap XML dinámico
```

---

## TAREA 3 — SEO EN CADA PÁGINA

Cada página de artículo debe incluir en el `<head>` exactamente esto:

```html
<title>{{ post.meta_title }} | Medimundo Querétaro</title>
<meta name="description" content="{{ post.meta_description }}">
<link rel="canonical" href="https://medimundo.mx/blog/{{ post.slug }}">

<meta property="og:title" content="{{ post.meta_title }}">
<meta property="og:description" content="{{ post.meta_description }}">
<meta property="og:image" content="{{ post.imagen_principal }}">
<meta property="og:url" content="https://medimundo.mx/blog/{{ post.slug }}">
<meta property="og:type" content="article">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ post.titulo }}",
  "datePublished": "{{ post.fecha_publicacion }}",
  "dateModified": "{{ post.actualizado }}",
  "image": "{{ post.imagen_principal }}",
  "author": { "@type": "Organization", "name": "Medimundo" },
  "publisher": {
    "@type": "Organization",
    "name": "Medimundo",
    "url": "https://medimundo.mx"
  }
}
</script>
```

---

## TAREA 4 — SCHEMA LOCAL BUSINESS (página principal)

Agregar en el `<head>` de `index.html`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Medimundo",
  "description": "Renta y venta de equipo médico y de rehabilitación en Querétaro",
  "slogan": "Rehabilitación en Movimiento",
  "url": "https://medimundo.mx",
  "telephone": "+52-442-223-77-57",
  "email": "medicasaqro@gmail.com",
  "foundingDate": "2005",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Canadá 212, Plaza de las Américas, Col. Carretas",
    "addressLocality": "Querétaro",
    "addressRegion": "Querétaro",
    "addressCountry": "MX"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "10:00",
      "closes": "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "15:00"
    }
  ]
}
</script>
```

---

## TAREA 5 — IMÁGENES

Las imágenes están en `content/medimundo/fotos/equipo/`. Para cada imagen:

1. Convertir a **WebP** manteniendo copia JPG como fallback
2. Comprimir a menos de **150 KB**
3. Copiar a `static/img/equipo/`
4. Usar el nombre de archivo tal cual — ya están optimizados para SEO
5. Usar el alt text del archivo `fotos/registro_fotos.md`
6. Agregar `loading="lazy"` a todas las imágenes que no sean above-the-fold

**Comando de conversión sugerido:**
```bash
for f in content/medimundo/fotos/equipo/*.jpg; do
    cwebp -q 80 "$f" -o "static/img/equipo/$(basename ${f%.jpg}).webp"
done
```

---

## TAREA 6 — CARGAR ARTÍCULOS A LA BASE DE DATOS

Los 4 artículos están en `content/medimundo/blog/articulos/`. Cada archivo `.md` contiene en el encabezado:
- `Meta title` → campo `meta_title`
- `Meta description` → campo `meta_description`
- `Slug` → campo `slug`
- `Categoría` → campo `categoria`
- `Keywords` → campo `tags`

Crear un script `scripts/seed_blog.py` que lea los archivos `.md`, extraiga el frontmatter y los inserte en la base de datos. El contenido del artículo (después del frontmatter) va al campo `contenido`.

---

## TAREA 7 — SITEMAP XML

Generar `/sitemap.xml` dinámico que incluya:
- `/` — página principal
- `/blog` — listado del blog
- `/blog/{slug}` — cada artículo activo
- `/catalogo` — catálogo de productos (si existe)
- `/contacto` — página de contacto (si existe)

Prioridades sugeridas: home=1.0, blog=0.8, artículos=0.7

---

## TAREA 8 — CONFIGURAR GOOGLE SEARCH CONSOLE

Una vez desplegado el sitio:
1. Ir a https://search.google.com/search-console
2. Agregar propiedad con la URL del sitio
3. Verificar con el método de archivo HTML o meta tag
4. Enviar el sitemap: `https://medimundo.mx/sitemap.xml`
5. Verificar también en Google Business Profile que el sitio web esté vinculado

---

## DATOS DEL NEGOCIO (referencia rápida)

| Campo | Valor |
|---|---|
| Nombre | Medimundo |
| Slogan | Rehabilitación en Movimiento |
| Teléfono | 442 615 66 49 |
| Email | medicasaqro@gmail.com |
| Dirección | Av. Canadá 212, Plaza de las Américas, Col. Carretas, Querétaro |
| Horario L-V | 10:00 am – 7:00 pm |
| Horario Sáb | 10:00 am – 3:00 pm |
| Desde | 2005 |

---

## CRITERIOS DE ACEPTACIÓN

- [ ] Rutas `/blog` y `/blog/{slug}` funcionales
- [ ] Meta tags completos en cada artículo
- [ ] Schema LocalBusiness en página principal
- [ ] Schema Article en cada post
- [ ] Sitemap XML incluye todas las URLs del blog
- [ ] Imágenes convertidas a WebP con lazy loading
- [ ] Los 4 artículos visibles y navegables
- [ ] Tiempo de carga < 3 segundos en móvil (verificar con PageSpeed)
- [ ] Google Search Console configurado y verificado
- [ ] Sin errores 404 en ninguna ruta del blog

---

*Este prompt fue generado como parte del proyecto de migración web de Medimundo — Abril 2026*
*Preparado con Claude (claude.ai) a partir de información real del negocio*
