import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Edit, Trash2, X, Send, User, Users, CheckCircle, AlertCircle } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import api from "../api";
import LoadingSpinner from "./LoadingSpinner";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({ title: '', message: '', userId: '' });
  const [status, setStatus] = useState({ type: '', text: '' });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/notifications");
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

  const openModal = (notification = null) => {
    setEditingNotification(notification);
    setFormData({
      title: notification ? notification.title : '',
      message: notification ? notification.message : '',
      userId: notification ? notification.user : ''
    });
    setStatus({ type: '', text: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotification(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await api.delete(`/api/admin/notifications/${id}`);
        setNotifications(notifications.filter(n => n._id !== id));
      } catch (err) {
        console.error('Failed to delete notification:', err);
        alert('Failed to delete notification.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });
    const payload = { title: formData.title, message: formData.message, userId: formData.userId || undefined };

    try {
      if (editingNotification) {
        // Update
        const res = await api.put(`/api/admin/notifications/${editingNotification._id}`, payload);
        setNotifications(notifications.map(n => n._id === editingNotification._id ? res.data : n));
        setStatus({ type: 'success', text: 'Notification updated successfully!' });
      } else {
        // Create
        const res = await api.post('/api/admin/notifications', payload);
        setNotifications([res.data, ...notifications]);
        setStatus({ type: 'success', text: 'Notification sent successfully!' });
      }
      setTimeout(() => closeModal(), 1000);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07091F] text-white flex">
      <AdminSidebar />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-6 lg:ml-72 xl:ml-80 2xl:ml-96">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3"><Bell /> Notifications</h1>
            <p className="text-gray-400 mt-1">Create, view, and manage user notifications.</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Create Notification
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
          {loading ? <LoadingSpinner text="Fetching notifications..." /> : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {notifications.map((n) => (
                <div key={n._id} className="flex items-center gap-4 p-3 bg-black/30 rounded-xl border border-white/10">
                  <div className="flex-1">
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-sm text-gray-300">{n.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                      {n.isBroadcast ? (
                        <span className="flex items-center gap-1"><Users size={12} /> Broadcast</span>
                      ) : (
                        <span className="flex items-center gap-1"><User size={12} /> To: {n.user}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(n)} className="p-2 hover:bg-white/10 rounded-lg"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(n._id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="admin-notification-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-6 w-full max-w-lg border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingNotification ? 'Edit' : 'Create'} Notification</h2>
                <button onClick={closeModal} className="p-1 rounded-full hover:bg-white/10"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-glass w-full mt-1"
                    placeholder="e.g., Welcome to PlutoBoost!"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-glass w-full mt-1"
                    rows="4"
                    placeholder="Your notification content here..."
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm text-gray-400">User ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="input-glass w-full mt-1"
                    placeholder="Leave blank to broadcast to all users"
                    disabled={!!editingNotification && !editingNotification.isBroadcast}
                  />
                </div>

                {status.text && (
                  <div
                    className={`flex items-center gap-3 text-sm p-3 rounded-lg ${
                      status.type === "success"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {status.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {status.text}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    <Send size={16} />
                    {loading ? 'Sending...' : (editingNotification ? 'Save Changes' : 'Send Notification')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}