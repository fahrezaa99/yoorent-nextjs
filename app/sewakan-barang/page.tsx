"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

const categories = [
  "Kamera & Elektronik",
  "Handphone & Gadget",
  "Laptop & Komputer",
  "Kendaraan",
  "Properti",
  "Alat Berat",
  "Fashion & Aksesoris",
  "Outdoor & Camping",
  "Lainnya",
];

const conditions = [
  "Baru",
  "Sangat Baik",
  "Baik",
  "Layak Pakai",
];

export default function SewakanBarangPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fotoRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    // Cek field
    const nama = data.get("nama") as string;
    const kategori = data.get("kategori") as string;
    const lokasi = data.get("lokasi") as string;
    const alamat = data.get("alamat") as string;
    const harga = Number(data.get("harga"));
    const deposit = Number(data.get("deposit")) || 0;
    const deskripsi = data.get("deskripsi") as string;
    const kondisi = data.get("kondisi") as string;
    const whatsapp = data.get("whatsapp") as string;
    const catatan = data.get("catatan") as string;
    const fotoFile = data.get("foto") as File;

    // Upload foto ke Supabase Storage
    let fotoUrl = "";
    if (fotoFile && fotoFile.size > 0) {
      const fileExt = fotoFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("barang-foto")
        .upload(fileName, fotoFile, { cacheControl: "3600", upsert: false });
      if (uploadError) {
  setError(`Upload foto gagal: ${uploadError.message || uploadError.toString() || "Unknown error"}`);
  setLoading(false);
  return;
}
      // Ambil publicUrl dengan benar
      const { data: urlData } = supabase.storage
        .from("barang-foto")
        .getPublicUrl(fileName);
      fotoUrl = urlData?.publicUrl ?? "";
    }

    // Simpan ke tabel barang
    const { error: insertError } = await supabase.from("barang").insert([
      {
        nama,
        kategori,
        lokasi,
        alamat,
        harga,
        deposit,
        deskripsi,
        kondisi,
        whatsapp,
        catatan,
        foto: fotoUrl,
      },
    ]);
    if (insertError) {
      setError("Gagal menyimpan barang: " + insertError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
    form.reset();
    setPreview(null);
  }

  return (
    <main className="min-h-screen bg-blue-50/60 pt-28 px-2 pb-12 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-7 border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-5 text-center">Sewakan Barangmu</h1>
        <p className="text-gray-600 text-center mb-7">
          Masukkan detail barang yang ingin kamu sewakan.<br />
          Data kamu akan diverifikasi sebelum tampil ke publik.
        </p>
        {sent ? (
          <div className="text-green-600 font-bold text-center text-lg py-10">
            Barang berhasil diajukan! Tim kami akan menghubungi kamu.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="text-red-600 font-bold text-center">{error}</div>}
            <input
              name="nama"
              required
              placeholder="Nama Barang (misal: Kamera Canon 80D)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
            />

            <select
              name="kategori"
              required
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none text-gray-700"
              defaultValue=""
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              name="lokasi"
              required
              placeholder="Lokasi (Kota)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
            />

            <textarea
              name="alamat"
              placeholder="Alamat lengkap lokasi barang (opsional: share link Google Maps)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none resize-none"
              rows={2}
            />

            <div className="flex gap-2">
              <input
                name="harga"
                type="number"
                required
                placeholder="Harga Sewa/hari (Rp)"
                className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
                min={0}
              />
              <input
                name="deposit"
                type="number"
                placeholder="Deposit/Jaminan (optional)"
                className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
                min={0}
              />
            </div>

            <textarea
              name="deskripsi"
              required
              placeholder="Deskripsi barang (misal: lensa 18-55mm, baterai, charger, kondisi 99%)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none resize-none"
              rows={3}
            />

            <select
              name="kondisi"
              required
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none text-gray-700"
              defaultValue=""
            >
              <option value="" disabled>
                Pilih Kondisi Barang
              </option>
              {conditions.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>

            {/* Upload foto */}
            <input
              name="foto"
              type="file"
              required
              accept="image/*"
              ref={fotoRef}
              className="w-full"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
                else setPreview(null);
              }}
            />
            {preview && (
              <div className="my-2 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-24 rounded-lg object-cover"
                />
              </div>
            )}

            <input
              name="whatsapp"
              required
              placeholder="Nomor Whatsapp/Telepon (privasi terjaga, contoh: 0812xxxx)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
            />

            <input
              name="catatan"
              placeholder="Aturan sewa/catatan tambahan (opsional)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
            />

            <div className="flex items-center gap-2">
              <input
                required
                type="checkbox"
                id="tos"
                className="accent-blue-600"
              />
              <label htmlFor="tos" className="text-sm text-gray-700">
                Saya setuju dengan{" "}
                <a href="#" className="underline text-blue-600">
                  Syarat & Ketentuan
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 text-white font-bold py-3 rounded-xl shadow hover:scale-105 transition-all duration-200 mt-2 disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Ajukan Barang"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
