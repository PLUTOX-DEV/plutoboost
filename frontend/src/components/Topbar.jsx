import { Wallet } from "lucide-react";
import { useContext } from "react";
import UserContext from "../context/UserContext";
import NotificationBell from "./NotificationBell";

export default function Topbar() {
  const { balance } = useContext(UserContext);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">
          Performance overview of your account
        </p>
      </div>

      {/* Wallet */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-xl">
          <Wallet size={18} className="text-purple-400" />
          <div className="text-sm">
            <p className="text-gray-400 leading-none">Wallet Balance</p>
            <p className="font-semibold text-white leading-tight">
              NGN {balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
