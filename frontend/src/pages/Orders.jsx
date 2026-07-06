import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, RefreshCw } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { DashboardSkeleton } from "../components/Skeletons";
import LoadingSpinner from "../components/LoadingSpinner";

const statusStyles = {
  Completed: "badge-success",
  Pending: "badge-warning",
  Processing: "badge-info",
  'In progress': "badge-info",
  Partial: "badge-info",
  Canceled: "badge-error",
  Failed: "badge-error",
};

function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

const OrderCard = ({ order, index }) => {
  const friendlyId = `#PB-${order._id.slice(-4).toUpperCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-2xl p-4 sm:p-5 border border-white/10"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">{friendlyId}</span>
            <span className={statusStyles[order.status] || "badge-warning"}>{order.status}</span>
          </div>
          <p className="font-semibold text-base sm:text-lg">{order.serviceType}</p>
          <p className="text-sm text-gray-300">{order.quantity.toLocaleString()} {order.platform} units</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-lg sm:text-xl font-bold">₦{order.price.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{timeAgo(order.createdAt)}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-xs text-gray-400 break-all">Link: <span className="text-gray-200">{order.link}</span></p>
      </div>
    </motion.div>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async (search = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/user/orders`, { params: { search } });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(searchTerm);
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(order =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#07091F] text-white">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
              <ShoppingCart className="text-purple-400" />
              Your Orders
            </h1>
            <p className="text-gray-400 mt-1">A complete history of all your boosts.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Order ID, service, or status..."
                  className="input-glass w-full pl-11"
                />
              </div>
              <button type="submit" className="btn-secondary flex items-center justify-center gap-2">
                <Search size={16} /> Search
              </button>
              <button type="button" onClick={() => fetchOrders()} disabled={loading} className="btn-secondary flex items-center justify-center gap-2">
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </form>
          </motion.div>

          <div className="space-y-4">
            {loading ? (
              <LoadingSpinner text="Refreshing orders..." />
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <OrderCard key={order._id} order={order} index={index} />
              ))
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <ShoppingCart size={40} className="mx-auto text-gray-600" />
                <h3 className="mt-4 text-lg font-semibold">No Orders Found</h3>
                <p className="text-gray-400 mt-1">
                  {searchTerm ? "Try adjusting your search." : "You haven't placed any orders yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}