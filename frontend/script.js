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

// ── Crisis 2026 data (Jan 2024 – Mar 2026) ──
const CRISIS_HISTORY = [
  { month: "2024-01-01", brent: 80.12, import_vol: 90.49, diesel: 88.83 },
  { month: "2024-02-01", brent: 83.48, import_vol: 92.50, diesel: 92.87 },
  { month: "2024-03-01", brent: 85.41, import_vol: 91.36, diesel: 89.08 },
  { month: "2024-04-01", brent: 89.94, import_vol: 93.28, diesel: 87.16 },
  { month: "2024-05-01", brent: 81.75, import_vol: 91.88, diesel: 84.88 },
  { month: "2024-06-01", brent: 82.25, import_vol: 91.37, diesel: 84.95 },
  { month: "2024-07-01", brent: 85.15, import_vol: 91.76, diesel: 83.80 },
  { month: "2024-08-01", brent: 80.36, import_vol: 89.14, diesel: 85.10 },
  { month: "2024-09-01", brent: 74.02, import_vol: 84.78, diesel: 82.35 },
  { month: "2024-10-01", brent: 75.63, import_vol: 83.69, diesel: 83.94 },
  { month: "2024-11-01", brent: 74.35, import_vol: 87.04, diesel: 86.93 },
  { month: "2024-12-01", brent: 73.86, import_vol: 87.34, diesel: 90.64 },
  { month: "2025-01-01", brent: 79.27, import_vol: 90.17, diesel: 92.74 },
  { month: "2025-02-01", brent: 75.44, import_vol: 94.29, diesel: 90.54 },
  { month: "2025-03-01", brent: 72.73, import_vol: 96.36, diesel: 89.37 },
  { month: "2025-04-01", brent: 68.13, import_vol: 93.72, diesel: 86.93 },
  { month: "2025-05-01", brent: 64.45, import_vol: 88.89, diesel: 83.61 },
  { month: "2025-06-01", brent: 71.44, import_vol: 92.38, diesel: 85.33 },
  { month: "2025-07-01", brent: 71.04, import_vol: 91.56, diesel: 80.79 },
  { month: "2025-08-01", brent: 67.87, import_vol: 91.10, diesel: 83.85 },
  { month: "2025-09-01", brent: 67.99, import_vol: 90.41, diesel: 84.38 },
  { month: "2025-10-01", brent: 64.54, import_vol: 83.49, diesel: 82.06 },
  { month: "2025-11-01", brent: 63.80, import_vol: 87.50, diesel: 87.28 },
  { month: "2025-12-01", brent: 62.54, import_vol: 90.97, diesel: 89.41 },
  { month: "2026-01-01", brent: 66.60, import_vol: 89.79, diesel: 90.89 },
  { month: "2026-02-01", brent: 70.89, import_vol: 96.57, diesel: 93.76 },
  { month: "2026-03-01", brent: 103.13, import_vol: 95.94, diesel: 90.19 },
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
function switchTab(tabName) {
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tabName);
  });
  document.getElementById("simulatorView").style.display = tabName === "simulator" ? "" : "none";
  document.getElementById("backtestView").style.display  = tabName === "backtest"  ? "" : "none";
  document.getElementById("crisisView").style.display    = tabName === "crisis"    ? "" : "none";
  if (tabName === "backtest") renderBacktest();
  if (tabName === "crisis")   renderCrisis();
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

// CTA button — switch to simulator and pre-set shock to 45%
document.getElementById("crisisRunBtn").addEventListener("click", () => {
  shockRange.value = 45;
  shockValue.textContent = "45%";
  switchTab("simulator");
  runSimulation();
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

// ── Crisis 2026 charts ──
let crisisRendered = false;

function renderCrisis() {
  if (crisisRendered) return;
  crisisRendered = true;

  const months   = CRISIS_HISTORY.map((r) => r.month);
  const plotCfg  = { responsive: true, displayModeBar: false };
  const shockX   = "2026-03-01";

  const crisisShape = {
    type: "rect", xref: "x", yref: "paper",
    x0: "2026-02-15", x1: "2026-03-15",
    y0: 0, y1: 1,
    fillcolor: "rgba(215,102,52,0.12)",
    line: { width: 0 },
  };

  // Brent price chart
  Plotly.newPlot(
    document.getElementById("crisisBrentChart"),
    [{
      x: months,
      y: CRISIS_HISTORY.map((r) => r.brent),
      mode: "lines+markers",
      name: "Brent Price (USD/barrel)",
      line: { color: "#d76634", width: 3 },
      marker: { size: 6 },
    }],
    {
      ...baseLayout(""),
      height: 340,
      margin: { l: 48, r: 20, t: 40, b: 50 },
      shapes: [crisisShape],
      annotations: [{
        x: shockX, y: 103.13,
        text: "<b>SHOCK<br>+45%</b>",
        showarrow: true, arrowhead: 2, arrowcolor: "#d76634",
        ax: 40, ay: -40,
        font: { color: "#d76634", size: 13 },
        bgcolor: "rgba(255,248,238,0.9)",
        bordercolor: "#d76634", borderwidth: 1, borderpad: 4,
      }],
      yaxis: { ...baseLayout("").yaxis, title: { text: "USD / barrel", font: { size: 12, color: "#655749" } } },
    },
    plotCfg,
  );

  // Import + Diesel downstream chart
  Plotly.newPlot(
    document.getElementById("crisisDownstreamChart"),
    [
      {
        x: months,
        y: CRISIS_HISTORY.map((r) => r.import_vol),
        mode: "lines+markers",
        name: "Import Volume (ML)",
        line: { color: "#0f766e", width: 3 },
        marker: { size: 6 },
      },
      {
        x: months,
        y: CRISIS_HISTORY.map((r) => r.diesel),
        mode: "lines+markers",
        name: "Diesel Sales (ML)",
        line: { color: "#2049c9", width: 3, dash: "dot" },
        marker: { size: 6 },
      },
    ],
    {
      ...baseLayout(""),
      height: 340,
      margin: { l: 48, r: 20, t: 40, b: 50 },
      shapes: [crisisShape],
      annotations: [{
        x: shockX, y: 95.94,
        text: "<b>Shock เพิ่งเกิด<br>ผลกระทบยังไม่มา</b>",
        showarrow: true, arrowhead: 2, arrowcolor: "#655749",
        ax: 50, ay: -50,
        font: { color: "#655749", size: 12 },
        bgcolor: "rgba(255,248,238,0.9)",
        bordercolor: "#c8b89a", borderwidth: 1, borderpad: 4,
      }],
      yaxis: { ...baseLayout("").yaxis, title: { text: "ล้านลิตร (ML)", font: { size: 12, color: "#655749" } } },
      legend: { orientation: "h", y: 1.18, x: 0, font: { family: "IBM Plex Sans, sans-serif", size: 12, color: "#655749" } },
    },
    plotCfg,
  );
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
