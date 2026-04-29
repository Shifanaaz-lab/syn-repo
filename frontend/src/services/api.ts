const API_BASE_URL = 'http://localhost:8001';

export interface TelemetryData {
  engine_id: number;
  cycle: number;
  timestamp: number;
  sensors: number[];
  op_settings: number[];
  metadata?: Record<string, any>;
}

export interface PredictionResponse {
  engine_id: number;
  cycle: number;
  predicted_rul: number;
  failure_probability: number;
  confidence_interval: number[];
  timestamp: number;
}

export interface FleetStatus {
  active_engines: number;
  critical_count: number;
  warning_count: number;
  total_risk_count: number;
  mean_rul: number;
}

export interface EngineData {
  id: string;
  rul: number;
  risk: number;
}

export interface TelemetryLine {
  timestamps: string[];
  s1: number[];
  s2: number[];
  s3: number[];
}

export interface AnalyticsSummary {
  avg_risk: number;
  health_score: number;
  model_precision: number;
  drift_status: string;
}

export interface MaintenanceTask {
  id: string;
  task: string;
  date: string;
}

export interface MaintenanceData {
  immediate: {
    id: string;
    reason: string;
  };
  upcoming: MaintenanceTask[];
}

export interface DashboardResponse {
  status: string;
  fleet: FleetStatus;
  alerts: string[];
  engine_grid: EngineData[];
  rul_bars: EngineData[];
  telemetry_lines: TelemetryLine;
  worst_engine: {
    id: number;
    risk: number;
  };
  analytics_summary: AnalyticsSummary;
  maintenance: MaintenanceData;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get dashboard telemetry data
  async getDashboardData(): Promise<DashboardResponse> {
    return this.request<DashboardResponse>('/api/telemetry');
  }

  // Get maintenance history
  async getMaintenanceHistory(): Promise<{ status: string; history: any[] }> {
    return this.request<{ status: string; history: any[] }>('/api/maintenance_history');
  }

  // Predict RUL for a single engine
  async predictRUL(telemetry: TelemetryData): Promise<PredictionResponse> {
    return this.request<PredictionResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify(telemetry),
    });
  }

  // Get system metrics
  async getMetrics(): Promise<any> {
    return this.request<any>('/metrics');
  }

  // Get alerts
  async getAlerts(): Promise<{ alerts: any[]; count: number }> {
    return this.request<{ alerts: any[]; count: number }>('/alerts');
  }

  // Filter dashboard data by machine type
  async filterByMachineType(machineType: string): Promise<DashboardResponse> {
    return this.request<DashboardResponse>('/api/filter', {
      method: 'POST',
      body: JSON.stringify({ machine_type: machineType }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: number; version: string }> {
    return this.request<{ status: string; timestamp: number; version: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
