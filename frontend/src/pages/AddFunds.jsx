import { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Landmark,
  Bitcoin,
  ShieldCheck,
  Wallet,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Copy,
  QrCode,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { useUser } from "../context/UserContext";
import api from "../api";

const amounts = [5000, 10000, 15000, 25000, 50000, 100000];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AddFunds() {
  const { balance, user, setBalance } = useUser();
  const [amount, setAmount] = useState(15000);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [depositFee, setDepositFee] = useState(2.5); // Default fee percentage

  const finalAmount = customAmount ? Number(customAmount) : amount;
  const feeAmount = finalAmount * (depositFee / 100);
  const amountToReceive = finalAmount - feeAmount;

  const handleFundWallet = async () => {
    setLoading(true);
    try {
      // Initialize Paystack payment
      const res = await api.post('/paystack/initialize', { amount: finalAmount });
      const { url } = res.data;

      // Open Paystack payment page
      window.location.href = url;
    } catch (err) {
      console.error("Funding error:", err);
      alert('Failed to fund wallet. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />

      <main className="relative flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-6 lg:py-8 overflow-hidden lg:ml-72 xl:ml-80 2xl:ml-96">
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed_0%,transparent_55%),radial-gradient(circle_at_bottom,#9333ea_0%,transparent_60%)] opacity-30 pointer-events-none" />

        <div className="relative z-10 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
          {/* HEADER */}
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
                <Sparkles className="text-purple-400" size={24} />
                Add Funds
              </h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">
                Fund your wallet securely
              </p>
            </div>

            <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Wallet size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Current Balance</p>
                <p className="font-bold text-lg">₦{balance.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* AMOUNT SELECTION */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass card-hover rounded-2xl p-4 sm:p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  <Zap size={18} className="text-purple-400" />
                </div>
                Choose Amount
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`relative py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                      amount === amt && !customAmount
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-glow-sm"
                        : "bg-black/40 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10"
                    }`}
                  >
                    {amt === 15000 && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                        POPULAR
                      </span>
                    )}
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* CUSTOM AMOUNT */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Or enter custom amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="input-glass pl-8"
                  />
                </div>
              </div>

              {/* BONUS INFO */}
              {finalAmount >= 50000 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="text-sm text-amber-400">
                    +5% bonus on deposits above ₦50,000!
                  </span>
                </div>
              )}
            </motion.div>

            {/* PAYMENT SUMMARY & ACTION */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 glass card-hover rounded-2xl p-4 sm:p-6 space-y-5"
            >
              <h2 className="text-lg font-semibold">Summary</h2>
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount to pay</span>
                  <span className="text-2xl font-bold">₦{finalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Processing Fee ({depositFee}%)</span>
                  <span className="text-red-400">-₦{feeAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                  <span className="text-gray-400">You will receive</span>
                  <span className="text-xl font-bold text-emerald-400">
                    ₦{amountToReceive.toLocaleString()}
                  </span>
                </div>
                {finalAmount >= 50000 && (
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-amber-400">Bonus (5%)</span>
                    <span className="text-amber-400">+₦{(finalAmount * 0.05).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleFundWallet}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} className="text-green-400" />
                Secured by Paystack
              </div>
            </motion.div>
          </div>

          {/* NOTIFICATION */}
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed bottom-10 right-10 z-50 p-4 rounded-xl border bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
              >
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* FEATURES */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <FeatureCard icon={Zap} title="Instant" description="Credit in seconds" />
            <FeatureCard icon={ShieldCheck} title="Secure" description="256-bit encryption" />
            <FeatureCard icon={CheckCircle} title="No Fees" description="Zero hidden charges" />
            <FeatureCard icon={Sparkles} title="Bonus" description="On large deposits" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="glass rounded-xl p-3 sm:p-4 text-center card-hover">
      <Icon size={20} className="mx-auto text-purple-400 mb-2" />
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-[10px] sm:text-xs text-gray-400">{description}</p>
    </div>
  );
}
