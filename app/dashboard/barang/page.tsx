"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DaftarBarangPage() {
  const [barangs, setBarangs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data barang dari Supabase
    const fetchBarangs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("barang").select("*").order("created_at", { ascending: false });
      if (!error) setBarangs(data || []);
      setLoading(false);
    };
    fetchBarangs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Daftar Barang Disewakan</h1>
      <p className="text-gray-500 mb-6">Semua barang yang kamu tambahkan akan tampil di sini.</p>

      {loading ? (
        <div className="text-center py-10">Loading barang...</div>
      ) : barangs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Belum ada barang. Yuk tambah barang dulu!</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {barangs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md border p-5 flex gap-4 items-center hover:shadow-lg transition"
            >
              {item.foto ? (
                <img
                  src={item.foto}
                  alt={item.nama}
                  className="w-24 h-24 rounded-md object-cover border"
                  loading="lazy"
                />
              ) : (
                <div className="w-24 h-24 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.nama}</h2>
                <div className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-1 inline-block mb-1">
                  {item.kategori}
                </div>
                <div className="text-sm text-gray-600 mb-1">{item.lokasi}</div>
                <div className="text-green-600 font-bold mb-2">Rp {item.harga?.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Kondisi: {item.kondisi}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
