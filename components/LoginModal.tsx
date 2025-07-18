"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [setuju, setSetuju] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    if (!setuju) {
      setError("Anda harus setuju dengan Syarat & Ketentuan.");
      return;
    }

    setLoading(true);
    const { error: supaErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setTimeout(() => {
      setLoading(false);
      if (supaErr) {
        setError(supaErr.message);
      } else {
        onClose();
        router.push("/");
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 mx-2 sm:mx-0">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Tutup"
          className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-4">
          Masuk ke YooRent
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
              disabled={loading}
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-400 outline-none mt-1"
            />
          </div>
          <div className="relative">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              disabled={loading}
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-400 outline-none mt-1 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={loading}
              className="absolute right-3 top-9 text-gray-400 hover:text-blue-600"
              tabIndex={-1}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                // Eye Off SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.33-9-7.5a9.98 9.98 0 012.523-5.982M8.5 8.5a3 3 0 114.243 4.243M9.75 9.75a3 3 0 013.808 3.808M3 3l18 18" />
                </svg>
              ) : (
                // Eye SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs mt-1">
            <input
              type="checkbox"
              checked={setuju}
              onChange={(e) => setSetuju(e.target.checked)}
              disabled={loading}
              required
            />
            <span>
              Saya setuju dengan{" "}
              <a href="#" className="text-blue-600 underline">Syarat & Ketentuan</a>
            </span>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] bg-gradient-to-r from-blue-600 to-green-400 text-white font-bold py-3 rounded-lg shadow hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            Masuk
          </button>
        </form>

        <div className="flex justify-between w-full mt-4 text-sm">
          <Link
            href="/daftar"
            className="text-blue-600 hover:underline font-semibold"
          >
            Belum punya akun? Daftar gratis
          </Link>
          <Link
            href="/lupa-password"
            className="text-gray-500 hover:underline"
          >
            Lupa password?
          </Link>
        </div>

        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-3 text-xs text-gray-400 whitespace-nowrap">
            atau lanjutkan dengan
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={() => signIn("google")}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg py-3 font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition bg-white"
          >
            <FcGoogle className="w-6 h-6" /> Masuk dengan Google
          </button>
          <button
            type="button"
            onClick={() => alert("Login dengan Apple coming soon!")}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg py-3 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition bg-black text-white"
          >
            <FaApple className="w-5 h-5" /> Masuk dengan Apple
          </button>
        </div>
      </div>
    </div>
  );
}
