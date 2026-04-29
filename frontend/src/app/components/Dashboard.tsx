import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Bell,
  User,
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

// Mock data generators
const generateTelemetryData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    time: i,
    temperature: 60 + Math.random() * 40 + Math.sin(i * 0.2) * 15,
    pressure: 50 + Math.random() * 30 + Math.cos(i * 0.15) * 10,
    vibration: 40 + Math.random() * 50 + Math.sin(i * 0.3) * 20,
  }));
};

const machineTypes = [
  { id: "turbines", name: "Gas Turbines", count: 12, icon: "⚡" },
  { id: "pumps", name: "Centrifugal Pumps", count: 24, icon: "🔄" },
  { id: "compressors", name: "Air Compressors", count: 18, icon: "💨" },
  { id: "generators", name: "Power Generators", count: 8, icon: "⚙️" },
  { id: "motors", name: "Electric Motors", count: 36, icon: "🔌" },
];

const timeRanges = [
  { id: "1h", label: "Last Hour" },
  { id: "24h", label: "24 Hours" },
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "custom", label: "Custom Range" },
];

const aiInsights = [
  { id: 1, icon: "check", text: "Vibration anomaly in Engine E-073", time: "2.46s", type: "success" },
  { id: 2, icon: "alert", text: "Critical failure predicted for E-001 in 52.7M hours", time: "3.12s", type: "warning" },
  { id: 3, icon: "info", text: "System performing 2,847% training epoch", time: "3.89s", type: "info" },
  { id: 4, icon: "check", text: "Vibration anomaly in Engine E-073", time: "4.21s", type: "success" },
  { id: 5, icon: "alert", text: "Engine E-041 operating within optimal parameters", time: "4.92s", type: "warning" },
];

const fleetData = [
  { id: "E-001", health: 45, status: "critical", rul: 127, location: "Plant A", temp: 87.3 },
  { id: "E-023", health: 62, status: "warning", rul: 543, location: "Plant B", temp: 78.9 },
  { id: "E-037", health: 71, status: "warning", rul: 782, location: "Plant A", temp: 74.1 },
  { id: "E-042", health: 88, status: "healthy", rul: 2156, location: "Plant C", temp: 69.5 },
  { id: "E-091", health: 94, status: "healthy", rul: 2847, location: "Plant B", temp: 67.3 },
  { id: "E-103", health: 89, status: "healthy", rul: 2201, location: "Plant C", temp: 68.2 },
  { id: "E-117", health: 76, status: "warning", rul: 891, location: "Plant A", temp: 72.8 },
  { id: "E-142", health: 91, status: "healthy", rul: 2534, location: "Plant B", temp: 66.9 },
];

const alerts = [
  { id: 1, severity: "critical", engine: "E-001", message: "Vibration threshold exceeded", time: "2 min ago", acknowledged: false },
  { id: 2, severity: "warning", engine: "E-023", message: "Temperature rising above normal", time: "15 min ago", acknowledged: false },
  { id: 3, severity: "critical", engine: "E-037", message: "Bearing failure prediction", time: "1 hour ago", acknowledged: true },
  { id: 4, severity: "info", engine: "E-042", message: "Scheduled maintenance due", time: "2 hours ago", acknowledged: true },
  { id: 5, severity: "warning", engine: "E-091", message: "Oil pressure fluctuation detected", time: "3 hours ago", acknowledged: false },
];

const maintenanceSchedule = [
  { id: 1, engine: "E-001", task: "Bearing replacement", date: "2026-04-25", status: "scheduled", priority: "high" },
  { id: 2, engine: "E-023", task: "Oil change", date: "2026-04-26", status: "scheduled", priority: "medium" },
  { id: 3, engine: "E-037", task: "Vibration sensor calibration", date: "2026-04-27", status: "in-progress", priority: "high" },
  { id: 4, engine: "E-042", task: "Routine inspection", date: "2026-04-28", status: "scheduled", priority: "low" },
  { id: 5, engine: "E-091", task: "Filter replacement", date: "2026-04-29", status: "completed", priority: "medium" },
];

const analyticsData = [
  { name: "Jan", failures: 4, predictions: 3, accuracy: 92 },
  { name: "Feb", failures: 2, predictions: 2, accuracy: 95 },
  { name: "Mar", failures: 5, predictions: 4, accuracy: 89 },
  { name: "Apr", failures: 1, predictions: 1, accuracy: 98 },
];

const COLORS = ['#ef4444', '#f97316', '#22c55e', '#3b82f6'];

export function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [telemetryData, setTelemetryData] = useState(generateTelemetryData());
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedMachine, setSelectedMachine] = useState(machineTypes[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[1]);
  const [showMachineDropdown, setShowMachineDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<any>(null);
  const [showAlertPanel, setShowAlertPanel] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const dataTimer = setInterval(() => {
      setTelemetryData((prev) => {
        const newData = [...prev.slice(1)];
        const lastPoint = prev[prev.length - 1];
        newData.push({
          time: lastPoint.time + 1,
          temperature: 60 + Math.random() * 40 + Math.sin(lastPoint.time * 0.2) * 15,
          pressure: 50 + Math.random() * 30 + Math.cos(lastPoint.time * 0.15) * 10,
          vibration: 40 + Math.random() * 50 + Math.sin(lastPoint.time * 0.3) * 20,
        });
        return newData;
      });
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(dataTimer);
    };
  }, []);

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

  const renderDashboardView = () => (
    <div className="space-y-6">
      {/* Top Section - Telemetry & Engine Network */}
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
                <span className="text-xs text-gray-400">Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-400">Pressure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-xs text-gray-400">Vibration</span>
              </div>
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData}>
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="vibration" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
            <span>Last updated: 0.2s ago</span>
            <span className="text-red-400">⚠ Anomaly Detected</span>
          </div>
        </div>

        {/* Engine Network */}
        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-1">ENGINE NETWORK</h3>
            <p className="text-xs text-gray-400">Digital twin topology</p>
          </div>

          <div className="relative h-48 flex items-center justify-center">
            <motion.div
              className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400 flex items-center justify-center"
              animate={{
                boxShadow: ["0 0 20px rgba(6, 182, 212, 0.5)", "0 0 40px rgba(6, 182, 212, 0.8)", "0 0 20px rgba(6, 182, 212, 0.5)"],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Database className="w-6 h-6 text-cyan-400" />
            </motion.div>

            {[0, 60, 120, 180, 240, 300].map((angle, index) => {
              const radius = 80;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const status = index === 2 ? "critical" : index === 4 ? "warning" : "healthy";

              return (
                <motion.div
                  key={angle}
                  className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                    status === "critical" ? "bg-red-500/20 border-red-500" :
                    status === "warning" ? "bg-orange-500/20 border-orange-500" :
                    "bg-green-500/20 border-green-500"
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={status === "critical" ? {
                    boxShadow: ["0 0 10px rgba(239, 68, 68, 0.5)", "0 0 25px rgba(239, 68, 68, 0.8)", "0 0 10px rgba(239, 68, 68, 0.5)"],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  whileHover={{ scale: 1.2 }}
                >
                  <Radio className="w-4 h-4 text-white" />
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-400">4 Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-xs text-gray-400">1 Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs text-gray-400">1 Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Pipeline */}
      <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Data Pipeline</h3>
            <p className="text-xs text-gray-400">End-to-end processing architecture</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
            <motion.div className="w-2 h-2 rounded-full bg-green-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {[
            { icon: Wifi, label: "Sensors", value: "2.4k/s", color: "cyan" },
            { icon: Activity, label: "Streaming", value: "32ms", color: "blue" },
            { icon: Database, label: "MongoDB", value: "847B", color: "green" },
            { icon: Zap, label: "AI Model", value: null, color: "purple" },
            { icon: BarChart3, label: "Prediction", value: "99.6%", color: "orange" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/30 flex items-center justify-center mb-3`}
                    animate={{ boxShadow: [`0 0 10px rgba(6, 182, 212, 0.2)`, `0 0 20px rgba(6, 182, 212, 0.4)`, `0 0 10px rgba(6, 182, 212, 0.2)`] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    <Icon className={`w-6 h-6 text-${item.color}-400`} />
                  </motion.div>
                  <span className="text-xs text-gray-400 mb-1">{item.label}</span>
                  {item.value && <span className={`text-sm font-bold text-${item.color}-400`}>{item.value}</span>}
                </div>
                {index < 4 && (
                  <motion.div
                    className="absolute top-8 left-[calc(100%+0.5rem)] w-6 h-0.5 bg-gradient-to-r from-cyan-500/50 to-cyan-500/10"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI INSIGHTS FEED</h3>
              <p className="text-xs text-gray-400">Real-time intelligence stream</p>
            </div>
          </div>
          <div className="space-y-2">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-300 mb-1">{insight.text}</p>
                    <span className="text-xs text-gray-500">{insight.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">FAILURE TIMELINE</h3>
              <p className="text-xs text-gray-400">Degradation progression</p>
            </div>
          </div>
          <div className="relative py-4">
            {[
              { label: "Stable", sublabel: "Nominal operation", color: "green", active: true },
              { label: "Degrading", sublabel: "Performance decline", color: "orange", active: false },
              { label: "Critical", sublabel: "Imminent failure", color: "red", active: false },
            ].map((stage, index) => (
              <div key={index} className="relative flex items-center gap-4 mb-6 last:mb-0">
                <motion.div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    stage.active ? `bg-${stage.color}-500/20 border-${stage.color}-500` : "bg-gray-500/10 border-gray-500"
                  }`}
                  animate={stage.active ? {
                    boxShadow: [`0 0 10px rgba(34, 197, 94, 0.5)`, `0 0 20px rgba(34, 197, 94, 0.8)`, `0 0 10px rgba(34, 197, 94, 0.5)`]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stage.active && <div className={`w-3 h-3 rounded-full bg-${stage.color}-500`} />}
                </motion.div>
                <div>
                  <div className={`text-sm font-bold ${stage.active ? `text-${stage.color}-400` : "text-gray-500"}`}>{stage.label}</div>
                  <div className="text-xs text-gray-500">{stage.sublabel}</div>
                </div>
                {index < 2 && <div className="absolute left-4 top-10 w-0.5 h-6 bg-gradient-to-b from-gray-500/50 to-transparent" />}
              </div>
            ))}
            <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <p className="text-xs text-orange-400">Predicted to 76.4h</p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">FLEET HEALTH</h3>
              <p className="text-xs text-gray-400">Remaining useful life</p>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-cyan-400">72%</span>
              <span className="text-sm text-gray-400">Overall Health</span>
            </div>
          </div>
          <div className="space-y-3">
            {fleetData.slice(0, 5).map((engine) => (
              <div key={engine.id} className="cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{engine.id}</span>
                  <span className={`text-xs font-bold ${
                    engine.status === "critical" ? "text-red-400" :
                    engine.status === "warning" ? "text-orange-400" : "text-green-400"
                  }`}>{engine.health}%</span>
                </div>
                <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      engine.status === "critical" ? "bg-gradient-to-r from-red-600 to-red-500" :
                      engine.status === "warning" ? "bg-gradient-to-r from-orange-600 to-orange-500" :
                      "bg-gradient-to-r from-green-600 to-green-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${engine.health}%` }}
                    transition={{ duration: 1, delay: 0.1 }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">RUL: {engine.rul}h</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnginesView = () => (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Engine Fleet Overview</h3>
        <div className="grid grid-cols-4 gap-4">
          {fleetData.map((engine) => (
            <motion.div
              key={engine.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedEngine(engine)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                engine.status === "critical" ? "bg-red-500/10 border-red-500/50" :
                engine.status === "warning" ? "bg-orange-500/10 border-orange-500/50" :
                "bg-green-500/10 border-green-500/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-white">{engine.id}</span>
                <Radio className={`w-5 h-5 ${
                  engine.status === "critical" ? "text-red-400" :
                  engine.status === "warning" ? "text-orange-400" : "text-green-400"
                }`} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Health</span>
                  <span className={`font-bold ${
                    engine.status === "critical" ? "text-red-400" :
                    engine.status === "warning" ? "text-orange-400" : "text-green-400"
                  }`}>{engine.health}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">RUL</span>
                  <span className="text-cyan-400">{engine.rul}h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Temp</span>
                  <span className="text-orange-400">{engine.temp}°C</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">{engine.location}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedEngine && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Engine {selectedEngine.id} - Detailed Diagnostics</h3>
            <button onClick={() => setSelectedEngine(null)} className="p-2 rounded-lg hover:bg-white/10">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-cyan-500/20">
                <div className="text-sm text-gray-400 mb-1">Health Status</div>
                <div className="text-3xl font-bold text-cyan-400">{selectedEngine.health}%</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-cyan-500/20">
                <div className="text-sm text-gray-400 mb-1">Remaining Useful Life</div>
                <div className="text-3xl font-bold text-orange-400">{selectedEngine.rul}h</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-cyan-500/20">
                <div className="text-sm text-gray-400 mb-1">Temperature</div>
                <div className="text-3xl font-bold text-red-400">{selectedEngine.temp}°C</div>
              </div>
            </div>
            <div className="col-span-2">
              <div className="h-full p-4 rounded-xl bg-white/5 border border-cyan-500/20">
                <h4 className="text-sm font-bold text-white mb-4">Sensor Readings (Last Hour)</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={telemetryData}>
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} />
                    <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="vibration" stroke="#a855f7" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderInsightsView = () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">AI Predictions & Insights</h3>
        <div className="space-y-3">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-white/5 border border-cyan-500/20 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white mb-1">{insight.text}</p>
                  <span className="text-xs text-gray-500">{insight.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Model Performance</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Prediction Accuracy</span>
              <span className="text-lg font-bold text-green-400">94.7%</span>
            </div>
            <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: "94.7%" }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">False Positive Rate</span>
              <span className="text-lg font-bold text-orange-400">2.3%</span>
            </div>
            <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: "2.3%" }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Detection Rate</span>
              <span className="text-lg font-bold text-cyan-400">98.1%</span>
            </div>
            <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: "98.1%" }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <div className="text-xs text-gray-400 mb-2">Model Version</div>
            <div className="text-lg font-bold text-white">v3.7.2 - Production</div>
            <div className="text-xs text-cyan-400 mt-2">Last trained: 2 days ago</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlertsView = () => (
    <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Active Alerts & Notifications</h3>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-sm font-medium">
            Mark All Read
          </button>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10">
            Filter
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-xl border-2 ${
              alert.severity === "critical" ? "bg-red-500/10 border-red-500/50" :
              alert.severity === "warning" ? "bg-orange-500/10 border-orange-500/50" :
              "bg-blue-500/10 border-blue-500/50"
            } ${alert.acknowledged ? "opacity-50" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {alert.severity === "critical" ? (
                  <AlertOctagon className="w-5 h-5 text-red-400 mt-1" />
                ) : alert.severity === "warning" ? (
                  <AlertTriangle className="w-5 h-5 text-orange-400 mt-1" />
                ) : (
                  <CircleDot className="w-5 h-5 text-blue-400 mt-1" />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{alert.engine}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      alert.severity === "critical" ? "bg-red-500/20 text-red-400" :
                      alert.severity === "warning" ? "bg-orange-500/20 text-orange-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!alert.acknowledged && (
                  <button className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs font-medium">
                    Acknowledge
                  </button>
                )}
                <button className="p-1 rounded-lg hover:bg-white/10">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMaintenanceView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-center">
              <Wrench className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-xs text-gray-400">Scheduled</div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-xs text-gray-400">In Progress</div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">47</div>
              <div className="text-xs text-gray-400">Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Maintenance Schedule</h3>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium">
            + Schedule New
          </button>
        </div>

        <div className="space-y-3">
          {maintenanceSchedule.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-white/5 border border-cyan-500/20 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === "completed" ? "bg-green-500" :
                    task.status === "in-progress" ? "bg-cyan-500" :
                    "bg-orange-500"
                  }`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{task.engine}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-sm text-gray-300">{task.task}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{task.date}</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        task.priority === "high" ? "bg-red-500/20 text-red-400" :
                        task.priority === "medium" ? "bg-orange-500/20 text-orange-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-medium hover:bg-white/10">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Failure Prediction Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData}>
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="failures" fill="#ef4444" />
              <Bar dataKey="predictions" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Fleet Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RPieChart>
              <Pie
                data={[
                  { name: 'Critical', value: 2 },
                  { name: 'Warning', value: 3 },
                  { name: 'Healthy', value: 11 },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {[0, 1, 2].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">94.7%</div>
              <div className="text-xs text-gray-400">Model Accuracy</div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-xs text-gray-400">Predictions Made</div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">$2.3M</div>
              <div className="text-xs text-gray-400">Cost Savings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard": return renderDashboardView();
      case "engines": return renderEnginesView();
      case "insights": return renderInsightsView();
      case "alerts": return renderAlertsView();
      case "maintenance": return renderMaintenanceView();
      case "analytics": return renderAnalyticsView();
      default: return renderDashboardView();
    }
  };

  return (
    <div className="relative size-full overflow-hidden bg-[#0a0e1a]">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-[#0d1117] border-r border-cyan-500/20 flex flex-col items-center py-6 z-50">
        <motion.div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-8"
          animate={{ boxShadow: ["0 0 20px rgba(6, 182, 212, 0.3)", "0 0 30px rgba(6, 182, 212, 0.5)", "0 0 20px rgba(6, 182, 212, 0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="w-6 h-6 text-white" />
        </motion.div>

        <div className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group">
                <motion.button
                  onClick={() => setActiveNav(item.id)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    activeNav === item.id ? "bg-cyan-500/20 border border-cyan-500/50" : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={`w-5 h-5 ${activeNav === item.id ? "text-cyan-400" : "text-gray-400"}`} />
                </motion.button>

                {/* Tooltip */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#0d1117] border border-cyan-500/30 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  <span className="text-xs text-white font-medium">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <motion.div
          onClick={() => setShowAlertPanel(!showAlertPanel)}
          className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center relative cursor-pointer"
          animate={{ boxShadow: ["0 0 10px rgba(239, 68, 68, 0.3)", "0 0 20px rgba(239, 68, 68, 0.6)", "0 0 10px rgba(239, 68, 68, 0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5 text-red-400" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{alerts.filter(a => !a.acknowledged).length}</span>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="ml-16 h-full flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-[#0d1117] border-b border-cyan-500/20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-white tracking-wider">NEXUS AI COMMAND CENTER</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-green-400 font-medium">Operational</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-cyan-400 font-medium">Streaming</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-400 font-mono">{currentTime.toLocaleTimeString()}</div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
              <motion.div className="w-2 h-2 rounded-full bg-red-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="text-xs text-red-400 font-medium">3 LIVE</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <AlertTriangle className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-orange-400 font-medium">Alerts</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <User className="w-3 h-3 text-cyan-400" />
              <span className="text-xs text-white font-medium">AI Operator</span>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div className="h-14 bg-[#0d1117]/50 border-b border-cyan-500/10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Machine Type Selector */}
            <div className="relative">
              <button
                onClick={() => setShowMachineDropdown(!showMachineDropdown)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-cyan-500/30 hover:bg-white/10 transition-all"
              >
                <span className="text-2xl">{selectedMachine.icon}</span>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Machine Type</div>
                  <div className="text-sm text-white font-medium">{selectedMachine.name}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              <AnimatePresence>
                {showMachineDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 w-64 backdrop-blur-xl bg-[#0d1117] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    {machineTypes.map((machine) => (
                      <button
                        key={machine.id}
                        onClick={() => { setSelectedMachine(machine); setShowMachineDropdown(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all ${selectedMachine.id === machine.id ? "bg-cyan-500/10" : ""}`}
                      >
                        <span className="text-2xl">{machine.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="text-sm text-white font-medium">{machine.name}</div>
                          <div className="text-xs text-gray-400">{machine.count} units</div>
                        </div>
                        {selectedMachine.id === machine.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Time Range Selector */}
            <div className="relative">
              <button
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-cyan-500/30 hover:bg-white/10 transition-all"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-white font-medium">{selectedTimeRange.label}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              <AnimatePresence>
                {showTimeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 w-48 backdrop-blur-xl bg-[#0d1117] border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    {timeRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => { setSelectedTimeRange(range); setShowTimeDropdown(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-all ${selectedTimeRange.id === range.id ? "bg-cyan-500/10" : ""}`}
                      >
                        <span className="text-sm text-white">{range.label}</span>
                        {selectedTimeRange.id === range.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-cyan-500/30 hover:bg-white/10 transition-all">
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-white font-medium">Refresh</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search engines..." className="pl-9 pr-4 py-2 w-64 bg-white/5 border border-cyan-500/30 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50" />
            </div>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowReportModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/30">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Generate Report</span>
            </motion.button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Alert Sidebar Panel */}
      <AnimatePresence>
        {showAlertPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              onClick={() => setShowAlertPanel(false)}
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-16 top-0 bottom-0 w-96 backdrop-blur-xl bg-[#0d1117] border-r border-cyan-500/30 shadow-2xl z-[100] overflow-hidden flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-6 border-b border-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Active Alerts</h2>
                      <p className="text-xs text-gray-400">{alerts.filter(a => !a.acknowledged).length} unacknowledged</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAlertPanel(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-all">
                    Mark All Read
                  </button>
                  <button className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-medium hover:bg-white/10 transition-all">
                    Clear All
                  </button>
                </div>
              </div>

              {/* Alerts List */}
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border-2 ${
                      alert.severity === "critical"
                        ? "bg-red-500/10 border-red-500/50"
                        : alert.severity === "warning"
                        ? "bg-orange-500/10 border-orange-500/50"
                        : "bg-blue-500/10 border-blue-500/50"
                    } ${alert.acknowledged ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {alert.severity === "critical" ? (
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <AlertOctagon className="w-5 h-5 text-red-400" />
                        </motion.div>
                      ) : alert.severity === "warning" ? (
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      ) : (
                        <CircleDot className="w-5 h-5 text-blue-400" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{alert.engine}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              alert.severity === "critical"
                                ? "bg-red-500/20 text-red-400"
                                : alert.severity === "warning"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{alert.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Alert Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      {!alert.acknowledged ? (
                        <>
                          <button className="flex-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-all">
                            Acknowledge
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-medium hover:bg-white/10 transition-all">
                            View Details
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-green-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Acknowledged</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Panel Footer */}
              <div className="p-4 border-t border-cyan-500/20">
                <button
                  onClick={() => {
                    setShowAlertPanel(false);
                    setActiveNav("alerts");
                  }}
                  className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                >
                  View All Alerts
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Report Generation Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100]"
            onClick={() => !isGeneratingReport && setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg backdrop-blur-xl bg-[#0d1117] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Generate Report</h2>
                {!isGeneratingReport && (
                  <button onClick={() => setShowReportModal(false)} className="p-2 rounded-lg hover:bg-white/10 transition-all">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>

              {!isGeneratingReport ? (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Report Type</label>
                      <select className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50">
                        <option>Predictive Maintenance Summary</option>
                        <option>Detailed Fleet Analysis</option>
                        <option>Critical Alerts Report</option>
                        <option>Performance Metrics</option>
                        <option>Custom Report</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Time Period</label>
                      <select className="w-full px-4 py-3 bg-white/5 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50">
                        <option>Last 24 Hours</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Custom Range</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Format</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button className="px-4 py-3 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400 font-medium">PDF</button>
                        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10">Excel</button>
                        <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:bg-white/10">CSV</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Include</label>
                      <div className="space-y-2">
                        {["Charts & Visualizations", "AI Predictions", "Raw Data", "Recommendations"].map((item) => (
                          <label key={item} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                            <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm text-gray-300">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerateReport} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Generate Report
                  </motion.button>
                </>
              ) : (
                <div className="py-12 flex flex-col items-center">
                  <motion.div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-500" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                  <p className="text-white mt-6 text-lg">Generating report...</p>
                  <p className="text-gray-400 text-sm mt-2">Processing data and creating visualizations</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
