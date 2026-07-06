import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, CheckCheck, RefreshCw } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";

function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/notifications");
            console.log("Fetched notifications:", res.data);
            setNotifications(res.data);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            // Optimistically update the UI for a faster user experience
            const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
            setNotifications(updatedNotifications);
            // Then, send the request to the server
            await api.post('/api/notifications/read/all');
            // No need to refetch if the optimistic update is sufficient
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="flex min-h-screen bg-[#07091F] text-white">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
                <div className="max-w-4xl mx-auto space-y-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-2xl sm:text-3xl font-bold gradient-text flex items-center gap-2">
                            <Bell className="text-purple-400" />
                            Notifications {unreadCount > 0 && (
                                <span className="text-base font-medium px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-400 mt-1">Your recent account updates and alerts.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-end gap-4">
                        <button onClick={fetchNotifications} disabled={loading} className="btn-secondary flex items-center gap-2 text-sm">
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                        </button>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="btn-primary flex items-center gap-2 text-sm">
                                <CheckCheck size={14} /> Mark all as read
                            </button>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-4 sm:p-6">
                        {loading ? <LoadingSpinner text="Loading notifications..." /> : (
                            <div className="space-y-3">
                                {notifications.length > 0 ? (
                                    notifications.map(n => (
                                        <div key={n._id} className={`p-4 border-l-4 flex gap-4 items-start ${!n.read ? 'border-purple-500 bg-purple-500/10' : 'border-transparent bg-black/30'}`}>
                                            <div className="w-8 h-8 bg-purple-500/20 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                                                <Mail size={16} className="text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold">{n.title}</p>
                                                <p className="text-sm text-gray-300">{n.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        <Bell size={32} className="mx-auto mb-4 text-gray-500" />
                                        <p className="font-semibold">You're all caught up!</p>
                                        <p>No new notifications right now.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}