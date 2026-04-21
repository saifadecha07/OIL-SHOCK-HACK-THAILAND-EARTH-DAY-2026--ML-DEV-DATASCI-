from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from pathlib import Path

from app.api.endpoints.simulate import router as simulate_router
from app.core.config import settings
from app.db.session import AsyncSessionLocal


app = FastAPI(
    title=settings.project_name,
    debug=settings.debug,
)

frontend_dir = Path(__file__).resolve().parents[2] / "frontend"

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.safe_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/ready", tags=["health"])
async def readiness_check() -> dict[str, object]:
    database_status = "unconfigured"
    database_detail = "Database is disabled."
    overall_status = "ok"

    if settings.database_enabled and AsyncSessionLocal is not None:
        try:
            async with AsyncSessionLocal() as session:
                await session.execute(text("SELECT 1"))
            database_status = "ok"
            database_detail = "Database connection established."
        except Exception:
            database_status = "unavailable"
            database_detail = "Database connection unavailable."
            overall_status = "degraded"

    return {
        "status": overall_status,
        "database": {
            "status": database_status,
            "detail": database_detail,
        },
        "api_prefix": settings.api_v1_prefix,
        "mock_model_allowed": settings.allow_mock_model,
    }


app.include_router(simulate_router, prefix=settings.api_v1_prefix)

if frontend_dir.exists():
    assets_dir = frontend_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/", include_in_schema=False)
    async def dashboard_index() -> FileResponse:
        return FileResponse(frontend_dir / "index.html")

    @app.get("/script.js", include_in_schema=False)
    async def dashboard_script() -> FileResponse:
        return FileResponse(frontend_dir / "script.js")

    @app.get("/style.css", include_in_schema=False)
    async def dashboard_styles() -> FileResponse:
        return FileResponse(frontend_dir / "style.css")
