"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BookingPopup from "@/components/BookingPopup";
import Link from "next/link";
import { MapPin } from "lucide-react";
import ChatModal from "@/components/ChatModal";
import Image from "next/image";

const categories = ["Semua", "Kamera", "Drone", "Laptop", "Camping", "Motor"];
const locations = [
  "Semua", "Jakarta", "Bandung", "Bogor", "Surabaya", "Bali", "Palembang", "Batam",
];
const hargaRanges = [
  { label: "Semua", min: 0, max: Infinity },
  { label: "< Rp100.000", min: 0, max: 100000 },
  { label: "Rp100.000 - Rp150.000", min: 100000, max: 150000 },
  { label: "> Rp150.000", min: 150000, max: Infinity },
];

function formatRupiah(num: number) {
  return "Rp " + num.toLocaleString("id-ID") + "/hari";
}

interface Product {
  id: string;
  nama: string;
  foto: string[];
  harga: number;
  kategori?: string;
  lokasi?: string;
  alamat?: string;
  kondisi?: string;
  pemilik_nama?: string;
  pemilik_foto?: string;
  user_id?: string;
  whatsapp?: string;
  [key: string]: unknown;
}

export default function CariBarangPage() {
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedLocation, setSelectedLocation] = useState<string>("Semua");
  const [selectedHarga, setSelectedHarga] = useState<string>("Semua");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Booking popup
  const [openBooking, setOpenBooking] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Lightbox
  const [lightbox, setLightbox] = useState<{ urls: string[]; index: number } | null>(null);

  // ==== Chat ====
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatBarang, setChatBarang] = useState<Product | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      setUserId(res.data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    async function fetchBarang() {
      setLoading(true);
      const { data, error } = await supabase
        .from("barang")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setProducts((data as Product[]) || []);
      setLoading(false);
    }
    fetchBarang();
  }, []);

  const filtered = products.filter((p) =>
    (selectedCategory === "Semua" || p.kategori === selectedCategory) &&
    (selectedLocation === "Semua" || p.lokasi === selectedLocation) &&
    (selectedHarga === "Semua" ||
      (p.harga >= hargaRanges.find((h) => h.label === selectedHarga)!.min &&
        p.harga <= hargaRanges.find((h) => h.label === selectedHarga)!.max)) &&
    ((p.nama?.toLowerCase().includes(search.toLowerCase())) ||
      (p.lokasi?.toLowerCase().includes(search.toLowerCase())) ||
      (p.pemilik_nama?.toLowerCase().includes(search.toLowerCase())))
  );

  const handleSewaClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenBooking(true);
  };

  return (
    <main className="min-h-screen bg-blue-50/60 pt-28 px-2 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8">
          Cari Barang Sewa
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto mb-6">
          <input
            type="text"
            placeholder="Cari nama barang, lokasi, atau pemilik…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          >
            {locations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>
          <select
            value={selectedHarga}
            onChange={e => setSelectedHarga(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          >
            {hargaRanges.map((h) => (
              <option key={h.label}>{h.label}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("Semua");
              setSelectedLocation("Semua");
              setSelectedHarga("Semua");
            }}
            className="text-sm text-blue-600 underline"
          >
            Reset Filter
          </button>
        </div>

        {/* Lightbox Modal */}
        {lightbox && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative w-full max-w-3xl p-4">
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-2 right-2 text-white text-3xl"
              >
                &times;
              </button>
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={lightbox.urls[lightbox.index]}
                  alt={`Foto ${lightbox.index + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain"
                  width={900}
                  height={600}
                  unoptimized
                />
              </div>
              {lightbox.urls.length > 1 && (
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() =>
                      setLightbox({
                        urls: lightbox.urls,
                        index: (lightbox.index - 1 + lightbox.urls.length) % lightbox.urls.length,
                      })
                    }
                    className="px-4 py-2 bg-white rounded shadow"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() =>
                      setLightbox({
                        urls: lightbox.urls,
                        index: (lightbox.index + 1) % lightbox.urls.length,
                      })
                    }
                    className="px-4 py-2 bg-white rounded shadow"
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
            ))
          ) : filtered.length > 0 ? (
            filtered.map((product) => {
              const fotos = Array.isArray(product.foto) ? product.foto : [];
              const urls = fotos.map((raw: string) =>
                raw.startsWith("http")
                  ? raw
                  : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/barang-foto/${raw}`
              );

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
                >
                  <Link href={`/barang/${product.id}`}>
                    <div className="relative">
                      <Image
                        src={urls[0] || "/placeholder.png"}
                        alt={product.nama}
                        className="w-full h-44 object-contain bg-gray-100 p-2 cursor-pointer transition hover:scale-105"
                        width={360}
                        height={176}
                        unoptimized
                        onClick={e => {
                          e.preventDefault();
                          if (urls[0]) setLightbox({ urls, index: 0 });
                        }}
                      />
                      {urls.length > 1 && (
                        <button
                          type="button"
                          onClick={e => {
                            e.preventDefault();
                            setLightbox({ urls, index: 0 });
                          }}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
                        >
                          📷 Lihat {urls.length} Foto
                        </button>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <MapPin size={16} className="text-blue-500" />
                        {product.lokasi}
                        {product.alamat && (
                          <span className="text-gray-400 text-xs ml-2">{product.alamat}</span>
                        )}
                      </div>
                      <Link href={`/barang/${product.id}`}>
                        <h2 className="font-semibold text-lg text-gray-800 mb-1 truncate hover:text-blue-700 transition">
                          {product.nama}
                        </h2>
                      </Link>
                      <div className="text-sm text-gray-600 mb-2">
                        Kondisi: <span className="font-medium">{product.kondisi}</span> • Jenis:{" "}
                        <span className="font-medium">{product.kategori}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Image
                          src={
                            product.pemilik_foto ||
                            "https://randomuser.me/api/portraits/men/32.jpg"
                          }
                          alt={product.pemilik_nama || "Pemilik"}
                          className="w-6 h-6 rounded-full"
                          width={24}
                          height={24}
                          unoptimized
                        />
                        <span className="font-medium">{product.pemilik_nama || "Pemilik"}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-blue-600 text-xl font-bold mb-3">
                        {formatRupiah(product.harga)}
                      </div>
                      <div className="flex gap-2 mb-3">
                        {/* ======= CHAT BUTTON ======= */}
                        <button
                          onClick={() => {
                            setChatBarang(product);
                            setChatOpen(true);
                          }}
                          className="flex-shrink-0 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition"
                          disabled={!userId || !product.user_id}
                        >
                          Chat
                        </button>
                        {product.whatsapp ? (
                          <a
                            href={`https://wa.me/${product.whatsapp.replace(/^0/, "62")}`}
                            target="_blank"
                            rel="noopener"
                            className="flex-shrink-0 px-4 py-2 border border-green-500 text-green-600 rounded-lg text-sm hover:bg-green-50"
                          >
                            WhatsApp
                          </a>
                        ) : (
                          <button
                            className="flex-shrink-0 px-4 py-2 border border-gray-300 text-gray-400 rounded-lg text-sm cursor-not-allowed"
                            disabled
                            title="Nomor WhatsApp tidak tersedia"
                          >
                            WhatsApp
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => handleSewaClick(product)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                      >
                        Sewa Sekarang
                      </button>
                      <Link
                        href={`/barang/${product.id}`}
                        className="w-full mt-2 block bg-gray-100 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-50 text-center font-semibold transition"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              Barang tidak ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
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

      {/* Booking Popup */}
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
