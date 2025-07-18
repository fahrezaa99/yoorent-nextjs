"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

// Dummy data produk (di real project, nanti fetch dari API/database)
const products = [
  {
    id: "1",
    name: "Canon EOS 80D",
    price: 90000,
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&q=80",
    rating: 4.8,
    desc: "Kamera DSLR profesional, cocok untuk fotografi & video.",
    detail: "Include lensa 18-55mm, charger, dan 1x baterai.",
  },
  {
    id: "2",
    name: "DJI Mavic Air 2",
    price: 200000,
    location: "Bandung",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&q=80",
    rating: 4.9,
    desc: "Drone 4K, ready terbang untuk dokumentasi udara.",
    detail: "Include 2x baterai, remote, dan tas.",
  },
  {
    id: "3",
    name: "Tenda Camping Besar",
    price: 50000,
    location: "Bogor",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80",
    rating: 4.7,
    desc: "Tenda besar muat 4-6 orang, cocok untuk camping keluarga.",
    detail: "Include pasak dan alas, anti air.",
  },
];

interface Product {
  id: string;
  name: string;
  price: number;
  location: string;
  image: string;
  rating: number;
  desc: string;
  detail: string;
}

export default function ItemDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };

  const item: Product | undefined = products.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="max-w-xl mx-auto p-10 text-center">
        <h2 className="text-xl font-bold mb-4">Barang tidak ditemukan</h2>
        <Link href="/" className="text-blue-600 underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={item.image}
            alt={item.name}
            width={900}
            height={288}
            className="w-full h-72 object-cover rounded-xl mb-6"
            unoptimized
            priority
          />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
        <div className="flex items-center text-gray-600 mb-2">
          <span className="mr-2">⭐ {item.rating}</span>
          <span className="mx-2">|</span>
          <span>{item.location}</span>
        </div>
        <div className="text-xl font-bold text-blue-600 mb-2">
          Rp {item.price.toLocaleString("id-ID")}/hari
        </div>
        <p className="text-gray-700 mb-2">{item.desc}</p>
        <p className="text-sm text-gray-500 mb-6">{item.detail}</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow">
          Booking Sekarang
        </button>
        <Link href="/" className="block mt-6 text-blue-600 underline">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
