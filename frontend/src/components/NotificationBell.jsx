import { useState, useEffect, useRef } from 'react';
import { Bell, X, Mail, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import api from '../api'; // Assuming you have a configured axios instance

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

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const bellRef = useRef(null);
  
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isOpen && bellRef.current && !bellRef.current.contains(event.target)) {
        // A little trick to check if we are clicking inside the portal
        if (!event.target.closest('.notification-panel')) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);
  const markSpecificAsRead = async (id) => {
    // Optimistically update the UI
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      await api.post('/api/notifications/read', { ids: [id] });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert if API call fails
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length === 0) return;

    try {
      await api.post('/api/notifications/read/all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleBellClick = () => {
    if (bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 10, left: rect.left });
    }
    setIsOpen(!isOpen);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={bellRef}>
      <button onClick={handleBellClick} className="relative p-1.5 lg:p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Open notifications">
        <Bell className="text-gray-300" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#07091F]"
          >
            {unreadCount}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen &&
          createPortal(
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left - 280}px`, // Adjust to align right edge
              }}
              className="notification-panel w-80 sm:w-96 glass rounded-xl shadow-lg z-[100] overflow-hidden border border-white/10"
            >
              <div className="p-3 flex justify-between items-center border-b border-white/10 bg-black/30">
                <h3 className="font-bold text-base">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs flex items-center gap-1 text-purple-400 hover:text-white transition"
                  >
                    <CheckCheck size={14} /> Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n._id} className="p-3 border-b border-white/10 hover:bg-white/5 flex gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                        <Mail size={16} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{n.title}</p>
                        <p className="text-sm text-gray-300">{n.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.read && (
                        <button onClick={() => markSpecificAsRead(n._id)} className="flex-shrink-0" title="Mark as read">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-sm text-gray-400">
                    <Bell size={24} className="mx-auto mb-2 text-gray-500" />
                    <p>You're all caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>,
            document.body
          )}
      </AnimatePresence>
    </div>
  );
}