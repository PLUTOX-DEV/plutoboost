import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AffiliatePage() {
  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift size={40} className="text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">Coming Soon!</h1>
          <p className="text-gray-400 text-lg">
            Our exciting new affiliate program is under construction. Get ready to earn by sharing PlutoBoost with your friends and audience.
          </p>
          <Link to="/dashboard" className="mt-8 inline-block btn-primary">
            Back to Dashboard
          </Link>
        </motion.div>
      </main>
    </div>
  );
}