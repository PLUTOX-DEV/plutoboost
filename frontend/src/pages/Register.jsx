import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User } from "lucide-react";
import Navbar from "../components/Navbar";
import UserContext from "../context/UserContext";
import { GlassCard, PrimaryButton, Input, PasswordInput } from "../components/UIComponents";

export default function RegisterPage() {
  const { register } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password || password !== confirmPassword) {
      setError("Please fill in all fields and ensure passwords match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(username.trim(), email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden cosmic-bg text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* BACKGROUND FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.35),_transparent_60%)] opacity-70" />

      {/* REGISTER FORM */}
      <section className="relative z-10 mx-auto mt-24 grid max-w-4xl gap-16 px-6 md:grid-cols-2 animate-fade">
        {/* LEFT */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold">
            Join <span className="text-purple-400">PlutoBoost</span>
          </h1>

          <p className="text-gray-300 text-lg">
            Create your account and start boosting your social media presence!
          </p>

          <p className="text-xs text-gray-400 max-w-sm">
            Already have an account?{" "}
            <span className="text-purple-400 cursor-pointer" onClick={() => navigate("/login")}>
              Login here
            </span>
          </p>
        </div>

        {/* RIGHT */}
        <GlassCard>
          <h2 className="text-3xl font-bold mb-6">
            Sign Up for <span className="text-purple-400">PlutoBoost</span>
          </h2>

          <div className="space-y-4">
            <Input icon={User} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input icon={Mail} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <PasswordInput
              show={showPass}
              setShow={setShowPass}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordInput
              show={showConfirm}
              setShow={setShowConfirm}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <PrimaryButton text={loading ? "Creating account..." : "Sign Up"} onClick={handleRegister} disabled={loading} />
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