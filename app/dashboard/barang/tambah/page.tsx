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

  const handleInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
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

      // Ambil publicUrl DENGAN CARA BENAR!
      let publicPath = fileName;
      if (data && typeof data.path === "string") {
        publicPath = data.path;
      }
      const { data: urlData } = supabase.storage
        .from("barang-foto")
        .getPublicUrl(publicPath);
      fotoUrl = urlData?.publicUrl ?? "";
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
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg animate-fadein">
          {toast}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-4"
      >
        <h2 className="font-extrabold text-2xl mb-2 text-blue-700">
          Tambah Barang Sewa
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            name="nama"
            placeholder="Nama barang *"
            value={form.nama}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />
          <input
            type="text"
            name="kategori"
            placeholder="Kategori *"
            value={form.kategori}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />
          <input
            type="text"
            name="lokasi"
            placeholder="Lokasi *"
            value={form.lokasi}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />
          <input
            type="text"
            name="alamat"
            placeholder="Alamat"
            value={form.alamat}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />
          <input
            type="number"
            name="harga"
            placeholder="Harga Sewa per Hari *"
            value={form.harga}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />
          <input
            type="number"
            name="deposit"
            placeholder="Deposit (optional)"
            value={form.deposit}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />
          <textarea
            name="deskripsi"
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />
          <input
            type="text"
            name="kondisi"
            placeholder="Kondisi Barang *"
            value={form.kondisi}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />
          <input
            type="text"
            name="whatsapp"
            placeholder="No WhatsApp *"
            value={form.whatsapp}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />
          <textarea
            name="catatan"
            placeholder="Catatan untuk penyewa (optional)"
            value={form.catatan}
            onChange={handleInput}
            className="w-full p-2 rounded border"
          />

          {/* Upload Foto */}
          <label className="block text-sm font-medium text-gray-700 mt-3">
            Foto Barang *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className="block w-full text-sm text-gray-900"
          />
          {fotoPreview && (
            <img
              src={fotoPreview}
              alt="Preview"
              className="h-28 mt-2 rounded object-contain border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl shadow transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Mengajukan...
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" /> Ajukan Barang
            </>
          )}
        </button>
      </form>
    </div>
  );
}
