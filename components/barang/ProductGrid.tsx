"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import BookingPopup from "@/components/sewa/BookingPopup";
import { useAuth } from "@/components/common/AuthProvider";
import SkeletonBarangCard from "@/components/common/SkeletonBarangCard";

interface Product {
  id: number | string;
  name: string;
  image: string;
  location: string;
  rating: number;
  price: number;
}

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean; // <- tambahan
}

function formatRupiah(num: number) {
  return "Rp " + num.toLocaleString("id-ID") + "/hari";
}

export default function ProductGrid({ products = [], isLoading = false }: ProductGridProps) {
  const [openBooking, setOpenBooking] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const handleSewaClick = (product: Product) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setSelectedProduct(product);
    setOpenBooking(true);
  };

  return (
    <section className="pt-4 pb-8 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {isLoading
          ? [...Array(8)].map((_, i) => <SkeletonBarangCard key={i} />)
          : (products.length === 0 ? (
              <p className="col-span-full text-center text-gray-400 py-16 text-lg font-semibold">
                Tidak ada barang ditemukan.
              </p>
            ) : (
              products.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.04, boxShadow: "0 12px 36px 0 rgba(59,130,246,0.08)" }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={176}
                    className="w-full h-44 object-cover object-center rounded-t-2xl"
                    loading="lazy"
                    unoptimized
                  />
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <span>{product.location}</span>
                      <span className="mx-2">·</span>
                      <span className="flex items-center">
                        <span className="text-yellow-400 text-lg mr-1">★</span>
                        {product.rating}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                    <div className="text-xl font-semibold text-blue-600 mb-3">{formatRupiah(product.price)}</div>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleSewaClick(product)}
                        className="w-full bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 text-white font-bold py-2 rounded-xl shadow hover:scale-105 transition-all duration-200"
                      >
                        Sewa Sekarang
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ))
        }
      </div>

      {/* POPUP BOOKING */}
      {selectedProduct && (
        <BookingPopup
          open={openBooking}
          onClose={() => setOpenBooking(false)}
          barang={{
            nama: selectedProduct.name,
            lokasi: selectedProduct.location,
            harga: selectedProduct.price,
            foto: selectedProduct.image,
          }}
        />
      )}

      {/* POPUP LOGIN */}
      {showLogin && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white max-w-xs w-full rounded-2xl p-6 text-center shadow-xl">
            <h3 className="font-bold text-xl mb-3">Login Dulu</h3>
            <p className="text-gray-500 mb-6">
              Untuk menyewa barang, silakan login terlebih dahulu.
            </p>
            <a
              href="/masuk"
              className="inline-block w-full rounded-xl px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 mb-3"
            >
              Login / Daftar
            </a>
            <button
              className="w-full rounded-xl px-4 py-2 bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300"
              onClick={() => setShowLogin(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
