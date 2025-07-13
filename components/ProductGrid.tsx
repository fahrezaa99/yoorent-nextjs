"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import BookingPopup from "@/components/BookingPopup"; // pastikan sudah ada file ini

const products = [
  {
    id: 1,
    name: "Canon EOS 80D",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    location: "Jakarta",
    rating: 4.8,
    price: 90000,
  },
  {
    id: 2,
    name: "DJI Mavic Air 2",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    location: "Bandung",
    rating: 4.9,
    price: 200000,
  },
  {
    id: 3,
    name: "Tenda Camping Besar",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    location: "Bogor",
    rating: 4.7,
    price: 50000,
  },
  {
    id: 4,
    name: "Macbook Pro M1",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    location: "Surabaya",
    rating: 4.95,
    price: 120000,
  },
  {
    id: 5,
    name: "Speaker Bluetooth JBL",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    location: "Yogyakarta",
    rating: 4.6,
    price: 30000,
  },
];

function formatRupiah(num: number) {
  return "Rp " + num.toLocaleString("id-ID") + "/hari";
}

export default function ProductGrid() {
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleSewaClick = (product: any) => {
    setSelectedProduct({
      nama: product.name,
      lokasi: product.location,
      harga: product.price,
      foto: product.image,
    });
    setOpenBooking(true);
  };

  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Barang Populer
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.04, boxShadow: "0 12px 36px 0 rgba(59,130,246,0.08)" }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-44 object-cover object-center rounded-t-2xl"
              loading="lazy"
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
        ))}
      </div>
      {/* POPUP BOOKING */}
      {selectedProduct && (
        <BookingPopup
          open={openBooking}
          onClose={() => setOpenBooking(false)}
          barang={selectedProduct}
        />
      )}
    </section>
  );
}
