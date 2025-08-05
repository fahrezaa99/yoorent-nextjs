"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// Data kategori
const categories = [
  {
    emoji: "📷",
    title: "Kamera & Elektronik",
    desc: "Kamera, lensa, action cam, gadget, printer, proyektor, dsb",
    items: "6,800+ items",
    slug: "kamera-elektronik",
  },
  {
    emoji: "📱",
    title: "Handphone & Gadget",
    desc: "iPhone, Android, tablet, smartwatch, aksesoris",
    items: "4,400+ items",
    slug: "handphone-gadget",
  },
  {
    emoji: "💻",
    title: "Laptop & Komputer",
    desc: "Laptop, Macbook, komputer, monitor",
    items: "3,200+ items",
    slug: "laptop-komputer",
  },
  {
    emoji: "🚗",
    title: "Kendaraan",
    desc: "Motor, mobil, city car, sport, travel",
    items: "6,500+ items",
    slug: "kendaraan",
  },
  {
    emoji: "🏠",
    title: "Properti",
    desc: "Rumah, apartemen, villa, tanah, ruko, kos",
    items: "3,900+ items",
    slug: "properti",
  },
];

export default function PopularitasCategories() {
  const router = useRouter();

  const handleSewaKategori = (slug: string) => {
    router.push(`/cari-barang?kategori=${slug}`);
  };

  return (
    <section id="kategori" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-600/10 rounded-full px-4 py-2 mb-4">
            <span className="text-green-600 font-medium">Kategori Populer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Jelajahi Kategori Terlengkap
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dari peralatan profesional hingga barang hobi, temukan apapun yang Anda butuhkan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.slug}
              emoji={cat.emoji}
              title={cat.title}
              desc={cat.desc}
              items={cat.items}
              onSewa={() => handleSewaKategori(cat.slug)}
            />
          ))}
          <LihatSemuaCard />
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  emoji,
  title,
  desc,
  items,
  onSewa,
}: {
  emoji: string;
  title: string;
  desc: string;
  items: string;
  onSewa: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <span className="text-4xl">{emoji}</span>
        <span className="text-sm text-gray-500">{items}</span>
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{desc}</p>
      <button
        onClick={onSewa}
        className="w-full bg-blue-600 text-white font-semibold rounded-xl py-3 mt-auto hover:bg-blue-700 transition"
      >
        Sewa Sekarang
      </button>
    </div>
  );
}

function LihatSemuaCard() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-green-400 rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center hover:scale-105 transition-all duration-300">
      <Link
        href="/kategori"
        className="flex flex-col items-center gap-2 text-white font-semibold focus:outline-none focus:ring-4 focus:ring-white/40 transition"
      >
        <span className="text-3xl">🔎</span>
        <span className="text-lg mt-2">Lihat Semua</span>
      </Link>
    </div>
  );
}
