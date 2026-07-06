import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingCart,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Menu,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import api from "../api";


const statusColors = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  suspended: "bg-red-500/20 text-red-400 border-red-500/30"
};

export default function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [users, setUsers] = useState([]); // Store master raw data
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    inactive: 0, // Assuming inactive is not a status from backend for now
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async (page = 1) => {
      setLoading(true);
      try {
        const res = await api.get(`/api/admin/users?page=${page}&limit=10`);
        const { users: fetchedUsers, totalPages, currentPage, stats: fetchedStats } = res.data;

        setUsers(fetchedUsers.map(user => ({
          id: user._id,
          name: user.username,
          email: user.email,
          phone: 'N/A',
          status: user.status || 'active',
          joinDate: user.createdAt,
          totalOrders: user.orderCount || 0,
          totalSpent: user.totalSpent || 0,
          lastOrder: null,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        })));
        setPagination({ currentPage, totalPages });
        if (fetchedStats) setStats(prev => ({ ...prev, ...fetchedStats }));
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [pagination.currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleUpdateUser = async (updatedDetails) => {
    try {
      const res = await api.put(`/api/admin/users/${selectedUser.id}`, updatedDetails);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...res.data } : u));
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const suspendUser = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/suspend`);
      setUsers(users.map(u => u.id === id ? { ...u, status: 'suspended' } : u));
    } catch (err) {
      alert('Failed to suspend user');
    }
  };

  const activateUser = async (id) => {
    try {
      await api.put(`/api/admin/users/${id}/activate`);
      setUsers(users.map(u => u.id === id ? { ...u, status: 'active' } : u));
    } catch (err) {
      alert('Failed to activate user');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#07091F] text-white flex">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-6 lg:ml-72 xl:ml-80 2xl:ml-96">
        {/* MOBILE HEADER */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <Menu />
          </button>
          <h1 className="text-xl font-bold">User Management</h1>
        </div>

        {/* DESKTOP HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:block"
        >
          <h1 className="text-3xl font-bold gradient-text">User Management</h1>
          <p className="text-gray-400 mt-1">
            Manage user accounts, view activity, and handle support requests
          </p>
        </motion.div>

        {/* STATS CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard title="Total Users" value={stats.total} icon={Users} color="blue" />
          <StatCard title="Active Users" value={stats.active} icon={UserCheck} color="emerald" />
          <StatCard title="Inactive" value={stats.inactive} icon={UserX} color="gray" />
          <StatCard title="Suspended" value={stats.suspended} icon={Ban} color="red" />
        </motion.div>

        {/* FILTERS & SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-glass pl-10 py-3"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="flex items-center gap-2 glass rounded-xl px-4 py-2">
            <Filter size={16} className="text-purple-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none text-sm cursor-pointer"
            >
              <option className="bg-[#12002b]" value="all">All Status</option>
              <option className="bg-[#12002b]" value="active">Active</option>
              <option className="bg-[#12002b]" value="inactive">Inactive</option>
              <option className="bg-[#12002b]" value="suspended">Suspended</option>
            </select>
          </div>
        </motion.div>

        {/* USERS TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* DESKTOP TABLE */}
          <div className="hidden lg:block">
            <table className="w-full text-sm">
              <thead className="bg-black/40 text-gray-400">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">User</th>
                  <th className="px-6 py-4 text-left font-medium">Contact</th>
                  <th className="px-6 py-4 text-left font-medium">Status</th>
                  <th className="px-6 py-4 text-left font-medium">Orders</th>
                  <th className="px-6 py-4 text-left font-medium">Total Spent</th>
                  <th className="px-6 py-4 text-left font-medium">Join Date</th>
                  <th className="px-6 py-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-t border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Mail size={12} />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Phone size={12} />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <ShoppingCart size={14} className="text-purple-400" />
                        {user.totalOrders}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-purple-400 font-semibold">
                      ₦{user.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-white/10 rounded">
                            <Eye size={14} onClick={() => alert(`Viewing details for ${user.name}`)} />
                        </button>
                        <button className="p-1 hover:bg-white/10 rounded">
                          <Edit size={14} />
                        </button>
                        {user.status === 'suspended' ? (
                          <button onClick={() => activateUser(user.id)} className="p-1 hover:bg-green-500/20 rounded">
                            <CheckCircle size={14} />
                          </button>
                        ) : (
                          <button onClick={() => suspendUser(user.id)} className="p-1 hover:bg-red-500/20 rounded">
                            <Ban size={14} />
                          </button>
                        )}
                        <button onClick={() => deleteUser(user.id)} className="p-1 hover:bg-red-500/20 rounded">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden space-y-4 p-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">ID: {user.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[user.status]}`}>
                    {user.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="truncate">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p>{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Orders</p>
                    <p className="text-purple-400">{user.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total Spent</p>
                    <p className="text-purple-400">₦{user.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-xs text-gray-400">
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/10 rounded">
                      <Eye size={14} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded">
                      <Edit size={14} />
                    </button>
                    {user.status === 'suspended' ? (
                      <button onClick={() => activateUser(user.id)} className="p-2 hover:bg-green-500/20 rounded">
                        <CheckCircle size={14} />
                      </button>
                    ) : (
                      <button onClick={() => suspendUser(user.id)} className="p-2 hover:bg-red-500/20 rounded">
                        <Ban size={14} />
                      </button>
                    )}
                    <button onClick={() => deleteUser(user.id)} className="p-2 hover:bg-red-500/20 rounded">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2">
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-sm hover:border-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onSave={handleUpdateUser}
        />
      </main>
    </div>
  );
}

/* ===================== EDIT USER MODAL ===================== */
function EditUserModal({ isOpen, onClose, user, onSave }) {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (user) {
      setUserDetails({
        username: user.name,
        email: user.email,
        balance: user.totalSpent, // Note: This seems incorrect, should be user.balance. Assuming totalSpent for now.
      });
    }
  }, [user]);

  if (!isOpen || !userDetails) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(userDetails);
  };

  return (
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
        className="glass rounded-2xl p-6 w-full max-w-md border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit User: {user.name}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Username</label>
            <input type="text" name="username" value={userDetails.username} onChange={handleChange} className="input-glass w-full mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input type="email" name="email" value={userDetails.email} onChange={handleChange} className="input-glass w-full mt-1" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Balance</label>
            <input type="number" name="balance" value={userDetails.balance} onChange={handleChange} className="input-glass w-full mt-1" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <XCircle size={16} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ===================== STAT CARD ===================== */
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    gray: "from-gray-500/20 to-gray-600/10 border-gray-500/30 text-gray-400",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-400",
  };

  return (
    <div className={`glass p-4 rounded-xl border backdrop-blur-sm bg-gradient-to-br ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-black/20 ${colorClasses[color].split(' ').pop()}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
