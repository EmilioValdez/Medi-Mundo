from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.inogen import InogenModel
from app.schemas.inogen import InogenModelOut, InogenModelUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/api/inogen", tags=["inogen"])


@router.get("/", response_model=list[InogenModelOut])
async def list_inogen_models(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InogenModel).order_by(InogenModel.sort_order)
    )
    return result.scalars().all()


@router.put("/{model_id}", response_model=InogenModelOut)
async def update_inogen_model(
    model_id: int,
    body: InogenModelUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(InogenModel).where(InogenModel.id == model_id))
    model = result.scalar_one_or_none()
    if not model:
        raise HTTPException(404, "Modelo no encontrado")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(model, k, v)
    await db.commit()
    await db.refresh(model)
    return model
