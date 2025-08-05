import { Percent, Sparkles, XCircle } from "lucide-react";

interface BarangCardBadgeProps {
  promo?: boolean;
  tersedia?: boolean;
  sedangDisewa?: boolean;    
  tidakTersedia?: boolean;
  className?: string;
}

export default function BarangCardBadge({
  promo,
  tersedia,
  tidakTersedia,
  className = "",
}: BarangCardBadgeProps) {
  return (
    <div className={`flex flex-row gap-2 items-center ${className}`}>
      {promo && (
        <span className="flex items-center gap-1 bg-gradient-to-r from-pink-500 via-red-400 to-orange-400 text-white px-3 py-1 text-xs rounded-2xl font-bold shadow-md animate-bounce">
          <Percent size={13} className="mb-0.5" />
          Promo
        </span>
      )}
      {tersedia && (
        <span className="flex items-center gap-1 bg-blue-500/10 text-blue-700 px-3 py-1 text-xs rounded-2xl font-bold shadow-sm border border-blue-200 backdrop-blur-sm">
          <Sparkles size={13} className="mb-0.5" />
          Tersedia
        </span>
      )}
      {tidakTersedia && (
        <span className="flex items-center gap-1 bg-gray-300/40 text-gray-700 px-3 py-1 text-xs rounded-2xl font-bold shadow-sm border border-gray-200 backdrop-blur-sm">
          <XCircle size={13} className="mb-0.5" />
          Tidak Tersedia
        </span>
      )}
    </div>
  );
}
