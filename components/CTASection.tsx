"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Modal Login Dummy (bisa upgrade ke komponen auth-mu sendiri) ---
function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-7 max-w-xs w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
          onClick={onClose}
          aria-label="Tutup modal"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-bold text-blue-700 mb-4 text-center">Masuk YooRent</h2>
        <form className="space-y-3" onSubmit={e => { e.preventDefault(); onClose(); }}>
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Email" type="email" required />
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Password" type="password" required />
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 font-bold hover:bg-blue-700 transition">Masuk</button>
        </form>
        <div className="my-4 flex items-center text-xs text-gray-400">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="mx-2">atau</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        <button
          className="w-full border border-gray-300 rounded-lg py-2 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition mb-2"
          onClick={() => alert('Login Google coming soon!')}
        >
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none"><path d="M19.6 10.23c0-.68-.06-1.35-.17-2H10v3.77h5.48a4.69 4.69 0 01-2.04 3.08v2.55h3.29c1.92-1.78 3.02-4.4 3.02-7.4z" fill="#4285F4"/><path d="M10 20c2.7 0 4.97-.9 6.63-2.43l-3.29-2.55c-.91.6-2.07.96-3.34.96-2.56 0-4.72-1.73-5.5-4.06H1.08v2.6A10 10 0 0010 20z" fill="#34A853"/><path d="M4.5 11.92a6.02 6.02 0 010-3.84v-2.6H1.08A10 10 0 000 10c0 1.59.38 3.09 1.08 4.4l3.42-2.48z" fill="#FBBC05"/><path d="M10 3.97c1.47 0 2.8.51 3.85 1.52l2.9-2.9A9.96 9.96 0 0010 0 10 10 0 001.08 4.4l3.42 2.6C5.28 5.7 7.44 3.97 10 3.97z" fill="#EA4335"/></svg>
          Lanjutkan dengan Google
        </button>
        <button
          className="w-full border border-gray-300 rounded-lg py-2 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition bg-black text-white"
          onClick={() => alert('Login Apple coming soon!')}
        >
          <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor">
            <path d="M15.67,10.8c0-2.45,2.05-3.27,2.15-3.32c-1.17-1.71-2.99-1.95-3.64-1.98c-1.56-0.16-3.04,0.91-3.83,0.91
            c-0.8,0-2.01-0.89-3.32-0.87c-1.7,0.03-3.24,0.99-4.1,2.51c-1.74,3.01-0.45,7.45,1.24,9.89c0.82,1.18,1.8,2.5,3.09,2.45
            c1.25-0.05,1.73-0.79,3.24-0.79c1.51,0,1.94,0.79,3.28,0.76c1.36-0.03,2.21-1.2,3.02-2.39c0.95-1.39,1.35-2.75,1.36-2.82
            C18.72,15.26,15.67,14.07,15.67,10.8z"/>
            <path d="M13.63,4.27c0.71-0.87,1.19-2.08,1.05-3.27c-1.02,0.04-2.24,0.68-2.97,1.55c-0.65,0.77-1.23,2-1.01,3.17
            C11.84,5.84,12.92,5.15,13.63,4.27z"/>
          </svg>
          Lanjutkan dengan Apple
        </button>
      </motion.div>
    </div>
  );
}

// --- Simulasi Auth State (ganti dengan logic auth-mu sendiri) ---
const useAuth = (): { isLoggedIn: boolean } => {
  // Ganti false ke true jika mau tes login
  const [isLoggedIn] = useState(false);
  return { isLoggedIn };
};

export default function CTASection() {
  const router = useRouter();
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();

  const handleGabungClick = () => {
    if (!isLoggedIn) {
      setOpenLogin(true);
    } else {
      router.push("/sewakan-barang");
    }
  };

  return (
    <>
      <section className="py-16 px-4 bg-gradient-to-r from-blue-100 via-green-100 to-blue-200">
        <div className="max-w-3xl mx-auto text-center rounded-3xl shadow-lg p-10 border border-blue-200 bg-white/90">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Punya Barang Nganggur?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Daftarkan barangmu di YooRent dan mulai dapat penghasilan tambahan tiap bulan.<br />
            Gabung sekarang, gratis & tanpa ribet!
          </p>
          <button
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 hover:scale-105 transition-all duration-150 text-white text-lg font-bold shadow-md"
            onClick={handleGabungClick}
            type="button"
          >
            <span>Gabung & Sewakan Barang</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
      <AnimatePresence>
        {openLogin && (
          <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
