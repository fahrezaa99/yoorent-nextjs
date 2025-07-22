"use client";
import CategoryDropdown from "@/components/CategoryDropdown";
import LocationDropdown from "@/components/LocationDropdown";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleCariSekarang = (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    if (!value) {
      alert("Silakan masukkan kata kunci barang yang ingin dicari!");
      inputRef.current?.focus();
      return;
    }
    router.push(`/cari-barang?query=${encodeURIComponent(value)}`);
  };

  const handleSewakan = () => {
    router.push("/sewakan-barang");
  };

  const handleCariBarangSewa = () => {
    router.push("/cari-barang");
  };

  return (
    <section
      className="relative w-full min-h-[540px] flex flex-col justify-center pb-10 pt-24 md:pt-12"
      style={{
        backgroundColor: "#2186F6",
        backgroundImage: "none",
      }}
    >
      {/* Emoji hanya tampil di md ke atas */}
      <span className="absolute left-4 top-14 text-3xl md:text-5xl opacity-70 select-none pointer-events-none hidden md:block">📷</span>
      <span className="absolute right-4 bottom-16 text-3xl md:text-5xl opacity-70 select-none pointer-events-none hidden md:block">🏍️</span>
      <span className="absolute right-20 top-10 text-3xl md:text-5xl opacity-70 select-none pointer-events-none hidden md:block">🏠</span>
      <span className="absolute left-20 bottom-16 text-3xl md:text-5xl opacity-70 select-none pointer-events-none hidden md:block">🎸</span>

      {/* Info strip */}
      <div className="max-w-3xl mx-auto pt-5 pb-2 flex items-center justify-center">
        <span className="bg-white shadow px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Lebih dari 50,000 pengguna aktif
        </span>
      </div>

      {/* Headline + subheadline */}
      <div className="max-w-3xl mx-auto text-center px-2">
        <h1 className="font-extrabold mb-2 leading-tight text-2xl sm:text-4xl md:text-6xl drop-shadow-lg text-white">
          Sewa & Sewakan Apapun
          <br className="hidden md:block" /> dengan Mudah
        </h1>
        <div className="text-sm sm:text-base md:text-lg font-medium text-white/90 mt-1 mb-4">
          Platform sewa-menyewa terpercaya untuk semua kebutuhan Anda. Dari kamera hingga peralatan camping, semua ada di YooRent dengan jaminan keamanan 100%.
        </div>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleCariSekarang}
        className="max-w-4xl mx-auto bg-white rounded-[2.2rem] shadow-2xl p-5 md:p-8 w-full overflow-visible mt-6 border border-blue-100"
      >
        <div className="flex flex-col md:flex-row items-stretch gap-3 w-full">
          {/* Input cari barang */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari barang (misal: kamera, tenda, gitar...)"
            className="flex-1 min-w-[120px] text-lg px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-600 outline-none transition bg-gray-50 font-semibold min-h-[56px]"
          />

          {/* Kategori Dropdown */}
          <div className="w-full md:w-auto">
            <CategoryDropdown
              className="w-full md:w-auto text-lg px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-600 outline-none transition bg-gray-50 font-semibold min-h-[56px]"
            />
          </div>

          {/* Lokasi Dropdown */}
          <div className="w-full md:w-auto">
            <LocationDropdown
              className="w-full md:w-auto text-lg px-5 py-4 rounded-xl border border-gray-200 focus:border-blue-600 outline-none transition bg-gray-50 font-semibold min-h-[56px]"
            />
          </div>

          {/* Tombol Cari Sekarang */}
          <button
            type="submit"
            className="flex-shrink-0 flex items-center justify-center text-lg font-bold px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg min-w-[170px] gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[56px]"
          >
            <svg width={23} height={23} fill="none" stroke="currentColor" strokeWidth={2.3} viewBox="0 0 24 24">
              <circle cx={11} cy={11} r={7} />
              <path d="M21 21l-3.8-3.8" strokeLinecap="round" />
            </svg>
            Cari Sekarang
          </button>
        </div>
      </form>

      {/* CTA Buttons */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 justify-center mt-7 px-2">
        <button
          type="button"
          onClick={handleSewakan}
          className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-7 py-3 text-lg md:text-xl shadow transition active:scale-95 active:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 select-none"
        >
          <span className="text-2xl">$</span> Mulai Sewakan Barang
        </button>
        <button
          type="button"
          onClick={handleCariBarangSewa}
          className="flex-shrink-0 group flex items-center gap-2 bg-white border border-gray-200 font-semibold rounded-lg px-7 py-3 text-lg md:text-xl shadow hover:bg-blue-600 hover:text-white transition active:scale-95 active:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 select-none"
        >
          <span className="text-2xl group-hover:text-white transition-colors duration-200">🔎</span>
          <span className="transition-colors duration-200 group-hover:text-white">
            Cari Barang Sewa
          </span>
        </button>
      </div>
    </section>
  );
}
