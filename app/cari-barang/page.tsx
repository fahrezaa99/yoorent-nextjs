"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // pastikan path sesuai
import BookingPopup from "@/components/BookingPopup";

const categories = ["Semua", "Kamera", "Drone", "Laptop", "Camping"];
const locations = ["Semua", "Jakarta", "Bandung", "Bogor", "Surabaya"];
const hargaRanges = [
  { label: "Semua", min: 0, max: Infinity },
  { label: "< Rp100.000", min: 0, max: 100000 },
  { label: "Rp100.000 - Rp150.000", min: 100000, max: 150000 },
  { label: "> Rp150.000", min: 150000, max: Infinity },
];

function formatRupiah(num: number) {
  return "Rp " + num.toLocaleString("id-ID") + "/hari";
}

export default function CariBarangPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState("Semua");
  const [selectedHarga, setSelectedHarga] = useState("Semua");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking popup state
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Fetch barang dari Supabase
  useEffect(() => {
    async function fetchBarang() {
      setLoading(true);
      const { data, error } = await supabase
        .from("barang")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setProducts(data || []);
      setLoading(false);
    }
    fetchBarang();
  }, []);

  // Filtering barang
  const filtered = products.filter((p) =>
    (selectedCategory === "Semua" || p.kategori === selectedCategory) &&
    (selectedLocation === "Semua" || p.lokasi === selectedLocation) &&
    (selectedHarga === "Semua" ||
      (p.harga >= hargaRanges.find(h => h.label === selectedHarga)!.min &&
       p.harga <= hargaRanges.find(h => h.label === selectedHarga)!.max)
    ) &&
    (
      (p.nama && p.nama.toLowerCase().includes(search.toLowerCase())) ||
      (p.lokasi && p.lokasi.toLowerCase().includes(search.toLowerCase()))
    )
  );

  const handleSewaClick = (product: any) => {
    setSelectedProduct({
      nama: product.nama,
      lokasi: product.lokasi,
      harga: product.harga,
      foto: product.foto,
    });
    setOpenBooking(true);
  };

  return (
    <main className="min-h-screen bg-blue-50/60 pt-28 px-2 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8">
          Cari Barang Sewa
        </h1>
        {/* Search */}
        <input
          type="text"
          placeholder="Cari nama barang atau lokasi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="block w-full rounded-xl px-4 py-3 mb-6 border border-blue-200 focus:border-blue-500 outline-none shadow"
        />

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-7 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-blue-200 px-3 py-2 text-sm bg-white focus:border-blue-400 outline-none"
            >
              {categories.map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="rounded-lg border border-blue-200 px-3 py-2 text-sm bg-white focus:border-blue-400 outline-none"
            >
              {locations.map(loc => (
                <option key={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={selectedHarga}
              onChange={e => setSelectedHarga(e.target.value)}
              className="rounded-lg border border-blue-200 px-3 py-2 text-sm bg-white focus:border-blue-400 outline-none"
            >
              {hargaRanges.map(h => (
                <option key={h.label}>{h.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setSelectedCategory("Semua");
              setSelectedLocation("Semua");
              setSelectedHarga("Semua");
              setSearch("");
            }}
            className="text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100"
          >
            Reset Filter
          </button>
        </div>

        {/* Grid Barang */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {loading ? (
            <>
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 h-80 animate-pulse"
                />
              ))}
            </>
          ) : filtered.length > 0 ? (
            filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden hover:scale-[1.025] hover:shadow-xl transition"
              >
                <img
                  src={product.foto}
                  alt={product.nama}
                  className="w-full h-44 object-cover rounded-t-2xl"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center text-gray-500 text-xs mb-1">
                    <span>{product.lokasi}</span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mb-1">{product.nama}</h3>
                  <div className="text-lg font-semibold text-blue-600 mb-3">{formatRupiah(product.harga)}</div>
                  <button
                    className="mt-auto w-full bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 text-white font-bold py-2 rounded-xl shadow hover:scale-105 transition-all duration-200"
                    onClick={() => handleSewaClick(product)}
                  >
                    Sewa Sekarang
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              Barang tidak ditemukan.
            </div>
          )}
        </div>
      </div>
      {/* POPUP BOOKING */}
      {selectedProduct && (
        <BookingPopup
          open={openBooking}
          onClose={() => setOpenBooking(false)}
          barang={selectedProduct}
        />
      )}
    </main>
  );
}
