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
  Minus,
  Plus,
  Send,
  AlertCircle,
  Clock,
  Sparkles,
  Crown,
  Layers,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard() {
  const { balance, setBalance, placeOrder } = useContext(UserContext);
  const [allServices, setAllServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [qty, setQty] = useState(100);
  const [link, setLink] = useState("");
  const [linkPlaceholder, setLinkPlaceholder] = useState("https://...");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [serviceError, setServiceError] = useState(null);
  const [systemStatus, setSystemStatus] = useState({ status: 'checking', message: 'Checking...' });
  const [recentOrders, setRecentOrders] = useState([]);
  const [userStats, setUserStats] = useState({ totalOrders: 0 });


  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const updateMobileView = () => setIsMobileView(mql.matches);
    updateMobileView();
    mql.addEventListener?.('change', updateMobileView);
    return () => mql.removeEventListener?.('change', updateMobileView);
  }, []);

  const getServiceIcon = useCallback((name) => {
    const lower = name.toLowerCase();
    if (lower.includes('follower') || lower.includes('subscriber') || lower.includes('member') || lower.includes('friend')) return Users;
    if (lower.includes('like') || lower.includes('reaction')) return MessageCircle;
    if (lower.includes('view') || lower.includes('play')) return Eye;
    if (lower.includes('comment') || lower.includes('reply') || lower.includes('retweet') || lower.includes('share')) return TrendingUp;
    if (lower.includes('premium') || lower.includes('pro')) return Crown;
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
          const uniqueCategories = [...new Set(rawData.map(s => s.category || 'General'))];
          setCategories(uniqueCategories);
          if (uniqueCategories.length > 0) {
            setSelectedCategory(uniqueCategories[0]);
            const firstService = rawData.find(s => (s.category || 'General') === uniqueCategories[0]);
            setSelectedService(firstService || null);
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
    if (!selectedCategory || allServices.length === 0) return [];

    return allServices
      .filter(s => (s.category || 'General') === selectedCategory)
      .map(s => ({
        ...s,
        icon: getServiceIcon(s.name),
      }));
  }, [selectedCategory, allServices, getServiceIcon]);

  useEffect(() => {
    if (visibleServices.length > 0 && (!selectedService || selectedService.category !== selectedCategory)) {
      setSelectedService(visibleServices[0]);
    }
  }, [visibleServices, selectedCategory]);

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

  const total = selectedService ? (qty * selectedService.price).toFixed(2) : "0.00";

  const openConfirmationModal = () => {
    if (!link) return alert("Please enter a link");
    if (!selectedService || !selectedCategory) return alert("Please select a category and service.");
    setIsModalOpen(true);
  };

  const adjustQty = (delta) => {
    setQty((prev) => Math.max(0, (Number(prev) || 0) + delta));
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      const result = await placeOrder(selectedService, selectedCategory?.toLowerCase() || selectedService?.category?.toLowerCase(), qty, link);
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
        <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 pt-16 sm:pt-6 lg:pt-6 lg:py-8 space-y-6 lg:space-y-10 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen flex text-white">
      <Sidebar />

      <main className="relative flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 pt-16 sm:pt-6 lg:pt-6 py-6 lg:py-8 space-y-5 sm:space-y-6 lg:space-y-10 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden pb-28 lg:pb-8">
        {/* BACKGROUND FADE */}
        <div className="absolute inset-0 pointer-events-none dashboard-bg-fade" />

        {/* HEADER */}
        <motion.div {...(isMobileView ? {} : fadeInUp)} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="text-gray-400 text-sm sm:text-base mt-1">Boost your social media growth</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
            {...(isMobileView ? {} : { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } })}
            className={`p-3 sm:p-4 rounded-xl border text-sm sm:text-base ${
              notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}
          >
            {notification.message}
          </motion.div>
        )}

        {/* QUICK STATS */}
        <motion.div
          {...(isMobileView ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 } })}
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
        >
          <StatCard icon={Wallet} label="Balance" value={`₦${balance.toLocaleString()}`} color="purple" />
          <StatCard icon={ShoppingCart} label="Orders" value={userStats.totalOrders.toString()} color="indigo" />
          <StatCard icon={Zap} label="Categories" value={`${categories.length} available`} color="emerald" className="xs:col-span-2 lg:col-span-1" />
        </motion.div>

        {/* ORDER GRID */}
        <motion.div
          {...(isMobileView ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 } })}
          className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-5 sm:gap-6"
        >
          <div className="glass card-hover rounded-2xl p-4 sm:p-6 space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 shrink-0">
                  <ShoppingCart size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">Create New Boost</h2>
                  <p className="text-xs sm:text-sm text-gray-400">Choose the best service, set quantity, and launch.</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 self-start">
                <Star size={14} className="text-amber-400" /> Premium Options
              </span>
            </div>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">Category</label>
                <span className="text-xs text-gray-400">Choose your service category</span>
              </div>

              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-glass w-full min-h-[44px] text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white">Service</label>
                <span className="text-xs text-gray-400">{visibleServices.length} option{visibleServices.length === 1 ? '' : 's'}</span>
              </div>

              {serviceError ? (
                <div className="rounded-2xl bg-red-500/10 p-4 text-center text-red-300 text-sm">{serviceError}</div>
              ) : visibleServices.length > 0 ? (
                <div className="space-y-3">
                  <div>
                    <select
                      value={selectedService?.id || ''}
                      onChange={(e) => setSelectedService(visibleServices.find(s => s.id === e.target.value) || null)}
                      className="input-glass w-full min-h-[44px] text-sm"
                    >
                      {visibleServices.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — ₦{s.price.toFixed(2)} per unit
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedService && (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Service</p>
                        <p className="text-sm font-medium">{selectedService.name}</p>
                      </div>
                      {selectedService.description && (
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Description</p>
                          <div className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap mt-1">
                            {selectedService.description.split('\n').map((line, i) => (
                              <p key={i} className={line.includes('~') ? 'text-yellow-400/80' : ''}>
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider">Category</p>
                          <p className="text-white font-medium">{selectedService.category || 'General'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider">Price unit</p>
                          <p className="text-white font-medium">{selectedService.rateUnit === 'per_1000' ? 'Per 1000' : 'Per unit'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl bg-white/5 p-6 text-center text-gray-400 text-sm">
                  <p>No services available for this category.</p>
                  <p className="text-xs mt-1 text-gray-500">Please select a different category</p>
                </div>
              )}
            </section>

            {/* LINK & QUANTITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <Send size={14} className="text-purple-400" />
                  Post / Profile Link
                </label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder={linkPlaceholder}
                  inputMode="url"
                  className="input-glass w-full min-h-[44px] text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustQty(-10)}
                    aria-label="Decrease quantity"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white active:scale-95 transition hover:border-white/20"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="input-glass w-full min-h-[44px] text-center text-sm"
                    placeholder="Enter quantity"
                  />
                  <button
                    type="button"
                    onClick={() => adjustQty(10)}
                    aria-label="Increase quantity"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-white active:scale-95 transition hover:border-white/20"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SUMMARY PANEL */}
          <div className="hidden xl:flex glass card-hover rounded-2xl p-4 sm:p-6 flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  <Layers size={16} className="text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>
              <div className="space-y-4">
                <SummaryRow label="Category" value={selectedCategory || 'None selected'} />
                <SummaryRow label="Service" value={selectedService ? selectedService.name : 'Select a service'} />
                <SummaryRow label="Quantity" value={qty.toLocaleString()} />
                <div className="border-t border-white/10 pt-4">
                  <SummaryRow label="Total Cost" value={`₦${Number(total).toLocaleString()}`} highlight />
                </div>
              </div>
            </div>

            <button
              onClick={openConfirmationModal}
              disabled={isLoading || !selectedService}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[52px] shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              aria-busy={isLoading}
            >
              {isLoading ? <RefreshCw size={18} className="animate-spin" /> : 'Place Order'}
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Compact summary card shown inline on mobile/tablet */}
          <div className="glass card-hover rounded-2xl p-4 sm:p-6 space-y-4 xl:hidden">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                <Layers size={16} className="text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold">Order Summary</h2>
            </div>
            <div className="space-y-3">
              <SummaryRow label="Category" value={selectedCategory || 'None selected'} />
              <SummaryRow label="Service" value={selectedService ? selectedService.name : 'Select a service'} />
              <SummaryRow label="Quantity" value={qty.toLocaleString()} />
              <div className="border-t border-white/10 pt-3">
                <SummaryRow label="Total Cost" value={`₦${Number(total).toLocaleString()}`} highlight />
              </div>
            </div>
          </div>
        </motion.div>

        {/* HISTORIC ORDERS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass card-hover rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                <Clock size={16} className="text-purple-400" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold">Recent Orders</h2>
            </div>
            <a href="/orders" className="text-sm text-purple-400 hover:text-purple-300 transition flex items-center gap-1 group">
              View All
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </a>
          </div>
          <div className="space-y-3">
            {recentOrders.length > 0 ? recentOrders.map((order, i) => (
              <OrderRow key={i} platform={order.platform} service={order.service} qty={order.qty.toString()} status={order.status} />
            )) : (
              <div className="text-center text-gray-400 py-8 text-sm">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <ShoppingCart size={24} className="text-gray-500" />
                </div>
                <p>No recent orders</p>
                <p className="text-xs text-gray-500 mt-1">Start boosting your social media today</p>
              </div>
            )}
          </div>
        </motion.div>

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmOrder}
          loading={isLoading}
          orderDetails={{
            platform: selectedCategory || selectedService?.category,
            service: selectedService?.name,
            quantity: qty,
            total: `₦${Number(total).toLocaleString()}`
          }}
        />

        {/* STICKY MOBILE ORDER BAR */}
        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-black/90 backdrop-blur-lg px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wide text-gray-400">Total</p>
              <p className="text-lg font-semibold text-purple-300 truncate">₦{Number(total).toLocaleString()}</p>
            </div>
            <button
              onClick={openConfirmationModal}
              disabled={isLoading || !selectedService}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[52px] text-sm font-semibold px-4 shadow-lg shadow-purple-500/25"
              aria-busy={isLoading}
            >
              {isLoading ? <RefreshCw size={18} className="animate-spin" /> : 'Place Order'}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Helper Cards and Components */
function StatCard({ icon: Icon, label, value, color, className = "" }) {
  const colors = {
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30"
  };
  
  const iconColors = {
    purple: "text-purple-400",
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
  };
  
  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border ${colors[color]} bg-gradient-to-br p-4 sm:p-5 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 ${className}`}> 
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-current/5 to-transparent rounded-full blur-2xl" />
      <div className="flex items-start justify-between gap-3 sm:gap-4 relative">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-400 truncate">{label}</p>
          <p className="text-base sm:text-xl lg:text-2xl font-bold text-white mt-1 sm:mt-2 truncate">{value}</p>
        </div>
        <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl bg-black/20 ${iconColors[color]}`}>
          <Icon size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight, icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm text-gray-200">
      <span className="flex items-center gap-2 text-gray-400 shrink-0">
        {Icon && <Icon size={14} />} {label}
      </span>
      <span className={`truncate text-right ${highlight ? "text-purple-300 font-semibold text-lg" : "font-medium text-white"}`}>{value}</span>
    </div>
  );
}

function OrderRow({ platform, service, qty, status }) {
  const statusStyles = { 
    Completed: "badge-success", 
    Pending: "badge-warning", 
    Processing: "badge-info", 
    Failed: "badge-error" 
  };
  
  const statusIcons = {
    Completed: CheckCircle2,
    Pending: Clock,
    Processing: RefreshCw,
    Failed: XCircle,
  };
  
  const Icon = statusIcons[status] || Clock;
  
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 rounded-2xl sm:rounded-3xl border border-white/10 bg-black/20 p-3.5 sm:p-4 hover:border-white/20 transition duration-200">
      <div className="min-w-0">
        <p className="font-semibold text-white text-sm sm:text-base truncate">{platform} • {service}</p>
        <p className="text-xs text-gray-400">{qty} units</p>
      </div>
      <span className={`${statusStyles[status] || "badge-warning"} self-start sm:self-auto text-xs px-3 py-1 rounded-full flex items-center gap-1`}>
        <Icon size={12} className={status === "Processing" ? "animate-spin" : ""} />
        {status}
      </span>
    </div>
  );
}