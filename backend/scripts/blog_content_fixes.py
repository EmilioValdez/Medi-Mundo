"""
Correcciones puntuales de contenido de blog aplicadas directamente en Neon.

Neon es la fuente de verdad del blog: seed_blog.py ya NO sobrescribe posts
existentes. Para corregir texto de un post publicado, agrega aquí una tupla
(slug, texto_viejo, texto_nuevo). Es idempotente: si el texto viejo ya no
existe, no hace nada; solo toca `actualizado` cuando sí hubo cambio.
Usa slug '*' para aplicar el reemplazo a TODOS los posts.

2026-11-21: precios viejos de abril 2026 (silla $400, cama $750/$1,100,
concentrador $950, etc.) que el seed reescribía en cada deploy.
"""
from __future__ import annotations

from sqlalchemy import text

FIXES: list[tuple[str, str, str]] = [
    ('renta-cama-hospitalaria-queretaro', '| Cama hospitalaria manual | $750 pesos |', '| Cama hospitalaria manual | $1,500 pesos |'),
    ('renta-cama-hospitalaria-queretaro', '| Cama hospitalaria eléctrica | $1,100 pesos |', '| Cama hospitalaria eléctrica | $2,500 pesos |'),
    ('renta-cama-hospitalaria-queretaro', '| Cama hospitalaria eléctrica de lujo | $2,300 pesos |', '| Cama hospitalaria eléctrica de lujo | $3,500 pesos |'),
    ('renta-cama-hospitalaria-queretaro', '| Sillón Reposet eléctrico | $1,100 pesos |', '| Sillón Reposet eléctrico | $2,000 pesos |'),
    ('renta-cama-hospitalaria-queretaro', '| Grúa hidráulica para paciente | $1,100 pesos |', '| Grúa hidráulica para paciente | $2,500 pesos |'),
    ('renta-cama-hospitalaria-queretaro', '| Mesa de alimentos | $230 pesos |', '| Mesa de alimentos | $950 pesos |'),
    ('renta-concentrador-oxigeno-queretaro', 'Desde $950/mes. ☎', 'Desde $2,500/mes. ☎'),
    ('renta-concentrador-oxigeno-queretaro', '| **Precio mensual** | Desde $3,690 | Desde $950 |', '| **Precio mensual** | Desde $4,990 | Desde $2,500 |'),
    ('renta-concentrador-oxigeno-queretaro', '- **Renta mensual:** $950\n', '- **Renta mensual:** $2,500\n'),
    ('renta-concentrador-oxigeno-queretaro', '| Estacionario 5 LPM | Estacionario | — | — | $950 |', '| Estacionario 5 LPM | Estacionario | — | — | $2,500 |'),
    ('ubicacion-entrega-domicilio-medimundo-queretaro', 'Cama hospitalaria manual — $750/mes', 'Cama hospitalaria manual — $1,500/mes'),
    ('ubicacion-entrega-domicilio-medimundo-queretaro', 'Cama hospitalaria eléctrica — $1,100/mes', 'Cama hospitalaria eléctrica — $2,500/mes'),
    ('ubicacion-entrega-domicilio-medimundo-queretaro', 'eléctrica de lujo — $2,300/mes', 'eléctrica de lujo — $3,500/mes'),
    ('ubicacion-entrega-domicilio-medimundo-queretaro', 'Sillón Reposet eléctrico — $1,100/mes', 'Sillón Reposet eléctrico — $2,000/mes'),
    ('ubicacion-entrega-domicilio-medimundo-queretaro', 'Grúa hidráulica para paciente — $1,100/mes', 'Grúa hidráulica para paciente — $2,500/mes'),
    ('ubicacion-entrega-domicilio-medimundo-queretaro', 'Mesa de alimentos — $230/mes', 'Mesa de alimentos — $950/mes'),
    ('ubicacion-entrega-domicilio-medimundo-queretaro', 'Concentradores de oxígeno — desde $950/mes', 'Concentradores de oxígeno — desde $2,500/mes'),
    ('renta-silla-de-ruedas-queretaro', 'desde $400/mes. Sin depósito.', 'desde $1,500/mes. Sin depósito.'),
    ('renta-silla-de-ruedas-queretaro', '- **Renta mensual:** $400 pesos\n- **Renta semanal:** $150 pesos\n- **Renta diaria:** $30 pesos', '- **Renta mensual:** $1,500 pesos\n- **Renta quincenal:** $1,000 pesos\n- **Renta diaria:** $250 pesos'),
    ('renta-silla-de-ruedas-queretaro', '| Cama hospitalaria manual | $750 |', '| Cama hospitalaria manual | $1,500 |'),
    ('renta-silla-de-ruedas-queretaro', '| Cama hospitalaria eléctrica | $1,100 |', '| Cama hospitalaria eléctrica | $2,500 |'),
    ('renta-silla-de-ruedas-queretaro', '| Grúa hidráulica para traslado | $1,100 |', '| Grúa hidráulica para traslado | $2,500 |'),
    ('renta-silla-de-ruedas-queretaro', '| Mesa de alimentos ajustable | $230 |', '| Mesa de alimentos ajustable | $950 |'),
    ('renta-silla-de-ruedas-queretaro', '| Banco de ducha con respaldo | $350 |', '| Banco de ducha con respaldo | Consultar precio |'),
    ('cuidado-adulto-mayor-casa-queretaro', '- **Renta mensual:** $200 pesos', '- **Renta:** consultar precio'),
    ('cuidado-adulto-mayor-casa-queretaro', '- **Renta mensual:** $400 pesos\n- **Renta semanal:** $150 pesos', '- **Renta mensual:** $1,500 pesos\n- **Renta quincenal:** $1,000 pesos'),
    ('cuidado-adulto-mayor-casa-queretaro', '- **Renta mensual:** $750 pesos', '- **Renta mensual:** $1,500 pesos'),
    ('cuidado-adulto-mayor-casa-queretaro', '- **Renta mensual:** $350 pesos', '- **Renta:** consultar precio'),
    ('cuidado-adulto-mayor-casa-queretaro', '- **Renta mensual:** desde $450 pesos', '- **Renta:** consultar precio'),
    ('cuidado-adulto-mayor-casa-queretaro', '- **Renta mensual:** $230 pesos', '- **Renta mensual:** $950 pesos'),
    ('cuidado-adulto-mayor-casa-queretaro', '| Andadera plegable | $200 |', '| Andadera plegable | Consultar precio |'),
    ('cuidado-adulto-mayor-casa-queretaro', '| Silla de ruedas estándar | $400 |', '| Silla de ruedas estándar | $1,500 |'),
    ('cuidado-adulto-mayor-casa-queretaro', 'Concentrador de oxígeno estacionario (desde $950/mes)', 'Concentrador de oxígeno estacionario (desde $2,500/mes)'),
    ('cuidado-adulto-mayor-casa-queretaro', '| Cama hospitalaria manual | $750 |', '| Cama hospitalaria manual | $1,500 |'),
    ('cuidado-adulto-mayor-casa-queretaro', '| Cama hospitalaria eléctrica | $1,100 |', '| Cama hospitalaria eléctrica | $2,500 |'),
    ('cuidado-adulto-mayor-casa-queretaro', '| Grúa hidráulica para traslado | $1,100 |', '| Grúa hidráulica para traslado | $2,500 |'),
    ('cuidado-adulto-mayor-casa-queretaro', '| Mesa de alimentos ajustable | $230 |', '| Mesa de alimentos ajustable | $950 |'),
    ('cuidado-adulto-mayor-casa-queretaro', '| Banco de ducha con respaldo | $350 |', '| Banco de ducha con respaldo | Consultar precio |'),
    ('recargas-oxigeno-queretaro', 'concentradores desde $950/mes.', 'concentradores desde $2,500/mes.'),
    ('recargas-oxigeno-queretaro', '| Estacionario 5 LPM | Estacionario | $950 |', '| Estacionario 5 LPM | Estacionario | $2,500 |'),
    ('recargas-oxigeno-queretaro', 'estacionario desde $950 al mes.', 'estacionario desde $2,500 al mes.'),
    ('equipo-medico-recuperacion-casa-queretaro', 'estacionario** — desde $950/mes', 'estacionario** — desde $2,500/mes'),
    ('andaderas-bastones-queretaro', 'precios de renta desde $200/mes.', 'precios de renta accesibles.'),
    ('andaderas-bastones-queretaro', '- **Renta mensual en MediMundo:** $200', '- **Renta en MediMundo:** consultar precio'),
    ('andaderas-bastones-queretaro', '| Andadera fija plegable | $200 |', '| Andadera fija plegable | Consultar |'),
    ('cama-hospitalaria-manual-vs-electrica-queretaro', 'desde $750/mes.', 'desde $1,500/mes.'),
    ('cama-hospitalaria-manual-vs-electrica-queretaro', 'accesible ($750/mes)', 'accesible ($1,500/mes)'),
    ('cama-hospitalaria-manual-vs-electrica-queretaro', 'Precio más alto ($1,100/mes)', 'Precio más alto ($2,500/mes)'),
    ('cama-hospitalaria-manual-vs-electrica-queretaro', '| Renta mensual | $750 | $1,100 |', '| Renta mensual | $1,500 | $2,500 |'),
    ('inogen-at-home-concentrador-oxigeno-casa-queretaro', '| Renta mensual | $3,000 | **$950** |', '| Renta mensual | $3,000 | **$2,500** |'),
    ('cuidado-adulto-mayor-casa-queretaro', '- **Renta mensual:** $1,100 pesos', '- **Renta mensual:** $2,500 pesos'),
    ('grua-hidraulica-pacientes-queretaro', 'Renta semanal', 'Renta quincenal'),

    # 2026-11-21 (confirmado por el dueño):
    # - La dirección correcta es Av. Canadá 230 (Perfil de Negocio/Waze); los blogs decían 212.
    ('*', 'Av. Canadá 212', 'Av. Canadá 230'),
    # - El concentrador estacionario (no Inogen) NO lleva depósito.
    ('renta-concentrador-oxigeno-queretaro', '- **Renta mensual:** $2,500\n- **Depósito en garantía:** $6,500', '- **Renta mensual:** $2,500\n- **Depósito en garantía:** Sin depósito'),
    ('renta-concentrador-oxigeno-queretaro', '| Estacionario 5 LPM | Estacionario | — | — | $2,500 | $6,500 |', '| Estacionario 5 LPM | Estacionario | — | — | $2,500 | Sin depósito |'),
    ('recargas-oxigeno-queretaro', '| Estacionario 5 LPM | Estacionario | $2,500 | $6,500 |', '| Estacionario 5 LPM | Estacionario | $2,500 | Sin depósito |'),
    # - Las recargas de oxígeno son SOLO en tienda (no a domicilio).
    ('recargas-oxigeno-queretaro', 'Tanques de aluminio y acero, servicio a domicilio disponible.', 'Tanques de aluminio y acero, recarga en tienda el mismo día.'),
    # - Entrega de equipo: $500 en zona céntrica; fuera de ella depende de la zona.
    ('recargas-oxigeno-queretaro', 'El costo de entrega en zona céntrica es de $500 pesos.', 'El costo de entrega en zona céntrica es de $500 pesos; fuera de la zona céntrica depende de la zona, consúltanos. Las recargas de tanques se hacen solo en nuestra tienda.'),
]

_SQL = text("""
    UPDATE blog_posts SET
        contenido = REPLACE(contenido, :old, :new),
        meta_description = LEFT(REPLACE(meta_description, :old, :new), 170),
        resumen = LEFT(REPLACE(resumen, :old, :new), 300),
        actualizado = CURRENT_DATE
    WHERE (:slug = '*' OR slug = :slug) AND (
        POSITION(:old IN COALESCE(contenido, '')) > 0
        OR POSITION(:old IN COALESCE(meta_description, '')) > 0
        OR POSITION(:old IN COALESCE(resumen, '')) > 0
    )
""")


async def apply_fixes(db) -> None:
    changed = 0
    for slug, old, new in FIXES:
        result = await db.execute(_SQL, {"slug": slug, "old": old, "new": new})
        changed += result.rowcount or 0
    await db.commit()
    print(f"  CONTENT FIXES applied: {changed} replacement(s)")
