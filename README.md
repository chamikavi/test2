# test2
Codex Prompt for Generating 360 Performance Hub Technical Specification DocumentGenerate a comprehensive software specification document based on the following details:
Purpose & Scope:
Develop a web-based presentation automation and performance tracking platform for outlet managers and head office (HO), replacing manual PowerPoint decks with standardized, data-driven slides, capturing data for Month-on-Month (MoM) and Year-on-Year (YoY) analysis.
Success Criteria:
100% outlet compliance with auto-generated templates.
Manager input time ≤15 minutes per month.
Data entry error rate <2% (validated server-side).
Hosting on a single Ubuntu 22.04 Linode server (max 2GB RAM).
Functional Requirements:
Data Entry Wizard: Web forms matching slide sections with strict field validation.
Historical Data Store: Persist monthly submissions with outlet ID, month, and year; API supports MoM, YoY, and YTD data retrieval.
Presentation Generator: Automated PPTX/PDF generation using python-pptx with Matplotlib-generated charts.
Dashboards: Outlet and HO-specific data views, including monthly snapshots, trend charts, comparative analysis, and rankings.
User Management: Basic HTTP authentication with role-based access (manager, admin).
Non-Functional Requirements:
Security: HTTPS via Nginx, passwords encrypted (bcrypt ≥12 rounds), basic auth only.
Hosting: Docker Compose deployment (App, DB, Nginx, Certbot) on Linode (Ubuntu 22.04, ≤2GB RAM).
Notifications: Not included in v1.
Performance: Forms must have <1 second TTFB at 200 ms latency.
Backup: Nightly PostgreSQL database dumps retained for 14 days.
Tech Stack:
Frontend: React 18, Vite, TypeScript
Backend: Python 3.12, FastAPI, Uvicorn-Gunicorn-Poetry (Docker)
Database: PostgreSQL 15
Authentication: HTTP Basic (JWT session cookies, 8-hour expiry)
Charting: Matplotlib for PPT/PDF, Chart.js for dashboards
Data Model:
Define ER-style schema for Outlet, User, Period, KPI, Update, Feedback, File.
API Endpoints:
Implement core APIs (authentication, data CRUD operations, presentation generation, aggregated metrics).
Standard Deck Layout:
Strict adherence to specified slide titles, objectives, key elements, visual standards (branding, typography, imagery), accessibility requirements, and enforced text limits.
Deployment Workflow:
Provide instructions for cloning repository, environment setup (.env), Docker Compose commands, and automated Certbot SSL configuration.
Future Improvements (Backlog for v1.2):
Fine-grained role permissions
Optional Google Workspace SSO
Email notification system
KPI anomaly detection
Ensure the generated specification aligns precisely with the described requirements, structures, and constraints.

chamindu kavindra

## Development setup

Install dependencies using Poetry:

```bash
poetry install
```

Create a `.env` file based on `.env.example` and adjust the `DATABASE_URL` as needed. The default configuration uses SQLite for local development.

Run the API with Uvicorn:

```bash
poetry run uvicorn app.main:app --reload
```

This will start the FastAPI server at `http://localhost:8000`.

## Frontend development

This project requires **Node.js 18** or newer.

Install Node dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file based on `.env.example` to configure the API base URL.

Start the development server:

```bash
npm run dev
```

The React app will be available at `http://localhost:5173` by default.

## Available API endpoints

The backend exposes a small set of CRUD endpoints secured with HTTP Basic auth:

```
POST /users/                  create a new user
GET  /outlets/                list outlets
POST /outlets/                create outlet
GET  /periods/                list reporting periods
POST /periods/                create period
GET  /kpis/                   list KPIs
POST /kpis/                   create KPI
GET  /updates/{outlet}/{kpi}  list KPI updates
POST /updates/                create update
GET  /metrics/{outlet}/{kpi}  aggregated KPI values
GET  /feedback/{outlet}       list feedback for outlet
POST /feedback/               create feedback entry
GET  /files/{outlet}/{period} list file metadata
POST /files/                  create file metadata entry
GET  /deck/{outlet}/{period}  generate PPTX deck
```

## Deployment with Docker Compose

The project includes a simple Compose setup for running the API with Postgres and Nginx.
Make sure Docker and Docker Compose are installed, then:

```bash
# clone repository and change into directory
# cp .env.example .env  # adjust DATABASE_URL if needed
# cp frontend/.env.example frontend/.env  # configure API URL

docker compose build
# obtain certificates (replace domain and email)
docker compose run --rm certbot
# start everything in the background
docker compose up -d db app nginx
```

Nginx will forward traffic to the FastAPI app on port 80/443 using the certificates
managed by Certbot. Edit `nginx/default.conf` to set your real domain.
