import os
import json
import pandas as pd
from flask import Flask, render_template, jsonify
from pymongo import MongoClient
import plotly
import plotly.graph_objs as go

app = Flask(__name__)

# Config
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGO_DB = os.getenv("MONGODB_DB", "engine_telemetry")
WARNING_THRESHOLD = float(os.getenv("WARNING_THRESHOLD", "0.5"))
HIGH_RISK_THRESHOLD = float(os.getenv("HIGH_RISK_THRESHOLD", "0.85"))

# Initialize MongoDB client once for reuse
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
coll = db["live_predictions"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/telemetry')
def api_telemetry():
    try:
        # 1. Fetch latest record for EVERY unique engine using a single aggregation
        pipeline = [
            {"$sort": {"engine_id": 1, "timestamp": -1}},
            {"$group": {
                "_id": "$engine_id",
                "latest_doc": {"$first": "$$ROOT"}
            }},
            {"$replaceRoot": {"newRoot": "$latest_doc"}},
            {"$sort": {"engine_id": 1}}
        ]
        
        latest_records = list(coll.aggregate(pipeline))

        if not latest_records:
            return jsonify({"status": "error", "message": "No data in MongoDB"})
            
        # Convert ObjectId and prepare DataFrame
        for rec in latest_records:
            if "_id" in rec:
                rec["_id"] = str(rec["_id"])

        df_latest = pd.DataFrame(latest_records)
        df_latest["failure_probability"] = df_latest["failure_probability"].fillna(0)
        df_latest_sorted = df_latest.sort_values(by="failure_probability", ascending=False)
        
        # Risk thresholds
        critical_count = len(df_latest[df_latest["failure_probability"] > HIGH_RISK_THRESHOLD])
        warning_count = len(df_latest[(df_latest["failure_probability"] > WARNING_THRESHOLD) & (df_latest["failure_probability"] <= HIGH_RISK_THRESHOLD)])
        
        # 2. Alerts (Sorted by risk, unique per engine)
        df_alerts = df_latest[df_latest["failure_probability"] > WARNING_THRESHOLD].sort_values("failure_probability", ascending=False)
        alerts = []
        for _, row in df_alerts.iterrows():
            lvl = "CRITICAL" if row["failure_probability"] > HIGH_RISK_THRESHOLD else "WARNING"
            ts = row.get("timestamp", 0)
            ts_str = pd.to_datetime(ts, unit='s', errors='ignore').strftime("%H:%M:%S")
            alerts.append(f"[{ts_str}] {lvl}: Engine E-{int(row['engine_id']):03d} high risk ({row['failure_probability']:.2f})")

        # 3. UI Components (Grid, Bars, Telemetry)
        # SPATIAL STABILITY: Grid always shows E-001 to E-012 in order
        # Force numeric for sorting
        df_latest["engine_id_num"] = pd.to_numeric(df_latest["engine_id"], errors='coerce')
        df_grid = df_latest.sort_values(by="engine_id_num").head(12)
        engine_grid = []
        for _, row in df_grid.iterrows():
            engine_grid.append({
                "id": f"E-{int(row['engine_id']):03d}",
                "rul": float(row.get('predicted_rul', 0)),
                "risk": float(row.get('failure_probability', 0))
            })
            
        # ATTENTION QUEUE: RUL Bars remain sorted by peak risk
        rul_bars = []
        for _, row in df_latest_sorted.head(8).iterrows():
            rul_bars.append({
                "id": f"E-{int(row['engine_id']):03d}",
                "rul": float(row.get('predicted_rul', 0)),
                "risk": float(row.get('failure_probability', 0))
            })

        telemetry_lines = {"timestamps": [], "s1": [], "s2": [], "s3": []}
        if not df_latest_sorted.empty:
            worst_id = int(df_latest_sorted.iloc[0]["engine_id"])
            h_cursor = coll.find({"engine_id": worst_id}).sort("timestamp", -1).limit(30)
            h_data = list(h_cursor)
            if h_data:
                h_data.reverse()
                for h in h_data:
                    ts_str = pd.to_datetime(h['timestamp'], unit='s', errors='ignore').strftime("%H:%M:%S")
                    telemetry_lines["timestamps"].append(ts_str)
                    f = h.get("features", {})
                    telemetry_lines["s1"].append(float(f.get("s1", 0)))
                    telemetry_lines["s2"].append(float(f.get("s2", 0)))
                    telemetry_lines["s3"].append(float(f.get("s3", 0)))

        # 4. Maintenance Logic (Unique engines)
        worst_engine_id = int(df_latest_sorted.iloc[0]["engine_id"]) if not df_latest_sorted.empty else None
        df_upcoming = df_latest[df_latest["engine_id"] != worst_engine_id] if worst_engine_id is not None else df_latest
        upcoming_tasks = []
        if not df_upcoming.empty:
            top_up = df_upcoming.nsmallest(2, 'predicted_rul')
            upcoming_tasks.append({"id": f"E-{int(top_up.iloc[0]['engine_id']):03d}", "task": "Structural Overhaul", "date": "2026-11-15"})
            if len(top_up) > 1:
                upcoming_tasks.append({"id": f"E-{int(top_up.iloc[1]['engine_id']):03d}", "task": "Sensor Re-Alignment", "date": "2026-11-20"})

        # Final Payload
        response = {
            "status": "success",
            "fleet": {
                "active_engines": len(df_latest),
                "critical_count": critical_count,
                "warning_count": warning_count,
                "total_risk_count": critical_count + warning_count,
                "mean_rul": float(df_latest["predicted_rul"].mean()) if not df_latest.empty else 0
            },
            "alerts": alerts,
            "engine_grid": engine_grid,
            "rul_bars": rul_bars,
            "telemetry_lines": telemetry_lines,
            "worst_engine": {
                "id": worst_engine_id if worst_engine_id is not None else 0,
                "risk": float(df_latest_sorted.iloc[0]["failure_probability"]) if not df_latest_sorted.empty else 0
            },
            "analytics_summary": {
                "avg_risk": float(df_latest["failure_probability"].mean()) if not df_latest.empty else 0,
                "health_score": float(100 * (1 - df_latest["failure_probability"].mean())) if not df_latest.empty else 100,
                "model_precision": 0.982,
                "drift_status": "NOMINAL"
            },
            "maintenance": {
                "immediate": {
                    "id": f"E-{worst_engine_id:03d}" if worst_engine_id is not None else "NONE",
                    "reason": "PEAK RISK PROBABILITY"
                },
                "upcoming": upcoming_tasks
            }
        }
        return jsonify(response)

    except Exception as e:
        import traceback
        return jsonify({"status": "error", "message": str(e), "trace": traceback.format_exc()})

@app.route('/api/maintenance_history')
def api_maintenance_history():
    try:
        # Fetch last 15 maintenance events
        m_coll = db["maintenance_log"]
        history = list(m_coll.find({}, {"_id": 0}).sort("timestamp", -1).limit(15))
        return jsonify({"status": "success", "history": history})
    except Exception as e:
        import traceback
        return jsonify({"status": "error", "message": str(e), "trace": traceback.format_exc()})

if __name__ == '__main__':
    # Cloud-ready port handling (Render/Heroku use $PORT)
    port = int(os.environ.get("PORT", 8001))
    app.run(debug=False, port=port, host="0.0.0.0")
