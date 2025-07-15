"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { signIn } from "next-auth/react";
import LoadingModal from "./LoadingModal"; // Pastikan path-nya benar

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  return (
    <>
      {/* POPUP LOADING KEREN */}
      <LoadingModal show={loading} message="Sedang masuk ke YooRent..." />

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 mx-4">
          {/* Close button */}
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 text-2xl"
            onClick={onClose}
            aria-label="Tutup"
            type="button"
            disabled={loading}
          >×</button>
          <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-6">Masuk ke YooRent</h2>
          <form
            onSubmit={async e => {
              e.preventDefault();
              setError("");
              if (!email || !password) {
                setError("Email dan password wajib diisi.");
                return;
              }
              setLoading(true);
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              setLoading(false);
              if (error) setError(error.message);
              else {
                if (onClose) onClose();
                window.location.href = "/";
              }
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="rounded-lg border px-4 py-3 focus:border-blue-400 outline-none"
                required
                placeholder="you@email.com"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1 relative">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="rounded-lg border px-4 py-3 focus:border-blue-400 outline-none w-full"
                required
                placeholder="********"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-blue-600"
                tabIndex={-1}
                disabled={loading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-green-400 text-white font-bold py-3 rounded-lg shadow hover:opacity-95 text-lg transition disabled:opacity-50"
              disabled={loading}
            >
              Masuk
            </button>
          </form>

          <div className="flex justify-between w-full mt-4 text-sm">
            <a href="/daftar" className="text-blue-600 hover:underline font-semibold">Belum punya akun? Daftar gratis</a>
            <a href="/lupa-password" className="text-gray-500 hover:underline">Lupa password?</a>
          </div>

          <div className="flex items-center w-full my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="mx-3 text-xs text-gray-400 whitespace-nowrap">atau lanjutkan dengan</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              className="w-full border border-gray-300 rounded-lg py-3 font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition text-base bg-white"
              onClick={() => signIn("google")}
              disabled={loading}
            >
              {/* ...SVG Google... */}
              Masuk dengan Google
            </button>
            <button
              type="button"
              className="w-full border border-gray-300 rounded-lg py-3 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition text-base bg-black text-white"
              onClick={() => alert('Login dengan Apple coming soon!')}
              disabled={loading}
            >
              {/* ...SVG Apple... */}
              Masuk dengan Apple
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
