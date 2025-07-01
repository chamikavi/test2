# ---------- frontend build stage ----------
FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend .
RUN npm run build

# ---------- backend stage ----------
FROM python:3.12-slim
WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

COPY app ./app

# include compiled frontend assets
COPY --from=frontend /frontend/dist ./static

# document exposed API endpoints for quick reference
# POST /users/                  create user (admin only)
# GET  /outlets/                list outlets
# POST /outlets/                create outlet
# GET  /periods/                list periods
# POST /periods/                create period
# GET  /kpis/                   list KPIs
# POST /kpis/                   create KPI
# GET  /updates/{outlet}/{kpi}  list KPI updates
# POST /updates/                create update
# GET  /metrics/{outlet}/{kpi}  aggregated KPI values
# GET  /feedback/{outlet}       list feedback
# POST /feedback/               create feedback
# GET  /files/{outlet}/{period} list file metadata
# POST /files/                  create file metadata
# GET  /deck/{outlet}/{period}  generate PPTX deck

EXPOSE 8000
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "app.main:app"]
