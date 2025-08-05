// app/dashboard/profile/components/ProfileHeader.tsx
"use client";
import { FaCheckCircle } from "react-icons/fa";

type ProfileHeaderProps = {
  nama: string;
  email: string;
  is_verified: boolean;
  avatar_url?: string;
};

export default function ProfileHeader({
  nama,
  email,
  is_verified,
  avatar_url,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-2xl shadow-md mb-6">
      <div className="relative">
        <img
          src={avatar_url || "/default-avatar.png"}
          alt={nama}
          className="w-28 h-28 rounded-full border-4 border-blue-200 object-cover shadow"
        />
        {is_verified && (
          <span className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
            <FaCheckCircle className="text-green-500 text-2xl" />
          </span>
        )}
      </div>
      <div className="text-center">
        <h2 className="font-bold text-xl md:text-2xl text-gray-800">{nama}</h2>
        <p className="text-gray-500 text-sm md:text-base">{email}</p>
        <span
          className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-semibold 
            ${is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
          `}
        >
          {is_verified ? "Terverifikasi" : "Belum Verifikasi"}
        </span>
      </div>
    </div>
  );
}
