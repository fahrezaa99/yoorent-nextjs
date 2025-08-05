import React, { useState } from "react";
import ResultCount from "./ResultCount";

interface StickyFilterBarProps {
  filteredCount: number;
  kategoriOptions: string[];
  lokasiOptions: string[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedLocation: string;
  setSelectedLocation: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
  selectedHarga: string;
  setSelectedHarga: (v: string) => void;
  selectedDelivery: string;
  setSelectedDelivery: (v: string) => void;
  selectedPromo: string;
  setSelectedPromo: (v: string) => void;
  selectedRating: string;
  setSelectedRating: (v: string) => void;
  handleReset: () => void;
}

const optionClass =
  "rounded-xl bg-white px-4 py-2 border border-gray-200 focus:outline-none focus:border-blue-400 shadow-sm text-gray-700";
const labelClass =
  "block font-medium text-gray-600 text-sm mb-1";

export default function StickyFilterBar({
  filteredCount,
  kategoriOptions,
  lokasiOptions,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedStatus,
  setSelectedStatus,
  selectedHarga,
  setSelectedHarga,
  selectedDelivery,
  setSelectedDelivery,
  selectedPromo,
  setSelectedPromo,
  selectedRating,
  setSelectedRating,
  handleReset,
}: StickyFilterBarProps) {
  const [showFilter, setShowFilter] = useState(false);

  // FILTER COMPONENT
  const FilterContent = (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-3 md:grid-cols-7">
        <div>
          <label className={labelClass}>Kategori</label>
          <select
            className={optionClass + " w-full"}
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="Semua">Semua</option>
            {kategoriOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Lokasi</label>
          <select
            className={optionClass + " w-full"}
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
          >
            <option value="Semua">Semua</option>
            {lokasiOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={optionClass + " w-full"}
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
          >
            <option value="Semua">Semua</option>
            <option value="Disewa">Disewa</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Tidak Tersedia">Tidak Tersedia</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Harga</label>
          <select
            className={optionClass + " w-full"}
            value={selectedHarga}
            onChange={e => setSelectedHarga(e.target.value)}
          >
            <option value="Semua">Semua</option>
            <option value="< Rp100.000">&lt; Rp100.000</option>
            <option value="Rp100.000 - Rp150.000">Rp100.000 - Rp150.000</option>
            <option value="> Rp150.000">&gt; Rp150.000</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Delivery</label>
          <select
            className={optionClass + " w-full"}
            value={selectedDelivery}
            onChange={e => setSelectedDelivery(e.target.value)}
          >
            <option value="Semua">Semua</option>
            <option value="Bisa Delivery">Bisa Delivery</option>
            <option value="Ambil Sendiri">Ambil Sendiri</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Promo</label>
          <select
            className={optionClass + " w-full"}
            value={selectedPromo}
            onChange={e => setSelectedPromo(e.target.value)}
          >
            <option value="Semua">Semua</option>
            <option value="Promo">Promo</option>
            <option value="Tidak Promo">Tidak Promo</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Rating</label>
          <select
            className={optionClass + " w-full"}
            value={selectedRating}
            onChange={e => setSelectedRating(e.target.value)}
          >
            <option value="Semua">Semua</option>
            <option value="4">4 ke atas</option>
            <option value="3">3 ke atas</option>
            <option value="2">2 ke atas</option>
            <option value="1">1 ke atas</option>
          </select>
        </div>
      </div>
      {/* RESET BUTTON */}
      <div className="w-full mt-3 md:w-auto">
        <button
          className="h-12 px-6 w-full md:w-auto rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow transition"
          onClick={handleReset}
        >
          Reset Filter
        </button>
      </div>
    </div>
  );

  return (
    <div className="sticky top-16 z-30 bg-gradient-to-b from-[#f5faff] to-[#f0f6ff] py-2 mb-6 shadow-lg rounded-2xl px-2 md:px-6">
      {/* MOBILE: Show button only */}
      <div className="flex md:hidden flex-col gap-2 w-full">
        <button
          className="w-full rounded-xl bg-blue-50 text-blue-700 font-semibold py-2 shadow border border-blue-100"
          onClick={() => setShowFilter(s => !s)}
        >
          {showFilter ? "Tutup Filter" : "Tampilkan Filter"}
        </button>
        {/* Filter content, only if open */}
        {showFilter && (
          <div className="animate-fade-in pt-2">{FilterContent}</div>
        )}
        <div className="flex items-center mt-2">
          <ResultCount count={filteredCount} />
        </div>
      </div>
      {/* DESKTOP: Show filter bar always */}
      <div className="hidden md:flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        {FilterContent}
      </div>
      {/* Desktop: jumlah hasil */}
      <div className="hidden md:flex items-center mt-2 pb-2">
        <ResultCount count={filteredCount} />
      </div>
    </div>
  );
}
