from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.oxygen_refill import OxygenRefill
from app.schemas.oxygen_refill import OxygenRefillOut, OxygenRefillUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/api/oxygen-refills", tags=["oxygen-refills"])


@router.get("", response_model=list[OxygenRefillOut])
@router.get("/", response_model=list[OxygenRefillOut])
async def list_oxygen_refills(active_only: bool = False, db: AsyncSession = Depends(get_db)):
    q = select(OxygenRefill).order_by(OxygenRefill.sort_order)
    if active_only:
        q = q.where(OxygenRefill.is_active == True)
    result = await db.execute(q)
    return result.scalars().all()


@router.put("/{refill_id}", response_model=OxygenRefillOut)
async def update_oxygen_refill(
    refill_id: int,
    body: OxygenRefillUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(OxygenRefill).where(OxygenRefill.id == refill_id))
    refill = result.scalar_one_or_none()
    if not refill:
        raise HTTPException(404, "Recarga no encontrada")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(refill, k, v)
    await db.commit()
    await db.refresh(refill)
    return refill
