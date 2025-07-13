'use client'

import { useRouter } from "next/navigation";

export default function KategoriPage() {
  const router = useRouter();
  // Semua kategori, bisa tambah sesuai kebutuhan
  const allCategories = [
    { emoji: "📷", title: "Kamera & Elektronik" },
    { emoji: "📱", title: "Handphone & Gadget" },
    { emoji: "💻", title: "Laptop & Komputer" },
    { emoji: "🚗", title: "Kendaraan" },
    { emoji: "🏠", title: "Properti" },
    { emoji: "🚜", title: "Alat Berat" },
    { emoji: "👗", title: "Fashion & Aksesoris" },
    { emoji: "⛺", title: "Outdoor & Camping" },
    { emoji: "🎲", title: "Lainnya" },
  ];

  return (
    <div className="min-h-[80vh] bg-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Tombol Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:underline hover:gap-3 transition-all"
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kembali
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Semua Kategori
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {allCategories.map((cat) => (
            <div
              key={cat.title}
              className="bg-white border rounded-2xl shadow flex flex-col items-center p-6 hover:bg-gradient-to-tr hover:from-blue-200 hover:to-green-100 hover:scale-105 transition-all duration-200 group cursor-pointer"
            >
              <span className="text-5xl mb-3 transition-all duration-200 group-hover:scale-110">{cat.emoji}</span>
              <span className="font-semibold text-lg group-hover:text-blue-600 transition-all duration-200">
                {cat.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
