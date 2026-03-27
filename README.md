NEXUS Industrial Aero-Tech Command Center
========================================

A high-fidelity, real-time predictive maintenance dashboard for aero-engine fleets. The system utilizes XGBoost for Remaining Useful Life (RUL) prediction and provides a live, industrial-grade monitoring interface.

### Core Components
1. **Telemetry Simulator (`real_time_engine_telemetry.py`)**: 
   Generates live sensor data for 100 engines, runs XGBoost RUL predictions, and streams results to MongoDB.
2. **Backend API (`app.py`)**: 
   A Flask-based service (running on **Port 8001**) that synchronizes MongoDB data with the frontend.
3. **Frontend Dashboard (`index.html`)**: 
   A premium, "Mission Control" themed UI featuring real-time KPIs, Risk Alerts, and an AI-driven Maintenance Schedule.

### Quick Start
1. **Prepare Environment**:
   ```bash
   pip install -r requirements.txt
   ```
2. **Initialize Data Stream**:
   Set `MONGODB_URI` and run the simulator:
   ```bash
   python real_time_engine_telemetry.py
   ```
3. **Launch Dashboard**:
   Run the Flask server:
   ```bash
   python app.py
   ```
4. **Access System**:
   Navigate to **[http://localhost:8001](http://localhost:8001)** in your browser.

### Features
- **Real-Time Synchronization**: All dashboard elements update every 6 seconds without page reloads.
- **Unified Alerting**: 1:1 synchronization between the Risk KPI count and the Alerts Log.
- **Intelligent Maintenance**: Dynamic selection of engines for "Immediate Attention" based on peak risk factors.

