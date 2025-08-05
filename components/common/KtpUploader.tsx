// components/KtpUploader.tsx
"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient();

export default function KtpUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Pilih file KTP terlebih dahulu!");
      return;
    }
    setUploading(true);
    setError("");
    setSuccess("");
    setProgress(null);

    const fileExt = file.name.split(".").pop();
    // Nama unik, misal userId-timestamp.ext
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file ke bucket "ktp"
    const { data, error: uploadError } = await supabase.storage
      .from("ktp")
      .upload(filePath, file);

    if (uploadError) {
      setError("Gagal upload: " + uploadError.message);
      setUploading(false);
      return;
    }

    // Ambil public url file KTP
    const { data: publicUrlData } = supabase.storage
      .from("ktp")
      .getPublicUrl(filePath);

    // Update field "ktp_url" di table "profiles"
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ ktp_url: publicUrlData.publicUrl })
      .eq("id", userId);

    if (dbError) {
      setError("Upload berhasil, tapi gagal update database: " + dbError.message);
      setUploading(false);
      return;
    }

    setSuccess("Berhasil upload KTP!");
    setUploading(false);
    setProgress(100);
  }

  return (
    <div className="max-w-md mx-auto p-4 rounded-xl shadow bg-white">
      <label className="block mb-2 font-semibold">Upload Foto KTP (jpg/png/pdf):</label>
      <input
        type="file"
        accept="image/*,application/pdf"
        className="mb-3"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
        disabled={uploading}
      />
      {progress !== null && (
        <div className="h-2 w-full bg-gray-200 rounded my-2">
          <div
            className="bg-blue-600 h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white font-bold disabled:opacity-50"
        disabled={uploading}
        onClick={handleUpload}
      >
        {uploading ? "Mengupload..." : "Upload KTP"}
      </button>
    </div>
  );
}
