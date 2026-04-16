const API_URL = "http://localhost:8000/api/v1/simulate";

const shockRange = document.getElementById("shockRange");
const horizonRange = document.getElementById("horizonRange");
const shockValue = document.getElementById("shockValue");
const horizonValue = document.getElementById("horizonValue");
const runButton = document.getElementById("runButton");
const statusBanner = document.getElementById("statusBanner");
const modelMetaText = document.getElementById("modelMetaText");

const maxDropValue = document.getElementById("maxDropValue");
const maxDropSubtext = document.getElementById("maxDropSubtext");
const criticalMonthValue = document.getElementById("criticalMonthValue");
const criticalMonthSubtext = document.getElementById("criticalMonthSubtext");
const shockSeverityValue = document.getElementById("shockSeverityValue");
const shockSeveritySubtext = document.getElementById("shockSeveritySubtext");

const importChart = document.getElementById("importChart");
const dieselChart = document.getElementById("dieselChart");
const forecastTableBody = document.querySelector("#forecastTable tbody");
const HEALTH_URL = "http://localhost:8000/api/v1/simulate/health";

shockRange.addEventListener("input", () => {
  shockValue.textContent = `${shockRange.value}%`;
});

horizonRange.addEventListener("input", () => {
  horizonValue.textContent = horizonRange.value;
});

runButton.addEventListener("click", async () => {
  await runSimulation();
});

document.addEventListener("DOMContentLoaded", async () => {
  await loadModelHealth();
});

function setStatus(message, type = "info") {
  statusBanner.className = `status-banner ${type}`;
  statusBanner.textContent = message;
}

function formatNumber(value) {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatMonth(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function computeInsights(forecasts, shockPercentage) {
  const maxImportDrop = forecasts.reduce((lowest, row) => {
    return row.delta_doeb_import_volume < lowest.delta_doeb_import_volume ? row : lowest;
  }, forecasts[0]);

  const criticalDieselDrop = forecasts.reduce((lowest, row) => {
    return row.delta_doeb_diesel_sales < lowest.delta_doeb_diesel_sales ? row : lowest;
  }, forecasts[0]);

  maxDropValue.textContent = `${formatNumber(maxImportDrop.delta_doeb_import_volume)} ML`;
  maxDropSubtext.textContent = formatMonth(maxImportDrop.month);

  criticalMonthValue.textContent = formatMonth(criticalDieselDrop.month);
  criticalMonthSubtext.textContent = "Peak downstream stress";

  shockSeverityValue.textContent = `${shockPercentage}%`;
  shockSeveritySubtext.textContent = "Brent scenario applied";
}

function applyApiSummary(summary, shockPercentage) {
  if (!summary) {
    return;
  }

  maxDropValue.textContent = `${formatNumber(summary.max_drop_import_volume)} ML`;
  maxDropSubtext.textContent = summary.shock_transmission_method;

  criticalMonthValue.textContent = formatMonth(summary.critical_month);
  criticalMonthSubtext.textContent = `Lag ${summary.selected_lag_months} months`;

  shockSeverityValue.textContent = `${shockPercentage}%`;
  shockSeveritySubtext.textContent = "Scenario applied";
}

function renderImportChart(forecasts) {
  importChart.classList.remove("empty-state");
  const months = forecasts.map((row) => row.month);

  const traces = [
    {
      x: months,
      y: forecasts.map((row) => row.baseline_doeb_import_volume),
      mode: "lines+markers",
      name: "Baseline Import Volume",
      line: { color: "#0f766e", width: 4 },
      marker: { size: 8 },
    },
    {
      x: months,
      y: forecasts.map((row) => row.shocked_doeb_import_volume),
      mode: "lines+markers",
      name: "Shocked Import Volume",
      line: { color: "#d76634", width: 4 },
      marker: { size: 8 },
    },
  ];

  Plotly.newPlot(importChart, traces, baseLayout("Crude Oil Import Volume Forecast"), {
    responsive: true,
    displayModeBar: false,
  });
}

function renderDieselChart(forecasts) {
  dieselChart.classList.remove("empty-state");
  const months = forecasts.map((row) => row.month);

  const traces = [
    {
      x: months,
      y: forecasts.map((row) => row.baseline_doeb_diesel_sales),
      mode: "lines",
      name: "Baseline Diesel Sales",
      fill: "tozeroy",
      line: { color: "#2049c9", width: 4 },
      fillcolor: "rgba(32, 73, 201, 0.14)",
    },
    {
      x: months,
      y: forecasts.map((row) => row.shocked_doeb_diesel_sales),
      mode: "lines",
      name: "Shocked Diesel Sales",
      fill: "tozeroy",
      line: { color: "#9a6700", width: 4 },
      fillcolor: "rgba(154, 103, 0, 0.16)",
    },
  ];

  Plotly.newPlot(dieselChart, traces, baseLayout("Diesel Sales Response Forecast"), {
    responsive: true,
    displayModeBar: false,
  });
}

function baseLayout(title) {
  return {
    title: {
      text: title,
      font: { family: "Space Grotesk, sans-serif", size: 22, color: "#1f1a17" },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { l: 48, r: 20, t: 64, b: 50 },
    legend: {
      orientation: "h",
      y: 1.14,
      x: 0,
      font: { family: "IBM Plex Sans, sans-serif", size: 12, color: "#655749" },
    },
    xaxis: {
      tickfont: { family: "IBM Plex Sans, sans-serif", color: "#655749" },
      gridcolor: "rgba(55, 40, 29, 0.08)",
      zeroline: false,
    },
    yaxis: {
      tickfont: { family: "IBM Plex Sans, sans-serif", color: "#655749" },
      gridcolor: "rgba(55, 40, 29, 0.08)",
      zeroline: false,
    },
    font: { family: "IBM Plex Sans, sans-serif", color: "#1f1a17" },
  };
}

function renderTable(forecasts) {
  forecastTableBody.innerHTML = "";

  forecasts.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatMonth(row.month)}</td>
      <td>${formatNumber(row.baseline_doeb_import_volume)}</td>
      <td>${formatNumber(row.shocked_doeb_import_volume)}</td>
      <td class="${row.delta_doeb_import_volume < 0 ? "delta-negative" : "delta-positive"}">${formatNumber(row.delta_doeb_import_volume)}</td>
      <td>${formatNumber(row.baseline_doeb_diesel_sales)}</td>
      <td>${formatNumber(row.shocked_doeb_diesel_sales)}</td>
      <td class="${row.delta_doeb_diesel_sales < 0 ? "delta-negative" : "delta-positive"}">${formatNumber(row.delta_doeb_diesel_sales)}</td>
    `;
    forecastTableBody.appendChild(tr);
  });
}

async function loadModelHealth() {
  try {
    const response = await fetch(HEALTH_URL);
    if (!response.ok) {
      throw new Error("Health check failed.");
    }

    const health = await response.json();
    modelMetaText.textContent =
      `Lag ${health.selected_lag_months} months | ${health.leading_indicators.join(", ")} | ` +
      `${health.is_differenced ? "differenced" : "level"} VAR`;
    setStatus("Model is online and ready for simulation.", "success");
  } catch (error) {
    console.error(error);
    modelMetaText.textContent = "Backend model status unavailable";
    setStatus(
      "Backend is not reachable yet. Start FastAPI first, then refresh this page.",
      "error",
    );
  }
}

async function runSimulation() {
  const shockPercentage = Number(shockRange.value);
  const forecastMonths = Number(horizonRange.value);

  runButton.disabled = true;
  runButton.textContent = "Running...";
  setStatus("Running SHOCKWAVE scenario simulation...", "loading");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eia_price_shock_percentage: shockPercentage,
        forecast_months: forecastMonths,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Simulation request failed.");
    }

    const data = await response.json();
    const forecasts = data.forecasts || [];
    if (!forecasts.length) {
      throw new Error("API response did not contain forecast rows.");
    }

    if (data.summary) {
      applyApiSummary(data.summary, shockPercentage);
    } else {
      computeInsights(forecasts, shockPercentage);
    }
    renderImportChart(forecasts);
    renderDieselChart(forecasts);
    renderTable(forecasts);
    setStatus("Simulation complete. Scenario outputs updated successfully.", "success");
  } catch (error) {
    console.error(error);
    setStatus(
      "Unable to complete the simulation. Confirm that the FastAPI backend is running at http://localhost:8000.",
      "error",
    );
  } finally {
    runButton.disabled = false;
    runButton.textContent = "Run Simulation";
  }
}
