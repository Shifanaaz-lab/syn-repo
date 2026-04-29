import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Bell,
  Database,
  Radio,
  TrendingUp,
  BarChart3,
  Settings,
  Home,
  Zap,
  Shield,
  Wifi,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  Calendar,
  ChevronDown,
  X,
  Search,
  Clock,
  TrendingDown,
  Maximize2,
  RefreshCw,
  Wrench,
  AlertOctagon,
  CircleDot,
  PieChart,
  Layout,
  Server,
  Thermometer,
  Gauge,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart as RPieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import apiService, { DashboardResponse, EngineData } from "../../services/api";

const COLORS = ['#ef4444', '#f97316', '#22c55e', '#3b82f6'];

export function IntegratedDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<any>(null);
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(fetchDashboardData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "engines", icon: Radio, label: "Engines" },
    { id: "insights", icon: Zap, label: "AI Insights" },
    { id: "alerts", icon: Bell, label: "Alerts" },
    { id: "maintenance", icon: Wrench, label: "Maintenance" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
  ];

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGeneratingReport(false);
    setShowReportModal(false);
    alert("Report generated successfully! Download started.");
  };

  const formatTelemetryData = () => {
    if (!dashboardData?.telemetry_lines.timestamps) return [];
    
    return dashboardData.telemetry_lines.timestamps.map((timestamp, index) => ({
      time: timestamp,
      temperature: dashboardData.telemetry_lines.s1[index] || 0,
      pressure: dashboardData.telemetry_lines.s2[index] || 0,
      vibration: dashboardData.telemetry_lines.s3[index] || 0,
    }));
  };

  const formatRulBars = () => {
    if (!dashboardData?.rul_bars) return [];
    
    return dashboardData.rul_bars.map(engine => ({
      id: engine.id,
      rul: engine.rul,
      risk: engine.risk * 100, // Convert to percentage
      health: Math.max(0, 100 - (engine.risk * 100))
    }));
  };

  const getEngineStatusColor = (risk: number) => {
    if (risk > 0.85) return 'text-red-500';
    if (risk > 0.5) return 'text-orange-500';
    return 'text-green-500';
  };

  const getEngineStatusBg = (risk: number) => {
    if (risk > 0.85) return 'bg-red-500/20 border-red-500/30';
    if (risk > 0.5) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-green-500/20 border-green-500/30';
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error loading dashboard</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const telemetryData = formatTelemetryData();
  const rulBarsData = formatRulBars();

  return (
    <div className="min-h-screen bg-[#05080f] text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">FLEET COMMAND CENTER</h1>
            <p className="text-gray-400">Predictive Maintenance Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">System Time</div>
              <div className="text-xl font-mono">{currentTime.toLocaleTimeString()}</div>
            </div>
            <button 
              onClick={fetchDashboardData}
              className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-green-400">Active</span>
          </div>
          <div className="text-2xl font-bold">{dashboardData?.fleet.active_engines || 0}</div>
          <div className="text-xs text-gray-400">Total Engines</div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-xs text-red-400">Critical</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{dashboardData?.fleet.critical_count || 0}</div>
          <div className="text-xs text-gray-400">At Risk</div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertOctagon className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-orange-400">Warning</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{dashboardData?.fleet.warning_count || 0}</div>
          <div className="text-xs text-gray-400">Needs Attention</div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-xs text-green-400">Health</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {dashboardData?.analytics_summary.health_score.toFixed(1) || 0}%
          </div>
          <div className="text-xs text-gray-400">Fleet Health</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Real-Time Telemetry */}
        <div className="col-span-2 backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">REAL-TIME TELEMETRY</h3>
              <p className="text-xs text-gray-400">Streaming sensor data pipeline</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs text-gray-400">Sensor 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-400">Sensor 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-xs text-gray-400">Sensor 3</span>
              </div>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="vibration" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 10 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engine Grid */}
        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">ENGINE GRID</h3>
              <p className="text-xs text-gray-400">Fleet status overview</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {dashboardData?.engine_grid.map((engine, index) => (
              <div
                key={engine.id}
                className={`p-2 rounded-lg border text-center cursor-pointer transition-all hover:scale-105 ${getEngineStatusBg(engine.risk)}`}
                onClick={() => setSelectedEngine(engine)}
              >
                <div className="text-xs font-bold">{engine.id}</div>
                <div className="text-xs mt-1">{engine.rul.toFixed(0)}</div>
                <div className={`text-xs ${getEngineStatusColor(engine.risk)}`}>
                  {(engine.risk * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* RUL Bars */}
        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">RUL PRIORITY QUEUE</h3>
              <p className="text-xs text-gray-400">Engines requiring attention</p>
            </div>
          </div>

          <div className="space-y-2">
            {rulBarsData.slice(0, 8).map((engine) => (
              <div key={engine.id} className="flex items-center gap-3">
                <div className="text-xs font-bold w-12">{engine.id}</div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${engine.risk > 85 ? 'bg-red-500' : engine.risk > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                      style={{ width: `${engine.health}%` }}
                    />
                  </div>
                </div>
                <div className="text-xs w-12 text-right">{engine.rul.toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">ALERTS</h3>
              <p className="text-xs text-gray-400">System notifications</p>
            </div>
            <Bell className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {dashboardData?.alerts.slice(0, 6).map((alert, index) => (
              <div key={index} className="text-xs p-2 bg-white/5 rounded border border-gray-700">
                {alert}
              </div>
            ))}
            {(!dashboardData?.alerts || dashboardData.alerts.length === 0) && (
              <div className="text-xs text-gray-500 text-center py-4">No active alerts</div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">ANALYTICS SUMMARY</h3>
            <p className="text-xs text-gray-400">System performance metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Avg Risk</div>
            <div className="text-lg font-bold">
              {((dashboardData?.analytics_summary.avg_risk || 0) * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Model Precision</div>
            <div className="text-lg font-bold">
              {((dashboardData?.analytics_summary.model_precision || 0) * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Drift Status</div>
            <div className="text-lg font-bold text-green-400">
              {dashboardData?.analytics_summary.drift_status || 'NOMINAL'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Mean RUL</div>
            <div className="text-lg font-bold">
              {dashboardData?.fleet.mean_rul.toFixed(1) || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
