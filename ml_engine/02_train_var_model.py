from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from statsmodels.tsa.api import VAR
from statsmodels.tsa.stattools import adfuller, grangercausalitytests


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "shockwave_training_data.csv"
MODEL_PATH = BASE_DIR / "shockwave_var_model.pkl"

LEADING_INDICATORS = ["eia_brent_price", "eia_natural_gas_price"]
TARGET_VARIABLES = ["doeb_import_volume", "doeb_diesel_sales"]


def adf_pvalue(series: pd.Series) -> float:
    return adfuller(series.dropna(), autolag="AIC")[1]


def prepare_stationary_dataframe(df: pd.DataFrame) -> tuple[pd.DataFrame, bool, dict[str, float]]:
    pvalues = {column: adf_pvalue(df[column]) for column in df.columns}
    print("ADF p-values:", pvalues)

    needs_difference = any(pvalue > 0.05 for pvalue in pvalues.values())
    if not needs_difference:
        return df.copy(), False, pvalues

    stationary_df = df.diff().dropna()
    print("Applied first differencing because at least one series failed stationarity.")
    return stationary_df, True, pvalues


def run_pairwise_granger_tests(df: pd.DataFrame, max_lag: int = 6) -> pd.DataFrame:
    safe_max_lag = min(max_lag, max(1, len(df) // 5))
    all_rows: list[dict[str, Any]] = []

    for leading_indicator in LEADING_INDICATORS:
        for target_variable in TARGET_VARIABLES:
            test_input = df[[target_variable, leading_indicator]]
            results = grangercausalitytests(test_input, maxlag=safe_max_lag, verbose=False)

            for lag, test_result in results.items():
                all_rows.append(
                    {
                        "leading_indicator": leading_indicator,
                        "target_variable": target_variable,
                        "lag": lag,
                        "ssr_ftest_pvalue": test_result[0]["ssr_ftest"][1],
                        "lrtest_pvalue": test_result[0]["lrtest"][1],
                    }
                )

    summary_df = pd.DataFrame(all_rows)
    print("Granger causality summary:")
    print(summary_df.to_string(index=False))
    return summary_df


def train_var_model(df: pd.DataFrame) -> tuple[Any, int, dict[str, Any]]:
    model = VAR(df)
    max_var_lag = min(12, max(2, len(df) // 4))
    lag_selection = model.select_order(maxlags=max_var_lag)

    selected_lag = lag_selection.aic
    if selected_lag is None:
        selected_lag = lag_selection.bic
    if selected_lag is None:
        raise ValueError("Unable to determine VAR lag order from AIC/BIC.")

    selected_lag = max(1, int(selected_lag))
    print(f"Selected VAR lag order: {selected_lag}")

    fitted_model = model.fit(selected_lag)
    irf_periods = 24
    irf = fitted_model.irf(irf_periods)
    lag_metadata = {
        "selected_lag": selected_lag,
        "aic": lag_selection.aic,
        "bic": lag_selection.bic,
        "hqic": lag_selection.hqic,
        "fpe": lag_selection.fpe,
        "irf_periods": irf_periods,
    }
    print(fitted_model.summary())
    return fitted_model, selected_lag, {"lag_metadata": lag_metadata, "irf": irf}


def main() -> None:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Training data not found at {DATA_PATH}. Run 01b_generate_mock_doeb_data.py first."
        )

    raw_df = pd.read_csv(DATA_PATH, parse_dates=["Date"], index_col="Date").asfreq("MS")
    stationary_df, is_differenced, adf_summary = prepare_stationary_dataframe(raw_df)
    granger_summary = run_pairwise_granger_tests(stationary_df, max_lag=6)
    var_model, selected_lag, model_extras = train_var_model(stationary_df)

    leading_relationships = (
        granger_summary[granger_summary["ssr_ftest_pvalue"] < 0.05]
        .sort_values(["target_variable", "ssr_ftest_pvalue", "lag"])
        .to_dict(orient="records")
    )

    model_bundle = {
        "var_results": var_model,
        "selected_lag": selected_lag,
        "is_differenced": is_differenced,
        "train_columns": list(stationary_df.columns),
        "train_end": stationary_df.index.max(),
        "adf_summary": adf_summary,
        "granger_summary": granger_summary,
        "leading_relationships": leading_relationships,
        "lag_metadata": model_extras["lag_metadata"],
        "train_means": stationary_df.mean().to_dict(),
        "train_std": stationary_df.std(ddof=0).replace(0, 1.0).to_dict(),
        "model_status": "ready",
    }
    joblib.dump(model_bundle, MODEL_PATH)

    print(f"Saved VAR model bundle to {MODEL_PATH}")


if __name__ == "__main__":
    main()
