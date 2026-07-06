import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function InfoPage({ title, children }) {
  return (
    <div className="min-h-screen bg-[#07091F] text-white">
      <Navbar />
      <div className="pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto px-6"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">{title}</h1>
          </div>
          <div className="glass rounded-2xl p-8 space-y-4 prose prose-invert prose-lg max-w-none">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}