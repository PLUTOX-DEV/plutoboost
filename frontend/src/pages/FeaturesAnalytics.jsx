import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Eye, MessageCircle, Calendar, Download, Share, CheckCircle, Zap } from "lucide-react";
import Navbar from "../components/Navbar";

const features = [
  {
    icon: BarChart3,
    title: "Comprehensive Analytics",
    description: "Get detailed insights into your social media performance across all platforms."
  },
  {
    icon: TrendingUp,
    title: "Growth Tracking",
    description: "Monitor your follower growth, engagement rates, and reach over time."
  },
  {
    icon: Users,
    title: "Audience Insights",
    description: "Understand your audience demographics, interests, and engagement patterns."
  },
  {
    icon: Eye,
    title: "Content Performance",
    description: "Analyze which posts perform best and optimize your content strategy."
  },
  {
    icon: Calendar,
    title: "Scheduled Reports",
    description: "Receive automated reports on your social media performance regularly."
  },
  {
    icon: Download,
    title: "Data Export",
    description: "Export your analytics data for further analysis or reporting needs."
  }
];

const benefits = [
  "Make data-driven decisions for your social media strategy",
  "Identify top-performing content and posting times",
  "Track ROI on your social media marketing efforts",
  "Understand audience behavior and preferences",
  "Optimize posting schedules for maximum engagement",
  "Measure the impact of your growth campaigns"
];

const metrics = [
  { label: "Follower Growth Rate", value: "+24%", icon: TrendingUp },
  { label: "Engagement Rate", value: "4.8%", icon: MessageCircle },
  { label: "Content Reach", value: "2.1M", icon: Eye },
  { label: "Audience Growth", value: "+156K", icon: Users }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function FeaturesAnalytics() {
  return (
    <div className="min-h-screen bg-[#07091F] text-white">
      <Navbar />

      <div className="pt-24 pb-16">
        {/* HEADER */}
        <motion.div
          {...fadeInUp}
          className="text-center max-w-4xl mx-auto px-6 mb-16"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BarChart3 size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6">
            Advanced Analytics
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Transform your social media strategy with data-driven insights and comprehensive performance tracking
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>Real-Time Data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>Multi-Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span>Actionable Insights</span>
            </div>
          </div>
        </motion.div>

        {/* METRICS SHOWCASE */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center card-hover"
              >
                <metric.icon size={32} className="text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FEATURES GRID */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                {...fadeInUp}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.8 }}
          className="max-w-6xl mx-auto px-6 mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Analytics Dashboard</h2>
            <p className="text-gray-400">Everything you need to understand your social media performance at a glance</p>
          </div>

          <div className="glass rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6">Key Metrics Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-400">Total Followers</span>
                    <span className="font-bold text-purple-400">42,500</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-400">Engagement Rate</span>
                    <span className="font-bold text-emerald-400">4.8%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-400">Reach Growth</span>
                    <span className="font-bold text-cyan-400">+24%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-black/30 rounded-xl">
                    <span className="text-gray-400">Top Post Type</span>
                    <span className="font-bold text-amber-400">Videos</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6">Platform Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-pink-400">IG</span>
                      </div>
                      <span>Instagram</span>
                    </div>
                    <span className="text-emerald-400">+12%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-red-400">YT</span>
                      </div>
                      <span>YouTube</span>
                    </div>
                    <span className="text-emerald-400">+18%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-sky-400">X</span>
                      </div>
                      <span>X (Twitter)</span>
                    </div>
                    <span className="text-emerald-400">+8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BENEFITS */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} transition={{ delay: 0.9 }}>
              <h2 className="text-3xl font-bold mb-6">Why Analytics Matter</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 1.0 }}>
              <div className="glass rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-purple-400 mb-2">85%</div>
                  <div className="text-sm text-gray-400">Strategy improvement</div>
                </div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-emerald-400 mb-2">3.2x</div>
                  <div className="text-sm text-gray-400">ROI increase</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
                  <div className="text-sm text-gray-400">Data monitoring</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* INTEGRATION */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 1.1 }}
          className="max-w-4xl mx-auto px-6 mb-20"
        >
          <div className="glass rounded-2xl p-8 text-center">
            <Share size={48} className="text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Seamless Integration</h3>
            <p className="text-gray-400 mb-6">
              Connect all your social media accounts and get unified analytics across platforms
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full">
                <span className="w-6 h-6 bg-pink-500/20 rounded flex items-center justify-center text-xs font-bold text-pink-400">IG</span>
                <span className="text-sm">Instagram</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full">
                <span className="w-6 h-6 bg-red-500/20 rounded flex items-center justify-center text-xs font-bold text-red-400">YT</span>
                <span className="text-sm">YouTube</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-sky-500/10 rounded-full">
                <span className="w-6 h-6 bg-sky-500/20 rounded flex items-center justify-center text-xs font-bold text-sky-400">X</span>
                <span className="text-sm">Twitter</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full">
                <span className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center text-xs font-bold text-blue-400">FB</span>
                <span className="text-sm">Facebook</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 1.2 }}
          className="text-center px-6"
        >
          <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Unlock Your Data's Potential</h2>
            <p className="text-gray-400 mb-6">
              Transform your social media strategy with powerful analytics and insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-8 py-4 rounded-xl font-semibold shadow-glow transition-all duration-300">
                Start Analytics
              </button>
              <button className="border border-white/20 hover:border-purple-500/50 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                View Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}