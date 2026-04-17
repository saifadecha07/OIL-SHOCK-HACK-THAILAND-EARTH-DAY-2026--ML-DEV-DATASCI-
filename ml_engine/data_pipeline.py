from __future__ import annotations

"""
Compatibility layer for older notebook and script imports.

The real implementation now lives in the structured ML workspace modules:
- ml_engine.data_sources
- ml_engine.feature_engineering
- ml_engine.validation
"""

from ml_engine.data_sources import (
    EIADataFetcher,
    build_global_signal_frame,
    build_modeling_frame,
    build_real_target_frame,
    load_owid_energy_dataset,
    load_timeseries_csv,
)
from ml_engine.feature_engineering import build_diagnostic_feature_frame
from ml_engine.validation import prepare_stationary_dataframe, run_pairwise_granger_tests

__all__ = [
    "EIADataFetcher",
    "build_global_signal_frame",
    "build_modeling_frame",
    "build_real_target_frame",
    "load_owid_energy_dataset",
    "load_timeseries_csv",
    "build_diagnostic_feature_frame",
    "prepare_stationary_dataframe",
    "run_pairwise_granger_tests",
]
