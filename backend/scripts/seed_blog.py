"""
Run from the backend/ directory:
    python -m scripts.seed_blog
"""
from __future__ import annotations

import asyncio
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select
from app.database import async_session, engine, Base
from app.models.blog import BlogPost  # noqa: F401 — registers model with Base

DOCS_DIR = Path(__file__).resolve().parent.parent.parent / "docs"

ARTICLE_FILES = [
    "01_renta-cama-hospitalaria-queretaro.md",
    "02_renta-concentrador-oxigeno-queretaro.md",
    "03_ubicacion-entrega-domicilio-queretaro.md",
]

# Slugs de artículos duplicados o reemplazados que deben desactivarse
DEACTIVATE_SLUGS = [
    "concentrador-oxigeno-renta-queretaro",
]

IMAGE_MAP = {
    "renta-cama-hospitalaria-queretaro": "/images/cama-hospitalaria-manual-medimundo-queretaro.jpg",
    "renta-concentrador-oxigeno-queretaro": "/images/concentrador-oxigeno-everflo-philips-respironics.jpg",
    "ubicacion-entrega-domicilio-medimundo-queretaro": "/images/silla-de-ruedas-renta-queretaro-medimundo.jpg",
}

ALT_MAP = {
    "renta-cama-hospitalaria-queretaro": "Cama hospitalaria manual en renta en Querétaro — MediMundo",
    "renta-concentrador-oxigeno-queretaro": "Cama hospitalaria eléctrica en renta — MediMundo Querétaro",
    "ubicacion-entrega-domicilio-medimundo-queretaro": "Silla de ruedas en renta en Querétaro — MediMundo",
    "concentrador-oxigeno-renta-queretaro": "Cama hospitalaria eléctrica de lujo en renta — MediMundo Querétaro",
}


def _parse_field(text: str, field: str) -> str:
    match = re.search(rf"\*\*{field}:\*\*\s*(.+)", text)
    return match.group(1).strip() if match else ""


def parse_article(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")

    title_match = re.match(r"^#\s+(.+)", raw)
    titulo = title_match.group(1).strip() if title_match else path.stem

    parts = raw.split("\n---\n", 1)
    header = parts[0]
    contenido = parts[1].strip() if len(parts) > 1 else ""

    meta_title = _parse_field(header, "Meta title")
    meta_description = _parse_field(header, "Meta description")
    slug = _parse_field(header, "Slug")
    categoria = _parse_field(header, "Categoría") or _parse_field(header, "Categoria")
    tags = _parse_field(header, "Keywords")

    resumen = meta_description[:300] if meta_description else ""

    return {
        "titulo": titulo,
        "slug": slug,
        "resumen": resumen,
        "contenido": contenido,
        "categoria": categoria,
        "tags": tags,
        "imagen_principal": IMAGE_MAP.get(slug, ""),
        "alt_imagen": ALT_MAP.get(slug, titulo),
        "fecha_publicacion": date(2026, 4, 25),
        "actualizado": date(2026, 4, 25),
        "activo": True,
        "meta_title": meta_title[:70] if meta_title else titulo[:70],
        "meta_description": meta_description[:170] if meta_description else resumen[:170],
    }


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        for filename in ARTICLE_FILES:
            path = DOCS_DIR / filename
            if not path.exists():
                print(f"  SKIP (not found): {path}")
                continue

            data = parse_article(path)
            if not data["slug"]:
                print(f"  SKIP (no slug): {filename}")
                continue

            existing = (await db.execute(
                select(BlogPost).where(BlogPost.slug == data["slug"])
            )).scalar_one_or_none()

            if existing:
                for k, v in data.items():
                    setattr(existing, k, v)
                print(f"  UPDATED: {data['slug']}")
            else:
                db.add(BlogPost(**data))
                print(f"  INSERTED: {data['slug']}")

        await db.commit()

        # Desactivar artículos duplicados o reemplazados
        for slug in DEACTIVATE_SLUGS:
            row = (await db.execute(
                select(BlogPost).where(BlogPost.slug == slug)
            )).scalar_one_or_none()
            if row and row.activo:
                row.activo = False
                print(f"  DEACTIVATED: {slug}")

        await db.commit()
        print("Done.")


if __name__ == "__main__":
    asyncio.run(seed())
