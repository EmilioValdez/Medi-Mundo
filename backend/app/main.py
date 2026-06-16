from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import RedirectResponse, Response as FastAPIResponse
from starlette.middleware.base import BaseHTTPMiddleware


class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    # Paths that must be served directly even over HTTP (never redirected)
    _NO_REDIRECT = {"/robots.txt", "/sitemap.xml"}

    async def dispatch(self, request: Request, call_next):
        proto = request.headers.get("x-forwarded-proto", "https")
        path = request.url.path
        if proto == "http" and path not in self._NO_REDIRECT and not path.startswith("/.well-known/"):
            url = str(request.url).replace("http://", "https://", 1)
            return RedirectResponse(url, status_code=301)
        return await call_next(request)


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
from app.routers import auth, categories, equipment, bookings, customers, dashboard, blog, inogen, oxygen_refills
from app.models import blog as _blog_models  # noqa: F401 — ensures table is created
from app.models import inogen as _inogen_models  # noqa: F401 — ensures table is created
from app.models import oxygen_refill as _oxygen_refill_models  # noqa: F401 — ensures table is created

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as exc:
        # DB temporarily unavailable — server still starts; static files work fine
        print(f"[lifespan] DB create_all skipped: {exc}")
    yield


app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
    redirect_slashes=False,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(HTTPSRedirectMiddleware)
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
app.include_router(inogen.router)
app.include_router(oxygen_refills.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME}


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
