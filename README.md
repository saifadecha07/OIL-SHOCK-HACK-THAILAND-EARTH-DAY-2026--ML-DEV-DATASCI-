# SHOCKWAVE

SHOCKWAVE is an end-to-end energy intelligence project that turns an upstream oil-price shock into a downstream operational forecast for Thailand.

Instead of stopping at a notebook, this project packages the full workflow: data preparation, time-series modeling, backend APIs, a usable frontend, Dockerized local deployment, and security hardening before release.

<div align="center">
  <a href="https://youtu.be/YwDWwzWZuWE">
    <img src="https://github.com/user-attachments/assets/9c9f465f-a966-4bc9-8d1e-8b7f88259293" alt="SHOCKWAVE Demo" width="100%">
  </a>
  <br>
  <em>คลิกที่รูปเพื่อดูวิดีโอสาธิตการทำงานของระบบ</em>
</div>

## Why This Project Stands Out

- Solves a real-world problem: how global oil shocks propagate into Thai import volume and diesel demand with a delayed impact.
- Goes beyond analysis slides: the project is built as a working product, not only a data-science experiment.
- Connects multiple disciplines in one repo: data engineering, forecasting, backend engineering, frontend delivery, DevOps, and security hygiene.
- Shows product thinking: the output is a scenario simulator that a non-technical stakeholder can actually use.

## What I Built

### 1. Forecasting Pipeline

I designed a time-series workflow to transform energy and fuel data into a modeling frame that can simulate shock scenarios over future months.

Core work in this repo includes:
- Ingesting and preparing DOEB and energy-related inputs
- Building processed datasets for modeling
- Training a VAR-based forecasting model
- Generating model artifacts and diagnostic outputs
- Supporting a mock-safe path when the trained artifact is not available

**Relevant project areas:**
- `ml_engine/`
- `ml_engine/data/`
- `ml_engine/artifacts/`
- `ml_engine/pipelines/`

### 2. Backend API

I built a FastAPI backend that exposes the model as an application service instead of leaving it buried inside notebooks or scripts.

What the backend does:
- Accepts shock simulation requests
- Returns forecasted downstream impact month by month
- Exposes health and readiness endpoints
- Separates schema, service, config, and API endpoint layers

**Relevant project areas:**
- `shockwave_backend/app/api/`
- `shockwave_backend/app/services/`
- `shockwave_backend/app/schemas/`
- `shockwave_backend/app/core/`

### 3. Frontend Experience

I turned the model output into a lightweight dashboard experience so the scenario can be explored visually, not just printed in a terminal.

The frontend includes:
- Interactive shock percentage control
- Forecast horizon control
- Chart-based comparison between baseline and shocked outcomes
- Table output for stakeholder interpretation

**Relevant project areas:**
- `frontend/index.html`
- `frontend/script.js`
- `frontend/style.css`
- `frontend/app.py`

### 4. Deployment and Security

I also handled productization work that many portfolio projects skip. 

<div align="center">
  <img src="https://github.com/user-attachments/assets/9c9f465f-a966-4bc9-8d1e-8b7f88259293" alt="Docker Compose Running in VS Code" width="80%">
  <br>
  <em>Clean project structure and successful backend/frontend orchestration via Docker Compose.</em>
</div>
<br>

<div align="center">
  <img src="https://github.com/user-attachments/assets/e6ad8533-9215-4d71-9dbb-2f2c5e36cd13" alt="Docker Desktop Containers" width="80%">
  <br>
  <em>Multi-container application running efficiently in Docker.</em>
</div>
<br>

That includes:
- Docker-based local deployment
- Service wiring for frontend, backend, database, and ML workflows
- Environment variable handling with `.env.example`
- Removal of tracked secrets from Git history
- CORS hardening
- Reduced leakage from health endpoints
- Non-root container execution
- Localhost-only port binding for safer local demos

**Relevant project areas:**
- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `.env.example`
- `.gitignore`
- `SECURITY.md`

## Technical Highlights

- `Python`, `FastAPI`, `Pydantic`, `SQLAlchemy`, `PostgreSQL`
- `Docker Compose`
- `Pandas`, `NumPy`, `Statsmodels`, `Joblib`
- `JavaScript`, `HTML/CSS`

## Business Framing

The project is built around a simple but strong idea:

When Brent oil prices spike, downstream pain in the Thai energy system does not always appear immediately. There is a lag. SHOCKWAVE models that lag so decision-makers can see likely disruption before it becomes obvious in operations.

That framing makes the work valuable not only as a machine-learning exercise, but as an early-warning decision tool.

## What This Demonstrates About Me

This repository demonstrates that I can:
- Take an abstract data problem and turn it into a working product
- Move across the stack instead of staying in a single specialization
- Structure code for maintainability, not just speed of hacking
- Think about deployment and security before publishing
- Build projects that are understandable to both technical reviewers and business stakeholders

## How To Run

1. Make sure Docker Desktop is running.
2. Put your source CSV files into:
   - `ml_engine/data/raw/doeb_import.csv`
   - `ml_engine/data/raw/doeb_diesel.csv`
3. Copy `.env.example` to `.env` and fill in the required values.
4. Build the dataset:
   ```bash
   docker compose run --rm ml-trainer python -m ml_engine.pipelines.build_dataset
