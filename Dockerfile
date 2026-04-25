# Stage 1: Build frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend + serve frontend
FROM python:3.12-slim
WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY docs/ ./docs/
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY --from=frontend-build /app/frontend/public/images ./frontend/public/images

WORKDIR /app/backend
EXPOSE 8000

CMD python -m scripts.seed_catalog; python -m scripts.seed_blog; python -m scripts.seed_admin; uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
