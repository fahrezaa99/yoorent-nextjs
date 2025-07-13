"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, UploadCloud } from "lucide-react";

export default function TambahBarangPage() {
  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    lokasi: "",
    alamat: "",
    harga: "",
    deposit: "",
    deskripsi: "",
    kondisi: "",
    whatsapp: "",
    catatan: "",
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const router = useRouter();

  const isFormValid = () =>
    form.nama &&
    form.kategori &&
    form.lokasi &&
    form.harga &&
    form.kondisi &&
    foto &&
    form.whatsapp;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFoto(file ?? null);
    if (file) setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setToast("Lengkapi semua field yang wajib dan upload foto barang!");
      setTimeout(() => setToast(""), 2300);
      return;
    }
    setLoading(true);

    // 1. Upload foto ke storage Supabase
    let fotoUrl = "";
    if (foto) {
      const fileName = `foto-${Date.now()}-${foto.name}`;
      const { data, error } = await supabase.storage
        .from("barang-foto")
        .upload(fileName, foto);
      if (error) {
        setToast("Gagal upload foto");
        setLoading(false);
        return;
      }
      fotoUrl = supabase.storage.from("barang-foto").getPublicUrl(data?.path || fileName).publicUrl;
    }

    // 2. Insert ke table barang
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { error: dbError } = await supabase.from("barang").insert({
      ...form,
      harga: Number(form.harga),
      deposit: form.deposit ? Number(form.deposit) : null,
      foto: fotoUrl,
      user_id: userId,
    });
    console.log("INSERT ERROR:", dbError); // <---- Tambahkan baris ini untuk debug!
    setLoading(false);

    if (!dbError) {
      setToast("Barang berhasil diajukan!");
      setTimeout(() => router.push("/dashboard/barang"), 1600);
    } else {
      setToast("Gagal simpan data!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-green-50 py-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg animate-fadein">{toast}</div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-4">
        <h2 className="font-extrabold text-2xl mb-2 text-blue-700">Tambah Barang Sewa</h2>
        {/* ... form input sama seperti sebelumnya ... */}
        {/* ... Copy dari kode kamu ... */}
        {/* (kode form input tidak diubah, langsung tempel dari kode kamu yang sekarang, cukup tambahkan console.log di atas!) */}
      </form>
    </div>
  );
}
