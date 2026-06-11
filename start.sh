#!/bin/bash
set -e

# Run DB seeds sequentially
cd /app/backend
python -m scripts.seed_catalog
python -m scripts.seed_blog
python -m scripts.seed_admin

# Start FastAPI on internal port 8001 (background)
uvicorn app.main:app --host 0.0.0.0 --port 8001 &

# Start Next.js on $PORT (Railway sets this; default 3000)
cd /app/frontend
HOSTNAME=0.0.0.0 BACKEND_URL=http://localhost:8001 PORT=${PORT:-3000} node server.js
