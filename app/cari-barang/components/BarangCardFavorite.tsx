// components/barang/BarangCardFavorite.tsx
import { Heart } from "lucide-react";

export default function BarangCardFavorite({ isFavorite, onClick }: { isFavorite: boolean; onClick: () => void }) {
  return (
    <button
      className={`p-1 bg-white/70 rounded-full border border-gray-200 shadow-md hover:bg-pink-50 ${isFavorite ? "text-pink-600" : "text-gray-400"}`}
      aria-label="Bookmark"
      type="button"
      onClick={onClick}
    >
      <Heart size={22} fill={isFavorite ? "#e11d48" : "none"} />
    </button>
  );
}
