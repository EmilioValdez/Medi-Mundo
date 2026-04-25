# PRD — BLOG Y SEO MEDIMUNDO
**Product Requirements Document**  
**Versión:** 1.0  
**Fecha:** Abril 2026  
**Implementado por:** Claude Code / Equipo de desarrollo  
**Stack:** FastAPI (Python) + Frontend web

---

## 1. OBJETIVO

Implementar un módulo de blog en la plataforma web de Medimundo que:
1. Posicione el sitio orgánicamente en Google (SEO local — Querétaro)
2. Genere confianza y autoridad en el tema de rehabilitación y cuidado en casa
3. Resuelva las dudas frecuentes de los clientes antes de que llamen
4. Atraiga tráfico calificado que convierta en rentas o ventas

---

## 2. ALCANCE

### Incluye
- Módulo de blog con listado y detalle de artículos
- Sistema de categorías y etiquetas
- SEO on-page completo (meta tags, Open Graph, schema markup)
- Sitemap XML dinámico
- Breadcrumbs
- Artículos de arranque (ver Sección 6)
- Sección de fotografía por artículo y página

### No incluye (por ahora)
- Sistema de comentarios
- Newsletter
- Panel de administración de blog (se gestiona vía archivos o base de datos existente)

---

## 3. REQUERIMIENTOS TÉCNICOS

### 3.1 Backend (FastAPI)

```
/blog                        → Listado de artículos (paginado, 9 por página)
/blog/{slug}                 → Detalle de artículo
/blog/categoria/{slug}       → Filtro por categoría
/sitemap.xml                 → Sitemap dinámico
/api/blog/posts              → Endpoint JSON para consumo interno
```

**Modelo de artículo:**
```python
class BlogPost:
    id: int
    titulo: str
    slug: str                # URL amigable: "renta-cama-hospitalaria-queretaro"
    resumen: str             # 150-160 caracteres (para meta description)
    contenido: str           # HTML o Markdown
    categoria: str
    tags: list[str]
    imagen_principal: str    # URL o path de imagen
    alt_imagen: str          # Texto alternativo (SEO)
    fecha_publicacion: date
    actualizado: date
    activo: bool
    meta_title: str          # Título SEO (50-60 chars)
    meta_description: str    # Descripción SEO (150-160 chars)
    schema_type: str         # Article, FAQPage, HowTo
```

### 3.2 SEO On-Page (por artículo)

Cada página de artículo debe incluir en el `<head>`:

```html
<!-- Básico -->
<title>{{ meta_title }} | Medimundo Querétaro</title>
<meta name="description" content="{{ meta_description }}">
<link rel="canonical" href="https://medimundo.mx/blog/{{ slug }}">

<!-- Open Graph (WhatsApp, Facebook) -->
<meta property="og:title" content="{{ meta_title }}">
<meta property="og:description" content="{{ meta_description }}">
<meta property="og:image" content="{{ imagen_principal }}">
<meta property="og:url" content="https://medimundo.mx/blog/{{ slug }}">
<meta property="og:type" content="article">

<!-- Schema.org -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ titulo }}",
  "datePublished": "{{ fecha_publicacion }}",
  "author": { "@type": "Organization", "name": "Medimundo" },
  "publisher": {
    "@type": "Organization",
    "name": "Medimundo",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Canadá 212, Plaza de las Américas",
      "addressLocality": "Querétaro",
      "addressCountry": "MX"
    }
  }
}
</script>
```

### 3.3 Schema Local Business (página principal)

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Medimundo",
  "description": "Renta y venta de equipo médico y de rehabilitación en Querétaro",
  "slogan": "Rehabilitación en Movimiento",
  "url": "https://medimundo.mx",
  "telephone": "+52-442-223-77-57",
  "email": "medicasaqro@gmail.com",
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
  ],
  "foundingDate": "2005"
}
```

---

## 4. CATEGORÍAS DEL BLOG

| Categoría | Slug | Enfoque |
|---|---|---|
| Cuidado en Casa | `cuidado-en-casa` | Consejos para familias cuidadoras |
| Rehabilitación | `rehabilitacion` | Recuperación postoperatoria y fisioterapia |
| Equipo Médico | `equipo-medico` | Guías de uso y selección de equipo |
| Adulto Mayor | `adulto-mayor` | Movilidad, seguridad y bienestar |
| Preguntas Frecuentes | `faq` | Respuestas a dudas comunes de clientes |

---

## 5. ESTRUCTURA DE CARPETAS DEL PROYECTO

```
medimundo/
│
├── content/                        ← CONTENIDO (este repositorio)
│   ├── 01_brief_negocio.md
│   ├── 02_prd_blog_seo.md
│   ├── blog/
│   │   ├── articulos/              ← Archivos .md de cada artículo
│   │   └── calendario_editorial.md
│   ├── fotos/
│   │   ├── equipo/                 ← Fotos del equipo médico
│   │   ├── local/                  ← Fotos del negocio
│   │   ├── equipo_en_uso/          ← Fotos contextuales (pacientes/familia)
│   │   └── README_fotos.md         ← Guía de fotografía
│   └── seo/
│       ├── palabras_clave.md
│       └── meta_tags_paginas.md
│
├── app/                            ← FastAPI backend
│   ├── routers/
│   │   └── blog.py
│   ├── models/
│   │   └── blog.py
│   └── templates/
│       └── blog/
│           ├── lista.html
│           └── detalle.html
│
└── static/
    └── img/
        └── blog/                   ← Imágenes optimizadas para web
```

---

## 6. PLAN EDITORIAL — ARTÍCULOS DE ARRANQUE

### Bloque 1: SEO Local (prioridad alta)
| # | Título | Keyword principal | Categoría |
|---|---|---|---|
| 1 | Renta de cama hospitalaria en Querétaro: todo lo que debes saber | renta cama hospitalaria Querétaro | Equipo Médico |
| 2 | Concentrador de oxígeno en renta: ¿cuándo lo necesitas y cómo elegirlo? | concentrador oxígeno renta Querétaro | Equipo Médico |
| 3 | Silla de ruedas en Querétaro: renta vs compra, ¿qué conviene más? | silla de ruedas Querétaro | Equipo Médico |

### Bloque 2: Cuidado en Casa (tráfico informacional)
| # | Título | Keyword principal | Categoría |
|---|---|---|---|
| 4 | Cómo preparar tu hogar para recibir a un adulto mayor | adulto mayor en casa | Adulto Mayor |
| 5 | Recuperación en casa después de una cirugía: equipo esencial | recuperación postoperatoria casa | Rehabilitación |
| 6 | Calcetas de compresión: para qué sirven y quién las necesita | calcetas de compresión | Equipo Médico |

### Bloque 3: Confianza y Conversión
| # | Título | Keyword principal | Categoría |
|---|---|---|---|
| 7 | ¿Cuánto cuesta rentar equipo médico en Querétaro? | precio renta equipo médico | FAQ |
| 8 | Preguntas frecuentes sobre la renta de equipo médico | renta equipo médico preguntas | FAQ |
| 9 | 5 ventajas de rentar equipo médico en lugar de comprarlo | ventajas renta equipo médico | FAQ |

---

## 7. REQUERIMIENTOS DE IMAGEN

### Por artículo de blog:
- **Imagen principal:** 1200 x 630 px (ratio 1.91:1) — formato WebP + JPG fallback
- **Imágenes dentro del artículo:** máx. 800px ancho, comprimidas < 150 KB
- **Alt text:** descriptivo e incluir keyword cuando aplique

### Optimización técnica:
- Convertir todas las imágenes a **WebP** con fallback JPG
- Nombres de archivo en kebab-case con keyword: `cama-hospitalaria-electrica-queretaro.webp`
- Lazy loading habilitado: `loading="lazy"`

---

## 8. MÉTRICAS DE ÉXITO

| Métrica | Meta a 6 meses |
|---|---|
| Posición promedio en Google Search Console | Top 10 para keywords locales |
| Tráfico orgánico mensual | 500+ visitas/mes |
| Artículos publicados | 12 artículos |
| Tiempo promedio en página | > 2 minutos |
| Conversión blog → contacto | > 3% |

---

## 9. HERRAMIENTAS RECOMENDADAS

- **Google Search Console** — monitoreo de posicionamiento (configurar desde día 1)
- **Google Business Profile** — perfil de Google Maps (vincular con el sitio)
- **Google Analytics 4** — tráfico y comportamiento
- **PageSpeed Insights** — velocidad del sitio (meta: score > 90 mobile)

---

## 10. CRITERIOS DE ACEPTACIÓN

- [ ] Rutas `/blog` y `/blog/{slug}` funcionales
- [ ] Meta tags completos en cada artículo
- [ ] Schema LocalBusiness en página principal
- [ ] Schema Article en cada post
- [ ] Sitemap XML incluye todas las URLs del blog
- [ ] Imágenes en formato WebP con lazy loading
- [ ] Tiempo de carga < 3 segundos en móvil
- [ ] Google Search Console configurado y verificado
- [ ] Google Business Profile vinculado al sitio

---

*PRD generado como parte del proyecto de migración web de Medimundo — Abril 2026*
