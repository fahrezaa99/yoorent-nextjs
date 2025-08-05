"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin } from "lucide-react";
import BarangDetailCarousel from "@/components/barang/BarangDetailCarousel";
import SewaPanel from "@/components/sewa/SewaPanel";

type Barang = {
  id: string;
  nama: string;
  harga: number;
  foto: string[];
  lokasi: string;
  alamat?: string;
  kategori?: string;
  kondisi?: string;
  deskripsi?: string;
  catatan?: string;
  syarat?: string;
  owner?: { nama?: string; lokasi?: string; rating?: number; totalReview?: number; foto?: string };
};

export default function ItemDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [item, setItem] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("barang")
        .select("*")
        .eq("id", id)
        .single();
      setItem(data as Barang | null);
      setLoading(false);
    };
    if (id) fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="text-blue-600 font-semibold text-lg">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <h2 className="text-xl font-bold mb-4">Barang tidak ditemukan</h2>
        <Link href="/" className="text-blue-600 underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  // Foto barang array, fallback ke placeholder jika kosong
  const fotos: string[] = Array.isArray(item.foto) && item.foto.length > 0 ? item.foto : ["/placeholder.png"];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* KIRI: Detail barang */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow p-8 mb-6">
            {/* Carousel Foto Barang */}
            <BarangDetailCarousel images={fotos} nama={item.nama} />
            <h1 className="text-2xl font-bold mt-5 mb-2">{item.nama}</h1>
            <div className="flex items-center text-gray-600 mb-3 gap-2">
              <MapPin size={18} className="text-blue-500" />
              <span className="font-medium">{item.lokasi}</span>
              {item.alamat && (
                <span className="text-gray-400 text-xs ml-2">{item.alamat}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mb-3 text-sm">
              {item.kategori && (
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">{item.kategori}</span>
              )}
              {item.kondisi && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">Kondisi: {item.kondisi}</span>
              )}
            </div>
            <div className="text-xl font-bold text-blue-600 mb-4">
              Rp {Number(item.harga).toLocaleString("id-ID")} <span className="text-base font-normal">/hari</span>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Deskripsi Barang</h2>
              <p className="text-gray-700">{item.deskripsi || "-"}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Syarat & Ketentuan Sewa</h2>
              <ul className="text-gray-600 list-disc ml-5 text-sm leading-7">
                <li>Barang harus dikembalikan dalam kondisi seperti saat diterima.</li>
                <li>Penyewa bertanggung jawab atas kehilangan/kerusakan selama masa sewa.</li>
                <li>Penyerahan/pengembalian di lokasi yang disepakati.</li>
                <li>Biaya sewa belum termasuk deposit/jaminan (jika ada).</li>
                <li>Pembatalan kurang dari 24 jam dikenakan biaya 50%.</li>
                {item.syarat && <li>{item.syarat}</li>}
              </ul>
            </div>
            <Link href="/" className="block mt-4 text-blue-600 underline">← Kembali ke Beranda</Link>
          </div>
        </div>
        {/* KANAN: Panel Booking */}
        <div className="w-full md:w-[400px]">
          <SewaPanel 
            namaBarang={item.nama}
            hargaPerHari={item.harga}
            hargaPerMinggu={0}
            lokasi={item.lokasi}
            kategori={item.kategori || ""}
            fotoBarang={fotos[0]}
            owner={{
              name: item.owner?.nama || "",
              rating: item.owner?.rating || 0,
              total: item.owner?.totalReview || 0,
              foto: item.owner?.foto || "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
