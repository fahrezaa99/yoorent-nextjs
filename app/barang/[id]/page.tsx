"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin } from "lucide-react";
import Image from "next/image";

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
  whatsapp?: string;
};

export default function ItemDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [item, setItem] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const { data, error } = await supabase
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

  // Foto barang
  const fotos: string[] = Array.isArray(item.foto) ? item.foto : [];
  const fotoUrl = fotos[0]?.startsWith("http")
    ? fotos[0]
    : fotos[0]
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/barang-foto/${fotos[0]}`
    : "/placeholder.png";

  // ====== Perbaikan Tombol WhatsApp ======
  const whatsappUrl = item.whatsapp
    ? `https://wa.me/${item.whatsapp.replace(/^0/, "62")}`
    : null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        {/* Gambar utama */}
        <div className="w-full h-72 bg-gray-100 rounded-xl mb-6 relative overflow-hidden">
          <Image
            src={fotoUrl}
            alt={item.nama}
            fill
            className="object-contain rounded-xl"
            sizes="(max-width: 768px) 100vw, 700px"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">{item.nama}</h1>
        <div className="flex items-center text-gray-600 mb-2 gap-2">
          <MapPin size={18} className="text-blue-500" />
          <span className="font-medium">{item.lokasi}</span>
          {item.alamat && (
            <span className="text-gray-400 text-xs ml-2">{item.alamat}</span>
          )}
        </div>
        <div className="text-xl font-bold text-blue-600 mb-2">
          Rp {Number(item.harga).toLocaleString("id-ID")}/hari
        </div>
        <div className="mb-3 flex flex-wrap gap-2 text-sm">
          {item.kategori && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">{item.kategori}</span>
          )}
          {item.kondisi && (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">Kondisi: {item.kondisi}</span>
          )}
        </div>
        <p className="text-gray-700 mb-2">{item.deskripsi}</p>
        {item.catatan && (
          <div className="text-sm text-gray-500 mb-4">{item.catatan}</div>
        )}
        {/* ====== Button WhatsApp, Sudah Aman ====== */}
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow"
          >
            Booking via WhatsApp
          </a>
        ) : (
          <button
            disabled
            className="bg-gray-200 text-gray-400 px-6 py-3 rounded-xl font-semibold cursor-not-allowed"
            title="Nomor WhatsApp tidak tersedia"
          >
            Booking via WhatsApp
          </button>
        )}
        <Link href="/" className="block mt-6 text-blue-600 underline">← Kembali ke Beranda</Link>
      </div>
    </div>
  );
}
