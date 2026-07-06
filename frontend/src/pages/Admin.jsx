import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Wallet,
  Menu,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Settings,
  Shield,
  Zap,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import { LineStats, PlatformPie } from "../components/Charts";

const recentActivity = [
  { type: "order", user: "John Doe", service: "Instagram Followers", amount: "₦3,500", time: "2 min ago", status: "completed" },
  { type: "withdrawal", user: "Admin", amount: "₦50,000", time: "15 min ago", status: "pending" },
  { type: "user", user: "Sarah Johnson", action: "registered", time: "1 hour ago", status: "completed" },
  { type: "order", user: "Mike Chen", service: "YouTube Views", amount: "₦2,000", time: "2 hours ago", status: "processing" },
  { type: "deposit", user: "Admin", amount: "₦25,000", time: "3 hours ago", status: "completed" },
];

const quickActions = [
  { icon: Users, label: "Manage Users", color: "from-blue-500 to-cyan-500", path: "/admin/users" },
  { icon: ShoppingCart, label: "View Orders", color: "from-purple-500 to-indigo-500", path: "/admin/orders" },
  { icon: Settings, label: "System Settings", color: "from-amber-500 to-orange-500", path: "/admin/system" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    orders: 0,
    completed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState({ status: 'checking', value: 'Checking...', balance: null });
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin-login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      }
      setLoading(false);
    };

    const fetchSystemStatus = async () => {
      try {
        const res = await api.get('/api/admin/system');
        const exobooster = res.data.metrics.find(m => m.name === 'ExoBooster API');
        if (exobooster) {
          setApiStatus({ status: exobooster.status, value: exobooster.value });
        }
      } catch (err) {
        console.error('Failed to fetch system status:', err);
        setApiStatus({ status: 'error', value: 'Error' });
      }
    };

    const fetchRevenueData = async () => {
      try {
        const res = await api.get('/api/admin/revenue-stats');
        setRevenueData(res.data);
      } catch (err) {
        console.error('Failed to fetch revenue data:', err);
      }
    };
    fetchStats();
    fetchSystemStatus();
    fetchRevenueData();
  }, []);

  return (
    <div className="min-h-screen bg-[#07091F] text-white flex">
      {/* SIDEBAR */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* MAIN */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-8 lg:ml-72 xl:ml-80 2xl:ml-96">
        {/* ===== MOBILE HEADER ===== */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <Menu />
          </button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>

        {/* ===== DESKTOP HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block"
        >
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Platform overview & control panel
          </p>
        </motion.div>

        {/* ===== STATS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          <StatCard title="Total Revenue" value={`₦${stats.revenue.toLocaleString()}`} change="+12.5%" icon={TrendingUp} color="emerald" />
          <StatCard title="Active Users" value={stats.users.toString()} change="+8.2%" icon={Users} color="blue" />
          <StatCard title="Total Orders" value={stats.orders.toString()} change="+15.3%" icon={ShoppingCart} color="purple" />
          <StatCard title="Completed Orders" value={stats.completed.toString()} change="+5.1%" icon={CheckCircle} color="amber" />
        </motion.div>

        {/* ===== CHARTS ROW ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* REVENUE CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass card-hover rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 size={20} className="text-purple-400" />
                  Revenue Trends
                </h3>
                <p className="text-sm text-gray-400">Monthly revenue growth</p>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <TrendingUp size={16} />
                +18.2%
              </div>
            </div>
            <LineStats data={revenueData} />
          </motion.div>

          {/* PLATFORM DISTRIBUTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass card-hover rounded-2xl p-6"
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PieChart size={20} className="text-purple-400" />
                Platform Share
              </h3>
              <p className="text-sm text-gray-400">Orders by platform</p>
            </div>
            <PlatformPie />
          </motion.div>
        </div>

        {/* ===== BOTTOM SECTION ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RECENT ACTIVITY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass card-hover rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity size={20} className="text-purple-400" />
                Recent Activity
              </h3>
              <span className="text-xs text-gray-400">Live updates</span>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === "order" ? "bg-purple-500/20 text-purple-400" :
                      activity.type === "withdrawal" ? "bg-amber-500/20 text-amber-400" :
                      activity.type === "deposit" ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {activity.type === "order" ? <ShoppingCart size={16} /> :
                       activity.type === "withdrawal" ? <ArrowDownRight size={16} /> :
                       activity.type === "deposit" ? <ArrowUpRight size={16} /> :
                       <Users size={16} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {activity.type === "user" ? `${activity.user} ${activity.action}` :
                         activity.type === "order" ? `${activity.user} ordered ${activity.service}` :
                         `${activity.user} ${activity.type}`}
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className={`font-semibold text-sm ${
                        activity.type === "withdrawal" ? "text-red-400" :
                        activity.type === "deposit" ? "text-emerald-400" :
                        "text-purple-400"
                      }`}>
                        {activity.type === "withdrawal" ? "-" : "+"}{activity.amount}
                      </p>
                    )}
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                      activity.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* QUICK ACTIONS & SYSTEM STATUS */}
          <div className="space-y-6">
            {/* QUICK ACTIONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass card-hover rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-purple-400" />
                Quick Actions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <a
                    key={index}
                    href={action.path}
                    className="group p-4 rounded-xl bg-gradient-to-br hover:scale-105 transition-all duration-300 border border-white/10 hover:border-white/20"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon size={20} />
                    </div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* SYSTEM STATUS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass card-hover rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield size={20} className="text-purple-400" />
                System Status
              </h3>

              <div className="space-y-3">
                <StatusItem 
                  label="ExoBooster API" 
                  status={apiStatus.status} 
                  value={apiStatus.value} 
                />
                {apiStatus.balance && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Provider Balance</span>
                    <span className="text-xs font-semibold text-emerald-400">
                      {apiStatus.balance}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Server Load</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-black/40 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-amber-400">75%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Database</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-400" />
                    <span className="text-xs text-emerald-400">Connected</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Uptime</span>
                  <span className="text-xs text-emerald-400">99.9%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ===================== STAT CARD ===================== */
function StatCard({ title, value, change, icon: Icon, color }) {
  const colorClasses = {
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`relative overflow-hidden glass p-5 rounded-2xl border backdrop-blur-sm card-hover bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${
              change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'
            }`}>
              <TrendingUp size={12} className={change.startsWith('+') ? '' : 'rotate-180'} />
              {change}
            </div>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-black/20 ${colorClasses[color].split(' ').pop().replace('text-', 'text-')}`}>
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}

function StatusItem({ label, status, value }) {
  const colorClasses = {
    operational: "text-emerald-400",
    warning: "text-amber-400",
    error: "text-red-400",
    checking: "text-gray-400",
  };

  const Icon = status === 'operational' ? CheckCircle : status === 'error' ? AlertCircle : Clock;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <div className={`flex items-center gap-2 ${colorClasses[status] || 'text-gray-400'}`}>
        <Icon size={14} />
        <span className="text-xs">{value}</span>
      </div>
    </div>
  );
}
