"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Bell } from "lucide-react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import YooRentLogo from "./YooRentLogo";
import UserAvatar from "./UserAvatar";
import ChatIcon from "../chat/ChatIcon";
import { useAuth } from "@/components/common/AuthProvider"; // ⬅️ Tambahkan ini
import { supabase } from "@/lib/supabaseClient"; // <-- di atas


interface UserMeta {
  avatar_url?: string;
  full_name?: string;
}
interface UserType {
  email?: string;
  user_metadata?: UserMeta;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [openRegister, setOpenRegister] = useState<boolean>(false);
  // ⬇️ GANTI: Ambil user dari AuthProvider
  const { user, loading } = useAuth();

  // Untuk user dropdown
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dummy Notifikasi: Ganti pakai fetch dari backend/unread chat/notif sewa dsb
  const [notifCount, setNotifCount] = useState<number>(2);

  // Sticky & shadow on scroll
  const [scrolled, setScrolled] = useState<boolean>(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown menu kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleScroll = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };
  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
  };

  // Modal TANPA animasi
  function Modal({
    open,
    onClose,
    children,
  }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) {
    if (!open) return null;
    return (
      <div
        className="fixed inset-0 bg-black/40 z-[99] flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-xl max-w-xs w-full p-7 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute right-4 top-4 text-gray-500 hover:text-blue-600"
            onClick={onClose}
            aria-label="Tutup modal"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    );
  }

  // Komponen Dropdown User
  const UserDropdown = () => (
    <div className="relative ml-3 flex items-center gap-1" ref={menuRef}>
      {/* Bell Notifikasi Desktop */}
      <button
        className="relative group hidden md:block mr-1"
        aria-label="Notifikasi"
        type="button"
      >
        <Bell className="w-6 h-6 text-white group-hover:text-blue-200 transition" />
        {notifCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
            {notifCount}
          </span>
        )}
      </button>
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-full transition min-w-[44px]"
        type="button"
      >
        <UserAvatar user={user} size={36} />
        <span className="font-semibold text-white max-w-[110px] truncate hidden md:inline">
          {user?.user_metadata?.full_name || user?.email}
        </span>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {showMenu && (
        <div className="absolute right-0 top-full w-56 bg-white shadow-xl rounded-xl z-50 border overflow-hidden mt-2">
          <div className="p-4 border-b">
            <div className="font-semibold text-gray-900">
              {user?.user_metadata?.full_name || "User"}
            </div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
          <Link
            href="/dashboard"
            className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2"
            onClick={() => setShowMenu(false)}
          >
            <LayoutDashboard className="w-4 h-4 mr-2 text-blue-600" />
            Dashboard
          </Link>
          {/* === TAMBAH LINK EDIT PROFIL DI SINI === */}
          <Link
            href="/dashboard/profile"
            className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2"
            onClick={() => setShowMenu(false)}
          >
            <img
              src={user?.user_metadata?.avatar_url || "/default-avatar.png"}
              alt="Edit Profil"
              className="w-5 h-5 rounded-full mr-2 border object-cover"
            />
            Edit Profil
          </Link>
          {/* === END TAMBAH === */}
          <button
  onClick={async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  }}
  className="w-full px-4 py-2 rounded-2xl font-semibold text-white bg-red-500 hover:bg-red-600 transition"
  type="button"
>
  Logout
</button>
        </div>
      )}
    </div>
  );

  if (loading) return null; // Anti flicker

  return (
    <>
      {/* ===== Navbar ===== */}
      <nav
        className={`bg-[#001F3F] w-full fixed top-0 left-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg" : "shadow-none"
          }`}
      >
        <div className="max-w-6xl mx-auto px-2 md:px-4 flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="block md:hidden">
              <YooRentLogo size={44} />
            </span>
            <span className="hidden md:block">
              <YooRentLogo size={70} />
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="flex-1 justify-center hidden md:flex">
            <ul className="flex gap-6 lg:gap-8 text-white font-medium">
              <li>
                <a
                  href="/"
                  onClick={handleScrollToTop}
                  className="hover:text-green-400 transition cursor-pointer"
                >
                  Beranda
                </a>
              </li>
              <li>
                <Link href="/kategori" className="hover:text-green-400 transition">
                  Kategori
                </Link>
              </li>
              <li>
                <a
                  href="#carakerja"
                  onClick={handleScroll("carakerja")}
                  className="hover:text-green-400 transition cursor-pointer"
                >
                  Cara Kerja
                </a>
              </li>
              <li>
                <a
                  href="#testimoni"
                  onClick={handleScroll("testimoni")}
                  className="hover:text-green-400 transition cursor-pointer"
                >
                  Testimoni
                </a>
              </li>
            </ul>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {user ? (
              <UserDropdown />
            ) : (
              <>
                {/* Tombol Masuk (outline biru, modern, rounded) */}
                <button
                  onClick={() => setOpenLogin(true)}
                  className="px-4 py-2 rounded-2xl font-semibold border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 hidden md:inline-block"
                  type="button"
                >
                  Masuk
                </button>
                {/* Tombol Daftar (solid biru, lebih menonjol, rounded) */}
                <button
                  onClick={() => setOpenRegister(true)}
                  className="ml-3 px-4 py-2 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 hidden md:inline-block"
                  disabled={openRegister}
                  type="button"
                >
                  {openRegister ? (
                    <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : null}
                  Daftar
                </button>
              </>
            )}
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="ml-2 p-2 rounded-lg md:hidden text-white hover:bg-gray-800 transition"
              aria-label="Buka menu"
              type="button"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="absolute top-0 right-0 w-4/5 max-w-xs h-full
                  bg-[#11213a] shadow-2xl flex flex-col px-6 py-5 gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bell Notif Mobile */}
              {user && (
                <button className="relative group self-end mb-2 md:hidden" aria-label="Notifikasi">
                  <Bell className="w-6 h-6 text-white group-hover:text-blue-200 transition" />
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                      {notifCount}
                    </span>
                  )}
                </button>
              )}
              <ul className="flex flex-col gap-4 mt-6 text-white text-lg font-semibold">
                <li>
                  <a
                    href="/"
                    onClick={handleScrollToTop}
                    className="hover:text-green-400 transition"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <Link href="/kategori" className="hover:text-green-400 transition">
                    Kategori
                  </Link>
                </li>
                <li>
                  <a
                    href="#carakerja"
                    onClick={handleScroll("carakerja")}
                    className="hover:text-green-400 transition"
                  >
                    Cara Kerja
                  </a>
                </li>
                <li>
                  <a
                    href="#testimoni"
                    onClick={handleScroll("testimoni")}
                    className="hover:text-green-400 transition"
                  >
                    Testimoni
                  </a>
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-2xl font-semibold text-[#001F3F] bg-white border border-gray-300 hover:bg-gray-100 transition"
                      title="Dashboard"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    {/* === TAMBAH LINK EDIT PROFIL DI MOBILE === */}
                    <Link
                      href="/dashboard/profile"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-2xl font-semibold text-[#001F3F] bg-white border border-gray-300 hover:bg-gray-100 transition"
                      title="Edit Profil"
                      onClick={() => setMobileOpen(false)}
                    >
                      <img
                        src={user?.user_metadata?.avatar_url || "/default-avatar.png"}
                        alt="Edit Profil"
                        className="w-5 h-5 rounded-full border object-cover"
                      />
                      Edit Profil
                    </Link>
                    {/* === END TAMBAH === */}
                    <button
                      onClick={async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
}}
                      className="w-full px-4 py-2 rounded-2xl font-semibold text-white bg-red-500 hover:bg-red-600 transition"
                      type="button"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Tombol Masuk Mobile */}
                    <button
                      onClick={() => setOpenLogin(true)}
                      className="w-full px-4 py-2 rounded-2xl font-semibold border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 transition-all duration-150 shadow-sm"
                      type="button"
                    >
                      Masuk
                    </button>
                    {/* Tombol Daftar Mobile */}
                    <button
                      onClick={() => setOpenRegister(true)}
                      className="w-full px-4 py-2 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-150 shadow-md mt-2"
                      disabled={openRegister}
                      type="button"
                    >
                      {openRegister ? (
                        <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                      ) : null}
                      Daftar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login & Register Modals */}
      {openLogin && (
        <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
          <LoginModal
            open={openLogin}
            onClose={() => setOpenLogin(false)}
            onSuccess={() => setOpenLogin(false)}
          />
        </Modal>
      )}
      {openRegister && (
        <Modal open={openRegister} onClose={() => setOpenRegister(false)}>
          <RegisterModal
            open={openRegister}
            onClose={() => setOpenRegister(false)}
          />
        </Modal>
      )}
    </>
  );
}
