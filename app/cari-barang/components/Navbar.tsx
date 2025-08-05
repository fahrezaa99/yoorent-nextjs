// components/Navbar.tsx
import { Search, User2 } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center px-4 py-3 gap-4">
        {/* LOGO */}
        <a href="/" className="font-extrabold text-2xl text-blue-700 tracking-tight flex-shrink-0 select-none">
          Yoo<span className="text-blue-500">Rent</span>
        </a>

        {/* SEARCH BAR + PROMO */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              className="w-full rounded-xl border border-blue-100 bg-blue-50 py-2.5 pl-10 pr-36 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
              placeholder="Get 10% Off your first rental"
              readOnly
            />
            <span className="absolute right-3 top-2.5 text-blue-600 text-xs font-semibold">
              Get 10% Off your first rental
            </span>
          </div>
        </div>

        {/* MENU KANAN */}
        <div className="flex items-center gap-2">
          <a href="#" className="text-gray-600 hover:text-blue-600 text-sm font-semibold px-3 py-1 rounded-md">
            How
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 text-sm font-semibold px-3 py-1 rounded-md">
            It Works
          </a>
          <a href="/masuk" className="ml-2 rounded-full border border-gray-200 p-2 hover:bg-blue-50 transition">
            <User2 className="text-blue-600" size={22} />
          </a>
        </div>
      </div>
    </nav>
  );
}
