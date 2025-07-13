"use client";
import { motion } from "framer-motion";
import CategoryDropdown from "@/components/CategoryDropdown";
import LocationDropdown from "@/components/LocationDropdown";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handler tombol Cari Sekarang
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

  // Handler tombol Mulai Sewakan Barang
  const handleSewakan = () => {
    router.push("/sewakan-barang");
  };

  // Handler tombol Cari Barang Sewa
  const handleCariBarangSewa = () => {
    router.push("/cari-barang");
  };

  return (
    <section
      className="relative w-full min-h-[500px] flex flex-col justify-center pb-10 pt-28 md:pt-10"
      style={{
        backgroundImage:
          "linear-gradient(120deg,rgba(28,95,215,0.87) 20%,rgba(16,185,129,0.68) 100%), url('/bg-rental.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Emoji hanya tampil di md ke atas */}
      <span className="absolute left-10 top-14 text-4xl md:text-5xl opacity-70 select-none pointer-events-none hidden md:block">📷</span>
      <span className="absolute right-10 bottom-16 text-4xl md:text-5xl opacity-70 select-none pointer-events-none hidden md:block">🏍️</span>
      <span className="absolute right-20 top-10 text-4xl md:text-5xl opacity-70 select-none pointer-events-none hidden md:block">🏠</span>
      <span className="absolute left-20 bottom-16 text-4xl md:text-5xl opacity-70 select-none pointer-events-none hidden md:block">🎸</span>

      {/* Info strip */}
      <div className="max-w-3xl mx-auto pt-6 pb-2 flex items-center justify-center">
        <span className="bg-white shadow px-4 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Lebih dari 50,000 pengguna aktif
        </span>
      </div>

      {/* Headline + subheadline baru */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center px-3"
      >
        <h1 className="font-extrabold mb-3 leading-tight text-3xl sm:text-4xl md:text-7xl drop-shadow-lg">
          <span className="text-black">Sewa &amp; Sewakan </span>
          <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Apapun</span>
          <br />
          <span className="text-black">dengan </span>
          <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Mudah</span>
        </h1>
        <div className="text-base sm:text-lg md:text-xl font-medium text-gray-800 mt-2 mb-4">
          Platform sewa-menyewa terpercaya untuk semua kebutuhan Anda. Dari kamera hingga peralatan camping, semua ada di YooRent dengan jaminan keamanan 100%.
        </div>
      </motion.div>

      {/* Search Form */}
      <form
        onSubmit={handleCariSekarang}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row items-center gap-4"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari barang..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 outline-none text-base"
        />
        {/* Custom Category Dropdown */}
        <div className="w-full md:w-auto">
          <CategoryDropdown />
        </div>
        {/* Custom Location Dropdown */}
        <div className="w-full md:w-auto">
          <LocationDropdown />
        </div>
        {/* Cari Sekarang */}
        <motion.button
          type="submit"
          whileHover={{
            scale: 1.07,
            y: -3,
            boxShadow: "0 8px 24px 0 rgba(34,197,94,0.16)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 text-white px-5 py-2 rounded-xl font-bold shadow hover:opacity-90 transition flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <span className="inline-block align-middle">🔍</span>
          Cari Sekarang
        </motion.button>
      </form>

      {/* CTA Button */}
      <div className="flex flex-col md:flex-row gap-3 justify-center mt-6 px-2">
        {/* Mulai Sewakan Barang */}
        <motion.button
          type="button"
          onClick={handleSewakan}
          whileHover={{
            scale: 1.07,
            y: -3,
            boxShadow: "0 8px 24px 0 rgba(34,197,94,0.16)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 text-white font-semibold rounded-xl px-6 py-3 text-base md:text-lg shadow hover:opacity-90 transition"
        >
          <span className="text-xl">$</span> Mulai Sewakan Barang
        </motion.button>
        {/* Cari Barang Sewa */}
        <motion.button
          type="button"
          onClick={handleCariBarangSewa}
          whileHover={{
            scale: 1.07,
            y: -3,
            boxShadow: "0 8px 24px 0 rgba(59,130,246,0.12)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="group flex items-center gap-2 bg-white border border-gray-200 font-semibold rounded-xl px-6 py-3 text-base md:text-lg shadow hover:bg-blue-600 hover:text-white transition"
        >
          <span className="text-xl group-hover:text-white transition-colors duration-200">🔎</span>
          <span className="transition-colors duration-200 group-hover:text-white">
            Cari Barang Sewa
          </span>
        </motion.button>
      </div>
    </section>
  );
}
