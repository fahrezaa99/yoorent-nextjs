"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapPin } from "lucide-react";

export default function ItemDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("barang")
        .select("*")
        .eq("id", id)
        .single();
      setItem(data);
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

  // Ambil foto (array)
  const fotos: string[] = Array.isArray(item.foto) ? item.foto : [];
  const fotoUrl = fotos[0]?.startsWith("http")
    ? fotos[0]
    : fotos[0]
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/barang-foto/${fotos[0]}`
    : "/placeholder.png";

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <img
          src={fotoUrl}
          alt={item.nama}
          className="w-full h-72 object-contain bg-gray-100 rounded-xl mb-6"
        />
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
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">{item.kategori}</span>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">Kondisi: {item.kondisi}</span>
        </div>
        <p className="text-gray-700 mb-2">{item.deskripsi}</p>
        {item.catatan && (
          <div className="text-sm text-gray-500 mb-4">{item.catatan}</div>
        )}
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow"
          onClick={() => window.open(`https://wa.me/${item.whatsapp?.replace(/^0/, "62")}`)}
        >
          Booking via WhatsApp
        </button>
        <Link href="/" className="block mt-6 text-blue-600 underline">← Kembali ke Beranda</Link>
      </div>
    </div>
  );
}
