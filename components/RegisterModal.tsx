"use client";
import React, { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // Pastikan path sesuai struktur project

export default function RegisterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Register ke Supabase Auth
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          // NOTE: KTP/selfie belum di-upload ke Supabase Storage, hanya nama saja
        },
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Pendaftaran berhasil! Silakan cek email untuk verifikasi sebelum login.");
      // Reset form (opsional)
      setEmail("");
      setPassword("");
      setFullName("");
      setPhone("");
      setKtpPreview(null);
      setSelfiePreview(null);
    }
  };

  if (!open) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-center mb-3">Daftar ke <span className="text-blue-500">YooRent</span></h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
        <input
          className="input input-bordered w-full rounded-lg"
          type="text"
          placeholder="Nama Lengkap"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
        <input
          className="input input-bordered w-full rounded-lg"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="input input-bordered w-full rounded-lg"
          type="password"
          placeholder="Password"
          minLength={8}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          className="input input-bordered w-full rounded-lg"
          type="tel"
          placeholder="08xxxxxxxxxx"
          pattern="08[0-9]{8,12}"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />

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
          <img src={ktpPreview} alt="Preview KTP" className="mt-2 rounded-lg w-32 mx-auto shadow border" />
        )}

        <label className="block text-sm font-semibold mb-1">Upload Selfie dengan KTP</label>
        <input
          ref={selfieInputRef}
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={handleSelfieChange}
          required
        />
        {selfiePreview && (
          <img src={selfiePreview} alt="Preview Selfie KTP" className="mt-2 rounded-lg w-32 mx-auto shadow border" />
        )}

        <div className="flex items-center gap-2">
          <input type="checkbox" required className="checkbox checkbox-sm" />
          <span className="text-xs text-gray-600">
            Saya setuju dengan <a href="#" className="text-blue-600 underline">Syarat & Ketentuan</a>
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-2 font-bold rounded-lg bg-gradient-to-r from-blue-500 to-green-400 text-white hover:scale-105 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Daftar & Verifikasi"}
        </button>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="text-green-500 text-sm text-center">{success}</div>}
      </form>
      <p className="text-xs text-gray-400 text-center mt-3">
        Sudah punya akun?{" "}
        <span className="text-blue-500 cursor-pointer" onClick={onClose}>
          Masuk
        </span>
      </p>
    </div>
  );
}
