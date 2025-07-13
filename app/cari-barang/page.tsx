"use client";
import { useState } from "react";
import BookingPopup from "@/components/BookingPopup";

const dummyProducts = [
  {
    id: 1,
    name: "Canon EOS 80D",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    location: "Jakarta",
    rating: 4.8,
    price: 90000,
    category: "Kamera",
  },
  {
    id: 2,
    name: "DJI Mavic Air 2",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    location: "Bandung",
    rating: 4.9,
    price: 200000,
    category: "Drone",
  },
  {
    id: 3,
    name: "Tenda Camping Besar",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    location: "Bogor",
    rating: 4.7,
    price: 50000,
    category: "Camping",
  },
  {
    id: 4,
    name: "Macbook Pro M1",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    location: "Surabaya",
    rating: 4.95,
    price: 120000,
    category: "Laptop",
  },
];

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

  // Booking popup state
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const filtered = dummyProducts.filter((p) =>
    (selectedCategory === "Semua" || p.category === selectedCategory) &&
    (selectedLocation === "Semua" || p.location === selectedLocation) &&
    (selectedHarga === "Semua" ||
      (p.price >= hargaRanges.find(h => h.label === selectedHarga)!.min &&
       p.price <= hargaRanges.find(h => h.label === selectedHarga)!.max)
    ) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.location.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSewaClick = (product: any) => {
    setSelectedProduct({
      nama: product.name,
      lokasi: product.location,
      harga: product.price,
      foto: product.image,
    });
    setOpenBooking(true);
  };

  return (
    <main className="min-h-screen bg-blue-50/60 pt-28 px-2 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8">Cari Barang Sewa</h1>
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
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden hover:scale-[1.025] hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-44 object-cover rounded-t-2xl"
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center text-gray-500 text-xs mb-1">
                  <span>{product.location}</span>
                  <span className="mx-2">·</span>
                  <span className="flex items-center">
                    <span className="text-yellow-400 text-base mr-1">★</span>
                    {product.rating}
                  </span>
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-1">{product.name}</h3>
                <div className="text-lg font-semibold text-blue-600 mb-3">{formatRupiah(product.price)}</div>
                <button
                  className="mt-auto w-full bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 text-white font-bold py-2 rounded-xl shadow hover:scale-105 transition-all duration-200"
                  onClick={() => handleSewaClick(product)}
                >
                  Sewa Sekarang
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
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
