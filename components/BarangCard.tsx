"use client";
import Link from "next/link";
import { Star, Heart, Share2, Percent, Flame, BadgeCheck } from "lucide-react";
import Image from "next/image";

function formatRupiah(num: number) {
  return "Rp " + num.toLocaleString("id-ID") + "/hari";
}

export default function BarangCard({ item, isFavorite, toggleFavorite }: any) {
  // BADGE / TAG
  const badges = [];
  if (item.populer)
    badges.push(
      <span key="populer" className="bg-orange-500 text-white px-2 py-1 text-xs rounded mr-1 inline-flex items-center gap-1">
        <Flame size={14} />Populer
      </span>
    );
  if (item.promo)
    badges.push(
      <span key="promo" className="bg-pink-500 text-white px-2 py-1 text-xs rounded mr-1 inline-flex items-center gap-1">
        <Percent size={14} />Promo
      </span>
    );
  if (item.baru)
    badges.push(
      <span key="baru" className="bg-green-600 text-white px-2 py-1 text-xs rounded mr-1">
        Baru
      </span>
    );
  if (item.verified)
    badges.push(
      <span key="verified" className="bg-blue-600 text-white px-2 py-1 text-xs rounded mr-1 inline-flex items-center gap-1">
        <BadgeCheck size={14} />Verified
      </span>
    );
  // STATUS
  let statusColor = "bg-green-100 text-green-700";
  let statusText = "Tersedia";
  if (item.status === "disewa") {
    statusColor = "bg-red-100 text-red-600";
    statusText = "Disewa";
  } else if (item.status === "preorder") {
    statusColor = "bg-yellow-100 text-yellow-700";
    statusText = "Pre-order";
  }
  // Rating
  const rating = item.rating ?? Math.round(Math.random() * 2) + 3.5;
  const reviews = item.reviews ?? Math.floor(Math.random() * 20) + 3;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition flex flex-col group relative">
      {/* BADGE PROMO BESAR */}
      {item.promo && (
        <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-3 py-1 rounded-xl z-10 font-bold shadow">
          PROMO
        </div>
      )}

      {/* THUMBNAIL */}
      <Link href={`/barang/${item.id}`} className="block">
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={item.foto?.[0] || "/placeholder.png"}
            alt={item.nama}
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width: 768px) 100vw, 320px"
            priority
          />
        </div>
      </Link>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-1 mb-1">{badges}</div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor}`}>{statusText}</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold mb-1 line-clamp-2">{item.nama}</h2>
          <p className="flex items-center text-sm text-gray-500 mb-2 truncate">{item.lokasi}</p>
        </div>
        {/* RATING */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.round(rating) ? "#facc15" : "none"}
              stroke="#facc15"
            />
          ))}
          <span className="ml-2 text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400 ml-1">({reviews} review)</span>
        </div>
        {/* HARGA + DISKON */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            {item.harga_promo ? (
              <>
                <span className="text-xs text-gray-400 line-through mr-2">
                  {formatRupiah(item.harga)}
                </span>
                <span className="font-bold text-pink-600 text-base md:text-lg">
                  {formatRupiah(item.harga_promo)}
                </span>
              </>
            ) : (
              <span className="font-bold text-blue-700 text-base md:text-lg">
                {formatRupiah(item.harga)}
              </span>
            )}
          </div>
          <Link
            href={`/barang/${item.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow transition"
          >
            Sewa
          </Link>
        </div>
      </div>
      {/* Favorite + Share */}
      <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
        <button
          onClick={() => toggleFavorite(item.id)}
          className={`p-1 bg-white/70 rounded-full border border-gray-200 shadow-md hover:bg-pink-50 ${isFavorite ? "text-pink-600" : "text-gray-400"}`}
          aria-label="Bookmark"
        >
          <Heart size={22} fill={isFavorite ? "#e11d48" : "none"} />
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin + "/barang/" + item.id);
            alert("Link barang sudah di-copy!");
          }}
          className="p-1 bg-white/70 rounded-full border border-gray-200 shadow-md hover:bg-blue-50 text-blue-500"
          aria-label="Share"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}
