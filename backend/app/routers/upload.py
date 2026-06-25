from __future__ import annotations

import os
import uuid
from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from app.auth.deps import get_current_user
from app.config import get_settings

router = APIRouter(prefix="/api/upload", tags=["upload"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB

UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    _=Depends(get_current_user),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Tipo de archivo no permitido. Usa JPG, PNG o WebP.")

    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(400, "La imagen excede el límite de 10 MB.")

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
                data,
                folder="medimundo/equipment",
                resource_type="image",
            )
            return {"url": result["secure_url"]}
        except Exception as e:
            raise HTTPException(500, f"Error al subir a Cloudinary: {e}")

    # Fallback: save locally
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    ext = (file.filename or "img").rsplit(".", 1)[-1].lower() or "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOADS_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(data)

    return {"url": f"/uploads/{filename}"}
