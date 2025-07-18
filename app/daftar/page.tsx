"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hp, setHp] = useState("");
  const [setuju, setSetuju] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState<{ type: "error" | "sukses"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPesan(null);

    if (!nama || !email || !password || !hp) {
      setPesan({ type: "error", text: "Semua field wajib diisi." });
      return;
    }
    if (!setuju) {
      setPesan({ type: "error", text: "Anda harus setuju dengan Syarat & Ketentuan." });
      return;
    }
    if (password.length < 8) {
      setPesan({ type: "error", text: "Password minimal 8 karakter." });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nama, phone: hp },
      },
    });

    if (error) {
      setPesan({ type: "error", text: error.message });
    } else {
      setPesan({
        type: "sukses",
        text: "Daftar berhasil! Silakan cek email untuk verifikasi.",
      });
      setNama(""); setEmail(""); setPassword(""); setHp(""); setSetuju(false);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-200 to-green-100 flex items-center justify-center px-2">
      <form
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">
          Daftar ke <span className="text-blue-500">YooRent</span>
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Data kamu akan diverifikasi, pastikan sesuai identitas asli.
        </p>

        {pesan && (
          <div className={`text-center py-2 px-3 rounded-lg mb-2 text-sm ${pesan.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-emerald-700"}`}>
            {pesan.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold mb-1">Nama Lengkap</label>
          <input
            type="text"
            className="input input-bordered w-full rounded-lg"
            placeholder="Nama sesuai KTP"
            value={nama}
            onChange={e => setNama(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            className="input input-bordered w-full rounded-lg"
            placeholder="email@domain.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input input-bordered w-full rounded-lg pr-12"
              placeholder="Minimal 8 karakter"
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              onClick={() => setShowPassword((show) => !show)}
              disabled={loading}
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
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Nomor HP/Whatsapp</label>
          <input
            type="tel"
            className="input input-bordered w-full rounded-lg"
            placeholder="08xxxxxxxxxx"
            pattern="08[0-9]{8,12}"
            value={hp}
            onChange={e => setHp(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Checkbox syarat */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            required
            className="checkbox checkbox-sm"
            checked={setuju}
            onChange={e => setSetuju(e.target.checked)}
            disabled={loading}
          />
          <span className="text-xs text-gray-600">
            Saya setuju dengan <a href="#" className="text-blue-600 underline">Syarat & Ketentuan</a>
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 font-bold rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white hover:scale-105 transition flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white mr-1" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          Daftar & Verifikasi
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
