"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // Pastikan path benar
import { signIn } from "next-auth/react";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);
    // Login manual Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // Berhasil login
      window.location.href = "/"; // atau redirect ke dashboard/profile
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 mx-2">
        <button
          className="absolute right-5 top-5 text-gray-400 hover:text-blue-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-1">Masuk ke YooRent</h2>
        <p className="text-center text-gray-500 mb-4 text-sm">Login untuk akses penuh fitur YooRent.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:border-blue-400 outline-none"
            required
            placeholder="you@email.com"
          />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 focus:border-blue-400 outline-none"
            required
            placeholder="Password"
          />
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-green-400 to-blue-500 text-white font-bold py-2 rounded-xl shadow hover:opacity-90 text-lg transition"
            disabled={loading}
          >
            {loading ? "Loading..." : "Masuk"}
          </button>
        </form>
        <div className="flex justify-between mt-4 text-xs">
          <a href="/daftar" className="text-blue-600 hover:underline">
            Daftar Gratis
          </a>
          <a href="/lupa-password" className="text-gray-500 hover:underline">
            Lupa password?
          </a>
        </div>
        <div className="my-6 text-center text-gray-400 flex items-center">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="mx-3 text-xs">atau lanjutkan dengan</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="w-full border border-gray-300 rounded-lg py-2 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            onClick={() => signIn("google")}
          >
            {/* ...icon Google... */}
            Lanjutkan dengan Google
          </button>
          <button
            type="button"
            className="w-full border border-gray-300 rounded-lg py-2 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition bg-black text-white"
            onClick={() => alert('Login dengan Apple coming soon!')}
          >
            {/* ...icon Apple... */}
            Lanjutkan dengan Apple
          </button>
        </div>
      </div>
    </div>
  );
}
