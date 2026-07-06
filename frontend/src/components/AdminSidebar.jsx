import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Wallet,
  Server,
  LogOut,
  DollarSign,
  ShieldCheck,
  TrendingUp, // Ensure TrendingUp is imported
  BookOpen,
  X,
  Eye,
  Bell,
} from "lucide-react";

export default function AdminSidebar({ open, setOpen }) {
  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Deposits", path: "/admin/deposits", icon: DollarSign },
    { name: "Blog", path: "/admin/blog", icon: BookOpen },
    { name: "Fees Report", path: "/admin/fees", icon: TrendingUp },
    { name: "System", path: "/admin/system", icon: Server },
    { name: "Watchdog", path: "/admin/watchdog", icon: Eye },
    { name: "Notifications", path: "/admin/notifications", icon: Bell },
  ];

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="fixed left-0 top-0 h-screen w-64 lg:w-72 xl:w-80 2xl:w-96 bg-black/50 backdrop-blur-xl border-r border-white/10 hidden lg:flex flex-col z-50">
        <SidebarContent links={links} />
      </aside>

      {/* ===== MOBILE SIDEBAR ===== */}
      <AnimatePresence>
        {open && (
          <>
            {/* OVERLAY */}
            <motion.div
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />

            {/* DRAWER */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed left-0 top-0 h-screen w-64 lg:w-72 xl:w-80 2xl:w-96 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 lg:hidden"
            >
              <div className="flex justify-between items-center px-6 py-5">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <ShieldCheck className="text-purple-400" />
                  Admin<span className="text-purple-400">Panel</span>
                </div>

                <button onClick={() => setOpen(false)}>
                  <X />
                </button>
              </div>

              <SidebarContent links={links} onClick={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ===== SHARED CONTENT ===== */
function SidebarContent({ links, onClick }) {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <nav className="flex-1 px-4 space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            onClick={onClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
              ${
                isActive
                  ? "bg-purple-600/20 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.45)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => { logout(); navigate('/admin-login'); }}
        className="m-4 flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );
}
