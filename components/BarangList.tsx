"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatModal from "@/components/ChatModal";

type Barang = {
  id: string;
  nama: string;
  harga: number;
  kategori?: string;
  user_id?: string;        // <- pastikan ada field ini di DB
  pemilik_nama?: string;   // opsional, bisa ambil dari relasi user
};

export default function BarangList() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ====== Chat ======
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBarang, setChatBarang] = useState<Barang | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Ambil user login (supabase)
  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      setUserId(res.data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("barang")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setBarang(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8 text-blue-600">Loading daftar barang...</div>;
  if (error) return <div className="text-red-500 text-center py-6">{error}</div>;

  return (
    <div className="max-w-xl mx-auto my-8 bg-white rounded-xl shadow p-6">
      <h2 className="font-bold text-lg mb-4 text-blue-700">Barang Saya</h2>
      {barang.length === 0 ? (
        <div className="text-center text-gray-500">Belum ada barang milikmu.</div>
      ) : (
        <div className="space-y-4">
          {barang.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-semibold text-base">{item.nama}</div>
                <div>
                  Harga:{" "}
                  <span className="font-medium text-green-600">
                    Rp{Number(item.harga).toLocaleString()}
                  </span>
                </div>
                {item.kategori && (
                  <div className="text-sm text-gray-500">{item.kategori}</div>
                )}
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="border px-4 py-1 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  onClick={() => {
                    setChatBarang(item);
                    setChatOpen(true);
                  }}
                  disabled={!userId || !item.user_id}
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Chat */}
      {chatOpen && chatBarang && userId && chatBarang.user_id && (
        <ChatModal
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          barangId={chatBarang.id}
          userId={userId}
          receiverId={chatBarang.user_id}
          receiverName={chatBarang.pemilik_nama || "Pemilik"}
        />
      )}
    </div>
  );
}
