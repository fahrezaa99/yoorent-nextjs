"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProfileHeader from "./components/ProfileHeader";
import ProfileKtpForm from "./components/ProfileKtpForm";

export default function DashboardProfilePage() {
  const [nama, setNama] = useState("");
  const [foto, setFoto] = useState(""); // Link URL foto yang tersimpan
  const [preview, setPreview] = useState<string | null>(null); // Preview upload
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [is_verified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("nama, foto, email, hp, alamat, is_verified")
          .eq("id", user.id)
          .single();
        setNama(data?.nama ?? "");
        setFoto(data?.foto ?? "");
        setPreview(data?.foto ?? null);
        setEmail(data?.email ?? "");
        setHp(data?.hp ?? "");
        setAlamat(data?.alamat ?? "");
        setIsVerified(data?.is_verified ?? false);
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  // Handle upload foto
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPreview(URL.createObjectURL(file));
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = fileName;
    const { error } = await supabase.storage.from("profiles").upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });
    if (error) {
      alert("Gagal upload foto! " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);
    setFoto(data.publicUrl);
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        nama, foto, hp, alamat
      }).eq("id", user.id);
      alert("Profil berhasil diupdate!");
    }
    setLoading(false);
  };

  // Callback saat verifikasi KTP berhasil
  const handleVerifikasiSuccess = async () => {
    // Update status profile di Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ is_verified: true })
        .eq("id", user.id);
      setIsVerified(true);
      alert("Verifikasi KTP berhasil! Akun kamu sekarang sudah terverifikasi.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-2">
      <div className="w-full max-w-xl bg-white p-6 md:p-10 rounded-2xl shadow-xl">

        {/* --- PROFILE HEADER --- */}
        <ProfileHeader
          nama={nama}
          email={email}
          is_verified={is_verified}
          avatar_url={foto}
        />

        {/* --- FORM UPLOAD FOTO SAJA (tanpa nama, hp, alamat, email, dll) --- */}
        <form onSubmit={handleSave} className="flex flex-col gap-5 mb-8">
          <div className="flex flex-col items-center gap-3">
            <label className="text-sm font-medium text-gray-600 flex flex-col items-center">
              <span>Upload Foto</span>
              <input
                type="file"
                accept="image/*"
                className="mt-1"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploading && (
                <span className="text-xs text-blue-600 mt-1">Uploading...</span>
              )}
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        {/* --- VERIFIKASI KTP (muncul jika belum verif) --- */}
        {!is_verified && (
          <ProfileKtpForm onSuccess={handleVerifikasiSuccess} />
        )}

      </div>
    </div>
  );
}
