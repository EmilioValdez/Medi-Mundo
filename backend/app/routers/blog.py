from __future__ import annotations

import markdown
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.blog import BlogPost
from app.models.equipment import Equipment

router = APIRouter(tags=["blog"])


def _render_markdown(text: str) -> str:
    return markdown.markdown(text, extensions=["tables", "fenced_code"])


@router.get("/sitemap.xml")
async def sitemap(db: AsyncSession = Depends(get_db)):
    # Blog posts
    posts_result = await db.execute(
        select(BlogPost.slug, BlogPost.actualizado, BlogPost.fecha_publicacion)
        .where(BlogPost.activo == True)
        .order_by(BlogPost.fecha_publicacion.desc())
    )
    posts = posts_result.all()

    # Active equipment
    eq_result = await db.execute(
        select(Equipment.id).where(Equipment.is_active == True).order_by(Equipment.id)
    )
    equipment_ids = eq_result.scalars().all()

    static_urls = [
        ("https://medimundo.mx/", "1.0", "weekly"),
        ("https://medimundo.mx/rentas", "0.9", "weekly"),
        ("https://medimundo.mx/catalogo", "0.8", "weekly"),
        ("https://medimundo.mx/recargas", "0.8", "monthly"),
        ("https://medimundo.mx/respiratorio", "0.8", "monthly"),
        ("https://medimundo.mx/blog", "0.7", "weekly"),
        ("https://medimundo.mx/conocenos", "0.6", "monthly"),
    ]

    xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>',
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

    for loc, priority, changefreq in static_urls:
        xml_parts.append(
            f"  <url><loc>{loc}</loc><priority>{priority}</priority>"
            f"<changefreq>{changefreq}</changefreq></url>"
        )

    for eq_id in equipment_ids:
        xml_parts.append(
            f"  <url><loc>https://medimundo.mx/equipo/{eq_id}</loc>"
            f"<priority>0.7</priority><changefreq>monthly</changefreq></url>"
        )

    for slug, actualizado, fecha_pub in posts:
        lastmod = (actualizado or fecha_pub).isoformat() if (actualizado or fecha_pub) else ""
        xml_parts.append(
            f"  <url>"
            f"<loc>https://medimundo.mx/blog/{slug}</loc>"
            f"{'<lastmod>' + lastmod + '</lastmod>' if lastmod else ''}"
            f"<priority>0.7</priority><changefreq>monthly</changefreq>"
            f"</url>"
        )

    xml_parts.append("</urlset>")
    return Response(content="\n".join(xml_parts), media_type="application/xml")


@router.get("/api/blog/posts")
async def api_blog_posts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BlogPost).where(BlogPost.activo == True)
        .order_by(BlogPost.fecha_publicacion.desc())
    )
    posts = result.scalars().all()
    return [
        {c.key: getattr(p, c.key) for c in BlogPost.__table__.columns}
        for p in posts
    ]


@router.get("/api/blog/posts/{slug}")
async def api_blog_post(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BlogPost).where(BlogPost.slug == slug, BlogPost.activo == True)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Artículo no encontrado")
    data = {c.key: getattr(post, c.key) for c in BlogPost.__table__.columns}
    data["contenido_html"] = _render_markdown(post.contenido or "")
    return data
