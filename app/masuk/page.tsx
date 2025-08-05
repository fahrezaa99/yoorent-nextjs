"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function MasukPage() {
  const [slide, setSlide] = useState<"login" | "daftar">("login");

  // STATE LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // STATE DAFTAR
  const [regEmail, setRegEmail] = useState("");
  const [regNama, setRegNama] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!email || !password) {
      setLoginError("Email dan password wajib diisi.");
      return;
    }
    // TODO: Ganti dengan login sesungguhnya (signIn)
    alert("Fitur login manual coming soon!");
  };

  // Handle Register
  const handleDaftar = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    if (!regEmail || !regNama || !regPassword) {
      setRegError("Semua field wajib diisi.");
      return;
    }
    // TODO: Ganti dengan logic register ke backend-mu
    setRegSuccess("Berhasil daftar! Silakan login.");
    setTimeout(() => {
      setSlide("login");
      setRegSuccess("");
      setRegEmail("");
      setRegNama("");
      setRegPassword("");
    }, 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-8 px-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">

        {/* SLIDE TAB NAV */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            className={`flex-1 py-2 rounded-xl font-bold text-lg transition ${slide === "login" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-blue-600"}`}
            onClick={() => setSlide("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-xl font-bold text-lg transition ${slide === "daftar" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-blue-600"}`}
            onClick={() => setSlide("daftar")}
          >
            Daftar
          </button>
        </div>

        {/* SLIDE LOGIN */}
        {slide === "login" && (
          <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
            <h1 className="text-2xl font-extrabold text-blue-700 mb-4 text-center">Masuk ke YooRent</h1>
            <div>
              <label className="block font-semibold text-sm mb-1">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:border-blue-400 outline-none"
                required
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:border-blue-400 outline-none"
                required
                placeholder="Password"
              />
            </div>
            {loginError && <div className="text-red-600 text-sm">{loginError}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-green-400 to-blue-500 text-white font-bold py-2 rounded-xl shadow hover:opacity-90 text-lg transition"
            >
              Masuk
            </button>
            <div className="flex justify-end mt-2 text-sm">
              <Link href="/lupa-password" className="text-gray-500 hover:underline">
                Lupa password?
              </Link>
            </div>
            <div className="my-6 text-center text-gray-400 flex items-center">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="mx-3">atau lanjutkan dengan</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="w-full border border-gray-300 rounded-lg py-2 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                onClick={() => signIn("google")}
              >
                {/* ...Icon Google... */}
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none"><path d="M19.6 10.23c0-.68-.06-1.35-.17-2H10v3.77h5.48a4.69 4.69 0 01-2.04 3.08v2.55h3.29c1.92-1.78 3.02-4.4 3.02-7.4z" fill="#4285F4"/><path d="M10 20c2.7 0 4.97-.9 6.63-2.43l-3.29-2.55c-.91.6-2.07.96-3.34.96-2.56 0-4.72-1.73-5.5-4.06H1.08v2.6A10 10 0 0010 20z" fill="#34A853"/><path d="M4.5 11.92a6.02 6.02 0 010-3.84v-2.6H1.08A10 10 0 000 10c0 1.59.38 3.09 1.08 4.4l3.42-2.48z" fill="#FBBC05"/><path d="M10 3.97c1.47 0 2.8.51 3.85 1.52l2.9-2.9A9.96 9.96 0 0010 0 10 10 0 001.08 4.4l3.42 2.6C5.28 5.7 7.44 3.97 10 3.97z" fill="#EA4335"/></svg>
                Masuk dengan Google
              </button>
              <button
                type="button"
                className="w-full border border-gray-300 rounded-lg py-2 font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition bg-black text-white"
                onClick={() => alert('Fitur login dengan Apple coming soon!')}
              >
                {/* ...Icon Apple... */}
                <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15.67,10.8c0-2.45,2.05-3.27,2.15-3.32c-1.17-1.71-2.99-1.95-3.64-1.98c-1.56-0.16-3.04,0.91-3.83,0.91
                  c-0.8,0-2.01-0.89-3.32-0.87c-1.7,0.03-3.24,0.99-4.1,2.51c-1.74,3.01-0.45,7.45,1.24,9.89c0.82,1.18,1.8,2.5,3.09,2.45
                  c1.25-0.05,1.73-0.79,3.24-0.79c1.51,0,1.94,0.79,3.28,0.76c1.36-0.03,2.21-1.2,3.02-2.39c0.95-1.39,1.35-2.75,1.36-2.82
                  C18.72,15.26,15.67,14.07,15.67,10.8z"/>
                  <path d="M13.63,4.27c0.71-0.87,1.19-2.08,1.05-3.27c-1.02,0.04-2.24,0.68-2.97,1.55c-0.65,0.77-1.23,2-1.01,3.17
                  C11.84,5.84,12.92,5.15,13.63,4.27z"/>
                </svg>
                Masuk dengan Apple
              </button>
            </div>
          </form>
        )}

        {/* SLIDE DAFTAR */}
        {slide === "daftar" && (
          <form onSubmit={handleDaftar} className="space-y-4 animate-fade-in">
            <h1 className="text-2xl font-extrabold text-blue-700 mb-4 text-center">Daftar di YooRent</h1>
            <div>
              <label className="block font-semibold text-sm mb-1">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:border-blue-400 outline-none"
                required
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={regNama}
                onChange={e => setRegNama(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:border-blue-400 outline-none"
                required
                placeholder="Nama Lengkap"
              />
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1">Password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                className="w-full rounded-lg border px-4 py-2 focus:border-blue-400 outline-none"
                required
                placeholder="Password"
              />
            </div>
            {regError && <div className="text-red-600 text-sm">{regError}</div>}
            {regSuccess && <div className="text-green-600 text-sm">{regSuccess}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-green-400 to-blue-500 text-white font-bold py-2 rounded-xl shadow hover:opacity-90 text-lg transition"
            >
              Daftar
            </button>
            <div className="flex justify-end mt-2 text-sm">
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setSlide("login")}
              >
                Sudah punya akun? Masuk
              </button>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}
