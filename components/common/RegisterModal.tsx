"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";

export default function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [setuju, setSetuju] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !password || !repeatPassword || !hp) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Password tidak sama.");
      return;
    }
    if (!setuju) {
      setError("Anda harus setuju dengan Syarat & Ketentuan.");
      return;
    }

    setLoading(true);
    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone: hp },
      },
    });
    setLoading(false);

    if (signUpErr) {
      // Handle jika email sudah terdaftar
      if (
        signUpErr.message?.toLowerCase().includes("already registered") ||
        signUpErr.message?.toLowerCase().includes("already exists") ||
        (signUpErr.message?.toLowerCase().includes("email") && signUpErr.message?.toLowerCase().includes("exists")) ||
        signUpErr.message?.toLowerCase().includes("user with this email") ||
        signUpErr.message?.toLowerCase().includes("email is already")
      ) {
        setError("Email sudah terdaftar. Silakan login atau gunakan email lain.");
      } else {
        setError(signUpErr.message);
      }
      setSuccess(false);
      return;
    }

    // KIRIM EMAIL SELAMAT DATANG VIA API
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          nama: name
        }),
      });
    } catch (err) {
      // Tidak masalah jika email gagal terkirim, user tetap bisa lanjut
    }

    setSuccess(true);
  };

  const handleResendEmail = async () => {
    setResendMessage("");
    setResending(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setResendMessage("Gagal mengirim ulang email. Coba beberapa saat lagi.");
    } else {
      setResendMessage("Email verifikasi telah dikirim ulang. Silakan cek inbox/spam.");
    }

    setResending(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[100]" onClick={onClose}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-[95vw] max-w-md p-7 mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Tutup"
          className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 text-2xl"
        >
          <X className="w-6 h-6" />
        </button>

        {success ? (
          <div className="text-center py-8 px-4">
            <div className="text-green-600 mb-4">
              <svg
                className="mx-auto w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Selamat datang!</h3>
            <p className="text-gray-600 mb-4">
              Akun kamu sudah aktif. Silakan verifikasi email kamu untuk mulai menyewa barang.
            </p>

            <button
              onClick={handleResendEmail}
              disabled={resending}
              className={`text-sm px-4 py-2 rounded-lg font-semibold transition ${
                resending
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {resending ? "Mengirim ulang..." : "Kirim Ulang Email Verifikasi"}
            </button>

            {resendMessage && (
              <p className="mt-3 text-sm text-gray-600">{resendMessage}</p>
            )}
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-2">Daftar ke YooRent</h2>
            <p className="text-gray-500 text-sm text-center mb-4">
              Data kamu akan diverifikasi, pastikan sesuai identitas asli.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama sesuai KTP"
                  required
                  disabled={loading || success}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-400 outline-none mt-1 bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  disabled={loading || success}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-400 outline-none mt-1 bg-gray-50"
                />
              </div>
              <div className="relative">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password minimal 8 karakter"
                  required
                  minLength={8}
                  disabled={loading || success}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-400 outline-none mt-1 pr-10 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={loading || success}
                  className="absolute right-3 top-9 text-gray-400 hover:text-blue-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.33-9-7.5a9.98 9.98 0 012.523-5.982M8.5 8.5a3 3 0 114.243 4.243M9.75 9.75a3 3 0 013.808 3.808M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="relative">
                <label className="text-sm font-semibold text-gray-700">Ulangi Password</label>
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Ulangi password"
                  required
                  minLength={8}
                  disabled={loading || success}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-400 outline-none mt-1 pr-10 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword((v) => !v)}
                  disabled={loading || success}
                  className="absolute right-3 top-9 text-gray-400 hover:text-blue-600"
                  tabIndex={-1}
                  aria-label={showRepeatPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showRepeatPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.33-9-7.5a9.98 9.98 0 012.523-5.982M8.5 8.5a3 3 0 114.243 4.243M9.75 9.75a3 3 0 013.808 3.808M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Nomor HP</label>
                <input
                  type="tel"
                  pattern="^08[0-9]{8,}$"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                  disabled={loading || success}
                  className="w-full rounded-xl border px-4 py-3 focus:border-blue-400 outline-none mt-1 bg-gray-50"
                />
              </div>
              <div className="flex items-center gap-2 text-xs mt-1">
                <input
                  type="checkbox"
                  checked={setuju}
                  onChange={(e) => setSetuju(e.target.checked)}
                  disabled={loading || success}
                  required
                  className="accent-blue-600 w-4 h-4 rounded border-gray-300"
                />
                <span>
                  Saya setuju dengan{" "}
                  <a href="#" className="text-blue-600 underline">Syarat & Ketentuan</a>
                </span>
              </div>
              {error && (
                <div className={`text-sm mt-1 ${success ? "text-green-600 font-bold" : "text-red-600"}`}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full min-h-[48px] rounded-xl font-bold py-3 flex items-center justify-center gap-2 transition
                  ${loading || success
                    ? "bg-blue-200 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow"}`}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                Daftar & Verifikasi
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
