"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PopupChat from "@/components/chat/PopupChat";
import SkeletonBarangCard from "@/components/common/SkeletonBarangCard";
import dynamic from "next/dynamic";
import { useAuth } from '@/components/common/AuthProvider';
import ProductGrid from "@/components/barang/ProductGrid";
import SearchFilterBar from "./components/SearchFilterBar";
import SearchInput from "./components/SearchInput";
import StickyFilterBar from "./components/StickyFilterBar";

// ===== Dynamic Import BarangCard (ssr: false) =====
const BarangCard = dynamic(() => import('./components/BarangCard'), { ssr: false });

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
  owner?: {
    id?: string;
    user_id?: string;
    nama: string;
    foto: string | null;
    verified?: boolean;
    isOnline?: boolean;
  };
  [key: string]: unknown;
}

const kategoriList = [
  { key: "top", label: "Top" },
  { key: "Kamera & Elektronik", label: "Kamera & Elektronik" },
  { key: "Handphone & Gadget", label: "Handphone & Gadget" },
  { key: "Laptop & Komputer", label: "Laptop & Komputer" },
  { key: "Kendaraan", label: "Kendaraan" },
];

export default function CariBarangClient({ productsFromServer }: { productsFromServer: Product[] }) {
  // ========== Tambahan filter dinamis ==========
  const [kategoriOptions, setKategoriOptions] = useState<string[]>([]);
  const lokasiOptions = [
    "Jakarta",
    "Bandung",
    "Surabaya",
    "Jogja",
    "Bali"
  ];
  useEffect(() => {
    supabase.from("barang").select("kategori").then(({ data }) => {
      const kategoriList = Array.from(new Set((data || []).map((b: any) => b.kategori))).filter(Boolean);
      setKategoriOptions(kategoriList);
    });
  }, []);

  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedLocation, setSelectedLocation] = useState<string>("Semua");
  const [selectedHarga, setSelectedHarga] = useState<string>("Semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua Status");
  const [sortBy, setSortBy] = useState<string>("terbaru");
  const [products, setProducts] = useState<Product[]>(productsFromServer);
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedAsuransi, setSelectedAsuransi] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [selectedPromo, setSelectedPromo] = useState("");

  const [minHarga, setMinHarga] = useState<number>(0);
  const [maxHarga, setMaxHarga] = useState<number>(5000000);

  // --- CHAT STATE ---
  const [showChat, setShowChat] = useState(false);
  const [chatProps, setChatProps] = useState<any>(null);

  const [nearby, setNearby] = useState(false);
  const [isFetchingNearby, setIsFetchingNearby] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const nearbyCoords = useRef<{ lat: number; lng: number } | null>(null);

  const { user, loading: authLoading } = useAuth();
  const userId = user?.id || "";
  const isLoggedIn = !!user;

  useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 700); }, [productsFromServer]);
  useEffect(() => { setLoading(false); }, []);

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("Semua");
    setSelectedLocation("Semua");
    setSelectedHarga("Semua");
    setSelectedStatus("Semua Status");
    setSelectedRating("Semua");
    setSelectedAsuransi("Semua");
    setSelectedDelivery("Semua");
    setSelectedPromo("Semua");
    setMinHarga(0);
    setMaxHarga(5000000);
    setNearby(false);
    setProducts(productsFromServer);
    setLoading(false);
  };

  // Filtering products
  const filtered = products.filter((p) =>
    (
      search === ""
        ? p.status === "Tersedia"
        : p.status === "Tersedia" || p.status === "Sedang Disewa"
    )
    && (selectedCategory === "Semua" || (p.kategori && p.kategori.toLowerCase().includes(selectedCategory.toLowerCase())))
    && (selectedLocation === "Semua" || (p.lokasi && p.lokasi.toLowerCase().includes(selectedLocation.toLowerCase())))
    && (selectedStatus === "Semua Status" || (p.status || "Tersedia") === selectedStatus)
    && (selectedHarga === "Semua" ||
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
    )
    && (p.harga >= minHarga && p.harga <= maxHarga)
    && (
      (p.nama?.toLowerCase().includes(search.toLowerCase())) ||
      (p.lokasi?.toLowerCase().includes(search.toLowerCase())) ||
      (p.owner?.nama?.toLowerCase().includes(search.toLowerCase()))
    )
  );

  const [showLogin, setShowLogin] = useState(false);

  const handleSewaClick = (product: Product) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
  };

  // --- CHAT TRIGGER ---
  const handleOpenChat = (product: Product) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    // Build owner & barang object dari product
    setChatProps({
      receiverId: product.owner?.id || product.owner?.user_id || product.user_id || product.pemilik_id || "",
      productId: product.id,
      barang: {
        name: product.nama,
        price: "Rp " + (product.harga_promo || product.harga),
        location: product.lokasi,
      },
      owner: {
        name: product.owner?.nama || product.pemilik_nama || "Pemilik",
        avatar: product.owner?.foto || product.pemilik_foto || "/default-ava.png",
        online: product.owner?.isOnline ?? true,
        verified: product.owner?.verified || false,
      },
    });
    setShowChat(true);
  };

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid mb-4"></div>
        <span className="ml-3 text-blue-600 font-bold text-lg">Memuat user...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f5faff] to-[#f0f6ff] pt-28 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* HEADER */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-700 mb-4 tracking-tight">
          Cari Barang Sewa
        </h1>

        {/* PROMO BAR */}
        <div className="flex justify-center mb-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-2 flex items-center gap-2">
            <span className="font-semibold text-blue-700">Get 10% off your first rental</span>
            <a href="#" className="ml-2 text-blue-500 underline hover:text-blue-700 text-sm">Learn more</a>
          </div>
        </div>

        <StickyFilterBar
          filteredCount={filtered.length}
          kategoriOptions={kategoriOptions}
          lokasiOptions={lokasiOptions}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedHarga={selectedHarga}
          setSelectedHarga={setSelectedHarga}
          selectedDelivery={selectedDelivery}
          setSelectedDelivery={setSelectedDelivery}
          selectedPromo={selectedPromo}
          setSelectedPromo={setSelectedPromo}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          handleReset={handleReset}
        />

        {/* TAB KATEGORI */}
        <div className="flex gap-3 mb-7">
          {kategoriList.map((k) => (
            <button
              key={k.key}
              className={`px-5 py-2 rounded-xl font-semibold transition ${
                selectedCategory === k.label || (selectedCategory === "Semua" && k.key === "top")
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setSelectedCategory(k.label === "Top" ? "Semua" : k.label)}
            >
              {k.label}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} />

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {loading ? (
            <>
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
                <p className="text-blue-600 font-bold text-lg animate-pulse">Memuat barang...</p>
              </div>
              {[...Array(4)].map((_, i) => (
                <SkeletonBarangCard key={i} />
              ))}
            </>
          ) : filtered.length > 0 ? (
            filtered.map((product) => (
              console.log("PRODUK", product.nama, "OWNER", product.owner), // <- boleh begini
              <BarangCard
                key={product.id}
                item={product}
                nearby={nearby}
                toggleFavorite={toggleFavorite}
                isFavorite={favoriteIds.includes(product.id)}
                onSewaClick={handleSewaClick}
                onChatClick={() => handleOpenChat(product)}
                mounted={true}
                userId={userId}
                isLoggedIn={isLoggedIn}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-400 py-16 text-lg font-semibold">
              Tidak ada barang ditemukan.
            </p>
          )}
        </div>

        {/* ==== POPUP LOGIN ==== */}
        {showLogin && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white max-w-xs w-full rounded-2xl p-6 text-center shadow-xl">
              <h3 className="font-bold text-xl mb-3">Login Dulu</h3>
              <p className="text-gray-500 mb-6">
                Untuk menyewa barang, silakan login terlebih dahulu.
              </p>
              <a
                href="/masuk"
                className="inline-block w-full rounded-xl px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 mb-3"
              >
                Login / Daftar
              </a>
              <button
                className="w-full rounded-xl px-4 py-2 bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300"
                onClick={() => setShowLogin(false)}
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* ==== POPUP CHAT ==== */}
        {showChat && chatProps && (
          <PopupChat
            {...chatProps}
            onClose={() => setShowChat(false)}
          />
        )}

      </div>
    </main>
  );
}
