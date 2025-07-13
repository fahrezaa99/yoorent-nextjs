"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { supabase } from "@/lib/supabaseClient";

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 z-[99] flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-xl max-w-xs w-full p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-blue-600"
          onClick={onClose}
          aria-label="Tutup modal"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </motion.div>
    </div>
  );
}

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [showAnim, setShowAnim] = useState(false);

  const [user, setUser] = useState<any>(null);

  // ========== Auth & Animasi ==========
  useEffect(() => {
    // Cek user pertama kali, TIDAK munculin animasi
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    // Listener: animasi hanya saat login/logout beneran
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setShowAnim(true);
        setTimeout(() => setShowAnim(false), 1500);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  // ========== End Auth ==========

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = (id: string) => (e: any) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const handleScrollToTop = (e: any) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
  };

  // ==== Komponen User Info & Dashboard ====
  const UserInfo = () => (
    <div className="flex items-center gap-2 ml-3">
      <Link
        href="/dashboard"
        className="flex items-center px-2 py-1 rounded-lg font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
        title="Dashboard"
      >
        <LayoutDashboard className="w-5 h-5 mr-1" />
        Dashboard
      </Link>
      <span className="font-semibold text-xs text-blue-700 max-w-[110px] truncate hidden md:inline">
        {user?.email}
      </span>
      <button
        className="ml-2 px-3 py-1 rounded-xl bg-red-500 text-white text-xs hover:bg-red-600"
        onClick={async () => {
          await supabase.auth.signOut();
          setUser(null);
          setShowAnim(true);
          setTimeout(() => setShowAnim(false), 1500);
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
  // ==== End User Info ====

  return (
    <>
      {/* === ANIMASI TRANSISI LOGIN/LOGOUT === */}
      <AnimatePresence>
        {showAnim && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 left-1/2 z-[100] -translate-x-1/2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl shadow-xl text-lg font-bold tracking-wide"
          >
            {user ? "Login Berhasil! Selamat datang di YooRent" : "Logout Berhasil!"}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full shadow-sm dark:bg-gray-900 fixed top-0 left-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          {/* LOGO + TITLE */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 via-green-400 to-purple-500">
                <span className="text-white font-bold text-2xl">Y</span>
              </div>
              <span className="font-extrabold text-2xl text-blue-600">
                YooRent
              </span>
            </div>
            <span className="text-xs text-gray-500 mt-1 ml-1 dark:text-gray-400">
              Platform Sewa Terpercaya
            </span>
          </div>
          {/* Desktop MENU */}
          <div className="flex-1 justify-center hidden md:flex">
            <ul className="flex gap-8 text-gray-700 font-medium dark:text-gray-200">
              <li>
                <a
                  href="/"
                  onClick={handleScrollToTop}
                  className="hover:text-blue-600 dark:hover:text-green-400 transition cursor-pointer"
                >
                  Beranda
                </a>
              </li>
              <li>
                <Link
                  href="/kategori"
                  className="hover:text-blue-600 dark:hover:text-green-400 transition"
                >
                  Kategori
                </Link>
              </li>
              <li>
                <a
                  href="#carakerja"
                  onClick={handleScroll("carakerja")}
                  className="hover:text-blue-600 dark:hover:text-green-400 transition cursor-pointer"
                >
                  Cara Kerja
                </a>
              </li>
              <li>
                <a
                  href="#testimoni"
                  onClick={handleScroll("testimoni")}
                  className="hover:text-blue-600 dark:hover:text-green-400 transition cursor-pointer"
                >
                  Testimoni
                </a>
              </li>
            </ul>
          </div>
          {/* KANAN */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Switch */}
            <button
              onClick={() => setDark((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              title={dark ? "Switch ke Light Mode" : "Switch ke Dark Mode"}
              aria-label="Toggle dark mode"
              type="button"
            >
              {dark ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-700" />
              )}
            </button>
            {/* User Info */}
            {user ? (
              <UserInfo />
            ) : (
              <>
                <button
                  onClick={() => setOpenLogin(true)}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-blue-600 hover:text-white transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-blue-700 hidden md:inline-block"
                >
                  Masuk
                </button>
                <button
                  onClick={() => setOpenRegister(true)}
                  className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-green-400 to-purple-500 shadow hover:opacity-90 transition hidden md:inline-block"
                >
                  Daftar Gratis
                </button>
              </>
            )}
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="ml-2 p-2 rounded-lg md:hidden text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Buka menu"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <div
                className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col px-6 py-5 gap-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 via-green-400 to-purple-500">
                      <span className="text-white font-bold text-xl">Y</span>
                    </div>
                    <span className="font-extrabold text-xl text-blue-600">
                      YooRent
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    aria-label="Tutup menu"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>
                {/* Semua menu pakai Link */}
                <ul className="flex flex-col gap-4 font-semibold text-lg text-gray-900 dark:text-white">
                  <li>
                    <a
                      href="/"
                      onClick={handleScrollToTop}
                      className="hover:text-blue-600 dark:hover:text-green-400 transition cursor-pointer"
                    >
                      Beranda
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/kategori"
                      className="hover:text-blue-600 dark:hover:text-green-400 transition"
                      onClick={() => setMobileOpen(false)}
                    >
                      Kategori
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#carakerja"
                      onClick={handleScroll("carakerja")}
                      className="hover:text-blue-600 dark:hover:text-green-400 transition cursor-pointer"
                    >
                      Cara Kerja
                    </a>
                  </li>
                  <li>
                    <a
                      href="#testimoni"
                      onClick={handleScroll("testimoni")}
                      className="hover:text-blue-600 dark:hover:text-green-400 transition cursor-pointer"
                    >
                      Testimoni
                    </a>
                  </li>
                </ul>
                {/* User Info Mobile */}
                <div className="flex flex-col gap-2 pt-4 border-t dark:border-gray-700">
                  {user ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-2 py-1 rounded-lg font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                        title="Dashboard"
                      >
                        <LayoutDashboard className="w-5 h-5 mr-1" />
                        Dashboard
                      </Link>
                      <span className="font-semibold text-sm text-blue-700 max-w-[110px] truncate">
                        {user?.email}
                      </span>
                      <button
                        className="ml-2 px-3 py-1 rounded-xl bg-red-500 text-white text-xs hover:bg-red-600"
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setUser(null);
                          setMobileOpen(false);
                          setShowAnim(true);
                          setTimeout(() => setShowAnim(false), 1500);
                          window.location.reload();
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setOpenLogin(true);
                          setMobileOpen(false);
                        }}
                        className="px-4 py-2 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-blue-600 hover:text-white transition dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-blue-700 text-center"
                      >
                        Masuk
                      </button>
                      <button
                        onClick={() => {
                          setOpenRegister(true);
                          setMobileOpen(false);
                        }}
                        className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 via-green-400 to-purple-500 shadow hover:opacity-90 transition text-center"
                      >
                        Daftar Gratis
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* === LOGIN MODAL === */}
      <AnimatePresence>
        {openLogin && (
          <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
            <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
          </Modal>
        )}
      </AnimatePresence>

      {/* === REGISTER MODAL === */}
      <AnimatePresence>
        {openRegister && (
          <Modal open={openRegister} onClose={() => setOpenRegister(false)}>
            <RegisterModal open={openRegister} onClose={() => setOpenRegister(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
