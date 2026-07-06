import { TrendingUp } from "lucide-react";

export default function StatCard({ title, value, icon: Icon = TrendingUp }) {
  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl transition hover:border-purple-500/40">
      
      {/* Glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="relative flex items-center justify-between">
        {/* Text */}
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
            {value}
          </p>
        </div>

        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-purple-600/20 flex items-center justify-center">
          <Icon size={20} className="text-purple-400" />
        </div>
      </div>
    </div>
  );
}
