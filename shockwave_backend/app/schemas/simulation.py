from datetime import date

from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    eia_price_shock_percentage: float = Field(
        ...,
        ge=-100.0,
        le=100.0,
        description="Percentage shock applied to the EIA Brent price series.",
        examples=[10.0, -7.5],
    )
    forecast_months: int = Field(
        default=12,
        ge=1,
        le=36,
        description="Number of months to forecast after applying the shock.",
    )


class SimulationForecastPoint(BaseModel):
    month: date
    baseline_doeb_import_volume: float
    shocked_doeb_import_volume: float
    delta_doeb_import_volume: float
    baseline_doeb_diesel_sales: float
    shocked_doeb_diesel_sales: float
    delta_doeb_diesel_sales: float


class SimulationSummary(BaseModel):
    critical_month: date
    max_drop_import_volume: float
    max_drop_diesel_sales: float
    shock_transmission_method: str
    selected_lag_months: int


class ModelHealthResponse(BaseModel):
    status: str
    selected_lag_months: int
    leading_indicators: list[str]
    target_variables: list[str]
    is_differenced: bool
    mock_mode: bool


class ModelMetadataResponse(BaseModel):
    selected_lag_months: int
    shock_transmission_method: str
    leading_indicators: list[str]
    target_variables: list[str]
    granger_relationships: list[dict]
    lag_metadata: dict


class SimulationResponse(BaseModel):
    shock_percentage: float
    forecast_months: int
    leading_indicators: list[str]
    summary: SimulationSummary
    forecasts: list[SimulationForecastPoint]
