"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { supabase } from "@/lib/supabaseClient";
import YooRentLogo from "./YooRentLogo";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [showAnim, setShowAnim] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Sticky & shadow on scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          setShowAnim(true);
          setTimeout(() => setShowAnim(false), 1500);
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
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
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };
  const handleScrollToTop = (e: any) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileOpen(false);
  };

  // User info desktop only
  const UserInfo = () => (
    <div className="hidden md:flex items-center gap-2 ml-3">
      <Link
        href="/dashboard"
        className="flex items-center px-3 py-1 rounded-lg font-semibold text-[#001F3F] bg-white hover:bg-gray-100 transition"
        title="Dashboard"
      >
        <LayoutDashboard className="w-5 h-5 mr-1" />
        Dashboard
      </Link>
      <span className="font-semibold text-xs text-white max-w-[110px] truncate hidden lg:inline">
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

  // Responsive logo size
  const logoSize = typeof window !== "undefined" && window.innerWidth < 768 ? 44 : 70;

  return (
    <>
      {/* ===== Animasi Login/Logout ===== */}
      <AnimatePresence>
        {showAnim && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 left-1/2 z-[100] -translate-x-1/2
                       bg-gradient-to-r from-green-400 via-blue-500 to-purple-500
                       text-white px-8 py-3 rounded-xl shadow-xl text-lg font-bold tracking-wide"
          >
            {user
              ? "Login Berhasil! Selamat datang di YooRent"
              : "Logout Berhasil!"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Navbar ===== */}
      <motion.nav
        initial={{ y: -25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`bg-[#001F3F] w-full fixed top-0 left-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg" : "shadow-none"}`}
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
              <UserInfo />
            ) : (
              <>
                <button
                  onClick={() => setOpenLogin(true)}
                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-black bg-white border border-gray-300 hover:bg-gray-200 transition hidden md:inline-block"
                >
                  Masuk
                </button>
                <button
                  onClick={() => setOpenRegister(true)}
                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold text-white
                             bg-gradient-to-r from-blue-600 via-green-400 to-purple-500
                             shadow hover:opacity-90 transition hidden md:inline-block"
                >
                  Daftar Gratis
                </button>
              </>
            )}
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="ml-2 p-2 rounded-lg md:hidden text-white hover:bg-gray-800 transition"
              aria-label="Buka menu"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
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
                className="absolute top-0 right-0 w-4/5 max-w-xs h-full
                  bg-[#11213a] shadow-2xl flex flex-col px-6 py-5 gap-6"
                onClick={(e) => e.stopPropagation()}
              >
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
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-[#001F3F] bg-white border border-gray-300 hover:bg-gray-100 transition"
                        title="Dashboard"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                      </Link>
                      <button
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setUser(null);
                          setShowAnim(true);
                          setTimeout(() => setShowAnim(false), 1500);
                          window.location.reload();
                        }}
                        className="w-full px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setOpenLogin(true)}
                        className="w-full px-4 py-2 rounded-lg font-medium text-black bg-white border border-gray-300 hover:bg-gray-200 transition"
                      >
                        Masuk
                      </button>
                      <button
                        onClick={() => setOpenRegister(true)}
                        className="w-full px-4 py-2 rounded-lg font-semibold text-white
                          bg-gradient-to-r from-blue-600 via-green-400 to-purple-500
                          shadow hover:opacity-90 transition"
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

      {/* Login & Register Modals */}
      <AnimatePresence>
        {openLogin && (
          <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
            <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
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
      </AnimatePresence>
    </>
  );
}
