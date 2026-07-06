import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Wallet, RefreshCw } from "lucide-react";
import api from "../api";

export default function OwnerWithdrawPanel() {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [banks, setBanks] = useState([]);
  const [resolvedAccountName, setResolvedAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await api.get('/api/admin/banks');
        setBanks(res.data);
      } catch (err) {
        setMessage({ type: 'error', text: 'Could not load bank list.' });
      }
    };
    fetchBanks();
  }, []);

  const resolveAccount = useCallback(async () => {
    if (accountNumber.length >= 10 && bankCode) {
      setResolving(true);
      setMessage({ type: '', text: '' });
      try {
        const res = await api.post('/api/admin/resolve-account', { accountNumber, bankCode });
        setResolvedAccountName(res.data.accountName);
      } catch (err) {
        setResolvedAccountName('');
        setMessage({ type: 'error', text: err.response?.data?.error || 'Could not resolve account.' });
      } finally {
        setResolving(false);
      }
    }
  }, [accountNumber, bankCode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      resolveAccount();
    }, 1000); // Debounce the resolve API call

    return () => {
      clearTimeout(handler);
    };
  }, [accountNumber, bankCode, resolveAccount]);

  const handleWithdraw = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      if (!resolvedAccountName) {
        throw new Error("Account details must be verified first.");
      }
      const res = await api.post('/api/admin/withdraw', {
        amount: Number(amount),
        accountNumber,
        bankCode,
        accountName: resolvedAccountName
      });
      setMessage({ type: 'success', text: res.data.message });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || err.message || 'Withdrawal failed' });
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass card-hover rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Wallet size={20} className="text-purple-400" />
        Owner Withdrawal
      </h3>
      <div className="space-y-4">
        <input
          type="number"
          placeholder="Amount (₦)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-glass w-full"
        />
        <select
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
          className="input-glass w-full"
        >
          <option value="">Select a Bank</option>
          {banks.map((bank, index) => (
            <option key={`${bank.code}-${bank.name}-${index}`} value={bank.code} className="bg-[#12002b]">
              {bank.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="input-glass w-full"
          maxLength="10"
        />
        <div className="relative">
          <input
            type="text"
            placeholder="Account Name (auto-resolved)"
            value={resolvedAccountName}
            readOnly
            className="input-glass w-full bg-black/30 text-gray-400"
          />
          {resolving && (
            <RefreshCw size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-purple-400" />
          )}
        </div>
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Withdraw Revenue'}
        </button>
        {message.text && (
          <p className={`text-sm text-center ${
            message.type === 'success' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {message.text}
          </p>
        )}
      </div>
    </motion.div>
  );
};