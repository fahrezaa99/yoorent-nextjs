'use client';
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Barang = {
  id: string;
  nama: string;
  harga: number;
  lokasi: string;
  latitude: number;
  longitude: number;
  distance?: number;
};

export default function CariBarangTerdekat() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(false);
  const [nearby, setNearby] = useState(false);

  const fetchBarang = async (lat?: number, lng?: number) => {
    setLoading(true);
    let { data, error } = lat && lng
      ? await supabase.rpc('get_barang_terdekat', { user_lat: lat, user_lng: lng, max_distance: 50 })
      : await supabase.from('barang').select('*');
    if (!error && data) setBarang(data);
    setLoading(false);
  };

  const handleNearby = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setNearby(e.target.checked);
    if (e.target.checked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          fetchBarang(position.coords.latitude, position.coords.longitude);
        }, () => {
          alert('Gagal mendapatkan lokasi!');
        });
      }
    } else {
      fetchBarang();
    }
  };

  useEffect(() => { fetchBarang(); }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Cari Barang Sewa</h1>
      <div className="flex gap-3 items-center mb-6">
        <input
          type="checkbox"
          id="nearby"
          checked={nearby}
          onChange={handleNearby}
          className="accent-blue-600 w-4 h-4"
        />
        <label htmlFor="nearby" className="text-base">Tampilkan barang terdekat</label>
        {loading && <span className="ml-2 text-gray-500">Loading...</span>}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {barang.length === 0 && !loading && (
          <div className="col-span-3 text-center text-gray-400">Tidak ada barang ditemukan.</div>
        )}
        {barang.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow p-4">
            <div className="font-bold text-lg mb-1">{item.nama}</div>
            <div className="text-sm text-gray-500 mb-1">{item.lokasi}</div>
            {nearby && item.distance !== undefined && (
              <div className="text-xs text-blue-600 mb-2">Jarak: {item.distance?.toFixed(1)} km</div>
            )}
            <div className="font-semibold text-blue-600 mb-2">Rp {item.harga.toLocaleString('id-ID')}/hari</div>
            <button className="bg-blue-600 text-white px-4 py-1 rounded-xl font-medium">Sewa</button>
          </div>
        ))}
      </div>
    </div>
  );
}
