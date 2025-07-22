"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BookingPopup from "@/components/BookingPopup";
import ChatModal from "@/components/ChatModal";
import FilterBar from "@/components/FilterBar";
import BarangCard from "@/components/BarangCard";
import SkeletonBarangCard from "@/components/SkeletonBarangCard";

interface Product {
  id: string;
  nama: string;
  foto: string[];
  harga: number;
  harga_promo?: number;
  promo?: boolean;
  kategori?: string;
  lokasi: string;
  alamat?: string;
  kondisi?: string;
  pemilik_nama?: string;
  pemilik_foto?: string;
  user_id?: string;
  whatsapp?: string;
  distance?: number;
  status?: string;
  [key: string]: unknown;
}

// Slug-to-Category mapping
const kategoriMap: Record<string, string> = {
  "kamera-elektronik": "Kamera & Elektronik",
  "handphone-gadget": "Handphone & Gadget",
  "laptop-komputer": "Laptop & Komputer",
  "kendaraan": "Kendaraan",
  "properti": "Properti",
};

export default function CariBarangPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedLocation, setSelectedLocation] = useState<string>("Semua");
  const [selectedHarga, setSelectedHarga] = useState<string>("Semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua Status");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Harga range (untuk filter min/max harga)
  const [minHarga, setMinHarga] = useState<number>(0);
  const [maxHarga, setMaxHarga] = useState<number>(5000000);

  const [openBooking, setOpenBooking] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatBarang, setChatBarang] = useState<Product | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Nearby states
  const [nearby, setNearby] = useState(false);
  const [isFetchingNearby, setIsFetchingNearby] = useState(false);
  const nearbyCoords = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      setUserId(res.data.user?.id ?? null);
    });
  }, []);

  // Auto-activate filter category from URL
  useEffect(() => {
    const kategoriSlug = searchParams.get("kategori");
    if (kategoriSlug && kategoriMap[kategoriSlug]) {
      setSelectedCategory(kategoriMap[kategoriSlug]);
    }
    // You can also add other param auto-filter if needed!
    // Example: lokasi, harga, status (tinggal extend mapping)
  }, [searchParams]);

  // Fetch semua barang
  const fetchAllBarang = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("barang")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setProducts((data as Product[]) || []);
    setLoading(false);
  };

  // Fetch barang terdekat
  async function fetchNearbyBarang() {
    setIsFetchingNearby(true);
    if (!navigator.geolocation) {
      alert("Perangkat tidak mendukung lokasi!");
      setIsFetchingNearby(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        nearbyCoords.current = { lat, lng };
        const { data, error } = await supabase.rpc("get_barang_terdekat", {
          user_lat: lat,
          user_lng: lng,
          max_distance: 50,
        });
        if (!error) setProducts((data as Product[]) || []);
        setIsFetchingNearby(false);
        setLoading(false);
      },
      () => {
        alert("Tidak dapat mengambil lokasi Anda.");
        setNearby(false);
        setIsFetchingNearby(false);
        setLoading(false);
      }
    );
  }

  // Handler checkbox nearby
  const handleNearbyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setNearby(checked);
    if (checked) {
      setLoading(true);
      fetchNearbyBarang();
    } else {
      fetchAllBarang();
    }
  };

  useEffect(() => {
    fetchAllBarang();
  }, []);

  // Filtering
  const filtered = products.filter((p) =>
    (selectedCategory === "Semua" || p.kategori === selectedCategory) &&
    (selectedLocation === "Semua" || p.lokasi === selectedLocation) &&
    (selectedStatus === "Semua Status" || (p.status || "Tersedia") === selectedStatus) &&
    (selectedHarga === "Semua" ||
      (
        p.harga >= (
          selectedHarga === "< Rp100.000" ? 0 :
          selectedHarga === "Rp100.000 - Rp150.000" ? 100000 :
          selectedHarga === "> Rp150.000" ? 150000 : 0
        ) &&
        p.harga <= (
          selectedHarga === "< Rp100.000" ? 100000 :
          selectedHarga === "Rp100.000 - Rp150.000" ? 150000 :
          selectedHarga === "> Rp150.000" ? Infinity : Infinity
        )
      )
    ) &&
    // Filter by harga min/max slider
    (p.harga >= minHarga && p.harga <= maxHarga) &&
    (
      (p.nama?.toLowerCase().includes(search.toLowerCase())) ||
      (p.lokasi?.toLowerCase().includes(search.toLowerCase())) ||
      (p.pemilik_nama?.toLowerCase().includes(search.toLowerCase()))
    )
  );

  const handleSewaClick = (product: Product) => {
    setSelectedProduct(product);
    setOpenBooking(true);
  };

  // Favorite & share (mock, bisa dikembangkan)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f5faff] to-[#f0f6ff] pt-28 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Judul */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-700 mb-10 drop-shadow-sm tracking-tight">
          Cari Barang Sewa
        </h1>
        {/* FILTER BAR */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedHarga={selectedHarga}
          setSelectedHarga={setSelectedHarga}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          minHarga={minHarga}
          setMinHarga={setMinHarga}
          maxHarga={maxHarga}
          setMaxHarga={setMaxHarga}
          nearby={nearby}
          isFetchingNearby={isFetchingNearby}
          handleNearbyChange={handleNearbyChange}
          onReset={() => {
            setSearch("");
            setSelectedCategory("Semua");
            setSelectedLocation("Semua");
            setSelectedHarga("Semua");
            setSelectedStatus("Semua Status");
            setMinHarga(0);
            setMaxHarga(5000000);
            setNearby(false);
            fetchAllBarang();
          }}
        />

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonBarangCard key={idx} />
            ))
          ) : filtered.length > 0 ? (
            filtered.map((product) => (
              <BarangCard
                key={product.id}
                item={product}
                nearby={nearby}
                toggleFavorite={toggleFavorite}
                isFavorite={favoriteIds.includes(product.id)}
                onSewaClick={handleSewaClick}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 py-16 text-lg font-semibold">
              Tidak ada barang ditemukan.
            </p>
          )}
        </div>

        {/* Booking Popup */}
        {selectedProduct && (
          <BookingPopup
            open={openBooking}
            onClose={() => setOpenBooking(false)}
            barang={selectedProduct}
          />
        )}

        {/* Chat Modal */}
        {chatBarang && (
          <ChatModal
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            barangId={chatBarang.id}
            userId={userId!}
            receiverId={chatBarang.user_id!}
            receiverName={chatBarang.pemilik_nama || "Pemilik"}
          />
        )}
      </div>
    </main>
  );
}
