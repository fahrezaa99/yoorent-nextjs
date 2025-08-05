"use client";
import Link from "next/link";
import { Star, Share2 } from "lucide-react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatModal from "@/components/common/ChatModal";
import { useAuth } from "@/components/common/AuthProvider";
import ChatRoom from "@/components/chat/ChatRoom";


import BarangCardBadge from "./BarangCardBadge";
import BarangCardSlider from "./BarangCardSlider";
import BarangCardOwner from "./BarangCardOwner";
import BarangCardPrice from "./BarangCardPrice";
import BarangCardActions from "./BarangCardActions";
import BarangCardFavorite from "./BarangCardFavorite";

function formatRupiah(num: number) {
  return "Rp " + num.toLocaleString("id-ID");
}

interface BarangCardProps {
  item: any;
  isFavorite?: boolean;
  toggleFavorite?: (id: string) => void;
  userId?: string;
  isLoggedIn?: boolean;
  nearby?: boolean;
  onSewaClick?: (item: any) => void;
  onChatClick?: (item: any) => void;
  mounted?: boolean;    // ← tambahkan di sini :contentReference[oaicite:2]{index=2}
}

export default function BarangCard({
  item,
  isFavorite,
  toggleFavorite,
  userId,
  isLoggedIn,
  nearby,
  onSewaClick,
  onChatClick,
}: BarangCardProps) {
  const router = useRouter();

  // ------ STATUS code sudah tidak dipakai lagi ------

  const rating = item.rating ?? 4.5;
  const reviews = item.reviews ?? 10;

  const fotoList = item.foto && item.foto.length > 0 ? item.foto : ["/placeholder.png"];
  const isVerified = item.owner?.verified ?? item.profiles?.verified ?? item.verified ?? false;
  const ownerName = item.owner?.nama || item.profiles?.nama || "Pemilik";
  const ownerFoto = item.owner?.foto || item.profiles?.foto || "/default-avatar.png";
  const ownerId = item.owner_id || item.owner?.id || item.profiles?.id;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [showLogin, setShowLogin] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const { user, loading } = useAuth();
  const finalUserId = userId ?? user?.id ?? "";
  const finalIsLoggedIn = isLoggedIn ?? !!user;

  const handleSewaClick = (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e?.stopPropagation && e.stopPropagation();
    if (!finalIsLoggedIn) {
      e?.preventDefault();
      setShowLogin(true);
      return;
    }
    if (onSewaClick) onSewaClick(item);
  };

  const handleChatClick = () => {
    if (!finalIsLoggedIn) {
      setShowLogin(true);
    } else if (ownerId && finalUserId !== ownerId) {
      setShowChat(true);
    }
    if (onChatClick) onChatClick(item);
  };

  const handleBeliClick = () => {
    if (!finalIsLoggedIn) {
      setShowLogin(true);
      return;
    }
    router.push(`/beli/${item.id}`);
  };

  if (loading) return null;
const sedangDisewa = item.status === "Sedang Disewa" || item.is_rented; 
  return (
  <div className={
    `bg-white rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col group relative border border-blue-50
     ${sedangDisewa ? "opacity-70 grayscale pointer-events-none" : ""}`
  }>
    {/* FAVORITE */}
    <div className="absolute top-3 right-3 z-10">
      <BarangCardFavorite
        isFavorite={!!isFavorite}
        onClick={() => toggleFavorite && toggleFavorite(item.id)}
      />
    </div>

    {/* SLIDER / GAMBAR */}
    <Link href={`/barang/${item.id}`} className="block">
      <div className="relative w-full h-44 bg-gray-100">
        <BarangCardSlider fotoList={fotoList} nama={item.nama} />
        {/* Badge sedang disewa */}
        {sedangDisewa && (
          <span className="absolute top-3 left-3 bg-black/80 text-white font-bold text-xs rounded-xl px-3 py-1 shadow-lg z-10">
            Sedang Disewa
          </span>
        )}
      </div>
    </Link>

    <div className="p-4 flex-1 flex flex-col justify-between">
      {/* BADGE STATUS/PROMO */}
      <div className="mb-2">
        <BarangCardBadge
  promo={!!item.promo && item.status === "Tersedia"}
  tersedia={item.status === "Tersedia"}
  sedangDisewa={item.status === "Sedang Disewa"}
  tidakTersedia={item.status !== "Tersedia" && item.status !== "Sedang Disewa"}
/>
      </div>
        {/* JUDUL */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h2 className="text-base md:text-lg font-bold leading-tight line-clamp-2">{item.nama}</h2>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + "/barang/" + item.id);
              alert("Link barang sudah di-copy!");
            }}
            className="ml-2 p-1 bg-white/80 hover:bg-blue-100 rounded-full border border-gray-100 shadow text-blue-500 transition"
            aria-label="Share"
            tabIndex={0}
            type="button"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* LOKASI */}
        <p className="text-xs text-gray-500 mb-1 truncate">{item.lokasi}</p>

        {/* OWNER */}
        <BarangCardOwner ownerFoto={ownerFoto} ownerName={ownerName} isVerified={isVerified} />

        {/* RATING */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < Math.round(rating) ? "#facc15" : "none"}
              stroke="#facc15"
            />
          ))}
          <span className="ml-2 text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400 ml-1">({reviews} reviews)</span>
        </div>

        {/* HARGA */}
        <BarangCardPrice
          harga={item.harga}
          harga_promo={item.harga_promo}
          harga_beli={item.harga_beli}
          bisaDibeli={false}
        />

        {/* TOMBOL SEWA & CHAT */}
        <BarangCardActions
          onSewaClick={handleSewaClick}
          onChatClick={handleChatClick}
          isLoggedIn={finalIsLoggedIn}
          ownerId={ownerId}
          userId={finalUserId}
          mounted={mounted}
          itemId={item.id}
          ownerName={ownerName}
          bisaDibeli={false}
          onBeliClick={handleBeliClick}
        />
      </div>

      {/* ======= POPUP LOGIN ======= */}
      {showLogin && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur">
          <div className="bg-white max-w-xs w-full rounded-2xl p-6 text-center shadow-xl relative">
            <h3 className="font-bold text-xl mb-3">Login Dulu</h3>
            <p className="text-gray-500 mb-6">
              Untuk menyewa barang, silakan login terlebih dahulu.
            </p>
            <Link
              href="/masuk"
              className="inline-block w-full rounded-xl px-4 py-2 bg-blue-600 text-white font-semibold text-center shadow mb-2 hover:bg-blue-700 transition"
            >
              Login / Daftar
            </Link>
            <button
              className="w-full rounded-xl px-4 py-2 bg-gray-200 text-gray-600 font-semibold text-center"
              onClick={() => setShowLogin(false)}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* CHAT MODAL (kalau mau munculkan modal chat di card, aktifkan ini) */}
      {/* 
      {showChat && (
        <ChatModal
          open={showChat}
          onClose={() => setShowChat(false)}
          barangId={item.id}
          userId={finalUserId}
          receiverId={ownerId}
          receiverName={ownerName}
          barang={item}
          ownerName={ownerName}
          ownerFoto={ownerFoto}
        />
      )}
      */}
    </div>
  );
}
