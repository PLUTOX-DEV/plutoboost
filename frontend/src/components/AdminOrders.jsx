import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Eye,
  Edit,
  DollarSign,
  User,
  Calendar,
  Package,
  Menu,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import api from "../api";


const statusColors = {
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30"
};

const statusIcons = {
  completed: CheckCircle,
  processing: RefreshCw,
  pending: Clock,
  failed: XCircle
};

export default function AdminOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const fetchOrders = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/orders?page=${page}&limit=10&search=${search}`);
      const { orders: fetchedOrders, totalPages, currentPage } = res.data;
      setOrders(fetchedOrders.map(order => ({
        id: `#PB-${order._id.slice(-4)}`,
        user: order.user ? order.user.username : 'N/A',
        userEmail: order.user ? (order.user.email || 'N/A') : 'N/A',
        service: order.serviceType,
        providerOrderId: order.providerOrderId,
        platform: order.platform,
        quantity: order.quantity,
        price: order.price,
        profit: order.profit || 0, // Add profit to the mapped object
        status: order.status,
        date: order.createdAt,
        progress: order.status === 'completed' ? 100 : order.status === 'processing' ? 75 : 0,
        deliveryDate: order.status === 'completed' ? order.updatedAt : null
      })));
      setPagination({ currentPage, totalPages });
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders(pagination.currentPage, searchTerm);
    }, 500); // Debounce search requests

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, pagination.currentPage, statusFilter, fetchOrders]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      const providerOrderIds = orders
        .filter(o => o.status === 'Processing' || o.status === 'In Progress' || o.status === 'Pending')
        .map(o => o.providerOrderId)
        .filter(Boolean);

      if (providerOrderIds.length > 0) {
        await api.post('/api/admin/orders/status', { orderIds: providerOrderIds });
        // Refetch current page to see updates
        const handler = setTimeout(() => fetchOrders(pagination.currentPage, searchTerm), 500); // Now fetchOrders is in scope
        return () => clearTimeout(handler);
      }
    } catch (err) {
      console.error("Failed to refresh all statuses:", err);
      alert("Failed to refresh statuses.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === "completed").length,
    processing: orders.filter(o => o.status === "processing").length,
    pending: orders.filter(o => o.status === "pending").length,
    failed: orders.filter(o => o.status === "failed").length,
    // Corrected: Calculate revenue based on profit, not total price
    revenue: orders.reduce((sum, order) => sum + order.profit, 0)
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
          <h1 className="text-xl font-bold">Order Management</h1>
        </div>

        {/* DESKTOP HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block"
        >
          <h1 className="text-3xl font-bold gradient-text">Order Management</h1>
          <p className="text-gray-400 mt-1">
            Monitor and manage all customer orders across the platform
          </p>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          <StatCard title="Total Orders" value={stats.total} icon={ShoppingCart} color="blue" />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="emerald" />
          <StatCard title="Processing" value={stats.processing} icon={RefreshCw} color="blue" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="amber" />
          <StatCard title="Failed" value={stats.failed} icon={XCircle} color="red" />
          <StatCard title="Revenue" value={`₦${stats.revenue.toLocaleString()}`} icon={DollarSign} color="purple" />
        </motion.div>

        {/* FILTERS & SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID, user, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-glass pl-10 py-3"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2">
            <Filter size={16} className="text-purple-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none text-sm cursor-pointer"
            >
              <option className="bg-[#12002b]" value="all">All Status</option>
              <option className="bg-[#12002b]" value="completed">Completed</option>
              <option className="bg-[#12002b]" value="processing">Processing</option>
              <option className="bg-[#12002b]" value="pending">Pending</option>
              <option className="bg-[#12002b]" value="failed">Failed</option>
            </select>
          </div>
          <div className="flex items-center">
            <button onClick={handleRefreshAll} disabled={isRefreshing} className="btn-secondary flex items-center gap-2">
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              Refresh Statuses
            </button>
          </div>
        </motion.div>

        {/* ORDERS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block">
            <table className="w-full text-sm">
              <thead className="bg-black/40 text-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Order ID</th>
                  <th className="px-6 py-4 text-left font-medium">Customer</th>
                  <th className="px-6 py-4 text-left font-medium">Service</th>
                  <th className="px-6 py-4 text-left font-medium">Quantity</th>
                  <th className="px-6 py-4 text-left font-medium">Price</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Progress</th>
                  <th className="px-6 py-4 text-left font-medium">Date</th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const StatusIcon = statusIcons[order.status.toLowerCase()];
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-t border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 font-medium font-mono text-purple-400">{order.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{order.user}</p>
                          <p className="text-xs text-gray-400">{order.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{order.service}</p>
                          <p className="text-xs text-gray-400">{order.platform}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{order.quantity.toLocaleString()}</td>
                      <td className="px-6 py-4 text-purple-400 font-semibold">₦{order.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs border w-fit ${statusColors[order.status]}`}>
                          {StatusIcon && <StatusIcon size={12} className={order.status === "processing" ? "animate-spin" : ""} />}
                          {order.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 w-32">
                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${order.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              order.status === "completed" ? "bg-emerald-500" :
                              order.status === "failed" ? "bg-red-500" :
                              "bg-purple-500"
                            }`}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{order.progress}%</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-white/10 rounded">
                            <Eye size={14} />
                          </button>
                          <button className="p-1 hover:bg-white/10 rounded">
                            <Edit size={14} />
                          </button>
                          <button className="p-1 hover:bg-red-500/20 rounded">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden space-y-4 p-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status.toLowerCase()];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono font-medium text-purple-400">{order.id}</p>
                      <p className="text-sm text-gray-400 mt-1">{order.user}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs border ${statusColors[order.status]}`}>
                      {StatusIcon && <StatusIcon size={12} className={order.status === "processing" ? "animate-spin" : ""} />}
                      {order.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Service</p>
                      <p>{order.service}</p>
                      <p className="text-xs text-gray-500">{order.platform}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Quantity</p>
                      <p>{order.quantity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="text-purple-400 font-semibold">₦{order.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Progress</p>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            order.status === "completed" ? "bg-emerald-500" :
                            order.status === "failed" ? "bg-red-500" :
                            "bg-purple-500"
                          }`}
                          style={{ width: `${order.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{order.progress}%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-xs text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded">
                        <Eye size={14} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded">
                        <Edit size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

/* ===================== STAT CARD ===================== */
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
  };

  return (
    <div className={`glass p-3 rounded-xl border backdrop-blur-sm bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{title}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-black/20 ${colorClasses[color].split(' ').pop()}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
