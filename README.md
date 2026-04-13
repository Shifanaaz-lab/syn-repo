# 🚀 NEXUS Industrial Aero-Tech Command Center

> ⚡ A high-fidelity, real-time predictive maintenance system for aero-engine fleets
> powered by machine learning, live telemetry simulation, and a cyberpunk-inspired monitoring interface.

---

## 🧠 Overview

The **NEXUS - AI-Powered Real-Time Predictive Maintenance System for Industrial Equipment** is a professional-grade predictive maintenance platform optimized for **High-Fidelity Human-Computer Interaction (HCI)**. It is designed to:

* 📡 **10Hz Real-Time Streaming**: High-fidelity data sync every **100ms (0.1s)** for sub-second telemetry ingestion and UI updates.
* 🧠 **Spatial Stability**: A "fixed-parking-spot" status grid that prevents visual skipping even during rapid 10Hz updates.
* 🚨 **High-Fidelity Signaling**: Rhythmic alert pulsing for critical assets, synchronized at the millisecond-level with the AI risk engine.
* ☁️ **Cloud Scale**: Fully ready for deployment to **Render.com** with **MongoDB Atlas** for 24/7 global access.

This system mimics **industrial-grade monitoring environments**, enabling intelligent decision-making for maintenance operations.

---

## 🏗️ System Architecture

```text
Telemetry Simulation (10Hz)
        ↓
Feature Engineering (Rolling Windows)
        ↓
XGBoost RUL Predictor
        ↓
MongoDB Atlas (Cloud Data Sink)
        ↓
Flask Industrial API
        ↓
HCI-Optimized Command Dashboard
```

---

## ⚙️ Core Components

### 📡 Telemetry Simulator

**`real_time_engine_telemetry.py`**

* Simulates 100 engines in real-time
* Generates multi-sensor data streams
* Runs live RUL predictions
* Streams results to MongoDB

---

### 🧠 Backend API

**`app.py` (Flask – Port 8001)**

* Acts as middleware between database and UI
* Serves real-time engine data
* Handles synchronization and updates

---

### 🎨 Frontend Dashboard

**`index.html`**

* Cyberpunk / Mission Control themed interface
* Live KPIs and health indicators
* Risk Alerts panel
* AI-driven maintenance recommendations

---

## ✨ Key Features

### ⚡ Real-Time Monitoring

* **10Hz Synchronization**: Sub-second polling (100ms) for critical assets.
* **Spatially Stable Grid**: Engines remain fixed in position, allowing operators to "muscle-remember" asset locations.
* **Pulse Signaling**: Visual "breathing" alerts for engines with >0.85 failure probability.

---

### 🚨 Intelligent Alert System

* Dynamic risk detection
* Unified KPI + alert log synchronization

---

### 🛠️ AI-Driven Maintenance Planning

* Identifies engines requiring immediate attention
* Prioritizes based on degradation trends

---

### 📊 Predictive Analytics

* XGBoost-based RUL prediction
* Handles degradation patterns effectively

---

## 🛠️ Tech Stack

* **Python**
* **XGBoost**
* **Flask**
* **MongoDB**
* **HTML / CSS / JS**
* **Plotly / Visualization Libraries**

---

## ▶️ Quick Start

### 1️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 2️⃣ Start Telemetry Simulation

```bash
python real_time_engine_telemetry.py
```

> ⚠️ Ensure `MONGODB_URI` is configured

---

### 3️⃣ Launch Backend Server

```bash
python app.py
```

---

### 4️⃣ Open Dashboard

👉 http://localhost:8001

---

## 📊 System Capabilities

* Monitor fleet-wide engine health
* Predict failures before occurrence
* Reduce downtime through proactive maintenance
* Visualize degradation patterns in real-time

---

## 🔮 Future Enhancements

* ⚡ Deep Learning models (LSTM / Transformers)
* ☁️ Cloud deployment (AWS / GCP)
* 📡 Real-time streaming (Kafka / MQTT)
* 🗄️ Historical analytics dashboard

---

## 👨‍💻 Author

**Shifanaaz Abdulsab Nadaf**
AI/ML Engineer | Predictive Systems Enthusiast

---

## ⭐ Final Note

NEXUS is not just a dashboard —
it is a **real-time intelligent monitoring system** designed to bring predictive maintenance closer to production-grade environments.
