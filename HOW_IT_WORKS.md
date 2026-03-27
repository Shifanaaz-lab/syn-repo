# How the NEXUS Command Center Works

This document explains the **architecture**, **data flow**, and **logic** of the high-fidelity predictive maintenance system.

---

## 1. The Big Picture

```mermaid
graph TD
    A[Telemetry Simulator] -->|Cycles sensors + XGBoost| B[(MongoDB)]
    B -->|Latest Engine States| C[Flask Backend (Port 8001)]
    C -->|JSON API /api/telemetry| D[Vanilla JS Frontend]
    D -->|Real-Time DOM Updates| E[User View]
```

- **Simulator** (`real_time_engine_telemetry.py`): Simulates 100 engines. Every 3 seconds, it generates synthetic sensor data, engineering features, and running an XGBoost model to predict **Remaining Useful Life (RUL)**.
- **Backend API** (`app.py`): A high-performance Flask server running on **Port 8001** that fetches unique engine records from MongoDB and formats them for the dashboard.
- **Frontend** (`templates/index.html`): A "Mission Control" themed dashboard built with Vanilla JavaScript and Tailwind CSS, polling the backend every 6 seconds.

---

## 2. Telemetry and Feature Engineering

The simulator acts as the "Hardware Layer," generating synthetic degradation (sensor drift + noise) for a fleet of 100 aero-engines.

- **Features**: The model (XGBoost) requires engineered features (rolling means, standard deviations, lags, and trends). 
- **Health Heuristics**: 
    - **RUL**: Direct output of the trained XGBoost model.
    - **Failure Probability**: A heuristic derived from the engine's current cycle relative to its theoretical design life (Life Ratio).

---

## 3. High-Fidelity Logic Engines

### A. Dynamic Alert Synchronization
The **Risk Alerts KPI** and the **Alerts Log** in the "Alerts" tab are physical mirrors of each other.
- **Trigger**: Any engine with a `failure_probability` > 0.5 (WARNING) or > 0.85 (CRITICAL).
- **Sync**: The backend (`app.py`) generates a `total_risk_count` field which the frontend uses to ensure the KPI count always matches the number of rows in the log.

### B. Intelligent Maintenance Schedule
The "Maintenance Schedule" component uses a multi-tier selection algorithm:
1.  **Immediate Attention**: Locked to the engine with the **highest absolute failure probability** across the entire 100-engine fleet.
2.  **Upcoming Tasks**: Identifies the next two engines with the **lowest Remaining Useful Life (RUL)**.
3.  **Conflict Resolution**: The system filters out the "Immediate" engine from the "Upcoming" list to ensure you see varied, actionable data across the fleet.

---

## 4. Visual Execution (UI/UX)
- **SOC Command Center Palette**: Deep Navy, Black, and Cyan-glow. 
- **Micro-Animations**: Real-time ticker clocks (HH:MM:SS) beside risk bands indicate live connection health.
- **Isolated Syncing**: Each dashboard component (KPIs, Charts, Logs, Maintenance) is updated via isolated JS loops to prevent a single component error from crashing the entire system.

---

## 5. Summary Table

| Element | Logic Source | UI Indication |
|---------|--------------|---------------|
| **Risk Alerts KPI** | `df_latest[risk > 0.5]` | Synchronized with Alerts Tab |
| **Fleet RUL Dist** | Fleet-wide `predicted_rul` | Interactive Plotly Histogram |
| **Asset Grid** | Head(12) sorted by risk | Click-to-open Engine Reports |
| **Maintenance** | Top 1 (Risk) + Top 2 (RUL) | Unique Engine Targeting |
| **Telemetry Lines** | Last 30 cycles of "Worst Engine" | Real-time Sensor Trends |
