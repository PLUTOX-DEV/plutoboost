import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function FeaturePage({ title, description }) {
  return (
    <div className="min-h-screen bg-[#07091F] text-white pt-32 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 text-center"
      >
        <Sparkles className="mx-auto h-12 w-12 text-purple-400 mb-4" />
        <h1 className="text-5xl font-bold gradient-text">{title}</h1>
        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          {description}
        </p>
        <div className="mt-12 glass rounded-2xl p-8 text-left">
          Content for this feature will go here. You can describe the benefits, how it works, and add pricing or call-to-action buttons.
        </div>
      </motion.div>
    </div>
  );
}