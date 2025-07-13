"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Ardi, Fotografer Freelance",
    text: "Ngga nyangka, kamera yang nganggur bisa jadi duit tiap bulan. Proses aman & gampang. Sekarang udah rutin dapet tambahan income buat bayar cicilan mobil.",
    rating: 5,
  },
  {
    name: "Lina, Mahasiswa",
    text: "Aku sewa laptop pas rusak dadakan, prosesnya super cepat dan nggak ribet. Bener-bener solusi darurat buat tugas kampus!",
    rating: 5,
  },
  {
    name: "Bagas, EO Event",
    text: "Sewa alat outdoor dan sound system lengkap. Ownernya fast respon, barang dikirim tepat waktu, harga juga lebih murah dari tempat lain.",
    rating: 4,
  },
  {
    name: "Yuni, Ibu Rumah Tangga",
    text: "Iseng sewain blender sama mainan anak, ternyata peminatnya banyak juga. Dapet tambahan uang belanja tiap bulan. Recommended!",
    rating: 5,
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  // Auto-slide testimonial tiap 5 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [idx]);

  const next = () => setIdx((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section
      id="testimoni"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 via-green-100 to-blue-200"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4">
          <span className="text-blue-600 font-medium">Testimoni</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
          Apa Kata Mereka?
        </h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white/90 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-200 max-w-3xl mx-auto min-h-[280px] flex flex-col items-center"
            >
              <div className="flex justify-center mb-6">
                <Stars count={testimonials[idx].rating} />
              </div>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed text-center">
                “{testimonials[idx].text}”
              </p>
              <div className="font-semibold text-gray-900">
                — {testimonials[idx].name}
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Tombol Prev/Next */}
          <button
            aria-label="Sebelumnya"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:bg-blue-100 transition text-2xl"
            style={{ zIndex: 10 }}
          >‹</button>
          <button
            aria-label="Selanjutnya"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:bg-blue-100 transition text-2xl"
            style={{ zIndex: 10 }}
          >›</button>
        </div>
        {/* Bullets */}
        <div className="flex gap-2 mt-6 justify-center">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full ${i === idx ? "bg-blue-500" : "bg-gray-300"} transition`}
              onClick={() => setIdx(i)}
              aria-label={`Testimoni ke-${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex space-x-1">
      {[...Array(count)].map((_, i) => (
        <svg
          key={i}
          className="w-6 h-6 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.036 3.182a1 1 0 00.95.69h3.356c.969 0 1.371 1.24.588 1.81l-2.716 1.973a1 1 0 00-.364 1.118l1.036 3.181c.3.922-.755 1.688-1.54 1.118l-2.716-1.973a1 1 0 00-1.176 0l-2.716 1.973c-.785.57-1.84-.196-1.54-1.118l1.036-3.181a1 1 0 00-.364-1.118L2.293 8.61c-.783-.57-.38-1.81.588-1.81h3.356a1 1 0 00.95-.69l1.036-3.182z" />
        </svg>
      ))}
      {[...Array(5 - count)].map((_, i) => (
        <svg
          key={i}
          className="w-6 h-6 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.036 3.182a1 1 0 00.95.69h3.356c.969 0 1.371 1.24.588 1.81l-2.716 1.973a1 1 0 00-.364 1.118l1.036 3.181c.3.922-.755 1.688-1.54 1.118l-2.716-1.973a1 1 0 00-1.176 0l-2.716 1.973c-.785.57-1.84-.196-1.54-1.118l1.036-3.181a1 1 0 00-.364-1.118L2.293 8.61c-.783-.57-.38-1.81.588-1.81h3.356a1 1 0 00.95-.69l1.036-3.182z" />
        </svg>
      ))}
    </div>
  );
}
