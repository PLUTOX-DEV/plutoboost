import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Search, Menu, CheckCircle } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import LoadingSpinner from "./LoadingSpinner";
import api from "../api";

export default function AdminDeposits() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const res = await api.get('/api/admin/deposits');
        setDeposits(res.data);
      } catch (err) {
        console.error('Failed to fetch deposits:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  const filteredDeposits = deposits.filter(deposit =>
    (deposit.user?.username.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (deposit.user?.email.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    deposit.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-xl font-bold">Deposit History</h1>
        </div>

        {/* DESKTOP HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block"
        >
          <h1 className="text-3xl font-bold gradient-text">Deposit History</h1>
          <p className="text-gray-400 mt-1">
            View all successful wallet funding transactions
          </p>
        </motion.div>

        {/* FILTERS & SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, email, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-glass pl-10 py-3"
            />
          </div>
        </motion.div>

        {/* DEPOSITS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {loading ? (
            <LoadingSpinner text="Fetching deposit history..." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/40 text-gray-400">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium">User</th>
                    <th className="px-6 py-4 text-left font-medium">Amount</th>
                    <th className="px-6 py-4 text-left font-medium">Description</th>
                    <th className="px-6 py-4 text-left font-medium">Type</th>
                    <th className="px-6 py-4 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeposits.length > 0 ? (
                    filteredDeposits.map((deposit) => (
                      <motion.tr key={deposit._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-white/5 hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{deposit.user?.username || 'N/A'}</p>
                            <p className="text-xs text-gray-400">{deposit.user?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-emerald-400 font-semibold">+₦{deposit.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">{deposit.description}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-emerald-400">
                            <CheckCircle size={14} />
                            {deposit.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{new Date(deposit.createdAt).toLocaleString()}</td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-gray-400">
                        No deposits found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}