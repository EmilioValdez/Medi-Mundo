"""
Run from the backend/ directory:
    python -m scripts.seed_catalog
"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select
from app.database import async_session, engine, Base
from app.models.category import Category
from app.models.equipment import Equipment  # noqa: F401
from app.models.inogen import InogenModel  # noqa: F401

CATEGORIES = [
    {"name": "Camas Hospitalarias", "slug": "camas-hospitalarias", "icon": "🛏️", "description": "Camas manuales, eléctricas y de lujo para recuperación en casa."},
    {"name": "Sillas de Ruedas", "slug": "sillas-de-ruedas", "icon": "♿", "description": "Sillas de ruedas en renta y venta para todo tipo de necesidad."},
    {"name": "Concentradores de Oxígeno", "slug": "concentradores-de-oxigeno", "icon": "💨", "description": "Concentradores de oxígeno estacionarios y portátiles en renta."},
    {"name": "Movilidad", "slug": "andaderas-bastones", "icon": "🦯", "description": "Andaderas, bastones, muletas y equipos de apoyo para movilidad."},
    {"name": "Baño y Seguridad", "slug": "bano-seguridad", "icon": "🚿", "description": "Sillas de ducha, bancos de aluminio y accesorios de seguridad."},
    {"name": "Ortopedia", "slug": "ortopedia", "icon": "🦴", "description": "Ortopedia blanda, calcetas de compresión y soportes."},
    {"name": "Equipos de Apoyo", "slug": "equipos-apoyo", "icon": "🏥", "description": "Grúas hidráulicas, mesas de alimentos y sillones reposet."},
]

EQUIPMENT = [
    {
        "name": "Cama Hospitalaria Manual",
        "slug": "camas-hospitalarias",
        "description": "Cama hospitalaria manual con barandales ajustables. Ideal para recuperaciones postoperatorias y cuidado del adulto mayor en casa.",
        "price_monthly": 750,
        "price_weekly": 250,
        "price_daily": 50,
        "deposit": 0,
        "images": ["/images/cama-hospitalaria-manual-medimundo-queretaro.jpg"],
        "quantity_total": 5,
        "quantity_available": 5,
    },
    {
        "name": "Cama Hospitalaria Eléctrica",
        "slug": "camas-hospitalarias",
        "description": "Cama hospitalaria eléctrica con control remoto. Ajuste de posición para cabecera y piecera con un solo toque.",
        "price_monthly": 1100,
        "price_weekly": 380,
        "price_daily": 70,
        "deposit": 0,
        "images": ["/images/cama-hospitalaria-electrica-medimundo-queretaro.jpg"],
        "quantity_total": 4,
        "quantity_available": 4,
    },
    {
        "name": "Cama Hospitalaria Eléctrica de Lujo",
        "slug": "camas-hospitalarias",
        "description": "Cama hospitalaria eléctrica de lujo con posiciones múltiples, barandales y colchón incluido. La opción más completa para el cuidado en casa.",
        "price_monthly": 2300,
        "price_weekly": 750,
        "price_daily": 130,
        "deposit": 0,
        "images": ["/images/cama-hospitalaria-electrica-lujo-medimundo-queretaro.jpg"],
        "quantity_total": 2,
        "quantity_available": 2,
    },
    {
        "name": "Cama de Masaje 3 Posiciones",
        "slug": "camas-hospitalarias",
        "description": "Cama de masaje con 3 posiciones ajustables, estructura de madera resistente. Ideal para fisioterapia en casa.",
        "price_monthly": 900,
        "price_weekly": 300,
        "price_daily": 55,
        "deposit": 0,
        "images": ["/images/cama-masaje-3-posiciones-madera-medimundo-queretaro.jpg"],
        "quantity_total": 2,
        "quantity_available": 2,
    },
    {
        "name": "Silla de Ruedas Estándar",
        "slug": "sillas-de-ruedas",
        "description": "Silla de ruedas estándar plegable, ligera y resistente. Disponible en renta mensual o venta. Consulta disponibilidad.",
        "price_monthly": 400,
        "price_weekly": 150,
        "price_daily": 30,
        "deposit": 0,
        "images": ["/images/silla-de-ruedas-renta-queretaro-medimundo.jpg"],
        "quantity_total": 8,
        "quantity_available": 8,
    },
    {
        "name": "Concentrador de Oxígeno",
        "slug": "concentradores-de-oxigeno",
        "description": "Concentrador de Oxígeno 5 Lts Everflo Respironics Philips. Concentrador estacionario de alto rendimiento, flujo continuo de hasta 5 litros por minuto. No requiere receta médica. Incluye entrega, instalación y capacitación de uso a domicilio.",
        "price_monthly": 950,
        "price_weekly": 320,
        "price_daily": 60,
        "deposit": 6500,
        "images": ["/images/concentrador-oxigeno-everflo-philips-respironics.jpg"],
        "quantity_total": 3,
        "quantity_available": 3,
    },
    {
        "name": "Sillón Reposet Eléctrico",
        "slug": "equipos-apoyo",
        "description": "Sillón reposet eléctrico con control remoto. Posición de descanso y reclinación total. Ideal para pacientes con movilidad reducida.",
        "price_monthly": 1100,
        "price_weekly": 380,
        "price_daily": 70,
        "deposit": 0,
        "images": ["/images/sillon-reposet-pacientes.jpg"],
        "quantity_total": 2,
        "quantity_available": 2,
    },
    {
        "name": "Grúa Hidráulica para Paciente",
        "slug": "equipos-apoyo",
        "description": "Grúa hidráulica para traslado seguro de pacientes. Incluye arnés. Indispensable para el cuidado de pacientes con movilidad muy limitada.",
        "price_monthly": 1100,
        "price_weekly": 380,
        "price_daily": 70,
        "deposit": 0,
        "images": ["/images/grua-hidraulica-paciente.jpg"],
        "quantity_total": 2,
        "quantity_available": 2,
    },
    {
        "name": "Mesa de Alimentos",
        "slug": "equipos-apoyo",
        "description": "Mesa de alimentos ajustable en altura, compatible con camas hospitalarias. Bandeja amplia y ruedas para fácil desplazamiento.",
        "price_monthly": 230,
        "price_weekly": 80,
        "price_daily": 15,
        "deposit": 0,
        "images": ["/images/mesa-alimentos-paciente.jpg"],
        "quantity_total": 6,
        "quantity_available": 6,
    },
    {
        "name": "Banco de Ducha con Respaldo",
        "slug": "bano-seguridad",
        "description": "Banco de ducha de aluminio con respaldo y descansabrazos. Antideslizante, ajustable en altura. Ideal para adultos mayores y postoperatorio.",
        "price_monthly": 350,
        "price_weekly": 120,
        "price_daily": 20,
        "deposit": 0,
        "images": ["/images/banco-ducha-aluminio-respaldo-descansabrazos-medimundo.jpg"],
        "quantity_total": 4,
        "quantity_available": 4,
    },
    {
        "name": "Silla de Ducha con Asiento Perineal",
        "slug": "bano-seguridad",
        "description": "Silla de ducha con asiento perineal, respaldo y altura ajustable. Facilita la higiene personal de pacientes con movilidad reducida.",
        "price_monthly": 380,
        "price_weekly": 130,
        "price_daily": 22,
        "deposit": 0,
        "images": ["/images/silla-ducha-asiento-perineal-respaldo-altura-ajustable-medimundo.jpg"],
        "quantity_total": 4,
        "quantity_available": 4,
    },
    {
        "name": "Cómodo de Lujo Plegable",
        "slug": "bano-seguridad",
        "description": "Cómodo de lujo plegable de aluminio. Resistente, higiénico y fácil de limpiar. Indispensable para pacientes con movilidad muy limitada.",
        "price_monthly": 280,
        "price_weekly": 95,
        "price_daily": 18,
        "deposit": 0,
        "images": ["/images/comodo-lujo-plegable-aluminio-medimundo-queretaro.jpg"],
        "quantity_total": 5,
        "quantity_available": 5,
    },
]


INOGEN_MODELS = [
    {
        "model_id": "g2",
        "name": "Inogen One G2",
        "image": "/images/inogen-g2-png.png",
        "price_monthly": 3690,
        "price_biweekly": None,
        "price_weekly": None,
        "deposit": 25000,
        "faa_label": "Aprobado por FAA — apto para avión comercial",
        "faa_approved": True,
        "includes": [
            "Equipo",
            "Cargador de Pared y Auto",
            "Carrito de Traslado",
            "(2) baterías chicas de 12 celdas  ó  (1) batería grande de 24 celdas",
        ],
        "sort_order": 1,
    },
    {
        "model_id": "g3",
        "name": "Inogen One G3",
        "image": "/images/inogen-g3-png.png",
        "price_monthly": 4990,
        "price_biweekly": 3990,
        "price_weekly": 2590,
        "deposit": 30000,
        "faa_label": "Aprobado por FAA — apto para avión comercial",
        "faa_approved": True,
        "includes": [
            "Equipo",
            "Cargador de Pared y Auto",
            "Mochila de Traslado",
            "(2) baterías chicas de 8 celdas  ó  (1) batería grande de 16 celdas",
        ],
        "sort_order": 2,
    },
    {
        "model_id": "g4",
        "name": "Inogen One G4",
        "image": "/images/inogen-g4-png.webp",
        "price_monthly": 4990,
        "price_biweekly": 3990,
        "price_weekly": 2590,
        "deposit": 30000,
        "faa_label": "Fabricado bajo normas FAA — verifique con su aerolínea",
        "faa_approved": False,
        "includes": [
            "Equipo",
            "Cargador de Pared y Auto",
            "Mochila de Traslado",
            "(2) baterías chicas de 8 celdas",
        ],
        "sort_order": 3,
    },
    {
        "model_id": "g5",
        "name": "Inogen One G5",
        "image": "/images/inogen-g5-png.webp",
        "price_monthly": 6590,
        "price_biweekly": 4590,
        "price_weekly": 2590,
        "deposit": 40000,
        "faa_label": "Fabricado bajo normas FAA — verifique con su aerolínea",
        "faa_approved": False,
        "includes": [
            "Equipo",
            "Cargador de Pared y Auto",
            "Mochila de Traslado",
            "(2) baterías chicas de 8 celdas  ó  (1) batería grande de 16 celdas",
        ],
        "sort_order": 4,
    },
    {
        "model_id": "at-home",
        "name": "Inogen At Home",
        "image": "/images/inogen-at-home-png.webp",
        "price_monthly": 3000,
        "price_biweekly": None,
        "price_weekly": None,
        "deposit": 6000,
        "faa_label": None,
        "faa_approved": False,
        "includes": [
            "Equipo",
            "Cable de conexión a pared",
            "Peso 8.2 kg — compacto y fácil de mover",
            "Hasta 5 LPM en flujo continuo",
            "Ruido menor a 40 dB en nivel 2",
            "Inteligente, bajo consumo energético",
        ],
        "sort_order": 5,
    },
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Seed categories
        cat_map = {}
        for c in CATEGORIES:
            existing = (await db.execute(
                select(Category).where(Category.slug == c["slug"])
            )).scalar_one_or_none()
            if not existing:
                obj = Category(**c)
                db.add(obj)
                await db.flush()
                cat_map[c["slug"]] = obj.id
                print(f"  CATEGORY INSERTED: {c['name']}")
            else:
                cat_map[c["slug"]] = existing.id
                print(f"  CATEGORY EXISTS: {c['name']}")

        await db.commit()

        # Re-fetch category IDs after commit
        for c in CATEGORIES:
            row = (await db.execute(
                select(Category.id).where(Category.slug == c["slug"])
            )).scalar_one()
            cat_map[c["slug"]] = row

        # Seed equipment
        for e in EQUIPMENT:
            cat_slug = e.pop("slug")
            cat_id = cat_map.get(cat_slug)
            if not cat_id:
                print(f"  SKIP (no category): {e['name']}")
                continue

            existing = (await db.execute(
                select(Equipment).where(Equipment.name == e["name"])
            )).scalar_one_or_none()
            if not existing:
                obj = Equipment(category_id=cat_id, is_active=True, **e)
                db.add(obj)
                print(f"  EQUIPMENT INSERTED: {e['name']}")
            else:
                # Always sync images and description so they survive re-deploys
                if e.get("images"):
                    existing.images = e["images"]
                if e.get("description"):
                    existing.description = e["description"]
                print(f"  EQUIPMENT UPDATED: {e['name']}")

        await db.commit()

        # Seed Inogen models
        for m in INOGEN_MODELS:
            existing = (await db.execute(
                select(InogenModel).where(InogenModel.model_id == m["model_id"])
            )).scalar_one_or_none()
            if not existing:
                obj = InogenModel(**m, is_active=True)
                db.add(obj)
                print(f"  INOGEN INSERTED: {m['name']}")
            else:
                # Sync image in case it changed
                existing.image = m["image"]
                print(f"  INOGEN EXISTS: {m['name']}")

        await db.commit()
        print("Catalog seed done.")


if __name__ == "__main__":
    asyncio.run(seed())
