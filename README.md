# SHOCKWAVE

SHOCKWAVE is an end-to-end energy intelligence project that turns an upstream oil-price shock into a downstream operational forecast for Thailand.

Instead of stopping at a notebook, this project packages the full workflow: data preparation, time-series modeling, backend APIs, a usable frontend, Dockerized local deployment, and security hardening before release.

## Why This Project Stands Out

- Solves a real-world problem: how global oil shocks propagate into Thai import volume and diesel demand with a delayed impact.
- Goes beyond analysis slides: the project is built as a working product, not only a data-science experiment.
- Connects multiple disciplines in one repo: data engineering, forecasting, backend engineering, frontend delivery, DevOps, and security hygiene.
- Shows product thinking: the output is a scenario simulator that a non-technical stakeholder can actually use.

## What I Built

### 1. Forecasting Pipeline

I designed a time-series workflow to transform energy and fuel data into a modeling frame that can simulate shock scenarios over future months.

Core work in this repo includes:

- ingesting and preparing DOEB and energy-related inputs
- building processed datasets for modeling
- training a VAR-based forecasting model
- generating model artifacts and diagnostic outputs
- supporting a mock-safe path when the trained artifact is not available

Relevant project areas:

- `ml_engine/`
- `ml_engine/data/`
- `ml_engine/artifacts/`
- `ml_engine/pipelines/`

### 2. Backend API

I built a FastAPI backend that exposes the model as an application service instead of leaving it buried inside notebooks or scripts.

What the backend does:

- accepts shock simulation requests
- returns forecasted downstream impact month by month
- exposes health and readiness endpoints
- separates schema, service, config, and API endpoint layers

Relevant project areas:

- `shockwave_backend/app/api/`
- `shockwave_backend/app/services/`
- `shockwave_backend/app/schemas/`
- `shockwave_backend/app/core/`

### 3. Frontend Experience

I turned the model output into a lightweight dashboard experience so the scenario can be explored visually, not just printed in a terminal.

The frontend includes:

- interactive shock percentage control
- forecast horizon control
- chart-based comparison between baseline and shocked outcomes
- table output for stakeholder interpretation

Relevant project areas:

- `frontend/index.html`
- `frontend/script.js`
- `frontend/style.css`
- `frontend/app.py`

### 4. Deployment and Security

I also handled productization work that many portfolio projects skip.

That includes:

- Docker-based local deployment
- service wiring for frontend, backend, database, and ML workflows
- environment variable handling with `.env.example`
- removal of tracked secrets from Git history
- CORS hardening
- reduced leakage from health endpoints
- non-root container execution
- localhost-only port binding for safer local demos

Relevant project areas:

- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `.env.example`
- `.gitignore`
- `SECURITY.md`

## Technical Highlights

- `Python`
- `FastAPI`
- `Pydantic`
- `SQLAlchemy`
- `PostgreSQL`
- `Docker Compose`
- `Pandas`
- `NumPy`
- `Statsmodels`
- `Joblib`
- `JavaScript`
- `HTML/CSS`

## Business Framing

The project is built around a simple but strong idea:

When Brent oil prices spike, downstream pain in the Thai energy system does not always appear immediately. There is a lag. SHOCKWAVE models that lag so decision-makers can see likely disruption before it becomes obvious in operations.

That framing makes the work valuable not only as a machine-learning exercise, but as an early-warning decision tool.

## What This Demonstrates About Me

This repository demonstrates that I can:

- take an abstract data problem and turn it into a working product
- move across the stack instead of staying in a single specialization
- structure code for maintainability, not just speed of hacking
- think about deployment and security before publishing
- build projects that are understandable to both technical reviewers and business stakeholders

## How To Run

1. Make sure Docker Desktop is running.
2. Put your source CSV files into:
   - `ml_engine/data/raw/doeb_import.csv`
   - `ml_engine/data/raw/doeb_diesel.csv`
3. Copy `.env.example` to `.env` and fill in the required values.
4. Build the dataset:

```bash
docker compose run --rm ml-trainer python -m ml_engine.pipelines.build_dataset
```

5. Train the model:

```bash
docker compose run --rm ml-trainer python -m ml_engine.pipelines.train_model
```

6. Start the application:

```bash
docker compose up --build
```

7. Open:
   - Frontend: `http://localhost:8501`
   - Backend health: `http://localhost:8000/health`
   - Backend readiness: `http://localhost:8000/ready`
   - Simulation endpoint: `http://localhost:8000/api/v1/simulate`

## Notes

- `.env` is intentionally kept local and should not be committed.
- If the trained model artifact is missing, the backend can fall back to a deterministic mock mode for UI and API testing.
- This project was shaped as a competition-grade prototype, but the repo structure reflects production-minded engineering decisions.
