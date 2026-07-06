import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "../components/Navbar";
import GoogleIcon from "../components/icons/GoogleIcon";
import api from "../api";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const { login, user } = useUser();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(username.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden cosmic-bg text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* BACKGROUND FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.35),_transparent_60%)] opacity-70" />

      {/* LOGIN FORM */}
      <section className="relative z-10 mx-auto mt-24 grid max-w-4xl gap-16 px-6 md:grid-cols-2 animate-fade">
        {/* LEFT */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold">
            Login to <span className="text-purple-400">PlutoBoost</span>
          </h1>

          <p className="text-gray-300 text-lg">
            Welcome back! Please sign in to your account.
          </p>

          <p className="text-xs text-gray-400 max-w-sm">
            Don't have an account?{" "}
            <span className="text-purple-400 cursor-pointer" onClick={() => navigate("/register")}>
              Sign up here
            </span>
          </p>
        </div>

        {/* RIGHT */}
        <GlassCard>
          <h2 className="text-3xl font-bold mb-6">
            Login to <span className="text-purple-400">PlutoBoost</span>
          </h2>

          <SocialButton icon={<GoogleIcon />} text="Continue with Google" onClick={handleGoogleLogin} />

          <div className="mt-6 space-y-4">
            <Input icon={User} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <PasswordInput
              show={showPass}
              setShow={setShowPass}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <Link to="/forgot-password" className="mt-3 text-sm text-purple-400 cursor-pointer hover:underline">
            Forgot password?
          </Link>

          <PrimaryButton text={loading ? "Logging in..." : "Login"} onClick={handleLogin} disabled={loading} />
        </GlassCard>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mt-28 mb-6 text-center text-sm text-gray-400">
        © 2024 PlutoBoost · Privacy Policy · Terms of Service
      </footer>

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

function GlassCard({ children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
      {children}
    </div>
  );
}

function SocialButton({ icon, text, dark, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-3 rounded-xl py-3 font-medium transition hover:scale-[1.02]
        ${dark
          ? "bg-white/5 border border-white/10 text-white"
          : "bg-white text-black"}
      `}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </button>
  );
}

function PrimaryButton({ text, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
    >
      {text}
    </button>
  );
}

function Input({ icon: Icon, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 h-5 w-5 text-purple-400" />
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
      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-purple-400" />
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
        className="absolute right-3 top-3 text-gray-400 hover:text-white"
      >
        {show ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
}
