from __future__ import annotations

import io
import os
import uuid
from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from PIL import Image
from sqlalchemy import select

from app.auth.deps import get_current_user
from app.config import get_settings
from app.database import async_session
from app.models.stored_image import StoredImage

router = APIRouter(prefix="/api/upload", tags=["upload"])

MAX_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_DIMENSION = 1600

UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")


def _to_jpeg(data: bytes) -> bytes:
    img = Image.open(io.BytesIO(data))
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    if max(img.size) > MAX_DIMENSION:
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)
    out = io.BytesIO()
    img.save(out, format="JPEG", quality=88, optimize=True)
    return out.getvalue()


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    _=Depends(get_current_user),
):
    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(400, "La imagen excede el límite de 10 MB.")

    try:
        jpeg_data = _to_jpeg(data)
    except Exception:
        raise HTTPException(400, "No se pudo procesar la imagen. Usa JPG, PNG o WebP.")

    settings = get_settings()

    # Use Cloudinary if configured
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
        try:
            import cloudinary
            import cloudinary.uploader
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
            )
            result = cloudinary.uploader.upload(
                jpeg_data,
                folder="medimundo/equipment",
                resource_type="image",
                format="jpg",
            )
            return {"url": result["secure_url"]}
        except Exception as e:
            raise HTTPException(500, f"Error al subir a Cloudinary: {e}")

    # Store in PostgreSQL (Neon) — survives all deploys
    image_id = uuid.uuid4().hex
    async with async_session() as db:
        db.add(StoredImage(id=image_id, data=jpeg_data, content_type="image/jpeg"))
        await db.commit()

    return {"url": f"/api/images/{image_id}.jpg"}
