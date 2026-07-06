import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useContext } from "react";
import UserContext from "../context/UserContext";

export default function AdminLoginPage() {
  const { adminLogin } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminLogin(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Admin login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden cosmic-bg text-white flex items-center justify-center">
      {/* BACKGROUND FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.35),_transparent_60%)] opacity-70" />

      {/* ADMIN LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Admin Access</h1>
            <p className="text-gray-400 text-sm mt-2">Enter admin credentials to continue</p>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <Input
              icon={User}
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <PasswordInput
              show={showPass}
              setShow={setShowPass}
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

          <button
            onClick={handleAdminLogin}
            disabled={loading}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Access Admin Panel"}
            <Shield size={16} />
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Authorized personnel only
          </p>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        .animate-fade {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Input({ icon: Icon, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-10 py-3 outline-none focus:border-purple-500"
      />
    </div>
  );
}

function PasswordInput({ show, setShow, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-10 py-3 outline-none"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}