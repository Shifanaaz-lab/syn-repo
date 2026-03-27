# NEXUS Command Center: Operational Guide

This document provides the operational reference for the NEXUS Industrial Aero-Tech Command Center.

## System Architecture
- **Backend**: Flask engine on **Port 8001**.
- **Data Source**: MongoDB `live_predictions` collection (populated by `real_time_engine_telemetry.py`).
- **Frontend**: Vanilla JavaScript with Tailwind CSS / SOC Navy theme.

## High-Fidelity Features
### 1. Unified Risk Monitoring
The **Risk Alerts** KPI and the **Alerts Tab** are perfectly synchronized. Any engine with a `failure_probability` > 0.5 is logged as a WARNING, and > 0.85 as CRITICAL.

### 2. Intelligent Maintenance Schedule
- **Immediate Attention**: Dynamically selects the engine with the **highest absolute risk** at any given moment.
- **Upcoming Overhauls**: Proactively identifies engines with the **lowest Remaining Useful Life (RUL)** across the rest of the fleet.
- **Unique Selection**: Engines are filtered to ensure the "Immediate" engine does not duplicate in the "Upcoming" list, providing higher fleet visibility.

### 3. Fleet Health Distribution (Live)
Interactive Plotly charts show the distribution of RUL across the fleet, allowing operators to see broad health trends at a glance.

## Configuration
The system respects the following environment variables:
- `MONGODB_URI`: Connection string for the telemetry data.
- `WARNING_THRESHOLD`: Default `0.5`, determines when an engine turns yellow/warning.
- `HIGH_RISK_THRESHOLD`: Default `0.85`, determines when an engine turns red/critical.

## Getting Started
1. Start the MongoDB service.
2. Run `python real_time_engine_telemetry.py` to begin the data stream.
3. Run `python app.py` to start the command center API.
4. Access the UI at **[http://localhost:8001](http://localhost:8001)**.
