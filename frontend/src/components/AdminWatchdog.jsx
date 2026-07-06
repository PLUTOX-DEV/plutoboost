import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, RefreshCw, AlertTriangle, Info, CheckCircle } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import api from "../api";
import LoadingSpinner from "./LoadingSpinner";

const logIcons = {
  info: <Info size={16} className="text-blue-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  error: <AlertTriangle size={16} className="text-red-400" />,
};

const logColors = {
  info: "border-blue-500/20",
  warning: "border-amber-500/20",
  error: "border-red-500/20",
};

export default function AdminWatchdog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/logs/watchdog");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch watchdog logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#07091F] text-white flex">
      <AdminSidebar />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-6 lg:ml-72 xl:ml-80 2xl:ml-96">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Eye /> Watchdog Logs
          </h1>
          <p className="text-gray-400 mt-1">
            Live logs from the automated provider balance and daily report service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-end"
        >
          <button onClick={fetchLogs} disabled={loading} className="btn-secondary flex items-center gap-2">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Logs
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          {loading ? (
            <LoadingSpinner text="Fetching logs..." />
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div
                    key={log._id}
                    className={`flex items-start gap-4 p-3 bg-black/30 rounded-xl border ${logColors[log.level]}`}
                  >
                    <div className="mt-1">{logIcons[log.level] || <Info size={16} />}</div>
                    <div className="flex-1">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                      {log.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No watchdog logs found.</p>
                  <p className="text-sm">The service runs hourly and at midnight.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}