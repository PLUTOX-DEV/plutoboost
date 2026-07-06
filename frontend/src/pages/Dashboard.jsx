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
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard() {
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
    <div className="min-h-screen flex text-white">
      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-6 lg:py-8 space-y-6 lg:space-y-10 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
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

        {/* STATS ROW */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 sm:gap-4"
        >
          <StatCard icon={Wallet} label="Balance" value={`₦${balance.toLocaleString()}`} color="purple" />
          <StatCard icon={ShoppingCart} label="Orders" value={userStats.totalOrders.toString()} color="indigo" />
        </motion.div>

        {/* ORDER FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <div className="lg:col-span-2 glass card-hover rounded-2xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  <ShoppingCart size={18} className="text-purple-400" />
                </div>
                New Order
              </h2>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Star size={12} className="text-yellow-400" /> Premium
              </span>
            </div>

            {/* PLATFORM SELECT */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Select Platform</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {platforms.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPlatform(p)}
                    className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border transition-all duration-300
                    ${selectedPlatform && selectedPlatform.name === p.name
                      ? `${p.bg} border-current ${p.color} shadow-glow-sm`
                      : "bg-black/40 border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <p.icon size={20} />
                    <span className="text-xs sm:text-sm">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SERVICE TYPE */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Service Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                {serviceError ? (
                  <div className="col-span-full text-center text-red-400 py-4 bg-red-500/10 rounded-lg">{serviceError}</div>
                ) : (
                  visibleServices.length > 0 ? visibleServices.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedService(s)}
                      className={`text-left flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-300 hover:border-purple-500/50
                      ${selectedService && selectedService.name === s.name
                        ? "bg-purple-600/20 border-purple-500 text-purple-300"
                        : "bg-black/40 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <s.icon size={16} />
                      <span className="text-xs sm:text-sm flex-1">{s.name}</span>
                    </button>
                  )) : (
                    <div className="col-span-full text-center text-gray-400 py-4">No services available for this platform</div>
                  )
                )}
              </div>
            </div>

            {/* LINK INPUT */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Post / Profile Link</label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder={linkPlaceholder}
                className="input-glass"
              />
            </div>

            {/* QUANTITY INPUT */}
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Quantity</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="input-glass"
                placeholder="Enter desired quantity"
              />
            </div>
          </div>

          {/* SUMMARY PANELS */}
          <div className="glass card-hover rounded-2xl p-4 sm:p-6 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 flex-1">
              <SummaryRow label="Platform" value={selectedPlatform ? selectedPlatform.name : "Loading..."} icon={selectedPlatform?.icon} />
              <SummaryRow label="Service" value={selectedService ? selectedService.name : "..."} icon={selectedService?.icon} />
              <SummaryRow label="Quantity" value={qty.toLocaleString()} />
              <div className="border-t border-white/10 pt-3 mt-3">
                <SummaryRow label="Total Cost" value={`₦${Number(total).toLocaleString()}`} highlight />
              </div>
            </div>

            <button
              onClick={openConfirmationModal}
              disabled={isLoading || !selectedService}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
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
function StatCard({ icon: Icon, label, value, trend, color }) {
  const colors = {
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30"
  };
  return (
    <div className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${colors[color]} border backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-lg font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-black/20 text-white"><Icon size={18} /></div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight, icon: Icon }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400 flex items-center gap-2">{Icon && <Icon size={14} />}{label}</span>
      <span className={highlight ? "text-purple-400 font-bold text-lg" : "font-medium"}>{value}</span>
    </div>
  );
}

function OrderRow({ platform, service, qty, status }) {
  const statusStyles = { Completed: "badge-success", Pending: "badge-warning", Processing: "badge-info", Failed: "badge-error" };
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-black/30 border border-white/5 rounded-xl p-4 hover:border-white/10 transition">
      <div>
        <p className="font-medium text-sm">{platform} • {service}</p>
        <p className="text-xs text-gray-400">{qty} units</p>
      </div>
      <span className={statusStyles[status] || "badge-warning"}>{status}</span>
    </div>
  );
}