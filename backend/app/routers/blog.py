from __future__ import annotations

import math
from pathlib import Path

import markdown
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.blog import BlogPost

router = APIRouter(tags=["blog"])

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

PAGE_SIZE = 9


def _render_markdown(text: str) -> str:
    return markdown.markdown(text, extensions=["tables", "fenced_code"])


@router.get("/blog", response_class=HTMLResponse)
async def blog_list(
    request: Request,
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db),
):
    offset = (page - 1) * PAGE_SIZE
    total = (await db.execute(
        select(func.count()).select_from(BlogPost).where(BlogPost.activo == True)
    )).scalar_one()

    result = await db.execute(
        select(BlogPost)
        .where(BlogPost.activo == True)
        .order_by(BlogPost.fecha_publicacion.desc())
        .limit(PAGE_SIZE)
        .offset(offset)
    )
    posts = result.scalars().all()
    total_pages = math.ceil(total / PAGE_SIZE) if total else 1

    return templates.TemplateResponse(
        "blog/lista.html",
        {"request": request, "posts": posts, "page": page, "total_pages": total_pages},
    )


@router.get("/blog/categoria/{categoria}", response_class=HTMLResponse)
async def blog_categoria(
    request: Request,
    categoria: str,
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db),
):
    offset = (page - 1) * PAGE_SIZE
    total = (await db.execute(
        select(func.count()).select_from(BlogPost)
        .where(BlogPost.activo == True, BlogPost.categoria == categoria)
    )).scalar_one()

    result = await db.execute(
        select(BlogPost)
        .where(BlogPost.activo == True, BlogPost.categoria == categoria)
        .order_by(BlogPost.fecha_publicacion.desc())
        .limit(PAGE_SIZE)
        .offset(offset)
    )
    posts = result.scalars().all()
    total_pages = math.ceil(total / PAGE_SIZE) if total else 1

    return templates.TemplateResponse(
        "blog/lista.html",
        {"request": request, "posts": posts, "page": page, "total_pages": total_pages},
    )


@router.get("/blog/{slug}", response_class=HTMLResponse)
async def blog_detail(request: Request, slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BlogPost).where(BlogPost.slug == slug, BlogPost.activo == True)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Artículo no encontrado")

    post_data = {c.key: getattr(post, c.key) for c in BlogPost.__table__.columns}
    post_data["contenido_html"] = _render_markdown(post.contenido or "")

    class PostProxy:
        def __getattr__(self, name):
            return post_data.get(name)

    return templates.TemplateResponse(
        "blog/detalle.html",
        {"request": request, "post": type("Post", (), post_data)()},
    )


@router.get("/sitemap.xml")
async def sitemap(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BlogPost.slug, BlogPost.actualizado, BlogPost.fecha_publicacion)
        .where(BlogPost.activo == True)
        .order_by(BlogPost.fecha_publicacion.desc())
    )
    posts = result.all()

    urls = [
        ("https://medimundo.mx/", "1.0", "weekly"),
        ("https://medimundo.mx/blog", "0.8", "weekly"),
        ("https://medimundo.mx/catalogo", "0.7", "monthly"),
        ("https://medimundo.mx/contacto", "0.6", "monthly"),
    ]

    xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>',
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

    for loc, priority, changefreq in urls:
        xml_parts.append(
            f"  <url><loc>{loc}</loc><priority>{priority}</priority>"
            f"<changefreq>{changefreq}</changefreq></url>"
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
