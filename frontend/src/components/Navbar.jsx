import React, { useState, useEffect, useRef, useContext } from "react";
import { Menu, X, ChevronDown, Sparkles, ArrowRight, LogOut, BookOpen } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../context/UserContext";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  /* Track scroll for navbar background */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock scroll on mobile menu */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    {
      name: "Features",
      children: [
        { name: "Instagram Pricing", path: "/pricing/instagram" },
        { name: "YouTube Pricing", path: "/pricing/youtube" },
        { name: "X (Twitter) Pricing", path: "/pricing/twitter" },
        { name: "TikTok Pricing", path: "/pricing/tiktok" },
      ],
    },
   
    {
      name: "Resources",
      children: [
        { name: "Blog", path: "/blog" },
        { name: "Help Center", path: "/help" },
        { name: "Affiliate Program", path: "/affiliate" },
      ],
    },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-[60] transition-all duration-300 ${
        scrolled 
          ? "backdrop-blur-xl bg-black/70 border-b border-white/10 py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* LOGO */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-white font-bold text-xl group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles size={18} />
          </div>
          <span>
            Pluto<span className="text-purple-400">Boost</span>
          </span>
        </NavLink>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              {item.children ? (
                <button
                  aria-expanded={dropdown === item.name}
                  onClick={() => setDropdown(dropdown === item.name ? null : item.name)}
                  onMouseEnter={() => setDropdown(item.name)}
                  onMouseLeave={() => setDropdown(null)}
                  className="flex items-center gap-1 hover:text-white transition relative py-2"
                >
                  {item.name}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdown === item.name ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `hover:text-white transition relative py-2
                    ${isActive ? "text-white" : ""}`
                  }
                >
                  {item.name}
                </NavLink>
              )}

              {/* DESKTOP DROPDOWN */}
              <AnimatePresence>
                {item.children && dropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onMouseEnter={() => setDropdown(item.name)}
                    onMouseLeave={() => setDropdown(null)}
                    className="absolute left-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        onClick={() => setDropdown(null)}
                        to={child.path}
                        className="block px-4 py-3 text-sm text-gray-300 hover:bg-purple-500/20 hover:text-white transition border-b border-white/5 last:border-0"
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="flex items-center gap-3 ml-4">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                  px-5 py-2.5 rounded-full text-white font-medium shadow-lg shadow-purple-500/25
                  hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                    px-5 py-2.5 rounded-full text-white font-medium shadow-lg shadow-purple-500/25
                    hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden
          ${open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"}
          bg-black/95 backdrop-blur-xl border-t border-white/10`}
      >
        <div className="px-6 py-6 flex flex-col gap-2 text-gray-300">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <button
                  onClick={() =>
                    setDropdown(dropdown === item.name ? null : item.name)
                  }
                  className="flex w-full justify-between items-center py-3 text-base hover:text-white transition"
                >
                  {item.name}
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      dropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base hover:text-white transition"
                >
                  {item.name}
                </NavLink>
              )}

              {/* MOBILE DROPDOWN */}
              {item.children && dropdown === item.name && (
                <div className="pl-4 pb-2 flex flex-col gap-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.path}
                      onClick={() => {
                        setOpen(false);
                        setDropdown(null);
                      }}
                      className="py-2.5 text-sm text-gray-400 hover:text-white transition"
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="block bg-gradient-to-r from-purple-600 to-indigo-600
                  py-4 rounded-xl text-white font-semibold text-center
                  hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-center text-white hover:text-purple-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block bg-gradient-to-r from-purple-600 to-indigo-600
                    py-4 rounded-xl text-white font-semibold text-center
                    hover:from-purple-500 hover:to-indigo-500 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
