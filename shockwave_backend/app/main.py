from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.endpoints.simulate import router as simulate_router
from app.core.config import settings
from app.db.session import AsyncSessionLocal


app = FastAPI(
    title=settings.project_name,
    debug=settings.debug,
)

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
    database_detail = "Database check skipped."

    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        database_status = "ok"
        database_detail = "Database connection established."
    except Exception:
        database_status = "unavailable"
        database_detail = "Database connection unavailable."

    return {
        "status": "ok" if database_status == "ok" else "degraded",
        "database": {
            "status": database_status,
            "detail": database_detail,
        },
        "api_prefix": settings.api_v1_prefix,
        "mock_model_allowed": settings.allow_mock_model,
    }


app.include_router(simulate_router, prefix=settings.api_v1_prefix)
