# SHOCKWAVE

SHOCKWAVE is a Track A competition prototype for `OIL SHOCK Hack! | THAILAND EARTH DAY 2026`.

It turns an upstream oil-price shock into a lag-aware early-warning signal for Thailand through a complete workflow:

- dataset assembly
- time-series modeling
- holdout backtesting
- backend APIs
- interactive web dashboard
- Dockerized local deployment

The core idea is simple:

`global oil shock -> hidden lag -> downstream Thai energy stress`

## What This Project Is

SHOCKWAVE is not just a notebook or a static dashboard.

It is a product-minded prototype that packages:

- `ml_engine/` for training data generation and VAR model training
- `shockwave_backend/` for FastAPI inference and model health endpoints
- `frontend/` for the interactive scenario dashboard
- `docker-compose.yml` for local end-to-end orchestration

## Competition Positioning

This project should be framed as:

- `Track A: Planetary Signals Lab`
- `early warning system`
- `time-series analysis`
- `interactive web dashboard`

It is designed to show how global energy-market shocks can propagate into Thai downstream indicators with a delayed response that is useful for early warning.

## Current Data Scope

The current implementation is centered on:

- `EIA Open Data`
  - Brent price
  - Natural gas price
- `DOEB Open Data`
  - import volume
  - diesel sales

The repo is structured so that `OWID` and `EPPO` can be extended into later phases, but they are not yet first-class runtime features in the current competition build.

## Modeling Workflow

The core training script is:

- `ml_engine/02_train_var_model.py`

What it currently does:

1. loads `ml_engine/shockwave_training_data.csv`
2. checks stationarity with `ADF`
3. applies differencing when needed
4. runs `Granger causality` tests
5. selects VAR lag order from information criteria
6. trains a multivariate `VAR` model
7. runs a time-based holdout backtest
8. stores model artifacts and validation outputs

Generated outputs include:

- `ml_engine/shockwave_var_model.pkl`
- `ml_engine/shockwave_backtest_report.json`
- `ml_engine/shockwave_backtest_predictions.csv`

## Backtesting

The current training pipeline now includes a simple time-based holdout backtest.

This means the model is not only fit on the full dataset. It also:

- reserves the last `BACKTEST_STEPS` observations as a holdout window
- retrains on data before each holdout point
- produces one-step-ahead forecasts
- reports error metrics for the main targets

The backtest report currently summarizes:

- `MAE`
- `RMSE`
- `MAPE`

for:

- `doeb_import_volume`
- `doeb_diesel_sales`

## Backend API

The backend exposes the model through FastAPI instead of leaving it inside the ML scripts.

Important endpoints:

- `GET /health`
- `GET /ready`
- `GET /api/v1/simulate/health`
- `GET /api/v1/simulate/metadata`
- `POST /api/v1/simulate`

The API supports:

- scenario simulation
- model health inspection
- metadata inspection
- mock fallback mode when the trained artifact is unavailable

## Frontend

The live competition-facing UI is the static dashboard in:

- `frontend/index.html`
- `frontend/script.js`
- `frontend/style.css`

It lets the user:

- change Brent shock percentage
- change forecast horizon
- run a simulation
- inspect baseline vs shocked paths
- inspect critical month and month-by-month output

There is also a Streamlit implementation in `frontend/app.py`, but the compose deployment path is currently centered on the static dashboard.

## How To Run

1. Make sure Docker Desktop is running.
2. Put the source CSV files into:
   - `ml_engine/data/raw/doeb_import.csv`
   - `ml_engine/data/raw/doeb_diesel.csv`
3. Copy `.env.example` to `.env`
4. Replace placeholder environment values with real local values as needed
5. Build the training data:

```bash
docker compose run --rm ml-trainer python ml_engine/01b_generate_mock_doeb_data.py
```

6. Train the model and generate the backtest report:

```bash
docker compose run --rm ml-trainer python ml_engine/02_train_var_model.py
```

7. Start the app:

```bash
docker compose up --build
```

8. Open:
   - Frontend: `http://localhost:8501`
   - Backend health: `http://localhost:8000/health`
   - Backend readiness: `http://localhost:8000/ready`
   - Simulation endpoint: `http://localhost:8000/api/v1/simulate`

## Current Strengths

- clear product story for Track A
- end-to-end repo from model to UI
- lag-aware simulation framing
- holdout backtest added to training
- API + dashboard integration
- Dockerized demo path
- mock fallback mode for demo resilience

## Current Limitations

- still a prototype, not a production forecasting platform
- current implementation is strongest on `EIA + DOEB`; `OWID + EPPO` are not fully integrated into the live path
- probabilistic modeling and anomaly detection are still roadmap items
- PostgreSQL is currently light in domain usage
- repository hygiene still needs cleanup before public release

## Notes

- `.env` should remain local and should not be committed.
- `.env.example` should contain placeholders only.
- If the trained model artifact is missing, the backend can fall back to a deterministic mock mode for UI and API testing.
- If the local DOEB files are missing during data generation, the pipeline can fall back to synthetic target generation for demo continuity. Be explicit about that during technical review.
