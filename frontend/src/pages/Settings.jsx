import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Link2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Trash2,
  RefreshCw,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import GoogleIcon from "../components/icons/GoogleIcon";
import UserContext from "../context/UserContext";
import api from "../api";
import XIcon from "../components/icons/XIcon";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function SettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-pulse">
      {/* Header */}
      <div className="h-10 bg-gray-700/50 rounded-lg w-1/3"></div>
      {/* Profile Section */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="h-6 bg-gray-700/50 rounded w-1/4"></div>
        <div className="h-12 bg-gray-700/50 rounded-lg"></div>
        <div className="h-12 bg-gray-700/50 rounded-lg"></div>
      </div>
      {/* Password Section */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="h-6 bg-gray-700/50 rounded w-1/4"></div>
        <div className="h-12 bg-gray-700/50 rounded-lg"></div>
        <div className="h-12 bg-gray-700/50 rounded-lg"></div>
        <div className="h-12 bg-gray-700/50 rounded-lg"></div>
      </div>
      <div className="flex justify-end">
        <div className="h-12 w-40 bg-gray-700/50 rounded-lg"></div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { user, setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    loading: false,
  });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        username: user.username,
        email: user.email,
      }));
    }
  }, [user]);

  const [connectedAccounts, setConnectedAccounts] = useState({
    google: true,
    twitter: false,
  });

  const handleSave = async () => {
    setProfile(prev => ({ ...prev, loading: true }));
    setNotification({ show: false, message: '', type: '' });
    try {
      if (profile.username !== user.username || profile.email !== user.email) {
        const res = await api.put('/api/user/profile', { username: profile.username, email: profile.email });
        setUser(prevUser => ({ ...prevUser, username: profile.username, email: profile.email }));
      }

      if (profile.newPassword) {
        if (profile.newPassword !== profile.confirmPassword) {
          setNotification({ show: true, message: 'New passwords do not match.', type: 'error' });
          return;
        }
        await api.put('/api/user/password', { currentPassword: profile.currentPassword, newPassword: profile.newPassword });
        setProfile(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      }

      setNotification({ show: true, message: 'Settings saved successfully!', type: 'success' });
    } catch (err) {
      setNotification({ show: true, message: err.response?.data?.error || 'Failed to save settings.', type: 'error' });
    } finally {
      setProfile(prev => ({ ...prev, loading: false }));
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
    }
  };

  const handleDeleteAccount = async () => {
    setProfile(prev => ({ ...prev, loading: true }));
    try {
      await api.delete('/api/user/account');
      // This should ideally trigger a full logout and redirect from the context
      alert("Account deleted successfully. You will be logged out.");
      window.location.href = '/login';
    } catch (err) {
      setNotification({ show: true, message: err.response?.data?.error || 'Failed to delete account.', type: 'error' });
      setProfile(prev => ({ ...prev, loading: false }));
    }
  };

  const toggleConnection = (provider) => {
    setConnectedAccounts(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  if (!user) {
    return (
      <div className="flex min-h-screen bg-[#07091F] text-white">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden"><SettingsSkeleton /></main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#07091F] text-white">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 lg:ml-72 xl:ml-80 2xl:ml-96 overflow-x-hidden">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* HEADER */}
          <motion.div {...fadeInUp}>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
              <SettingsIcon className="text-purple-400" size={24} />
              Settings
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Manage your account settings and preferences
            </p>
          </motion.div>

          {/* SUCCESS MESSAGE */}
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 p-4 rounded-xl ${
                notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {notification.message}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* PROFILE SECTION */}
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="glass card-hover rounded-2xl p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <User size={18} className="text-purple-400" />
                  </div>
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Username</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="input-glass pl-10" placeholder="Enter username" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input-glass pl-10" placeholder="Enter email" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* PASSWORD SECTION */}
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="glass card-hover rounded-2xl p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Lock size={18} className="text-purple-400" />
                  </div>
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Current Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} value={profile.currentPassword} onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })} className="input-glass pl-10 pr-10" placeholder="Enter current password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showNewPassword ? "text" : "password"} value={profile.newPassword} onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })} className="input-glass pl-10 pr-10" placeholder="Enter new password" />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Confirm New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="password" value={profile.confirmPassword} onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })} className="input-glass pl-10" placeholder="Confirm new password" />
                    </div>
                  </div>
                  {profile.newPassword && profile.confirmPassword && profile.newPassword !== profile.confirmPassword && (
                    <div className="flex items-center gap-2 text-red-400 text-sm"><AlertCircle size={14} />Passwords do not match</div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6 sm:space-y-8">
              {/* CONNECTED ACCOUNTS */}
              <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="glass card-hover rounded-2xl p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Link2 size={18} className="text-purple-400" />
                  </div>
                  Connected Accounts
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center"><GoogleIcon /></div>
                      <div>
                        <p className="font-medium text-sm">Google</p>
                        <p className="text-xs text-gray-400">{connectedAccounts.google ? "Connected" : "Not connected"}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleConnection("google")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${connectedAccounts.google ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-purple-600 text-white hover:bg-purple-500"}`}>{connectedAccounts.google ? "Disconnect" : "Connect"}</button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-white/10"><XIcon /></div>
                      <div>
                        <p className="font-medium text-sm">X (Twitter)</p>
                        <p className="text-xs text-gray-400">{connectedAccounts.twitter ? "Connected" : "Not connected"}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleConnection("twitter")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${connectedAccounts.twitter ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-purple-600 text-white hover:bg-purple-500"}`}>{connectedAccounts.twitter ? "Disconnect" : "Connect"}</button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">Connect your social accounts for easier login.</p>
              </motion.div>

              {/* SAVE BUTTON */}
              <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="flex justify-end">
                <button onClick={handleSave} className="btn-primary w-full lg:w-auto flex items-center justify-center gap-2">
                  {profile.loading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  {profile.loading ? "Saving..." : "Save Changes"}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          loading={profile.loading}
        />
      </main>
    </div>
  );
}

function DeleteAccountModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass rounded-2xl p-6 w-full max-w-md border border-red-500/30" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 mb-4">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold">Are you absolutely sure?</h2>
          <p className="text-gray-400 mt-2 text-sm">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={onClose} disabled={loading} className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
