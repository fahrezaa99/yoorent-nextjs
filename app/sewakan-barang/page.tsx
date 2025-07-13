"use client";
import { useState } from "react";

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
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {/* Nama barang */}
            <input
              type="text"
              required
              placeholder="Nama Barang (misal: Kamera Canon 80D)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
            />

            {/* Kategori */}
            <select
              required
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none text-gray-700"
              defaultValue=""
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Kota */}
            <input
              type="text"
              required
              placeholder="Lokasi (Kota)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
            />

            {/* Alamat lengkap, bisa link Google Maps */}
            <textarea
              placeholder="Alamat lengkap lokasi barang (opsional: share link Google Maps)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none resize-none"
              rows={2}
            />

            <div className="flex gap-2">
              {/* Harga sewa */}
              <input
                type="number"
                required
                placeholder="Harga Sewa/hari (Rp)"
                className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
                min={0}
              />
              {/* Deposit */}
              <input
                type="number"
                placeholder="Deposit/Jaminan (optional)"
                className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
                min={0}
              />
            </div>

            {/* Deskripsi barang */}
            <textarea
              required
              placeholder="Deskripsi barang (misal: lensa 18-55mm, baterai, charger, kondisi 99%)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none resize-none"
              rows={3}
            />

            {/* Kondisi */}
            <select
              required
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none text-gray-700"
              defaultValue=""
            >
              <option value="" disabled>Pilih Kondisi Barang</option>
              {conditions.map(cond => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>

            {/* Upload foto */}
            <input
              type="file"
              required
              accept="image/*"
              multiple
              className="w-full"
            />

            {/* Kontak WA */}
            <input
              type="text"
              required
              placeholder="Nomor Whatsapp/Telepon (privasi terjaga, contoh: 0812xxxx)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
            />

            {/* Aturan sewa */}
            <input
              type="text"
              placeholder="Aturan sewa/catatan tambahan (opsional)"
              className="w-full border rounded-lg px-4 py-3 border-blue-200 focus:border-blue-500 outline-none"
            />

            {/* Agreement */}
            <div className="flex items-center gap-2">
              <input required type="checkbox" id="tos" className="accent-blue-600" />
              <label htmlFor="tos" className="text-sm text-gray-700">
                Saya setuju dengan <a href="#" className="underline text-blue-600">Syarat & Ketentuan</a>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 text-white font-bold py-3 rounded-xl shadow hover:scale-105 transition-all duration-200 mt-2"
            >
              Ajukan Barang
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
