import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertTriangle, RefreshCw } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, orderDetails, loading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="glass rounded-2xl p-6 w-full max-w-md border border-white/10"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 mb-4">
              <AlertTriangle size={32} className="text-purple-400" />
            </div>
            <h2 className="text-xl font-bold">Confirm Your Order</h2>
            <p className="text-gray-400 mt-2 text-sm">Please review your order details before confirming.</p>
          </div>

          <div className="mt-6 space-y-4 text-sm border-t border-b border-white/10 py-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Platform:</span>
              <span className="font-medium">{orderDetails.platform}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Service:</span>
              <span className="font-medium">{orderDetails.service}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Quantity:</span>
              <span className="font-medium">{orderDetails.quantity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-purple-400 font-semibold">Total Cost:</span>
              <span className="font-bold text-purple-400 text-lg">{orderDetails.total}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
              {loading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;