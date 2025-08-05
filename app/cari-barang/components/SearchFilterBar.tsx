"use client";
import React from "react";

interface SearchFilterBarProps {
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
  handleReset: () => void;
  // Optional:
  selectedRating?: string;
  setSelectedRating?: (v: string) => void;
  selectedAsuransi?: string;
  setSelectedAsuransi?: (v: string) => void;
  selectedDelivery?: string;
  setSelectedDelivery?: (v: string) => void;
  selectedPromo?: string;
  setSelectedPromo?: (v: string) => void;
}

export default function SearchFilterBar({
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
  handleReset,
  selectedRating,
  setSelectedRating,
  selectedAsuransi,
  setSelectedAsuransi,
  selectedDelivery,
  setSelectedDelivery,
  selectedPromo,
  setSelectedPromo,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end bg-white rounded-2xl shadow p-4 mb-5 overflow-x-auto">
      {/* Kategori */}
      <div className="flex flex-col">
        <label htmlFor="kategori" className="text-xs font-semibold text-gray-500 mb-1 ml-1">
          Kategori
        </label>
        <select
          id="kategori"
          className="border rounded-xl px-3 py-2 bg-gray-50 min-w-[110px] text-gray-700 focus:ring-2 focus:ring-blue-200 w-full sm:w-auto"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
        >
          <option value="Semua">Semua</option>
          {kategoriOptions.map((kategori) => (
            <option key={kategori} value={kategori}>{kategori}</option>
          ))}
        </select>
      </div>
      {/* Lokasi */}
      <div className="flex flex-col">
        <label htmlFor="lokasi" className="text-xs font-semibold text-gray-500 mb-1 ml-1">
          Lokasi
        </label>
        <select
          id="lokasi"
          className="border rounded-xl px-3 py-2 bg-gray-50 min-w-[110px] text-gray-700 focus:ring-2 focus:ring-blue-200 w-full sm:w-auto"
          value={selectedLocation}
          onChange={e => setSelectedLocation(e.target.value)}
        >
          <option value="Semua">Semua</option>
          {lokasiOptions.map((lokasi) => (
            <option key={lokasi} value={lokasi}>{lokasi}</option>
          ))}
        </select>
      </div>
      {/* Status */}
      <div className="flex flex-col">
        <label htmlFor="status" className="text-xs font-semibold text-gray-500 mb-1 ml-1">
          Status
        </label>
        <select
          id="status"
          className="border rounded-xl px-3 py-2 bg-gray-50 min-w-[110px] text-gray-700 focus:ring-2 focus:ring-blue-200 w-full sm:w-auto"
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
        >
          <option value="Semua Status">Semua Status</option>
          <option value="Tersedia">Tersedia</option>
          <option value="Disewa">Disewa</option>
          <option value="Bisa Dibeli">Bisa Dibeli</option>
          <option value="Promo">Promo</option>
        </select>
      </div>
      {/* Harga */}
      <div className="flex flex-col">
        <label htmlFor="harga" className="text-xs font-semibold text-gray-500 mb-1 ml-1">
          Harga
        </label>
        <select
          id="harga"
          className="border rounded-xl px-3 py-2 bg-gray-50 min-w-[110px] text-gray-700 focus:ring-2 focus:ring-blue-200 w-full sm:w-auto"
          value={selectedHarga}
          onChange={e => setSelectedHarga(e.target.value)}
        >
          <option value="Semua">Semua</option>
          <option value="< Rp100.000">&lt; Rp100.000</option>
          <option value="Rp100.000 - Rp150.000">Rp100.000 - Rp150.000</option>
          <option value="> Rp150.000">&gt; Rp150.000</option>
        </select>
      </div>
      {/* Delivery */}
      <div className="flex flex-col">
        <label htmlFor="delivery" className="text-xs font-semibold text-gray-500 mb-1 ml-1">
          Delivery
        </label>
        <select
          id="delivery"
          className="border rounded-xl px-3 py-2 bg-gray-50 min-w-[110px] text-gray-700 focus:ring-2 focus:ring-blue-200 w-full sm:w-auto"
          value={selectedDelivery}
          onChange={e => setSelectedDelivery && setSelectedDelivery(e.target.value)}
        >
          <option value="Semua">Semua</option>
          <option value="Ya">Ada Delivery</option>
          <option value="Tidak">Tidak Ada Delivery</option>
        </select>
      </div>
      {/* Promo */}
      <div className="flex flex-col">
        <label htmlFor="promo" className="text-xs font-semibold text-gray-500 mb-1 ml-1">
          Promo
        </label>
        <select
          id="promo"
          className="border rounded-xl px-3 py-2 bg-gray-50 min-w-[110px] text-gray-700 focus:ring-2 focus:ring-blue-200 w-full sm:w-auto"
          value={selectedPromo}
          onChange={e => setSelectedPromo && setSelectedPromo(e.target.value)}
        >
          <option value="Semua">Semua</option>
          <option value="Ya">Ada Promo</option>
          <option value="Tidak">Tidak Ada Promo</option>
        </select>
      </div>
      {/* Rating */}
      <div className="flex flex-col">
        <label htmlFor="rating" className="text-xs font-semibold text-gray-500 mb-1 ml-1">
          Rating
        </label>
        <select
          id="rating"
          className="border rounded-xl px-3 py-2 bg-gray-50 min-w-[110px] text-gray-700 focus:ring-2 focus:ring-blue-200 w-full sm:w-auto"
          value={selectedRating}
          onChange={e => setSelectedRating && setSelectedRating(e.target.value)}
        >
          <option value="Semua">Semua</option>
          <option value="5">5 ★</option>
          <option value="4">4+ ★</option>
          <option value="3">3+ ★</option>
        </select>
      </div>
      {/* Tombol Reset */}
      <button
        className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition shadow h-11"
        onClick={handleReset}
        type="button"
      >
        Reset Filter
      </button>
    </div>
  );
}
