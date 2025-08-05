"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBox, FaEnvelope, FaFileAlt, FaUser, FaStar, FaPlus, FaQuestionCircle, FaSearch } from "react-icons/fa";

export default function DashboardSidebar({
  unreadInbox = 0,
  unreadReview = 0,
  role,
  setRole,
  user,
  sidebarOpen,
  setSidebarOpen,
}: {
  unreadInbox?: number;
  unreadReview?: number;
  role: "penyewa" | "pemilik";
  setRole: (role: "penyewa" | "pemilik") => void;
  user?: { name: string; email: string; avatar?: string };
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  // Menu
  const renterMenu = [
    { label: "Dashboard", href: "/dashboard", icon: <FaHome size={20} />, active: pathname === "/dashboard" },
    { label: "Cari Barang", href: "/cari-barang", icon: <FaSearch size={20} /> },
    { label: "Transaksi Sewa", href: "/dashboard/sewa", icon: <FaFileAlt size={20} /> },
    { label: "Chat & Pesan", href: "/dashboard/inbox", icon: <FaEnvelope size={20} />, badge: unreadInbox },
    { label: "Ulasan & Rating", href: "/dashboard/review", icon: <FaStar size={20} />, badge: unreadReview },
    { label: "Akun/Profil", href: "/dashboard/profile", icon: <FaUser size={20} /> },
    { label: "Bantuan/Support", href: "/dashboard/support", icon: <FaQuestionCircle size={20} /> },
  ];
  const ownerMenu = [
    { label: "Dashboard", href: "/dashboard", icon: <FaHome size={20} /> },
    { label: "Barang Saya", href: "/dashboard/barang", icon: <FaBox size={20} /> },
    { label: "Tambah Barang", href: "/dashboard/barang/tambah", icon: <FaPlus size={20} /> },
    { label: "Transaksi Disewakan", href: "/dashboard/disewakan", icon: <FaFileAlt size={20} /> },
    { label: "Chat & Pesan", href: "/dashboard/inbox", icon: <FaEnvelope size={20} />, badge: unreadInbox },
    { label: "Ulasan & Rating", href: "/dashboard/review", icon: <FaStar size={20} />, badge: unreadReview },
    { label: "Akun/Profil", href: "/dashboard/profil", icon: <FaUser size={20} /> },
    { label: "Bantuan/Support", href: "/dashboard/support", icon: <FaQuestionCircle size={20} /> },
  ];
  const menu = role === "penyewa" ? renterMenu : ownerMenu;

  return (
    <>
      {/* Overlay untuk mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-all ${sidebarOpen ? 'block md:hidden' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <aside className={`
        transition-transform duration-300
        bg-white/80 border-r shadow-xl rounded-r-2xl
        min-h-screen max-w-[260px] w-64 px-4 py-6 flex flex-col
        z-50
        fixed top-0 left-0 h-full
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:h-auto md:rounded-2xl
      `}>
        {/* Tombol close mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-gray-600 text-2xl"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup Sidebar"
        >×</button>
        {/* === LOGO DAN USER INFO DIHAPUS === */}

        {/* Switcher Role */}
        <div className="flex w-full gap-2 justify-center mb-5 mt-2">
          <button
            className={`flex-1 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
              ${role === "penyewa" ? "bg-blue-600 text-white shadow" : "bg-white text-blue-600 border-blue-600"}
            `}
            onClick={() => setRole("penyewa")}
          >
            Penyewa
          </button>
          <button
            className={`flex-1 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
              ${role === "pemilik" ? "bg-blue-600 text-white shadow" : "bg-white text-blue-600 border-blue-600"}
            `}
            onClick={() => setRole("pemilik")}
          >
          Pemilik
          </button>
        </div>
        {/* Menu */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-1">
            {menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all
                    text-base
                    ${pathname === item.href
                      ? "bg-blue-600 text-white shadow font-semibold"
                      : "text-blue-900 hover:bg-blue-50"}
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="relative flex items-center">
                    {item.icon}
                    {/* Dot badge */}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 block w-3 h-3 rounded-full border-2 border-white bg-red-500 animate-pulse"></span>
                    )}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {/* Badge angka */}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Footer branding */}
        <div className="mt-6 text-center text-xs text-gray-400 font-semibold select-none">
          © 2025 YooRent. All rights reserved.
        </div>
      </aside>
    </>
  );
}
