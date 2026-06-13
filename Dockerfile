# ── Stage 1: Build Next.js ──────────────────────────────────────────────────
FROM node:20-slim AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# Durante el build Next.js pre-renderiza con el API público (FastAPI no corre en esta etapa)
ENV BACKEND_URL=https://medimundo.mx
RUN npm run build

# ── Stage 2: Runtime (Python + Node.js) ─────────────────────────────────────
FROM python:3.12-slim

# Install Node.js 20 (to run Next.js standalone server)
RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend code
COPY backend/ ./backend/
COPY docs/ ./docs/

# Next.js standalone output
COPY --from=frontend-build /app/.next/standalone ./frontend/
COPY --from=frontend-build /app/.next/static ./frontend/.next/static
COPY --from=frontend-build /app/public ./frontend/public

# Startup script
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]
