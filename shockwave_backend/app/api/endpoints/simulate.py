from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.simulation import (
    ModelHealthResponse,
    ModelMetadataResponse,
    SimulationRequest,
    SimulationResponse,
)
from app.services.ml_service import VARModelService, get_var_model_service


router = APIRouter(prefix="/simulate", tags=["simulation"])


@router.get("/health", response_model=ModelHealthResponse, status_code=status.HTTP_200_OK)
async def model_health(
    ml_service: VARModelService = Depends(get_var_model_service),
) -> ModelHealthResponse:
    return ModelHealthResponse(**ml_service.get_health_status())


@router.get("/metadata", response_model=ModelMetadataResponse, status_code=status.HTTP_200_OK)
async def model_metadata(
    ml_service: VARModelService = Depends(get_var_model_service),
) -> ModelMetadataResponse:
    return ModelMetadataResponse(**ml_service.get_model_metadata())


@router.post("", response_model=SimulationResponse, status_code=status.HTTP_200_OK)
async def simulate_shock(
    payload: SimulationRequest,
    ml_service: VARModelService = Depends(get_var_model_service),
) -> SimulationResponse:
    try:
        simulation_result = ml_service.simulate_shock(
            shock_percentage=payload.eia_price_shock_percentage,
            steps=payload.forecast_months,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc

    return SimulationResponse(
        shock_percentage=payload.eia_price_shock_percentage,
        forecast_months=payload.forecast_months,
        leading_indicators=simulation_result["leading_indicators"],
        summary=simulation_result["summary"],
        forecasts=simulation_result["forecasts"],
    )
