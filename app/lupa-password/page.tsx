"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LupaPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setError(error.message || "Gagal mengirim email reset password.");
    } else {
      setSuccess("Link reset password berhasil dikirim ke email Anda.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 text-center">Lupa Password</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Masukkan email yang terdaftar untuk mendapatkan link reset password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email kamu"
            className="border px-3 py-2 rounded-lg outline-blue-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="bg-blue-600 text-white font-semibold rounded-lg py-2 mt-2 transition hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>
        {success && (
          <div className="mt-4 text-green-600 text-sm text-center">{success}</div>
        )}
        {error && (
          <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
        )}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-blue-500 text-sm mt-6 hover:underline block mx-auto"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
