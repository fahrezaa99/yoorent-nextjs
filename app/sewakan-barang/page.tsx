"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

const categories = [
  "Kamera & Elektronik",
  "Handphone & Gadget",
  "Laptop & Komputer",
  "Kendaraan",
];

const conditions = ["Baru", "Sangat Baik", "Baik", "Layak Pakai"];

function formatNumber(value: string | number) {
  return value
    .toString()
    .replace(/[^0-9]/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function cleanNumber(value: string | number) {
  return value.toString().replace(/[^0-9]/g, "");
}

export default function SewakanBarangPage() {
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string[]>([]);
  const [fotoFiles, setFotoFiles] = useState<File[]>([]);
  const [harga, setHarga] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");
  const router = useRouter();

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFotoFiles(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Pastikan user sudah login
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Anda harus login terlebih dahulu.");
      setLoading(false);
      return;
    }

    // Tangkap elemen <form> yang valid
    const formEl = e.target as HTMLFormElement;
    const data = new FormData(formEl);

    const nama = data.get("nama") as string;
    const kategori = data.get("kategori") as string;
    const lokasi = data.get("lokasi") as string;
    const alamat = data.get("alamat") as string;
    const hargaVal = Number(cleanNumber(harga));
    const depositVal = Number(cleanNumber(deposit)) || 0;
    const deskripsi = data.get("deskripsi") as string;
    const kondisi = data.get("kondisi") as string;
    const whatsapp = data.get("whatsapp") as string;
    const catatan = data.get("catatan") as string;

    // Upload foto ke Supabase Storage
    const fotoUrls: string[] = [];
    for (const fotoFile of fotoFiles) {
      const ext = fotoFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("barang-foto")
        .upload(fileName, fotoFile, { cacheControl: "3600", upsert: false });
      if (upErr) {
        setError(`Upload foto gagal: ${upErr.message}`);
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("barang-foto").getPublicUrl(fileName);
      fotoUrls.push(urlData.publicUrl);
    }

    // Insert data ke table barang
    const { error: insertErr } = await supabase.from("barang").insert([
      {
        nama,
        kategori,
        lokasi,
        alamat,
        harga: hargaVal,
        deposit: depositVal,
        deskripsi,
        kondisi,
        whatsapp,
        catatan,
        foto: fotoUrls,
        status: "Sedang Diverifikasi",
        user_id: user.id,
      },
    ]);
    if (insertErr) {
      setError(`Gagal menyimpan: ${insertErr.message}`);
      setLoading(false);
      return;
    }

    // Sukses
    setSent(true);
    setLoading(false);
    formEl.reset();
    setPreview([]);
    setFotoFiles([]);
    setHarga("");
    setDeposit("");

    // Redirect ke dashboard setelah 1.2s
    setTimeout(() => {
      router.push("/dashboard/barang");
    }, 1200);
  }

  return (
    <main className="min-h-screen bg-blue-50/60 flex items-center justify-center py-6 px-2 sm:px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
        <h1 className="text-2xl font-extrabold text-blue-700 text-center mb-2">
          Sewakan Barangmu
        </h1>
        <p className="text-center text-gray-600 mb-4 text-sm">
          Masukkan detail barang yang ingin kamu sewakan. Data akan diverifikasi sebelum tampil publik.
        </p>

        {sent ? (
          <div className="text-green-600 font-bold text-center py-8">
            Barang berhasil diajukan!<br />
            <span className="block mt-2 text-sm text-blue-700">
              Mengalihkan ke daftar barang…
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            {/* Nama */}
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Barang
              </label>
              <input
                id="nama"
                name="nama"
                required
                placeholder="Contoh: Kamera Canon 80D"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
            </div>

            {/* Kategori */}
            <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                id="kategori"
                name="kategori"
                required
                defaultValue=""
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm"
              >
                <option value="" disabled>Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Lokasi */}
            <div>
              <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi (Kota)
              </label>
              <input
                id="lokasi"
                name="lokasi"
                required
                placeholder="Jakarta"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
            </div>

            {/* Alamat */}
            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Lengkap (opsional)
              </label>
              <textarea
                id="alamat"
                name="alamat"
                rows={2}
                placeholder="Alamat lengkap / link Google Maps"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm resize-none"
              />
            </div>

            {/* Harga & Deposit */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="harga" className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Sewa/hari (Rp)
                </label>
                <input
                  id="harga"
                  name="harga"
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="100,000"
                  value={harga}
                  onChange={(e) => setHarga(formatNumber(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="deposit" className="block text-sm font-medium text-gray-700 mb-1">
                  Deposit (opsional)
                </label>
                <input
                  id="deposit"
                  name="deposit"
                  type="text"
                  inputMode="numeric"
                  placeholder="50,000"
                  value={deposit}
                  onChange={(e) => setDeposit(formatNumber(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Barang
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                rows={3}
                required
                placeholder="Misal: lensa 18–55mm, baterai, charger"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm resize-none"
              />
            </div>

            {/* Kondisi */}
            <div>
              <label htmlFor="kondisi" className="block text-sm font-medium text-gray-700 mb-1">
                Kondisi Barang
              </label>
              <select
                id="kondisi"
                name="kondisi"
                required
                defaultValue=""
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm"
              >
                <option value="" disabled>Pilih Kondisi</option>
                {conditions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Upload Foto */}
            <div>
              <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Foto (lebih dari 1)
              </label>
              <input
                id="foto"
                name="foto"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFotoChange}
                className="w-full text-sm"
                required={preview.length === 0}
              />
              {preview.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {preview.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="h-16 w-16 object-cover rounded border"
                      width={64}
                      height={64}
                      unoptimized
                    />
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                Nomor WhatsApp/Telepon
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                required
                placeholder="0812xxxx"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
            </div>

            {/* Catatan */}
            <div>
              <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">
                Catatan Tambahan (opsional)
              </label>
              <input
                id="catatan"
                name="catatan"
                placeholder="Misal: minimal sewa 2 hari"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
            </div>

            {/* Syarat */}
            <div className="flex items-center">
              <input
                id="tos"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="tos" className="ml-2 text-xs text-gray-700">
                Saya setuju dengan{" "}
                <a href="#" className="text-blue-600 underline">
                  Syarat & Ketentuan
                </a>
              </label>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl shadow transition disabled:opacity-50 text-sm"
              >
                {loading ? "Mengirim..." : "Ajukan Barang"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
