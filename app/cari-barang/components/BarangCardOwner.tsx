// components/barang/BarangCardOwner.tsx
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export default function BarangCardOwner({ ownerFoto, ownerName, isVerified }: { ownerFoto: string; ownerName: string; isVerified: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Image
        src={ownerFoto}
        alt={ownerName}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover border"
      />
      <div>
        <div className="flex items-center gap-1 text-sm text-gray-700 font-medium">
          {ownerName}
          {isVerified && (
            <span title="Terverifikasi KTP">
              <BadgeCheck size={16} className="text-blue-500" />
            </span>
          )}
        </div>
        <div className="text-xs font-semibold mt-0.5">
          {isVerified ? (
            <span className="text-green-600 flex items-center gap-1 font-bold">
              Terverifikasi
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 7.293a1 1 0 00-1.414 0L9 13.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/></svg>
            </span>
          ) : (
            <span className="text-gray-400">Belum Terverifikasi</span>
          )}
        </div>
      </div>
    </div>
  );
}
