"use client";
import { motion } from "framer-motion";
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
      className="relative w-full min-h-[500px] flex flex-col justify-center pb-8 pt-24 md:pt-10"
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center px-2"
      >
        <h1 className="font-extrabold mb-2 leading-tight text-2xl sm:text-4xl md:text-6xl drop-shadow-lg text-white">
          Sewa & Sewakan Apapun
          <br className="hidden md:block" /> dengan Mudah
        </h1>
        <div className="text-sm sm:text-base md:text-lg font-medium text-white/90 mt-1 mb-4">
          Platform sewa-menyewa terpercaya untuk semua kebutuhan Anda. Dari kamera hingga peralatan camping, semua ada di YooRent dengan jaminan keamanan 100%.
        </div>
      </motion.div>

      {/* Search Form */}
      <form
        onSubmit={handleCariSekarang}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-3 md:p-4 flex flex-col md:flex-row items-center gap-3"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari barang..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 outline-none text-base"
        />
        <div className="w-full md:w-auto">
          <CategoryDropdown />
        </div>
        <div className="w-full md:w-auto">
          <LocationDropdown />
        </div>
        <motion.button
          type="submit"
          whileHover={{
            scale: 1.06,
            y: -2,
            boxShadow: "0 6px 18px 0 rgba(34,197,94,0.13)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow transition flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <span className="inline-block align-middle">🔍</span>
          Cari Sekarang
        </motion.button>
      </form>

      {/* CTA Button */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 justify-center mt-5 px-2">
        <motion.button
          type="button"
          onClick={handleSewakan}
          whileHover={{
            scale: 1.06,
            y: -2,
            boxShadow: "0 6px 18px 0 rgba(34,197,94,0.13)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 py-2 text-base md:text-lg shadow transition"
        >
          <span className="text-xl">$</span> Mulai Sewakan Barang
        </motion.button>
        <motion.button
          type="button"
          onClick={handleCariBarangSewa}
          whileHover={{
            scale: 1.06,
            y: -2,
            boxShadow: "0 6px 18px 0 rgba(59,130,246,0.10)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="group flex items-center gap-2 bg-white border border-gray-200 font-semibold rounded-lg px-5 py-2 text-base md:text-lg shadow hover:bg-blue-600 hover:text-white transition"
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
