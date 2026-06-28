from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from sqlalchemy import select

from app.database import async_session
from app.models.stored_image import StoredImage

router = APIRouter(prefix="/api/images", tags=["images"])


@router.get("/{filename}")
async def serve_image(filename: str):
    image_id = filename.rsplit(".", 1)[0]
    async with async_session() as db:
        row = (await db.execute(
            select(StoredImage).where(StoredImage.id == image_id)
        )).scalar_one_or_none()
    if not row:
        raise HTTPException(404, "Image not found")
    return Response(
        content=row.data,
        media_type=row.content_type,
        headers={"Cache-Control": "public, max-age=2592000"},
    )
