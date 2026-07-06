import { Menu } from "lucide-react";

export default function AdminTopbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex justify-between items-center">
      <button
        onClick={onMenu}
        className="lg:hidden text-white"
      >
        <Menu />
      </button>

      <h1 className="font-semibold">Admin</h1>
    </header>
  );
}
