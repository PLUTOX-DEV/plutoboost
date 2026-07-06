import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export function GlassCard({ children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
      {children}
    </div>
  );
}

export function PrimaryButton({ text, onClick, disabled }) {
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

export function Input({ icon: Icon, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 h-5 w-5 text-purple-400" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-10 py-3 outline-none focus:border-purple-500"
      />
    </div>
  );
}

export function PasswordInput({ show, setShow, placeholder, value, onChange }) {
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