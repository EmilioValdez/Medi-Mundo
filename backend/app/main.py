from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.middleware.base import BaseHTTPMiddleware

class CacheControlMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        path = request.url.path
        if path.startswith('/assets/'):
            response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
        elif path.startswith('/images/') or path.endswith(('.webp', '.jpg', '.jpeg', '.png', '.svg', '.ico')):
            response.headers['Cache-Control'] = 'public, max-age=604800'
        elif path.endswith(('.woff', '.woff2', '.ttf')):
            response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
        return response
from app.config import get_settings
from app.database import engine, Base
from app.routers import auth, categories, equipment, bookings, customers, dashboard, blog
from app.models import blog as _blog_models  # noqa: F401 — ensures table is created

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
)

app.add_middleware(CacheControlMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(equipment.router)
app.include_router(bookings.router)
app.include_router(customers.router)
app.include_router(dashboard.router)
app.include_router(blog.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME}


from fastapi.responses import Response as FastAPIResponse

@app.get("/robots.txt", include_in_schema=False)
async def robots_txt():
    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /api/\n"
        "Disallow: /admin/\n"
        "\n"
        "Sitemap: https://medimundo.mx/sitemap.xml\n"
    )
    return FastAPIResponse(content=content, media_type="text/plain")


# Serve frontend static files in production
FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
PUBLIC_IMAGES = Path(__file__).resolve().parent.parent.parent / "frontend" / "public" / "images"
if PUBLIC_IMAGES.is_dir():
    app.mount("/images", StaticFiles(directory=PUBLIC_IMAGES), name="images")

if FRONTEND_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(request: Request, full_path: str):
        file_path = FRONTEND_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIR / "index.html")
