"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { signIn } from "next-auth/react";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 mx-4">
        {/* Close button */}
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 text-2xl"
          onClick={onClose}
          aria-label="Tutup"
          type="button"
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-blue-600"
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
            {loading ? "Loading..." : "Masuk"}
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
          >
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.3-6.3C34.1 4.5 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20.1-7.7 20.1-21 0-1.4-.1-2.5-.3-3.5z"/>
              <path fill="#34A853" d="M6.7 14.1l7 5.1C15.2 16.2 19.2 13 24 13c3.1 0 6 .9 8.3 2.7l6.3-6.3C34.1 4.5 29.3 3 24 3c-7.6 0-14 5.4-17.3 11.1z"/>
              <path fill="#FBBC05" d="M24 44c5.9 0 10.7-1.9 14.2-5.2l-6.6-5.4C29.7 35.6 27 36.5 24 36.5c-5.8 0-10.7-3.9-12.4-9.2l-6.9 5.3C7.9 41 15.2 44 24 44z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7C35.5 32.5 30.6 36.5 24 36.5c-5.8 0-10.7-3.9-12.4-9.2l-6.9 5.3C7.9 41 15.2 44 24 44z"/>
            </svg>
            Masuk dengan Google
          </button>
          <button
            type="button"
            className="w-full border border-gray-300 rounded-lg py-3 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition text-base bg-black text-white"
            onClick={() => alert('Login dengan Apple coming soon!')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path fill="white" d="M16.365 1.43c0 1.14-.933 2.615-2.025 2.615-.115 0-.232-.015-.355-.038.02-.24.055-.495.11-.768.233-1.14 1.29-2.635 2.13-2.635.12 0 .244.018.364.044-.03.24-.077.49-.124.782zM14.419 4.317c.339 0 .683-.117 1.043-.35.073.044.144.086.216.13-.156.324-.349.645-.564.942-.369.505-.833 1.018-1.47 1.018-.115 0-.227-.016-.338-.046-.001-.03-.001-.06-.001-.09 0-1.037.81-1.604 1.114-1.604zM21.981 19.707c-.315.704-1.201 1.995-2.434 1.995-1.067 0-1.349-.627-2.51-.627-1.156 0-1.497.61-2.486.61-1.014 0-2.021-1.17-2.527-2.34-.457-1.066-.853-2.74-.353-3.961.38-.95 1.236-1.553 2.069-1.553.921 0 1.344.62 2.498.62 1.158 0 1.486-.627 2.5-.627.456 0 1.591.243 2.18 1.207-.058.032-1.397.807-1.384 2.39.015 1.425 1.164 1.907 1.183 1.916z"/>
            </svg>
            Masuk dengan Apple
          </button>
        </div>
      </div>
    </div>
  );
}
