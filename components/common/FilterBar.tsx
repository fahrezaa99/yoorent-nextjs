"use client";

const categories = ["Semua", "Kamera & Elektronik", "Handphone & Gadget", "Laptop & Komputer", "Kendaraan",];
const locations = [
  "Semua", "Jakarta", "Bandung", "Surabaya", "Bali",
];
const hargaRanges = [
  { label: "Semua", min: 0, max: Infinity },
  { label: "< Rp100.000", min: 0, max: 100000 },
  { label: "Rp100.000 - Rp150.000", min: 100000, max: 150000 },
  { label: "> Rp150.000", min: 150000, max: Infinity },
];
const statusList = ["Semua Status", "Tersedia", "Disewa", "Pre-order"];
const sortOptions = [
  { value: "terbaru", label: "Terbaru" },
  { value: "harga_terendah", label: "Harga Terendah" },
  { value: "harga_tertinggi", label: "Harga Tertinggi" },
  { value: "rating", label: "Rating/Review Tertinggi" },
];

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  selectedHarga: string;
  setSelectedHarga: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  minHarga: number;
  setMinHarga: (val: number) => void;
  maxHarga: number;
  setMaxHarga: (val: number) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  nearby: boolean;
  isFetchingNearby: boolean;
  handleNearbyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export default function FilterBar({
  search, setSearch,
  selectedCategory, setSelectedCategory,
  selectedLocation, setSelectedLocation,
  selectedHarga, setSelectedHarga,
  selectedStatus, setSelectedStatus,
  minHarga, setMinHarga,
  maxHarga, setMaxHarga,
  sortBy, setSortBy,
  nearby,
  isFetchingNearby,
  handleNearbyChange,
  onReset
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-3 md:p-6 flex overflow-x-auto gap-3 md:gap-4 max-w-6xl mx-auto mb-8 scrollbar-thin scrollbar-thumb-blue-200">
      {/* Search */}
      <div className="flex flex-col min-w-[170px]">
        <label className="text-xs text-gray-500 mb-1">Nama/Lokasi/Pemilik</label>
        <input
          type="text"
          placeholder="Cari nama barang…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-400 transition bg-gray-50 font-medium"
        />
      </div>
      {/* Kategori */}
      <div className="flex flex-col min-w-[125px]">
        <label className="text-xs text-gray-500 mb-1">Kategori</label>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-400 transition bg-gray-50 font-medium"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {/* Lokasi */}
      <div className="flex flex-col min-w-[115px]">
        <label className="text-xs text-gray-500 mb-1">Lokasi</label>
        <select
          value={selectedLocation}
          onChange={e => setSelectedLocation(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm md:text-base focus:ring-2 focus:ring-blue-400 transition bg-gray-50 font-medium"
        >
          {locations.map((loc) => (
            <option key={loc}>{loc}</option>
          ))}
        </select>
      </div>
      {/* Status */}
      <div className="flex flex-col min-w-[125px]">
        <label className="text-xs text-gray-500 mb-1">Status</label>
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm md:text-base font-medium bg-gray-50"
        >
          {statusList.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {/* Harga */}
      <div className="flex flex-col min-w-[135px]">
        <label className="text-xs text-gray-500 mb-1">Harga (Rp)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={maxHarga}
            value={minHarga}
            onChange={e => setMinHarga(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1 text-xs md:text-base"
            placeholder="Min"
          />
          <span className="mx-1 text-gray-400">-</span>
          <input
            type="number"
            min={minHarga}
            max={5000000}
            value={maxHarga}
            onChange={e => setMaxHarga(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1 text-xs md:text-base"
            placeholder="Max"
          />
        </div>
      </div>
      {/* Urutkan */}
      <div className="flex flex-col min-w-[130px]">
        <label className="text-xs text-gray-500 mb-1">Urutkan</label>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-sm md:text-base font-medium bg-gray-50"
        >
          {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </div>
  );
}
