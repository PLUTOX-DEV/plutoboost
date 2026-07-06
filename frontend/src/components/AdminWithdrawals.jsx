import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ArrowDownRight,
  DollarSign,
  User,
  Calendar,
  Banknote,
  Menu,
  Eye,
  Edit,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const withdrawals = [
  {
    id: "#WD-1001",
    user: "Admin",
    userEmail: "admin@plutoboost.com",
    amount: 50000,
    method: "Bank Transfer",
    accountDetails: "GTBank - 0123456789",
    status: "completed",
    requestedDate: "2024-01-20",
    processedDate: "2024-01-20",
    notes: "Monthly profit withdrawal"
  },
  {
    id: "#WD-1002",
    user: "John Adebayo",
    userEmail: "john@example.com",
    amount: 25000,
    method: "Bank Transfer",
    accountDetails: "First Bank - 1234567890",
    status: "pending",
    requestedDate: "2024-01-19",
    processedDate: null,
    notes: "Commission withdrawal"
  },
  {
    id: "#WD-1003",
    user: "Sarah Johnson",
    userEmail: "sarah@example.com",
    amount: 15000,
    method: "Crypto",
    accountDetails: "BTC: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    status: "processing",
    requestedDate: "2024-01-18",
    processedDate: null,
    notes: "Affiliate earnings"
  },
  {
    id: "#WD-1004",
    user: "Mike Chen",
    userEmail: "mike@example.com",
    amount: 30000,
    method: "Bank Transfer",
    accountDetails: "Zenith Bank - 0987654321",
    status: "rejected",
    requestedDate: "2024-01-17",
    processedDate: null,
    notes: "Insufficient balance verification"
  },
  {
    id: "#WD-1005",
    user: "Amara Okafor",
    userEmail: "amara@example.com",
    amount: 10000,
    method: "Bank Transfer",
    accountDetails: "UBA - 1122334455",
    status: "completed",
    requestedDate: "2024-01-16",
    processedDate: "2024-01-16",
    notes: "Service fee withdrawal"
  }
];

const statusColors = {
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30"
};

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  processing: Clock,
  rejected: XCircle
};

export default function AdminWithdrawals() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: withdrawals.length,
    completed: withdrawals.filter(w => w.status === "completed").length,
    pending: withdrawals.filter(w => w.status === "pending").length,
    processing: withdrawals.filter(w => w.status === "processing").length,
    rejected: withdrawals.filter(w => w.status === "rejected").length,
    totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
    completedAmount: withdrawals.filter(w => w.status === "completed").reduce((sum, w) => sum + w.amount, 0)
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
          <h1 className="text-xl font-bold">Withdrawal Management</h1>
        </div>

        {/* DESKTOP HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block"
        >
          <h1 className="text-3xl font-bold gradient-text">Withdrawal Management</h1>
          <p className="text-gray-400 mt-1">
            Process and manage all withdrawal requests from users and admin
          </p>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
        >
          <StatCard title="Total Requests" value={stats.total} icon={Wallet} color="blue" />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="emerald" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="amber" />
          <StatCard title="Processing" value={stats.processing} icon={Clock} color="blue" />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="red" />
          <StatCard title="Total Amount" value={`₦${stats.totalAmount.toLocaleString()}`} icon={DollarSign} color="purple" />
          <StatCard title="Paid Out" value={`₦${stats.completedAmount.toLocaleString()}`} icon={ArrowDownRight} color="emerald" />
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
              placeholder="Search withdrawals by ID, user, or method..."
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
              <option className="bg-[#12002b]" value="pending">Pending</option>
              <option className="bg-[#12002b]" value="processing">Processing</option>
              <option className="bg-[#12002b]" value="rejected">Rejected</option>
            </select>
          </div>
        </motion.div>

        {/* WITHDRAWALS TABLE */}
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
                  <th className="px-6 py-4 text-left font-medium">Withdrawal ID</th>
                  <th className="px-6 py-4 text-left font-medium">User</th>
                  <th className="px-6 py-4 text-left font-medium">Amount</th>
                  <th className="px-6 py-4 text-left font-medium">Method</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Requested</th>
                  <th className="px-6 py-4 text-left font-medium">Processed</th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.map((withdrawal) => {
                  const StatusIcon = statusIcons[withdrawal.status];
                  return (
                    <motion.tr
                      key={withdrawal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-t border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 font-medium font-mono text-purple-400">{withdrawal.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{withdrawal.user}</p>
                          <p className="text-xs text-gray-400">{withdrawal.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ArrowDownRight size={16} className="text-red-400" />
                          <span className="text-red-400 font-semibold">₦{withdrawal.amount.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{withdrawal.method}</p>
                          <p className="text-xs text-gray-400 truncate max-w-48">{withdrawal.accountDetails}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs border w-fit ${statusColors[withdrawal.status]}`}>
                          <StatusIcon size={12} className={withdrawal.status === "processing" ? "animate-spin" : ""} />
                          {withdrawal.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(withdrawal.requestedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {withdrawal.processedDate ? new Date(withdrawal.processedDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-white/10 rounded">
                            <Eye size={14} />
                          </button>
                          <button className="p-1 hover:bg-white/10 rounded">
                            <Edit size={14} />
                          </button>
                          {withdrawal.status === "pending" && (
                            <>
                              <button className="p-1 hover:bg-emerald-500/20 rounded">
                                <CheckCircle size={14} />
                              </button>
                              <button className="p-1 hover:bg-red-500/20 rounded">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
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
            {filteredWithdrawals.map((withdrawal) => {
              const StatusIcon = statusIcons[withdrawal.status];
              return (
                <motion.div
                  key={withdrawal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono font-medium text-purple-400">{withdrawal.id}</p>
                      <p className="text-sm text-gray-400 mt-1">{withdrawal.user}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs border ${statusColors[withdrawal.status]}`}>
                      <StatusIcon size={12} className={withdrawal.status === "processing" ? "animate-spin" : ""} />
                      {withdrawal.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Amount</p>
                      <p className="text-red-400 font-semibold flex items-center gap-1">
                        <ArrowDownRight size={14} />
                        ₦{withdrawal.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Method</p>
                      <p>{withdrawal.method}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400">Account Details</p>
                      <p className="text-xs text-gray-500 truncate">{withdrawal.accountDetails}</p>
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-400">Notes</p>
                    <p className="text-gray-300">{withdrawal.notes}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <div className="text-xs text-gray-400">
                      <p>Requested: {new Date(withdrawal.requestedDate).toLocaleDateString()}</p>
                      {withdrawal.processedDate && (
                        <p>Processed: {new Date(withdrawal.processedDate).toLocaleDateString()}</p>
                      )}
                    </div>
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
        <div className="flex justify-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition">
            Previous
          </button>
          <button className="px-4 py-2 rounded-lg bg-purple-600 text-sm">1</button>
          <button className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition">
            2
          </button>
          <button className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition">
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
          <p className="text-sm font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-black/20 ${colorClasses[color].split(' ').pop()}`}>
          <Icon size={16} />
        </div>
      </div>
    </div>
  );
}
