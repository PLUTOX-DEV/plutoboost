import { useState, useContext, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { DashboardSkeleton } from "../components/Skeletons";
import UserContext from "../context/UserContext";
import ConfirmationModal from "../components/ConfirmationModal";
import api from "../api"; 
import {
  Wallet,
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Eye,
  MessageCircle,
  Users,
  ShoppingCart,
  TrendingUp,
  Zap,
  Star,
  ArrowUpRight,
  Music,
  RefreshCw,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard() {
  // Load Tailwind CDN for this page only and inject safer overrides for mobile GPU bugs
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !window.__TAILWIND_DASHBOARD_LOADED__) {
        // Optional minimal Tailwind config can be set before loading the script
        window.tailwind = window.tailwind || {};
        // Keep default corePlugins but ensure preflight is enabled
        window.tailwind.config = window.tailwind.config || {};

        const script = document.createElement('script');
        script.src = 'https://cdn.tailwindcss.com';
        script.async = true;
        script.onload = () => {
          window.__TAILWIND_DASHBOARD_LOADED__ = true;
          console.log('Tailwind CDN loaded for Dashboard');
        };
        document.head.appendChild(script);

        // Inject dashboard-specific safe overrides to avoid heavy GPU use
        const styleId = 'dashboard-tailwind-overrides';
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.innerHTML = `
            .dashboard-page .glass, .dashboard-page .glass-dark, .dashboard-page .glass-light {
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
              box-shadow: 0 6px 14px rgba(0,0,0,0.12) !important;
              background: rgba(0,0,0,0.06) !important;
              border: 1px solid rgba(255,255,255,0.06) !important;
            }
            .dashboard-page .dashboard-bg-fade { display: none !important; }
            .dashboard-page .gradient-text, .dashboard-page .gradient-text-gold {
              background: none !important; -webkit-text-fill-color: initial !important; color: white !important;
            }
          `;
          document.head.appendChild(style);
        }
      }
    } catch (e) {
      console.warn('Failed to load Tailwind CDN for dashboard:', e);
    }
  }, []);

  const { balance, setBalance, placeOrder } = useContext(UserContext);
  const [allServices, setAllServices] = useState([]); 
  const [platforms, setPlatforms] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null); 
  const [qty, setQty] = useState(100);
  const [link, setLink] = useState("");
  const [linkPlaceholder, setLinkPlaceholder] = useState("https://...");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [serviceError, setServiceError] = useState(null);
  const [systemStatus, setSystemStatus] = useState({ status: 'checking', message: 'Checking...' });
  const [recentOrders, setRecentOrders] = useState([]);
  const [userStats, setUserStats] = useState({ totalOrders: 0 });

  const platformMap = { youtube: Youtube, instagram: Instagram, twitter: Twitter, facebook: Facebook, tiktok: Music };
  const colorMap = { youtube: "text-red-500", instagram: "text-pink-500", twitter: "text-sky-400", facebook: "text-blue-600", tiktok: "text-black" };
  const bgMap = { youtube: "bg-red-500/10", instagram: "bg-pink-500/10", twitter: "bg-sky-400/10", facebook: "bg-blue-600/10", tiktok: "bg-gray-800/10" };

  const getServiceIcon = useCallback((name) => {
    const lower = name.toLowerCase();
    if (lower.includes('follower') || lower.includes('subscriber') || lower.includes('member') || lower.includes('friend')) return Users;
    if (lower.includes('like') || lower.includes('reaction')) return MessageCircle;
    if (lower.includes('view') || lower.includes('play')) return Eye;
    if (lower.includes('comment') || lower.includes('reply') || lower.includes('retweet') || lower.includes('share')) return TrendingUp;
    return Users;
  }, []);

  useEffect(() => {
    const initDashboardData = async () => {
      setIsLoading(true);
      setSystemStatus({ status: 'checking', message: 'Checking...' });
      
      try {
        const [servicesRes, ordersRes, analyticsRes] = await Promise.all([
          api.get('/services'),
          api.get('/user/orders'),
          api.get('/analytics')
        ]);
  
        if (servicesRes.data) {
          const rawData = servicesRes.data;
          setAllServices(rawData);
          const uniquePlatforms = [...new Set(rawData.map(s => s.platform))];
          const platformData = uniquePlatforms.map(p => ({ 
            name: p.charAt(0).toUpperCase() + p.slice(1), 
            icon: platformMap[p.toLowerCase()] || Zap, 
            color: colorMap[p.toLowerCase()] || "text-gray-400", 
            bg: bgMap[p.toLowerCase()] || "bg-gray-500/10" 
          }));
          setPlatforms(platformData);
          if (platformData.length > 0) {
            setSelectedPlatform(platformData[0]); 
          }
          setSystemStatus({ status: 'operational', message: 'Operational' });
        }
  
        if (ordersRes.data) {
          const orders = ordersRes.data.slice(0, 3).map(order => ({
            platform: order.platform ? order.platform.charAt(0).toUpperCase() + order.platform.slice(1) : 'N/A',
            service: order.serviceType ? order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1) : 'N/A',
            qty: order.quantity || 0,
            status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending',
          }));
          setRecentOrders(orders);
        }
  
        if (analyticsRes.data) {
          setUserStats(analyticsRes.data.stats || { totalOrders: 0 });
        }
  
      } catch (err) {
        console.error('Failed initialization:', err);
        setServiceError("Could not load services from our provider. Please try again later.");
        setSystemStatus({ status: 'disrupted', message: 'Service Disrupted' });
      } finally {
        setIsLoading(false);
      }
    };
    initDashboardData();
  }, []);

  const visibleServices = useMemo(() => {
    if (!selectedPlatform || allServices.length === 0) return [];
    
    const platformKey = selectedPlatform.name.toLowerCase().replace('x (', '').replace(')', '');
    return allServices
      .filter(s => s.platform === platformKey)
      .map(s => ({
        id: s.service,
        name: s.name, 
        price: s.price || 1,
        icon: getServiceIcon(s.name)
      }));
  }, [selectedPlatform, allServices, getServiceIcon]);

  useEffect(() => {
    if (visibleServices.length > 0) {
      setSelectedService(visibleServices[0]);
    } else {
      setSelectedService(null);
    }
  }, [visibleServices]);

  useEffect(() => {
    if (selectedService) {
      const serviceName = selectedService.name.toLowerCase();
      if (serviceName.includes('follower') || serviceName.includes('subscriber') || serviceName.includes('friend') || serviceName.includes('member')) {
        setLinkPlaceholder('Enter Profile/Channel URL');
      } else if (serviceName.includes('comment') || serviceName.includes('like') || serviceName.includes('view') || serviceName.includes('play')) {
        setLinkPlaceholder('Enter Post/Video URL');
      } else {
        setLinkPlaceholder('Enter the link for the service');
      }
    }
  }, [selectedService]);

  // With the backend now providing a per-unit price, this calculation is correct.
  const total = selectedService ? (qty * selectedService.price).toFixed(2) : "0.00";

  const openConfirmationModal = () => {
    if (!link) return alert("Please enter a link");
    if (!selectedService || !selectedPlatform) return alert("Please select a platform and service.");
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      const result = await placeOrder(selectedService, selectedPlatform.name.toLowerCase(), qty, link);
      setBalance(result.newBalance); 
      setNotification({ show: true, message: "Order placed successfully!", type: 'success' });
      setLink("");
      
      const newOrder = result.order;
      setRecentOrders(prev => [
        {
          platform: newOrder.platform ? newOrder.platform.charAt(0).toUpperCase() + newOrder.platform.slice(1) : 'N/A',
          service: newOrder.serviceType ? newOrder.serviceType.charAt(0).toUpperCase() + newOrder.serviceType.slice(1) : 'N/A',
          qty: newOrder.quantity || 0,
          status: newOrder.status ? newOrder.status.charAt(0).toUpperCase() + newOrder.status.slice(1) : 'Pending',
        },
        ...prev,
      ].slice(0, 3));
      setUserStats(prev => ({ ...prev, totalOrders: prev.totalOrders + 1 }));
    } catch (err) {
      setNotification({ show: true, message: err.response?.data?.msg || "Failed to place order.", type: 'error' });
    }
    setIsLoading(false);
    setIsModalOpen(false);
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  if (isLoading && allServices.length === 0) {
    return (
      <div className="min-h-screen flex text-white">
        <Sidebar />
        <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-6 lg:py-8 space-y-6 lg:space-y-10 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen flex text-white">
      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-6 lg:py-8 space-y-6 lg:space-y-10 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
        {/* BACKGROUND FADE */}
        <div className="absolute inset-0 pointer-events-none dashboard-bg-fade" />

        {/* HEADER */}
        <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="text-gray-400 text-sm sm:text-base mt-1">Boost your social media growth</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              systemStatus.status === 'operational' ? 'bg-emerald-500/20 text-emerald-400' :
              systemStatus.status === 'disrupted' ? 'bg-red-500/20 text-red-400' :
              'bg-amber-500/20 text-amber-400'
            }`}>
              <Zap size={12} /> {systemStatus.message}
            </span>
          </div>
        </motion.div>

        {/* NOTIFICATION */}
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl border ${
              notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            {notification.message}
          </motion.div>
        )}

        {/* QUICK STATS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5"
        >
          <StatCard icon={Wallet} label="Balance" value={`₦${balance.toLocaleString()}`} color="purple" />
          <StatCard icon={ShoppingCart} label="Orders" value={userStats.totalOrders.toString()} color="indigo" />
          <StatCard icon={Zap} label="Platforms" value={`${platforms.length} available`} color="emerald" />
        </motion.div>

        {/* ORDER GRID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-6"
        >
          <div className="glass card-hover rounded-2xl p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  <ShoppingCart size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">Create New Boost</h2>
                  <p className="text-sm text-gray-400">Choose the best service, set quantity, and launch.</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                <Star size={14} className="text-amber-400" /> Premium Options
              </span>
            </div>

            {/* PLATFORM SELECT */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">Select Platform</label>
                <span className="text-xs text-gray-400">Tap to choose</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {platforms.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPlatform(p)}
                    className={`group flex flex-col items-center gap-2 rounded-2xl border px-3 py-3 text-sm transition-all duration-300 ${
                      selectedPlatform && selectedPlatform.name === p.name
                        ? `${p.bg} border-current ${p.color} shadow-glow-sm`
                        : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20"
                    }`}
                  >
                    <p.icon size={20} className={selectedPlatform && selectedPlatform.name === p.name ? p.color : 'text-gray-300'} />
                    <span className="text-xs sm:text-sm font-medium">{p.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* SERVICE TYPE */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">Service Type</label>
                <span className="text-xs text-gray-400">{visibleServices.length} options</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {serviceError ? (
                  <div className="col-span-full rounded-2xl bg-red-500/10 p-4 text-center text-red-300">{serviceError}</div>
                ) : visibleServices.length > 0 ? (
                  visibleServices.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedService(s)}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 hover:scale-[1.01] ${
                        selectedService && selectedService.name === s.name
                          ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-glow-sm'
                          : 'bg-black/30 border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5">
                        <s.icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{s.name}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full rounded-2xl bg-white/5 p-4 text-center text-gray-400">No services available for this platform.</div>
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Post / Profile Link</label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={linkPlaceholder}
                  className="input-glass"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Quantity</label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="input-glass"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
          </div>

          {/* SUMMARY PANEL */}
          <div className="glass card-hover rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
              <div className="space-y-4">
                <SummaryRow label="Platform" value={selectedPlatform ? selectedPlatform.name : 'None selected'} icon={selectedPlatform?.icon} />
                <SummaryRow label="Service" value={selectedService ? selectedService.name : 'Select a service'} icon={selectedService?.icon} />
                <SummaryRow label="Quantity" value={qty.toLocaleString()} />
                <div className="border-t border-white/10 pt-4">
                  <SummaryRow label="Total Cost" value={`₦${Number(total).toLocaleString()}`} highlight />
                </div>
              </div>
            </div>

            <button
              onClick={openConfirmationModal}
              disabled={isLoading || !selectedService}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              aria-busy={isLoading}
            >
              {isLoading ? <RefreshCw size={18} className="animate-spin" /> : 'Place Order'}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* HISTORIC ORDERS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass card-hover rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <a href="/orders" className="text-sm text-purple-400 hover:text-purple-300 transition">View All</a>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? recentOrders.map((order, i) => (
              <OrderRow key={i} platform={order.platform} service={order.service} qty={order.qty.toString()} status={order.status} />
            )) : (
              <div className="text-center text-gray-400 py-4">No recent orders</div>
            )}
          </div>
        </motion.div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmOrder}
          loading={isLoading}
          orderDetails={{
            platform: selectedPlatform?.name,
            service: selectedService?.name,
            quantity: qty,
            total: `₦${Number(total).toLocaleString()}`
          }}
        />
      </main>
    </div>
  );
}

/* Helper Cards and Components placed safely down here */
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30"
  };
  return (
    <div className={`relative overflow-hidden rounded-3xl border ${colors[color]} bg-gradient-to-br p-5 shadow-glow-sm`}> 
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{label}</p>
          <p className="text-2xl font-semibold text-white mt-2">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight, icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm text-gray-200">
      <span className="flex items-center gap-2 text-gray-400">
        {Icon && <Icon size={14} />} {label}
      </span>
      <span className={highlight ? "text-purple-300 font-semibold text-lg" : "font-medium text-white"}>{value}</span>
    </div>
  );
}

function OrderRow({ platform, service, qty, status }) {
  const statusStyles = { Completed: "badge-success", Pending: "badge-warning", Processing: "badge-info", Failed: "badge-error" };
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 hover:border-white/20 transition duration-200">
      <div>
        <p className="font-semibold text-white">{platform} • {service}</p>
        <p className="text-xs text-gray-400">{qty} units</p>
      </div>
      <span className={statusStyles[status] || "badge-warning"}>{status}</span>
    </div>
  );
}