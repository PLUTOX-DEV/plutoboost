import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Search, Menu, TrendingUp, Landmark, ShoppingCart } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminFees() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [report, setReport] = useState({
    stats: { totalDepositFees: 0, totalOrderProfits: 0, totalRevenue: 0 },
    transactions: [],
  });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async (page = 1) => {
      setLoading(true);
      try {
        const res = await api.get(`/api/admin/fees-report?page=${page}&limit=15`);
        setReport(res.data);
        setPagination({ currentPage: res.data.currentPage, totalPages: res.data.totalPages });
      } catch (err) {
        console.error('Failed to fetch fees report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getFeeForTransaction = (transaction) => {
    if (transaction.type === 'deposit') {
      return transaction.fee || 0;
    }
    // For purchases, we need to find the corresponding order to get the profit.
    // This is a simplification; a real implementation might need a more direct link.
    // For now, we'll assume profit is not directly on the transaction object.
    // A better backend would return the profit on the transaction itself.
    return transaction.profit || 0; // Assuming 'profit' could be on the object
  };

  return (
    <div className="min-h-screen bg-[#07091F] text-white flex">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-6 lg:ml-72 xl:ml-80 2xl:ml-96">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold gradient-text">Fees & Revenue Report</h1>
          <p className="text-gray-400 mt-1">Breakdown of all collected fees and profits.</p>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <StatCard title="Total Deposit Fees" value={`₦${report.stats.totalDepositFees.toLocaleString()}`} icon={Landmark} color="blue" />
          <StatCard title="Total Order Profit" value={`₦${report.stats.totalOrderProfits.toLocaleString()}`} icon={ShoppingCart} color="purple" />
          <StatCard title="Total Revenue" value={`₦${report.stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} color="emerald" />
        </motion.div>

        {/* TRANSACTIONS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="p-4 sm:p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold">Fee History</h2>
          </div>
          {loading ? <LoadingSpinner text="Fetching fee history..." /> : (
            <table className="w-full text-sm">
              <thead className="bg-black/40 text-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">User</th>
                  <th className="px-6 py-4 text-left font-medium">Type</th>
                  <th className="px-6 py-4 text-left font-medium">Description</th>
                  <th className="px-6 py-4 text-left font-medium">Fee/Profit</th>
                  <th className="px-6 py-4 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {report.transactions.map((tx) => (
                  <motion.tr
                    key={tx._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{tx.user ? tx.user.username : 'User Deleted'}</p>
                        <p className="text-xs text-gray-400">{tx.user ? tx.user.email : 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs border ${
                        tx.type === 'deposit' ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400' : 'border-purple-500/30 bg-purple-500/20 text-purple-400'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{tx.description}</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold flex flex-col">
                      <span>+₦{getFeeForTransaction(tx).toLocaleString()}</span>
                      <span className="text-xs text-gray-500 font-normal">{tx.type === 'purchase' ? 'Profit' : 'Fee'}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
  };

  return (
    <div className={`glass p-4 rounded-xl border backdrop-blur-sm bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-black/20 ${colorClasses[color].split(' ').pop()}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}