import os
import json
import pandas as pd
import numpy as np
from flask import Flask, jsonify
from flask_cors import CORS
import time
import random

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"])

# Config
WARNING_THRESHOLD = 0.5
HIGH_RISK_THRESHOLD = 0.85

def generate_mock_telemetry_data():
    """Generate mock telemetry data when MongoDB is not available"""
    np.random.seed(int(time.time()) % 1000)
    
    # Generate mock engine data
    engines = []
    for i in range(1, 13):  # 12 engines
        risk = np.random.beta(2, 5)  # Beta distribution for realistic risk values
        rul = max(10, int(300 * (1 - risk) + np.random.normal(0, 20)))
        
        engines.append({
            "engine_id": i,
            "predicted_rul": rul,
            "failure_probability": risk,
            "timestamp": time.time() - random.randint(0, 3600)
        })
    
    df = pd.DataFrame(engines)
    df_sorted = df.sort_values("failure_probability", ascending=False)
    
    # Risk counts
    critical_count = len(df[df["failure_probability"] > HIGH_RISK_THRESHOLD])
    warning_count = len(df[(df["failure_probability"] > WARNING_THRESHOLD) & (df["failure_probability"] <= HIGH_RISK_THRESHOLD)])
    
    # Generate alerts
    alerts = []
    for _, row in df[df["failure_probability"] > WARNING_THRESHOLD].head(5).iterrows():
        level = "CRITICAL" if row["failure_probability"] > HIGH_RISK_THRESHOLD else "WARNING"
        time_str = time.strftime("%H:%M:%S", time.localtime(row["timestamp"]))
        alerts.append(f"[{time_str}] {level}: Engine E-{int(row['engine_id']):03d} high risk ({row['failure_probability']:.2f})")
    
    # Engine grid (E-001 to E-012)
    engine_grid = []
    for _, row in df.sort_values("engine_id").iterrows():
        engine_grid.append({
            "id": f"E-{int(row['engine_id']):03d}",
            "rul": float(row['predicted_rul']),
            "risk": float(row['failure_probability'])
        })
    
    # RUL bars (top 8 by risk)
    rul_bars = []
    for _, row in df_sorted.head(8).iterrows():
        rul_bars.append({
            "id": f"E-{int(row['engine_id']):03d}",
            "rul": float(row['predicted_rul']),
            "risk": float(row['failure_probability'])
        })
    
    # Telemetry lines for worst engine
    telemetry_lines = {"timestamps": [], "s1": [], "s2": [], "s3": []}
    if not df_sorted.empty:
        worst_engine_id = int(df_sorted.iloc[0]["engine_id"])
        
        # Generate mock time series data
        for i in range(30):
            timestamp = time.strftime("%H:%M:%S", time.localtime(time.time() - (30-i) * 60))
            telemetry_lines["timestamps"].append(timestamp)
            telemetry_lines["s1"].append(60 + 20 * np.sin(i * 0.2) + np.random.normal(0, 5))
            telemetry_lines["s2"].append(50 + 15 * np.cos(i * 0.15) + np.random.normal(0, 3))
            telemetry_lines["s3"].append(40 + 25 * np.sin(i * 0.3) + np.random.normal(0, 4))
    
    # Worst engine
    worst_engine_id = int(df_sorted.iloc[0]["engine_id"]) if not df_sorted.empty else 0
    worst_engine_risk = float(df_sorted.iloc[0]["failure_probability"]) if not df_sorted.empty else 0
    
    # Maintenance
    upcoming_tasks = [
        {"id": f"E-{(worst_engine_id % 12 + 1):03d}", "task": "Structural Overhaul", "date": "2026-11-15"},
        {"id": f"E-{((worst_engine_id + 1) % 12 + 1):03d}", "task": "Sensor Re-Alignment", "date": "2026-11-20"}
    ]
    
    response = {
        "status": "success",
        "fleet": {
            "active_engines": len(df),
            "critical_count": critical_count,
            "warning_count": warning_count,
            "total_risk_count": critical_count + warning_count,
            "mean_rul": float(df["predicted_rul"].mean())
        },
        "alerts": alerts,
        "engine_grid": engine_grid,
        "rul_bars": rul_bars,
        "telemetry_lines": telemetry_lines,
        "worst_engine": {
            "id": worst_engine_id,
            "risk": worst_engine_risk
        },
        "analytics_summary": {
            "avg_risk": float(df["failure_probability"].mean()),
            "health_score": float(100 * (1 - df["failure_probability"].mean())),
            "model_precision": 0.982,
            "drift_status": "NOMINAL"
        },
        "maintenance": {
            "immediate": {
                "id": f"E-{worst_engine_id:03d}" if worst_engine_id != 0 else "NONE",
                "reason": "PEAK RISK PROBABILITY"
            },
            "upcoming": upcoming_tasks
        }
    }
    
    return response

@app.route('/api/telemetry')
def api_telemetry():
    """Return mock telemetry data"""
    try:
        data = generate_mock_telemetry_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": str(e),
            "trace": str(e)
        })

@app.route('/api/maintenance_history')
def api_maintenance_history():
    """Return mock maintenance history"""
    try:
        history = [
            {"engine_id": "E-001", "task": "Bearing replacement", "date": "2026-04-20", "status": "completed"},
            {"engine_id": "E-023", "task": "Oil change", "date": "2026-04-19", "status": "completed"},
            {"engine_id": "E-037", "task": "Vibration sensor calibration", "date": "2026-04-18", "status": "completed"},
        ]
        return jsonify({"status": "success", "history": history})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0"
    })

if __name__ == '__main__':
    print("🚀 Starting Mock Backend Server...")
    print("📊 API will be available at: http://localhost:8001")
    print("🔧 Using mock data (no MongoDB required)")
    port = int(os.environ.get("PORT", 8001))
    app.run(debug=True, port=port, host="0.0.0.0")
