import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Server,
  ShieldCheck,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Menu,
  Zap,
  Users,
  ShoppingCart,
  DollarSign
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import OwnerWithdrawPanel from "./OwnerWithdrawPanel";
import api from "../api";

const iconMap = {
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  ShieldCheck,
};

const statusColors = {
  operational: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30"
};

const logColors = {
  info: "text-blue-400",
  warning: "text-amber-400",
  error: "text-red-400"
};

export default function AdminSystem() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [controls, setControls] = useState({ maintenanceMode: false });
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalOrders: 0,
    revenue: 0,
    serverLoad: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const res = await api.get('/api/admin/system');
        setSystemMetrics(res.data.metrics);
        setRecentLogs(res.data.logs);
        setStats(res.data.stats);
        setControls(res.data.controls);
      } catch (err) {
        console.error('Failed to fetch system data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSystemData();
  }, []);

  const toggleMaintenanceMode = async () => {
    const newStatus = !controls.maintenanceMode;
    try {
      const res = await api.post('/api/admin/system/maintenance', { enabled: newStatus });
      setControls(res.data);
    } catch (err) {
      alert('Failed to update maintenance mode');
    }
  };

  const handleQuickAction = async (action) => {
    try {
      let res;
      if (action === 'clear-cache') {
        res = await api.post('/api/admin/system/clear-cache');
      } else if (action === 'run-diagnostics') {
        res = await api.post('/api/admin/system/run-diagnostics');
      }
      alert(res.data.message);
    } catch (err) {
      alert(`Action failed: ${err.response?.data?.error || 'Server error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#07091F] text-white flex">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-6 lg:ml-72 xl:ml-80 2xl:ml-96">
        {/* MOBILE HEADER */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <Menu />
          </button>
          <h1 className="text-xl font-bold">System Monitoring</h1>
        </div>

        {/* DESKTOP HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block"
        >
          <h1 className="text-3xl font-bold gradient-text">System Monitoring</h1>
          <p className="text-gray-400 mt-1">
            Monitor system health, performance metrics, and manage platform settings
          </p>
        </motion.div>

        {/* QUICK STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <QuickStat title="Active Users" value={stats.activeUsers} icon={Users} color="blue" />
          <QuickStat title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="purple" />
          <QuickStat title="Revenue" value={`₦${stats.revenue.toLocaleString()}`} icon={DollarSign} color="emerald" />
          <QuickStat title="Server Load" value={`${stats.serverLoad}%`} icon={Activity} color="amber" />
        </motion.div>

        {/* SYSTEM METRICS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {systemMetrics.map((metric, index) => {
            const Icon = iconMap[metric.icon];
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass card-hover rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      metric.status === "operational" ? "bg-emerald-500/20" :
                      metric.status === "warning" ? "bg-amber-500/20" :
                      "bg-red-500/20"
                    }`}>
                      <Icon size={20} className={
                        metric.status === "operational" ? "text-emerald-400" :
                        metric.status === "warning" ? "text-amber-400" :
                        "text-red-400"
                      } />
                    </div>
                    <div>
                      <h3 className="font-semibold">{metric.name}</h3>
                      <div className={`text-xs px-2 py-1 rounded-full border ${statusColors[metric.status]}`}>
                        {metric.status}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition">
                    <Settings size={16} />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="font-medium">{metric.value}</span>
                  </div>
                  {metric.balance && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Provider:</span>
                      <span className="font-medium">{metric.balance}</span>
                    </div>
                  )}
                  {metric.uptime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime:</span>
                      <span className="font-medium">{metric.uptime}</span>
                    </div>
                  )}
                  {metric.responseTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Response:</span>
                      <span className="font-medium">{metric.responseTime}</span>
                    </div>
                  )}
                  {metric.connections && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Connections:</span>
                      <span className="font-medium">{metric.connections}</span>
                    </div>
                  )}
                  {metric.cores && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cores:</span>
                      <span className="font-medium">{metric.cores}</span>
                    </div>
                  )}
                  {metric.temperature && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Temp:</span>
                      <span className="font-medium">{metric.temperature}</span>
                    </div>
                  )}
                  {metric.bandwidth && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bandwidth:</span>
                      <span className="font-medium">{metric.bandwidth}</span>
                    </div>
                  )}
                  {metric.threats !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Threats:</span>
                      <span className="font-medium">{metric.threats}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* SYSTEM LOGS & CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SYSTEM LOGS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity size={20} className="text-purple-400" />
                System Logs
              </h3>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 transition text-sm">
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentLogs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 bg-black/30 rounded-xl border border-white/5"
                >
                  <div className={`text-xs font-mono px-2 py-1 rounded ${logColors[log.level]} bg-current/10`}>
                    {log.time}
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    log.level === "info" ? "bg-blue-400" :
                    log.level === "warning" ? "bg-amber-400" :
                    "bg-red-400"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{log.message}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    log.type === "user" ? "bg-blue-500/20 text-blue-400" :
                    log.type === "order" ? "bg-purple-500/20 text-purple-400" :
                    log.type === "payment" ? "bg-emerald-500/20 text-emerald-400" :
                    log.type === "security" ? "bg-red-500/20 text-red-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {log.type}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SYSTEM CONTROLS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* MAINTENANCE MODE */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings size={20} className="text-purple-400" />
                System Controls
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Maintenance Mode</span>
                  <button
                    onClick={toggleMaintenanceMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      controls.maintenanceMode ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      controls.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">API Rate Limiting</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors focus:outline-none">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Backups</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600 transition-colors focus:outline-none">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button onClick={() => handleQuickAction('clear-cache')} className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition">
                  <span className="text-sm">Clear Cache</span>
                  <Zap size={16} className="text-blue-400" />
                </button>

                <button onClick={() => handleQuickAction('run-diagnostics')} className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 transition">
                  <span className="text-sm">Run Diagnostics</span>
                  <Activity size={16} className="text-purple-400" />
                </button>

                <button onClick={() => alert('Database backup initiated!')} className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition">
                  <span className="text-sm">Backup Database</span>
                  <Database size={16} className="text-emerald-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 transition">
                  <span className="text-sm">Restart Services</span>
                  <RefreshCw size={16} className="text-amber-400" />
                </button>
              </div>
            </div>

            {/* OWNER WITHDRAWAL PANEL */}
            <OwnerWithdrawPanel />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* ===================== QUICK STAT ===================== */
function QuickStat({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
  };

  return (
    <div className={`glass p-4 rounded-xl border backdrop-blur-sm bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-black/20 ${colorClasses[color].split(' ').pop()}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
