import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Send,
  History,
  TrendingUp,
  Shield,
  Zap,
  Copy,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import Sidebar from '../components/Sidebar';
import UserContext from "../context/UserContext";

const quickActions = [
  { icon: Plus, label: "Add Funds", color: "from-purple-500 to-indigo-500", href: "/addfunds" },
  { icon: Send, label: "Withdraw", color: "from-cyan-500 to-blue-500", href: "#" },
  { icon: History, label: "History", color: "from-amber-500 to-orange-500", href: "#" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function WalletSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-pulse">
      {/* HEADER */}
      <div>
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      </div>

      {/* BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 h-48 bg-gray-800/50"></div>
        <div className="space-y-4">
          <div className="glass rounded-xl p-4 h-20 bg-gray-800/50"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 h-20 bg-gray-800/50"></div>
            <div className="glass rounded-xl p-4 h-20 bg-gray-800/50"></div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 h-28 bg-gray-800/50"></div>
        <div className="glass rounded-xl p-4 h-28 bg-gray-800/50"></div>
        <div className="glass rounded-xl p-4 h-28 bg-gray-800/50"></div>
      </div>

      {/* TRANSACTIONS */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-700"></div>
                <div>
                  <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-5 bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Wallet() {
  const { balance, setBalance } = useContext(UserContext);
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchTransactions = async (page = 1) => {
    console.log(`Fetching transactions for page: ${page}`);
    if (!initialLoading) setLoading(true);
    try {
      const res = await api.get(`/api/transactions?page=${page}&limit=10`);
      const { transactions: fetchedTransactions, totalPages, currentPage } = res.data;

      const formattedTxs = fetchedTransactions.map(tx => ({
        id: tx._id,
        type: tx.type,
        description: tx.description,
        amount: tx.type === 'deposit' || tx.type === 'refund' ? tx.amount : -tx.amount,
        date: new Date(tx.createdAt).toLocaleDateString(),
        status: tx.status || 'Completed',
      }));
      setTransactions(formattedTxs);
      // *** FIX: Only update pagination if it has actually changed to prevent infinite loop ***
      if (currentPage !== pagination.currentPage || totalPages !== pagination.totalPages) {
        setPagination({ currentPage, totalPages });
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (!reference) return;

    const verifyPayment = async () => {
      setPaymentProcessing(true);
      setNotification({ show: true, message: 'Payment received. Confirming with Paystack...' });

      try {
        const res = await api.post('/paystack/verify', { reference });
        setBalance(res.data.newBalance);
        setNotification({ show: true, message: res.data.message || 'Payment confirmed!', type: 'success' });
        if (pagination.currentPage !== 1) {
          setPagination(prev => ({ ...prev, currentPage: 1 }));
        } else {
          fetchTransactions(1);
        }
      } catch (err) {
        console.error('Payment verification failed:', err);
        setNotification({ show: true, message: 'Payment is being processed in the background. Your wallet and transactions will update shortly.', type: 'info' });
        setTimeout(() => fetchTransactions(1), 10000);
      } finally {
        setPaymentProcessing(false);
      }

      navigate('/wallet', { replace: true });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
    };

    verifyPayment();
  }, [searchParams, setBalance, navigate]);

  useEffect(() => {
    // This effect fetches transactions whenever the page number changes.
    fetchTransactions(pagination.currentPage);
  }, [pagination.currentPage]); // Reruns ONLY when the page number changes

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "deposits") return t.type === "deposit" || t.type === "refund";
    if (filter === "purchases") return t.type === "purchase";
    return true;
  });

  const handleWithdraw = () => {
    setNotification({ show: true, message: "Withdrawal feature is coming soon!", type: 'info' });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  if (initialLoading) {
    return (
      <div className="flex bg-[#07091F] text-white min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
          <WalletSkeleton />
        </main>
      </div>
    );
  };

  return (
    <div className="flex bg-[#07091F] text-white min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* HEADER */}
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
                <WalletIcon className="text-purple-400" size={24} />
                Wallet
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Manage your funds and transactions
              </p>
            </div>
          </motion.div>

          {/* BALANCE CARDS */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* MAIN BALANCE */}
            <div className="relative overflow-hidden glass rounded-2xl p-6 card-hover">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <WalletIcon size={16} />
                  Available Balance
                </div>
                <p className="text-3xl sm:text-4xl font-bold">₦{balance.toLocaleString()}</p>
                {/* <div className="flex items-center gap-2 mt-3 text-sm text-emerald-400">
                  <TrendingUp size={14} />
                  +₦12,500 this month
                </div> */}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="/addfunds" className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
                  <Plus size={16} />
                  Add Funds
                </a>
                <button onClick={handleWithdraw} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm">
                  <Send size={16} />
                  Withdraw
                </button>
              </div>
            </div>

            {/* PENDING & STATS */}
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pending Orders</p>
                    <p className="text-xl font-bold text-amber-400">{transactions.filter(t => t.status === 'Pending').length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/20">
                    <History size={20} className="text-amber-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 card-hover">
                  <p className="text-xs text-gray-400">Total Deposits</p>
                  <p className="text-lg font-bold text-emerald-400">₦{transactions.reduce((sum, t) => t.amount > 0 ? sum + t.amount : sum, 0).toLocaleString()}</p>
                </div>
                <div className="glass rounded-xl p-4 card-hover">
                  <p className="text-xs text-gray-400">Total Spent</p>
                  <p className="text-lg font-bold text-purple-400">₦{transactions.reduce((sum, t) => t.amount < 0 ? sum - t.amount : sum, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* QUICK ACTIONS */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-3"
          >
            {quickActions.map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="glass rounded-xl p-4 text-center card-hover group"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`} onClick={action.label === 'Withdraw' ? handleWithdraw : undefined}>
                  <action.icon size={20} />
                </div>
                <p className="text-sm font-medium">{action.label}</p>
              </a>
            ))}
          </motion.div>

          {/* TRANSACTIONS */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History size={18} className="text-purple-400" />
                Transaction History
              </h2>
              
              <div className="flex gap-2">
                {["all", "deposits", "purchases"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filter === f
                        ? "bg-purple-600 text-white"
                        : "bg-black/40 text-gray-400 hover:text-white"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <RefreshCw
                    size={32}
                    className="animate-spin text-purple-400"
                  />
                </div>
              ) : filteredTransactions.length === 0 ? (
                <p className="text-center text-gray-400 py-4">No transactions yet.</p>
              ) : (
                filteredTransactions.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`p-2.5 rounded-xl ${
                        tx.type === "deposit" || tx.type === "refund"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}>
                        {tx.type === "deposit" || tx.type === "refund" ? (
                          <ArrowDownRight size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{tx.description}</p>
                        <p className="text-xs text-gray-400">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.amount > 0 ? "text-emerald-400" : "text-white"
                      }`}>
                        {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        tx.status === "Completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
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
            )}
          </motion.div>

          {/* NOTIFICATION */}
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed bottom-10 right-10 z-50 p-4 rounded-xl border ${
                notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-red-500/20 border-red-500/30 text-red-300'
              }`}
            >
              {notification.message}
            </motion.div>
          )}

          {/* SECURITY INFO */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            <div className="glass rounded-xl p-4 flex items-center gap-3 card-hover">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Shield size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Wallet</p>
                <p className="text-xs text-gray-400">256-bit encryption</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3 card-hover">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Zap size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Instant Deposits</p>
                <p className="text-xs text-gray-400">Credit in seconds</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3 card-hover">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <CreditCard size={18} className="text-cyan-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Multiple Methods</p>
                <p className="text-xs text-gray-400">Card, Bank, Crypto</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
