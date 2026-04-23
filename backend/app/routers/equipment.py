from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.equipment import Equipment
from app.models.category import Category
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentOut
from app.auth.deps import get_current_user

router = APIRouter(prefix="/api/equipment", tags=["equipment"])


def _to_out(eq: Equipment) -> dict:
    d = {c.key: getattr(eq, c.key) for c in Equipment.__table__.columns}
    d["category_name"] = eq.category.name if eq.category else None
    return d


@router.get("/", response_model=list[EquipmentOut])
async def list_equipment(
    category_id: int | None = None,
    active_only: bool = False,
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    q = select(Equipment).options(joinedload(Equipment.category)).order_by(Equipment.name)
    if category_id:
        q = q.where(Equipment.category_id == category_id)
    if active_only:
        q = q.where(Equipment.is_active == True)
    if search:
        q = q.where(Equipment.name.ilike(f"%{search}%"))
    result = await db.execute(q)
    items = result.unique().scalars().all()
    return [_to_out(e) for e in items]


@router.get("/{eq_id}", response_model=EquipmentOut)
async def get_equipment(eq_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Equipment).options(joinedload(Equipment.category)).where(Equipment.id == eq_id)
    )
    eq = result.unique().scalar_one_or_none()
    if not eq:
        raise HTTPException(404, "Equipo no encontrado")
    return _to_out(eq)


@router.post("/", response_model=EquipmentOut)
async def create_equipment(
    body: EquipmentCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    eq = Equipment(**body.model_dump())
    db.add(eq)
    await db.commit()
    await db.refresh(eq)
    result = await db.execute(
        select(Equipment).options(joinedload(Equipment.category)).where(Equipment.id == eq.id)
    )
    eq = result.unique().scalar_one()
    return _to_out(eq)


@router.put("/{eq_id}", response_model=EquipmentOut)
async def update_equipment(
    eq_id: int,
    body: EquipmentUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(
        select(Equipment).options(joinedload(Equipment.category)).where(Equipment.id == eq_id)
    )
    eq = result.unique().scalar_one_or_none()
    if not eq:
        raise HTTPException(404, "Equipo no encontrado")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(eq, k, v)
    await db.commit()
    await db.refresh(eq)
    result = await db.execute(
        select(Equipment).options(joinedload(Equipment.category)).where(Equipment.id == eq.id)
    )
    eq = result.unique().scalar_one()
    return _to_out(eq)


@router.delete("/{eq_id}")
async def delete_equipment(
    eq_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Equipment).where(Equipment.id == eq_id))
    eq = result.scalar_one_or_none()
    if not eq:
        raise HTTPException(404, "Equipo no encontrado")
    await db.delete(eq)
    await db.commit()
    return {"ok": True}
