function resolveApiBaseUrl() {
  const configuredBase = document
    .querySelector('meta[name="shockwave-api-base"]')
    ?.getAttribute("content")
    ?.trim();

  if (configuredBase) return configuredBase.replace(/\/$/, "");

  const { protocol, hostname, origin, port } = window.location;
  if ((hostname === "localhost" || hostname === "127.0.0.1") && (port === "8501" || port === "")) {
    return `${protocol}//${hostname}:8000`;
  }
  return origin.replace(/\/$/, "");
}

const API_BASE_URL = resolveApiBaseUrl();
const API_URL    = `${API_BASE_URL}/api/v1/simulate`;
const HEALTH_URL = `${API_BASE_URL}/api/v1/simulate/health`;
const READY_URL  = `${API_BASE_URL}/ready`;

// ── Backtest data (train → Dec 2025, test → Jan–Mar 2026) ──
const BACKTEST_PREDICTIONS = [
  {
    month: "2026-01-01",
    actual_doeb_import_volume:    89.793,
    predicted_doeb_import_volume: 92.568,
    abs_error_doeb_import_volume:  2.775,
    actual_doeb_diesel_sales:     90.886,
    predicted_doeb_diesel_sales:  91.394,
    abs_error_doeb_diesel_sales:   0.508,
  },
  {
    month: "2026-02-01",
    actual_doeb_import_volume:    96.566,
    predicted_doeb_import_volume: 92.230,
    abs_error_doeb_import_volume:  4.336,
    actual_doeb_diesel_sales:     93.756,
    predicted_doeb_diesel_sales:  91.390,
    abs_error_doeb_diesel_sales:   2.366,
  },
  {
    month: "2026-03-01",
    actual_doeb_import_volume:    95.942,
    predicted_doeb_import_volume: 94.712,
    abs_error_doeb_import_volume:  1.230,
    actual_doeb_diesel_sales:     90.185,
    predicted_doeb_diesel_sales:  90.663,
    abs_error_doeb_diesel_sales:   0.478,
  },
];

// ── DOM refs ──
const shockRange    = document.getElementById("shockRange");
const horizonRange  = document.getElementById("horizonRange");
const shockValue    = document.getElementById("shockValue");
const horizonValue  = document.getElementById("horizonValue");
const runButton     = document.getElementById("runButton");
const statusBanner  = document.getElementById("statusBanner");
const modelMetaText = document.getElementById("modelMetaText");

const maxDropValue         = document.getElementById("maxDropValue");
const maxDropSubtext       = document.getElementById("maxDropSubtext");
const criticalMonthValue   = document.getElementById("criticalMonthValue");
const criticalMonthSubtext = document.getElementById("criticalMonthSubtext");
const shockSeverityValue   = document.getElementById("shockSeverityValue");
const shockSeveritySubtext = document.getElementById("shockSeveritySubtext");

const importChart       = document.getElementById("importChart");
const dieselChart       = document.getElementById("dieselChart");
const forecastTableBody = document.querySelector("#forecastTable tbody");

let activeSimulation = null;

shockRange.addEventListener("input",   () => { shockValue.textContent   = `${shockRange.value}%`; });
horizonRange.addEventListener("input", () => { horizonValue.textContent = horizonRange.value; });
runButton.addEventListener("click", () => { runSimulation(); });

// ── Tab switching ──
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.getElementById("simulatorView").style.display = tab === "simulator" ? "" : "none";
    document.getElementById("backtestView").style.display  = tab === "backtest"  ? "" : "none";
    if (tab === "backtest") renderBacktest();
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  await loadModelHealth();
});

// ── Utilities ──
function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
}

function setStatus(message, type = "info") {
  statusBanner.className = `status-banner ${type}`;
  statusBanner.textContent = message;
}

function formatNumber(value) {
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatMonth(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(date);
}

function renderChartEmptyState(frame, title, copy) {
  Plotly.purge(frame);
  frame.classList.add("empty-state");
  frame.innerHTML = `<div><div class="empty-title">${title}</div><div class="empty-copy">${copy}</div></div>`;
}

function resetSummaryCards() {
  maxDropValue.textContent         = "-";
  maxDropSubtext.textContent       = "Run a simulation";
  criticalMonthValue.textContent   = "-";
  criticalMonthSubtext.textContent = "Delayed stress window";
  shockSeverityValue.textContent   = "-";
  shockSeveritySubtext.textContent = "Awaiting scenario";
}

function applyApiSummary(summary, shockPercentage) {
  if (!summary) return;
  maxDropValue.textContent         = `${formatNumber(summary.max_drop_import_volume)} ML`;
  maxDropSubtext.textContent       = summary.shock_transmission_method;
  criticalMonthValue.textContent   = formatMonth(summary.critical_month);
  criticalMonthSubtext.textContent = `Lag ${summary.selected_lag_months} months`;
  shockSeverityValue.textContent   = `${shockPercentage}%`;
  shockSeveritySubtext.textContent = "Scenario applied";
}

function computeInsights(forecasts, shockPercentage) {
  const maxImportDrop    = forecasts.reduce((a, b) => b.delta_doeb_import_volume < a.delta_doeb_import_volume ? b : a);
  const criticalDiesel   = forecasts.reduce((a, b) => b.delta_doeb_diesel_sales  < a.delta_doeb_diesel_sales  ? b : a);
  maxDropValue.textContent         = `${formatNumber(maxImportDrop.delta_doeb_import_volume)} ML`;
  maxDropSubtext.textContent       = formatMonth(maxImportDrop.month);
  criticalMonthValue.textContent   = formatMonth(criticalDiesel.month);
  criticalMonthSubtext.textContent = "Peak downstream stress";
  shockSeverityValue.textContent   = `${shockPercentage}%`;
  shockSeveritySubtext.textContent = "Brent scenario applied";
}

// ── Shared chart layout ──
function baseLayout(title) {
  return {
    title: { text: title, font: { family: "Space Grotesk, sans-serif", size: 22, color: "#1f1a17" } },
    height: 380,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor:  "rgba(0,0,0,0)",
    margin: { l: 48, r: 20, t: 64, b: 50 },
    legend: { orientation: "h", y: 1.14, x: 0, font: { family: "IBM Plex Sans, sans-serif", size: 12, color: "#655749" } },
    xaxis: { tickfont: { family: "IBM Plex Sans, sans-serif", color: "#655749" }, gridcolor: "rgba(55,40,29,0.08)", zeroline: false },
    yaxis: { tickfont: { family: "IBM Plex Sans, sans-serif", color: "#655749" }, gridcolor: "rgba(55,40,29,0.08)", zeroline: false },
    font: { family: "IBM Plex Sans, sans-serif", color: "#1f1a17" },
  };
}

// ── Simulator charts ──
function renderImportChart(forecasts) {
  importChart.classList.remove("empty-state");
  importChart.innerHTML = "";
  const months = forecasts.map((r) => r.month);
  Plotly.newPlot(importChart, [
    { x: months, y: forecasts.map((r) => r.baseline_doeb_import_volume), mode: "lines+markers", name: "Baseline Import Volume", line: { color: "#0f766e", width: 4 }, marker: { size: 8 } },
    { x: months, y: forecasts.map((r) => r.shocked_doeb_import_volume),  mode: "lines+markers", name: "Shocked Import Volume",   line: { color: "#d76634", width: 4 }, marker: { size: 8 } },
  ], baseLayout("Crude Oil Import Volume Forecast"), { responsive: true, displayModeBar: false });
}

function renderDieselChart(forecasts) {
  dieselChart.classList.remove("empty-state");
  dieselChart.innerHTML = "";
  const months = forecasts.map((r) => r.month);
  Plotly.newPlot(dieselChart, [
    { x: months, y: forecasts.map((r) => r.baseline_doeb_diesel_sales), mode: "lines", name: "Baseline Diesel Sales", fill: "tozeroy", line: { color: "#2049c9", width: 4 }, fillcolor: "rgba(32,73,201,0.14)" },
    { x: months, y: forecasts.map((r) => r.shocked_doeb_diesel_sales),  mode: "lines", name: "Shocked Diesel Sales",   fill: "tozeroy", line: { color: "#9a6700", width: 4 }, fillcolor: "rgba(154,103,0,0.16)" },
  ], baseLayout("Diesel Sales Response Forecast"), { responsive: true, displayModeBar: false });
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

function resetDashboardState() {
  resetSummaryCards();
  renderChartEmptyState(importChart, "No simulation yet", "Import volume forecast will appear here.");
  renderChartEmptyState(dieselChart, "No simulation yet", "Diesel sales forecast will appear here.");
  forecastTableBody.innerHTML = `<tr><td colspan="7" class="table-empty">No scenario results yet.</td></tr>`;
}

// ── Backtest charts ──
let backtestRendered = false;

function renderBacktest() {
  if (backtestRendered) return;
  backtestRendered = true;

  const months     = BACKTEST_PREDICTIONS.map((r) => r.month);
  const plotConfig = { responsive: true, displayModeBar: false };
  const layout     = { ...baseLayout(""), height: 340, margin: { l: 48, r: 20, t: 40, b: 50 } };

  // Import chart — bar (actual) + dashed line (predicted)
  Plotly.newPlot(
    document.getElementById("backtestImportChart"),
    [
      { x: months, y: BACKTEST_PREDICTIONS.map((r) => r.actual_doeb_import_volume),    type: "bar",          name: "Actual (ค่าจริง)",    marker: { color: "rgba(15,118,110,0.75)" } },
      { x: months, y: BACKTEST_PREDICTIONS.map((r) => r.predicted_doeb_import_volume), mode: "lines+markers", name: "Predicted (โมเดลทาย)", line: { color: "#d76634", width: 3, dash: "dot" }, marker: { size: 10, symbol: "diamond" } },
    ],
    { ...layout, yaxis: { ...layout.yaxis, title: { text: "ล้านลิตร (ML)", font: { size: 12, color: "#655749" } } } },
    plotConfig,
  );

  // Diesel chart
  Plotly.newPlot(
    document.getElementById("backtestDieselChart"),
    [
      { x: months, y: BACKTEST_PREDICTIONS.map((r) => r.actual_doeb_diesel_sales),    type: "bar",          name: "Actual (ค่าจริง)",    marker: { color: "rgba(32,73,201,0.7)" } },
      { x: months, y: BACKTEST_PREDICTIONS.map((r) => r.predicted_doeb_diesel_sales), mode: "lines+markers", name: "Predicted (โมเดลทาย)", line: { color: "#9a6700", width: 3, dash: "dot" }, marker: { size: 10, symbol: "diamond" } },
    ],
    { ...layout, yaxis: { ...layout.yaxis, title: { text: "ล้านลิตร (ML)", font: { size: 12, color: "#655749" } } } },
    plotConfig,
  );

  // Table
  const tbody = document.getElementById("backtestTableBody");
  tbody.innerHTML = "";
  BACKTEST_PREDICTIONS.forEach((row) => {
    const importBad  = row.abs_error_doeb_import_volume > 3;
    const dieselBad  = row.abs_error_doeb_diesel_sales  > 2;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatMonth(row.month)}</td>
      <td>${formatNumber(row.actual_doeb_import_volume)}</td>
      <td>${formatNumber(row.predicted_doeb_import_volume)}</td>
      <td class="${importBad ? "delta-negative" : "delta-positive"}">${formatNumber(row.abs_error_doeb_import_volume)}</td>
      <td>${formatNumber(row.actual_doeb_diesel_sales)}</td>
      <td>${formatNumber(row.predicted_doeb_diesel_sales)}</td>
      <td class="${dieselBad ? "delta-negative" : "delta-positive"}">${formatNumber(row.abs_error_doeb_diesel_sales)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Health check ──
async function loadModelHealth() {
  try {
    const [readyRes, healthRes] = await Promise.all([
      fetchWithTimeout(READY_URL,  {}, 10000),
      fetchWithTimeout(HEALTH_URL, {}, 10000),
    ]);
    if (!readyRes.ok || !healthRes.ok) throw new Error("Health check failed.");

    const readiness = await readyRes.json();
    const health    = await healthRes.json();
    const isMock    = health.status === "mock_ready";

    modelMetaText.textContent =
      `Lag ${health.selected_lag_months} months | ${health.leading_indicators.join(", ")} | ` +
      `${isMock ? "mock simulator" : `${health.is_differenced ? "differenced" : "level"} VAR`}`;

    setStatus(
      isMock
        ? `Backend online — mock simulation mode. Database ${readiness.database.status}.`
        : "Model is online and ready for simulation.",
      "success",
    );
  } catch (error) {
    modelMetaText.textContent = "Backend model status unavailable";
    resetDashboardState();
    setStatus(
      error.name === "AbortError"
        ? "Backend connection timed out. Check the Railway service is running."
        : "Backend is not reachable. Start FastAPI first, then refresh this page.",
      "error",
    );
  }
}

// ── Run simulation ──
async function runSimulation() {
  if (activeSimulation) activeSimulation.abort();
  activeSimulation = new AbortController();
  const { signal } = activeSimulation;
  const timeout = setTimeout(() => activeSimulation.abort(), 30000);

  const shockPercentage = Number(shockRange.value);
  const forecastMonths  = Number(horizonRange.value);

  runButton.disabled    = true;
  runButton.textContent = "Running...";
  setStatus("Running SHOCKWAVE scenario simulation...", "loading");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eia_price_shock_percentage: shockPercentage, forecast_months: forecastMonths }),
      signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.json().catch(async () => ({ detail: await response.text() || "Simulation failed." }));
      throw new Error(err.detail || "Simulation request failed.");
    }

    const data      = await response.json();
    const forecasts = data.forecasts || [];
    if (!forecasts.length) throw new Error("API response did not contain forecast rows.");

    if (data.summary) applyApiSummary(data.summary, shockPercentage);
    else computeInsights(forecasts, shockPercentage);

    renderImportChart(forecasts);
    renderDieselChart(forecasts);
    renderTable(forecasts);
    setStatus("Simulation complete. Scenario outputs updated successfully.", "success");
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === "AbortError") {
      setStatus("Simulation timed out (30s). Check Railway backend connection.", "error");
      return;
    }
    console.error(error);
    resetDashboardState();
    setStatus(`Unable to complete the simulation. ${error.message}`, "error");
  } finally {
    runButton.disabled    = false;
    runButton.textContent = "Run Simulation";
    activeSimulation      = null;
  }
}

resetDashboardState();
