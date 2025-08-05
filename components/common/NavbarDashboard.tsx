"use client";
import { useState } from "react";
import { FaBell, FaSearch, FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/components/common/AuthProvider"; // ⬅️ Tambah ini

type UserType = {
  name: string;
  email: string;
  avatar: string;
  // tambahkan field lain jika ada
};

type NavbarDashboardProps = {
  user: UserType;
  unreadNotif?: number;
  cartCount?: number;
};

export default function NavbarDashboard({
  user,
  unreadNotif = 2,
  cartCount = 0,
}: NavbarDashboardProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Data user dari props
  const name = user?.name || "User";
  const email = user?.email || "-";
  const avatar = user?.avatar || "/default-avatar.png";

  return (
    <>
      {/* NAVBAR */}
      <header className="w-full bg-blue-700 shadow flex items-center justify-between px-4 py-2 fixed top-0 left-0 z-40 md:static">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group" title="Kembali ke halaman utama">
            <span className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-blue-700 text-2xl font-extrabold shadow group-hover:scale-110 transition-all duration-150">
              Y
            </span>
            <span className="font-extrabold text-2xl text-white tracking-wide group-hover:underline">YooRent</span>
          </Link>
        </div>

        {/* Center: Desktop search bar */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="Cari barang, transaksi, pesan..."
              className="w-full pl-10 pr-4 py-2 rounded-full border bg-blue-50 focus:ring-2 ring-blue-300 outline-none transition text-blue-900 font-medium placeholder-blue-400"
            />
          </div>
        </div>

        {/* Right: notif, keranjang, profile, search mobile */}
        <div className="flex items-center gap-3">
          {/* Bell notif */}
          <button
            className="relative p-2"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifikasi"
          >
            <FaBell size={22} className="text-white" />
            {unreadNotif > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 border-2 border-blue-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                {unreadNotif > 99 ? "99+" : unreadNotif}
              </span>
            )}
          </button>

          {/* Keranjang */}
          <Link href="/wishlist">
            <button
              className="relative p-2 hover:bg-blue-800 rounded-full transition group"
              aria-label="Keranjang"
              title="Keranjang/Wishlist"
            >
              <FaShoppingCart size={22} className="text-white group-hover:scale-110 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 border-2 border-blue-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </Link>
          {/* Akhir Keranjang */}

          {/* User avatar, name, email */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-white px-2 py-1 rounded-full hover:bg-blue-800 transition">
              {/* Avatar dari props */}
              <span className="bg-white text-blue-700 font-bold rounded-full w-9 h-9 flex items-center justify-center text-lg overflow-hidden">
                {avatar && avatar !== "/default-avatar.png" ? (
                  <img
                    src={avatar}
                    alt={name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  name[0]
                )}
              </span>
              <div className="hidden md:flex flex-col items-start ml-2">
                <span className="font-semibold leading-tight">{name}</span>
                <span className="text-xs text-blue-200">{email}</span>
              </div>
            </button>
          </div>

          {/* Mobile search icon */}
          <button
            className="md:hidden p-2"
            onClick={() => setSearchOpen(true)}
            aria-label="Cari"
          >
            <FaSearch size={20} className="text-white" />
          </button>
        </div>

        {/* Notif dropdown */}
        {notifOpen && (
          <div className="absolute right-6 top-14 w-80 bg-white rounded-xl shadow-xl border z-50 p-3 animate-fadeIn">
            <div className="font-bold mb-2 text-blue-900">Notifikasi</div>
            <div className="mb-1 text-sm">🎉 Promo referral aktif!</div>
            <div className="mb-1 text-sm">🔔 Pembayaran Sewa diterima</div>
            <div className="mb-1 text-sm">📦 Barang dikembalikan</div>
            <button className="w-full mt-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold text-sm">
              Lihat Semua
            </button>
          </div>
        )}
      </header>

      {/* Mobile search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/40 flex items-start justify-center"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg mt-16 p-4 w-[95%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <FaSearch className="text-blue-400" />
              <input
                type="text"
                placeholder="Cari barang, transaksi, pesan..."
                className="flex-1 border-b outline-none py-2"
                autoFocus
              />
              <button
                className="text-blue-600 font-bold ml-2"
                onClick={() => setSearchOpen(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
