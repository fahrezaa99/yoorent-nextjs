"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message || "Gagal update password.");
    } else {
      setSuccess("Password berhasil diubah. Silakan login kembali.");
      setTimeout(() => router.push("/login"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            required
            placeholder="Password baru"
            className="border px-3 py-2 rounded-lg outline-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={6}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="bg-blue-600 text-white font-semibold rounded-lg py-2 mt-2 transition hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>
        {success && (
          <div className="mt-4 text-green-600 text-sm text-center">{success}</div>
        )}
        {error && (
          <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
