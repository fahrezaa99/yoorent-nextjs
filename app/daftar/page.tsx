"use client";
import React, { useState } from "react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Registrasi berhasil (dummy)\nData diverifikasi oleh admin.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-200 to-green-100 flex items-center justify-center">
      <form
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">
          Daftar ke <span className="text-blue-500">YooRent</span>
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Data kamu akan diverifikasi, pastikan sesuai identitas asli.
        </p>

        <div>
          <label className="block text-sm font-semibold mb-1">Nama Lengkap</label>
          <input
            type="text"
            className="input input-bordered w-full rounded-lg"
            placeholder="Nama sesuai KTP"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            className="input input-bordered w-full rounded-lg"
            placeholder="email@domain.com"
            required
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
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              onClick={() => setShowPassword((show) => !show)}
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
            required
          />
        </div>

        {/* Checkbox syarat */}
        <div className="flex items-center gap-2">
          <input type="checkbox" required className="checkbox checkbox-sm" />
          <span className="text-xs text-gray-600">
            Saya setuju dengan <a href="#" className="text-blue-600 underline">Syarat & Ketentuan</a>
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 font-bold rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white hover:scale-105 transition"
        >
          Daftar & Verifikasi
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
