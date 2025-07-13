"use client";
import React, { useRef, useState } from "react";

const RegisterPage = () => {
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const ktpInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleKtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKtpPreview(URL.createObjectURL(file));
    }
  };
  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

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
          <input
            type="password"
            className="input input-bordered w-full rounded-lg"
            placeholder="Minimal 8 karakter"
            minLength={8}
            required
          />
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

        {/* Upload KTP */}
        <div>
          <label className="block text-sm font-semibold mb-1">Upload Foto KTP</label>
          <input
            ref={ktpInputRef}
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleKtpChange}
            required
          />
          {ktpPreview && (
            <img src={ktpPreview} alt="Preview KTP" className="mt-2 rounded-lg w-40 mx-auto shadow border" />
          )}
        </div>

        {/* Upload Selfie dengan KTP */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Upload Selfie dengan KTP
            <span className="text-xs text-gray-500 ml-1">
              (Wajah & KTP harus terlihat jelas)
            </span>
          </label>
          <input
            ref={selfieInputRef}
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleSelfieChange}
            required
          />
          {selfiePreview && (
            <img src={selfiePreview} alt="Preview Selfie KTP" className="mt-2 rounded-lg w-40 mx-auto shadow border" />
          )}
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
