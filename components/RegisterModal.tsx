"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-8 mx-4">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 text-2xl"
          onClick={onClose}
          type="button"
        >×</button>
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-2">Daftar ke YooRent</h2>
        <form className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border px-4 py-3 focus:border-blue-400 outline-none"
            required
          />
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border px-4 py-3 focus:border-blue-400 outline-none"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 focus:border-blue-400 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <input
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border px-4 py-3 focus:border-blue-400 outline-none"
            required
          />
          <div className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>Saya setuju dengan <a href="/syarat" className="text-blue-600 hover:underline">Syarat & Ketentuan</a></span>
          </div>
          <button
            type="submit"
            disabled={!agree}
            className="bg-gradient-to-r from-blue-600 to-green-400 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            Daftar & Verifikasi
          </button>
        </form>

        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="mx-3 text-xs text-gray-400">atau daftar dengan</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition text-base"
            onClick={() => signIn("google")}
          >
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .9 8.3 2.7l6.3-6.3C34.1 4.5 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20.1-7.7 20.1-21 0-1.4-.1-2.5-.3-3.5z"/>
              <path fill="#34A853" d="M6.7 14.1l7 5.1C15.2 16.2 19.2 13 24 13c3.1 0 6 .9 8.3 2.7l6.3-6.3C34.1 4.5 29.3 3 24 3c-7.6 0-14 5.4-17.3 11.1z"/>
              <path fill="#FBBC05" d="M24 44c5.9 0 10.7-1.9 14.2-5.2l-6.6-5.4C29.7 35.6 27 36.5 24 36.5c-5.8 0-10.7-3.9-12.4-9.2l-6.9 5.3C7.9 41 15.2 44 24 44z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7C35.5 32.5 30.6 36.5 24 36.5c-5.8 0-10.7-3.9-12.4-9.2l-6.9 5.3C7.9 41 15.2 44 24 44z"/>
            </svg>
            Lanjutkan dengan Google
          </button>
        </div>

        <p className="text-center text-sm mt-4">
          Sudah punya akun? <a href="/masuk" className="text-blue-600 hover:underline">Masuk</a>
        </p>
      </div>
    </div>
  );
}
