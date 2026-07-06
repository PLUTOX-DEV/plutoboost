import { motion } from "framer-motion";
import {
  Link2,
  Copy,
  Users,
  Wallet,
  TrendingUp,
  CheckCircle,
  Clock,
  Crown,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Affiliate() {
  const referralLink = "https://plutoboost.com/r/johndoe";

  return (
    <div className="min-h-screen flex text-white">
      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-10 lg:ml-72 xl:ml-80 2xl:ml-96 max-w-7xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Affiliate Program</h1>
          <p className="text-gray-400 mt-1 max-w-xl">
            Earn commissions by referring users to PlutoBoost.
          </p>
        </motion.div>

        {/* REFERRAL LINK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass p-5 sm:p-6 rounded-2xl border border-white/10"
        >
          <div className="flex items-center gap-3 mb-3">
            <Link2 className="text-purple-400" />
            <h2 className="font-semibold text-lg">Your Referral Link</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              readOnly
              value={referralLink}
              className="flex-1 p-3 rounded-xl bg-black/40 border border-white/10 text-sm"
            />
            <button
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition flex items-center gap-2 justify-center"
            >
              <Copy size={16} />
              Copy
            </button>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <Stat title="Commission Balance" value="₦85,000" icon={Wallet} />
          <Stat title="Total Referrals" value="150" icon={Users} />
          <Stat title="Total Earnings" value="₦315,000" icon={TrendingUp} />
          <Stat title="Affiliate Tier" value="Gold" icon={Crown} />
        </div>

        {/* WITHDRAW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div>
            <p className="text-sm text-gray-400">Available Balance</p>
            <p className="text-3xl font-bold">₦85,000</p>
          </div>

          <button className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.03] transition">
            Withdraw Earnings
          </button>
        </motion.div>

        {/* HISTORY + TIERS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* HISTORY */}
          <div className="xl:col-span-2 glass p-6 rounded-2xl border border-white/10">
            <h2 className="font-semibold text-lg mb-4">
              Referral History
            </h2>

            <div className="space-y-3">
              <HistoryRow user="mike_smith" amount="₦1,500" status="Completed" />
              <HistoryRow user="jenny_doe" amount="₦1,800" status="Completed" />
              <HistoryRow user="alex_t" amount="₦1,200" status="Pending" />
            </div>
          </div>

          {/* TIERS */}
          <div className="glass p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="font-semibold text-lg">Affiliate Tiers</h2>

            <Tier
              name="Bronze"
              referrals="150"
              commission="10%"
              active
            />
            <Tier
              name="Silver"
              referrals="300"
              commission="15%"
            />
            <Tier
              name="Gold"
              referrals="500"
              commission="20%"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ title, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="glass p-5 rounded-2xl border border-white/10"
    >
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{title}</p>
        <Icon size={18} className="text-purple-400" />
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}

function HistoryRow({ user, amount, status }) {
  const isCompleted = status === "Completed";

  return (
    <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/10">
      <div>
        <p className="font-semibold">{user}</p>
        <p className="text-xs text-gray-400">{amount}</p>
      </div>

      <div
        className={`flex items-center gap-2 text-sm ${
          isCompleted ? "text-green-400" : "text-yellow-400"
        }`}
      >
        {isCompleted ? <CheckCircle size={16} /> : <Clock size={16} />}
        {status}
      </div>
    </div>
  );
}

function Tier({ name, referrals, commission, active }) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        active
          ? "border-purple-500 bg-purple-600/10"
          : "border-white/10 bg-black/40"
      }`}
    >
      <p className="font-semibold">{name} Tier</p>
      <p className="text-xs text-gray-400 mt-1">
        {referrals} referrals · {commission} commission
      </p>
    </div>
  );
}
