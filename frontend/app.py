from __future__ import annotations

from typing import Any

import pandas as pd
import plotly.express as px
import requests
import streamlit as st


API_URL = "http://localhost:8000/api/v1/simulate"
REQUEST_TIMEOUT = 60


st.set_page_config(
    page_title="SHOCKWAVE Dashboard",
    page_icon="S",
    layout="wide",
)


def inject_custom_css() -> None:
    st.markdown(
        """
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

            :root {
                --bg: #f3efe5;
                --surface: rgba(255, 252, 246, 0.78);
                --surface-strong: rgba(255, 248, 235, 0.94);
                --border: rgba(54, 44, 34, 0.12);
                --text: #1f1a16;
                --muted: #64574a;
                --accent: #c85c2f;
                --accent-dark: #8f3817;
                --teal: #0f766e;
                --gold: #a16207;
                --shadow: 0 20px 60px rgba(55, 38, 20, 0.12);
            }

            .stApp {
                background:
                    radial-gradient(circle at top left, rgba(200, 92, 47, 0.14), transparent 28%),
                    radial-gradient(circle at top right, rgba(15, 118, 110, 0.12), transparent 30%),
                    linear-gradient(180deg, #f6f0e5 0%, #efe6d8 100%);
                color: var(--text);
                font-family: "IBM Plex Sans", sans-serif;
            }

            .block-container {
                padding-top: 2rem;
                padding-bottom: 2rem;
                max-width: 1400px;
            }

            h1, h2, h3 {
                font-family: "Space Grotesk", sans-serif;
                color: var(--text);
                letter-spacing: -0.02em;
            }

            [data-testid="stSidebar"] {
                background:
                    linear-gradient(180deg, rgba(33, 28, 24, 0.98), rgba(24, 20, 18, 0.98));
                border-right: 1px solid rgba(255, 255, 255, 0.08);
            }

            [data-testid="stSidebar"] * {
                color: #f8f3ea;
                font-family: "IBM Plex Sans", sans-serif;
            }

            .hero-card {
                background: linear-gradient(135deg, rgba(255,248,236,0.92), rgba(249,238,218,0.85));
                border: 1px solid var(--border);
                border-radius: 28px;
                padding: 2rem 2.2rem;
                box-shadow: var(--shadow);
                overflow: hidden;
                position: relative;
                margin-bottom: 1.25rem;
            }

            .hero-card::after {
                content: "";
                position: absolute;
                right: -60px;
                top: -80px;
                width: 240px;
                height: 240px;
                background: radial-gradient(circle, rgba(200, 92, 47, 0.18), transparent 70%);
            }

            .eyebrow {
                display: inline-block;
                padding: 0.4rem 0.75rem;
                border-radius: 999px;
                background: rgba(200, 92, 47, 0.12);
                color: var(--accent-dark);
                font-size: 0.85rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                margin-bottom: 0.9rem;
            }

            .hero-title {
                font-size: 3rem;
                line-height: 0.95;
                margin: 0;
                font-weight: 700;
            }

            .hero-subtitle {
                color: var(--muted);
                font-size: 1.05rem;
                max-width: 850px;
                margin-top: 1rem;
                margin-bottom: 0;
            }

            .info-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                gap: 1rem;
                margin-top: 1.35rem;
            }

            .info-tile {
                background: rgba(255,255,255,0.56);
                border: 1px solid rgba(54, 44, 34, 0.08);
                border-radius: 20px;
                padding: 1rem 1.1rem;
                backdrop-filter: blur(10px);
            }

            .info-label {
                color: var(--muted);
                font-size: 0.78rem;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                font-weight: 700;
                margin-bottom: 0.45rem;
            }

            .info-value {
                font-family: "Space Grotesk", sans-serif;
                font-size: 1.2rem;
                font-weight: 700;
                color: var(--text);
            }

            .panel-card {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 24px;
                padding: 1.15rem 1.25rem;
                box-shadow: var(--shadow);
            }

            .section-title {
                font-size: 1.15rem;
                font-weight: 700;
                margin-bottom: 0.25rem;
            }

            .section-copy {
                color: var(--muted);
                font-size: 0.96rem;
                margin-bottom: 0;
            }

            .stButton > button {
                width: 100%;
                border: none;
                border-radius: 16px;
                background: linear-gradient(135deg, #d06c3c, #8f3817);
                color: #fffaf5;
                padding: 0.9rem 1rem;
                font-weight: 700;
                font-size: 1rem;
                box-shadow: 0 16px 32px rgba(143, 56, 23, 0.28);
            }

            .stMetric {
                background: var(--surface-strong);
                border: 1px solid var(--border);
                border-radius: 22px;
                padding: 0.75rem 0.9rem;
                box-shadow: var(--shadow);
            }

            .stDataFrame, .stPlotlyChart {
                background: transparent;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )


def render_header() -> None:
    st.markdown(
        """
        <section class="hero-card">
            <div class="eyebrow">SHOCKWAVE | AI-Driven Early Warning System</div>
            <h1 class="hero-title">Oil Shock Scenario Simulator</h1>
            <p class="hero-subtitle">
                This dashboard turns macro energy shocks into an operational early-warning signal.
                The core model encodes a <strong>Hidden Lag Time</strong>: Brent price spikes do not
                hit Thai downstream indicators immediately. Instead, the stress propagates through
                imports and diesel demand with a delayed impact window, helping teams act before
                the disruption becomes visible in the field.
            </p>
            <div class="info-grid">
                <div class="info-tile">
                    <div class="info-label">Signal Type</div>
                    <div class="info-value">Brent Price Shock -> DOEB Response</div>
                </div>
                <div class="info-tile">
                    <div class="info-label">Model Logic</div>
                    <div class="info-value">Lag-aware multivariate VAR simulation</div>
                </div>
                <div class="info-tile">
                    <div class="info-label">Pitch Angle</div>
                    <div class="info-value">Detect risk before market stress hits operations</div>
                </div>
            </div>
        </section>
        """,
        unsafe_allow_html=True,
    )


def render_sidebar() -> tuple[int, int, bool]:
    with st.sidebar:
        st.markdown("## What-If Simulator")
        st.markdown(
            "Stress-test the energy system by applying an upstream Brent shock and projecting the "
            "downstream lagged response."
        )

        shock_percentage = st.slider(
            "EIA Brent Price Shock (%)",
            min_value=0,
            max_value=100,
            value=20,
            step=1,
            help="Percentage increase applied to the latest EIA Brent reference value.",
        )
        forecast_months = st.slider(
            "Forecast Horizon (Months)",
            min_value=6,
            max_value=24,
            value=12,
            step=1,
            help="Number of future months to project after the simulated shock.",
        )

        st.markdown("---")
        st.markdown(
            """
            <div class="panel-card">
                <div class="section-title">How to Read This</div>
                <p class="section-copy">
                    Run the scenario, compare baseline vs shocked trajectories, then focus on the
                    first month where the downstream drop becomes meaningfully visible.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )
        st.markdown("")
        run_simulation = st.button("Run Simulation", type="primary")

    return shock_percentage, forecast_months, run_simulation


def call_simulation_api(shock_percentage: int, forecast_months: int) -> dict[str, Any]:
    payload = {
        "eia_price_shock_percentage": float(shock_percentage),
        "forecast_months": int(forecast_months),
    }

    response = requests.post(API_URL, json=payload, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    return response.json()


def parse_forecast_payload(api_response: dict[str, Any]) -> pd.DataFrame:
    forecasts = api_response.get("forecasts", [])
    if not forecasts:
        raise ValueError("API response does not contain any forecast rows.")

    df = pd.DataFrame(forecasts)
    df["month"] = pd.to_datetime(df["month"])
    return df.sort_values("month").reset_index(drop=True)


def compute_insights(forecast_df: pd.DataFrame, shock_percentage: int) -> dict[str, str]:
    max_drop_idx = forecast_df["delta_doeb_import_volume"].idxmin()
    critical_idx = forecast_df["delta_doeb_diesel_sales"].idxmin()

    max_drop_value = float(forecast_df.loc[max_drop_idx, "delta_doeb_import_volume"])
    max_drop_month = pd.to_datetime(forecast_df.loc[max_drop_idx, "month"])
    critical_month = pd.to_datetime(forecast_df.loc[critical_idx, "month"])

    return {
        "max_drop_value": f"{max_drop_value:.2f} ML",
        "max_drop_delta": max_drop_month.strftime("%b %Y"),
        "critical_month_value": critical_month.strftime("%b %Y"),
        "critical_month_delta": "Peak downstream stress",
        "shock_severity_value": f"{shock_percentage:.0f}%",
        "shock_severity_delta": "Brent scenario applied",
    }


def build_import_chart(forecast_df: pd.DataFrame) -> Any:
    plot_df = forecast_df.melt(
        id_vars="month",
        value_vars=["baseline_doeb_import_volume", "shocked_doeb_import_volume"],
        var_name="scenario",
        value_name="volume_ml",
    )
    plot_df["scenario"] = plot_df["scenario"].map(
        {
            "baseline_doeb_import_volume": "Baseline Import Volume",
            "shocked_doeb_import_volume": "Shocked Import Volume",
        }
    )

    fig = px.line(
        plot_df,
        x="month",
        y="volume_ml",
        color="scenario",
        markers=True,
        color_discrete_map={
            "Baseline Import Volume": "#0f766e",
            "Shocked Import Volume": "#c85c2f",
        },
        title="Crude Oil Import Volume Forecast",
    )
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        legend_title_text="Scenario",
        margin=dict(l=16, r=16, t=56, b=16),
        font=dict(family="IBM Plex Sans", color="#1f1a16"),
        title_font=dict(family="Space Grotesk", size=22),
    )
    fig.update_traces(line=dict(width=4))
    return fig


def build_diesel_chart(forecast_df: pd.DataFrame) -> Any:
    plot_df = forecast_df.melt(
        id_vars="month",
        value_vars=["baseline_doeb_diesel_sales", "shocked_doeb_diesel_sales"],
        var_name="scenario",
        value_name="volume_ml",
    )
    plot_df["scenario"] = plot_df["scenario"].map(
        {
            "baseline_doeb_diesel_sales": "Baseline Diesel Sales",
            "shocked_doeb_diesel_sales": "Shocked Diesel Sales",
        }
    )

    fig = px.area(
        plot_df,
        x="month",
        y="volume_ml",
        color="scenario",
        line_group="scenario",
        color_discrete_map={
            "Baseline Diesel Sales": "#1d4ed8",
            "Shocked Diesel Sales": "#a16207",
        },
        title="Diesel Sales Response Forecast",
    )
    fig.update_layout(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        legend_title_text="Scenario",
        margin=dict(l=16, r=16, t=56, b=16),
        font=dict(family="IBM Plex Sans", color="#1f1a16"),
        title_font=dict(family="Space Grotesk", size=22),
    )
    return fig


def render_insight_metrics(forecast_df: pd.DataFrame, shock_percentage: int) -> None:
    insights = compute_insights(forecast_df, shock_percentage)
    col1, col2, col3 = st.columns(3)

    col1.metric(
        "Max Drop in Import Volume",
        insights["max_drop_value"],
        insights["max_drop_delta"],
    )
    col2.metric(
        "Critical Month (Lag Time)",
        insights["critical_month_value"],
        insights["critical_month_delta"],
    )
    col3.metric(
        "Shock Severity",
        insights["shock_severity_value"],
        insights["shock_severity_delta"],
    )


def render_results(forecast_df: pd.DataFrame, shock_percentage: int) -> None:
    render_insight_metrics(forecast_df, shock_percentage)
    st.markdown("")

    chart_col1, chart_col2 = st.columns([1.1, 1.1], gap="large")
    with chart_col1:
        st.plotly_chart(build_import_chart(forecast_df), use_container_width=True)
    with chart_col2:
        st.plotly_chart(build_diesel_chart(forecast_df), use_container_width=True)

    st.markdown("")
    st.markdown(
        """
        <div class="panel-card">
            <div class="section-title">Forecast Table</div>
            <p class="section-copy">
                Use this table for the final pitch narrative, policy interpretation, and validation
                of the lagged shock effect month by month.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.dataframe(
        forecast_df,
        use_container_width=True,
        hide_index=True,
    )


def render_empty_state() -> None:
    st.markdown(
        """
        <div class="panel-card">
            <div class="section-title">Ready for Scenario Analysis</div>
            <p class="section-copy">
                Configure a Brent shock from the sidebar, then run the simulation to see how the
                delayed impact propagates into crude import volume and diesel sales over time.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )


def main() -> None:
    inject_custom_css()
    render_header()

    shock_percentage, forecast_months, run_simulation = render_sidebar()

    if run_simulation:
        try:
            with st.spinner("Running SHOCKWAVE scenario simulation..."):
                api_response = call_simulation_api(shock_percentage, forecast_months)
                forecast_df = parse_forecast_payload(api_response)
            render_results(forecast_df, shock_percentage)
        except requests.exceptions.ConnectionError:
            st.error(
                "Unable to connect to the FastAPI backend. Start the API server at "
                "`http://localhost:8000` and try again."
            )
        except requests.exceptions.Timeout:
            st.error("The simulation request timed out. Check the backend service and retry.")
        except requests.exceptions.HTTPError as exc:
            detail = exc.response.text if exc.response is not None else str(exc)
            st.error(f"Backend returned an error: {detail}")
        except ValueError as exc:
            st.error(str(exc))
    else:
        render_empty_state()


if __name__ == "__main__":
    main()
