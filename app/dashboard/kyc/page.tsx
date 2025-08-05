"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function KycPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [nama, setNama] = useState("");
  const [ktp, setKtp] = useState<File | null>(null);
  const [ktpUrl, setKtpUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Get user dan isi data awal profile
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/masuk");
        return;
      }
      setUser(user);
      const { data } = await supabase
        .from("profiles")
        .select("nama, ktp_url, is_verified")
        .eq("id", user.id)
        .single();
      if (data) {
        setNama(data.nama || "");
        setKtpUrl(data.ktp_url || "");
        setSuccess(data.is_verified);
      }
      setLoading(false);
    });
  }, []);

  // Handler upload file
  async function handleUpload(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    setKtp(file);
    setKtpUrl(URL.createObjectURL(file));
  }

  // Handler submit form
  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    let url = ktpUrl;
    // Upload KTP jika file diubah
    if (ktp) {
      const fileExt = ktp.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const { error } = await supabase.storage
        .from("ktp") // Ganti "kyc" jika nama bucket beda
        .upload(fileName, ktp, { upsert: true });
      if (error) {
        alert("Upload KTP gagal: " + error.message);
        setLoading(false);
        return;
      }
      url = supabase.storage.from("ktp").getPublicUrl(fileName).data.publicUrl;
    }

    // Update profile: nama & url KTP, reset verifikasi
    const { error } = await supabase
      .from("profiles")
      .update({ nama, ktp_url: url, is_verified: false })
      .eq("id", user.id);

    setLoading(false);
    if (!error) {
      setSuccess(true);
      alert("Data berhasil dikirim. Akunmu akan diverifikasi oleh admin.");
      router.replace("/dashboard/profile");
    } else {
      alert("Gagal update profil: " + error.message);
    }
  }

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <form
        className="bg-white max-w-md w-full rounded-xl p-8 shadow-xl flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-3">
          Verifikasi KTP (KYC)
        </h1>
        <div>
          <label className="font-semibold mb-1 block">Nama Lengkap</label>
          <input
            type="text"
            className="w-full border p-2 rounded focus:outline-blue-500"
            value={nama}
            onChange={e => setNama(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="font-semibold mb-1 block">Upload Foto KTP</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mb-2"
            required={!ktpUrl}
          />
          {ktpUrl && (
            <img
              src={ktpUrl}
              alt="KTP Preview"
              className="w-64 h-40 object-cover border rounded mx-auto mt-2"
            />
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 font-bold transition"
        >
          {loading ? "Mengirim..." : "Kirim Verifikasi"}
        </button>
        <p className="text-xs text-gray-500 text-center">
          Data akan diverifikasi manual oleh admin. Pastikan data sesuai!
        </p>
      </form>
    </div>
  );
}
