import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../api";
import Sidebar from "../components/Sidebar";
import { LineStats, PlatformPie } from "../components/Charts";
import { AnalyticsSkeleton } from "../components/Skeletons";
import {
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  Eye,
  MessageCircle,
  Zap,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    stats: { totalEarnings: 0, followersPurchased: 0, totalOrders: 0, avgPerOrder: 0 },
    recentActivity: [],
    topServices: [],
    platformDistribution: []
  });


  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        setAnalyticsData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = [
    { title: "Total Spent", value: `₦${analyticsData.stats.totalEarnings.toLocaleString()}`, icon: DollarSign, trend: "+12.5%", trendUp: true, color: "purple" },
    { title: "Followers Purchased", value: analyticsData.stats.followersPurchased.toLocaleString(), icon: Users, trend: "+24.3%", trendUp: true, color: "indigo" },
    { title: "Total Orders", value: analyticsData.stats.totalOrders.toString(), icon: ShoppingCart, trend: "+8.1%", trendUp: true, color: "cyan" },
    { title: "Avg per Order", value: `₦${analyticsData.stats.avgPerOrder.toFixed(2)}`, icon: BarChart3, trend: "-2.4%", trendUp: false, color: "amber" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#07091F] text-white">
        <Sidebar />
        <main className="flex-1 relative p-4 sm:p-6 lg:p-10 xl:p-12 2xl:p-16 space-y-6 sm:space-y-8 overflow-x-hidden lg:ml-72 xl:ml-80 2xl:ml-96"><AnalyticsSkeleton /></main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />

      <main className="flex-1 relative p-4 sm:p-6 lg:p-10 xl:p-12 2xl:p-16 space-y-6 sm:space-y-8 overflow-x-hidden lg:ml-72 xl:ml-80 2xl:ml-96">
        {/* Cosmic background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed_0%,transparent_55%),radial-gradient(circle_at_bottom,#9333ea_0%,transparent_60%)] opacity-20 pointer-events-none" />

        <div className="relative z-10 space-y-6 sm:space-y-8">
          {/* HEADER */}
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
                <BarChart3 className="text-purple-400" size={24} />
                Analytics
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Track your growth and performance
              </p>
            </div>

            <div className="flex items-center gap-2 glass rounded-xl px-4 py-2">
              <Calendar size={16} className="text-purple-400" />
              <select className="bg-transparent outline-none text-sm cursor-pointer">
                <option className="bg-[#12002b]" value="7d">Last 7 days</option>
                <option className="bg-[#12002b]" value="30d">Last 30 days</option>
                <option className="bg-[#12002b]" value="90d">Last 90 days</option>
                <option className="bg-[#12002b]" value="1y">Last year</option>
              </select>
            </div>
          </motion.div>

          {/* STATS */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} delay={i * 0.05} />
            ))}
          </motion.div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Line chart */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass card-hover rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg">Earnings Growth</h3>
                  <p className="text-sm text-gray-400">Monthly revenue trend</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <TrendingUp size={16} />
                  +18.2%
                </div>
              </div>
              <LineStats data={analyticsData.topServices.map(s => ({ name: s.name, value: s.revenue }))} />
            </motion.div>

            {/* Pie chart */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="glass card-hover rounded-2xl p-4 sm:p-6"
            >
              <div className="mb-6">
                <h3 className="font-semibold text-lg">Platform Distribution</h3>
                <p className="text-sm text-gray-400">Orders by platform</p>
              </div>
              <PlatformPie data={analyticsData.platformDistribution} />
            </motion.div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* TOP SERVICES */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.4 }}
              className="glass card-hover rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Top Services</h3>
                <button className="text-sm text-purple-400 hover:text-purple-300 transition">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {analyticsData.topServices && analyticsData.topServices.map((service, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{service.name}</p>
                        <p className="text-xs text-gray-400">{service.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-purple-400">₦{service.revenue.toLocaleString()}</p>
                      <p className="text-xs text-emerald-400">{service.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RECENT ACTIVITY */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.5 }}
              className="glass card-hover rounded-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Activity</h3>
                <span className="badge-info flex items-center gap-1">
                  <Zap size={12} /> Live
                </span>
              </div>
              <div className="space-y-3">
                {analyticsData.recentActivity.map((activity, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/5"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === "order" 
                        ? "bg-purple-500/20 text-purple-400" 
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {activity.type === "order" ? <ShoppingCart size={16} /> : <DollarSign size={16} />}
                    </div>
                    <div className="flex-1">
                      {activity.type === "order" ? (
                        <>
                          <p className="text-sm font-medium">
                            {activity.platform} {activity.service.split(' ')[0]}
                          </p>
                          <p className="text-xs text-gray-400">
                            {activity.qty.toLocaleString()} units
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium">Wallet Funded</p>
                          <p className="text-xs text-emerald-400">₦{activity.amount.toLocaleString()}</p>
                        </>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{new Date(activity.time).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* QUICK STATS */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <QuickStat icon={Eye} label="Profile Views" value="12.5K" />
            <QuickStat icon={MessageCircle} label="Engagement Rate" value="4.8%" />
            <QuickStat icon={Users} label="New Followers" value="2.3K" />
            <QuickStat icon={ArrowUpRight} label="Conversion" value="68%" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, color, delay }) {
  const colors = {
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
    cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  };

  const iconColors = {
    purple: "text-purple-400",
    indigo: "text-indigo-400",
    cyan: "text-cyan-400",
    amber: "text-amber-400",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-xl p-3 sm:p-4 bg-gradient-to-br ${colors[color]} border backdrop-blur-sm card-hover`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm text-gray-400">{title}</p>
          <p className="text-lg sm:text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-black/20 ${iconColors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className={`flex items-center gap-1 mt-2 text-xs ${trendUp ? "text-emerald-400" : "text-red-400"}`}>
        {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </motion.div>
  );
}

function QuickStat({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-xl p-3 sm:p-4 text-center card-hover">
      <Icon size={20} className="mx-auto text-purple-400 mb-2" />
      <p className="font-bold text-sm sm:text-base">{value}</p>
      <p className="text-[10px] sm:text-xs text-gray-400">{label}</p>
    </div>
  );
}
