"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Simulasi cek login user (ganti dengan logic auth asli lo)
const useAuth = () => {
  // Ganti sesuai logic auth lo
  const [isLoggedIn] = useState(false); // false = belum login
  return { isLoggedIn };
};

export default function GabungSewakanButton({
  openLoginModal,
}: {
  openLoginModal: () => void;
}) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const handleClick = () => {
    if (!isLoggedIn) {
      openLoginModal();
    } else {
      router.push("/sewakan-barang");
    }
  };

  return (
    <button
      className="bg-gradient-to-r from-blue-600 via-green-400 to-blue-500 text-white font-bold py-3 px-7 rounded-xl shadow hover:opacity-90 text-lg transition flex items-center justify-center gap-2"
      onClick={handleClick}
      type="button"
    >
      Gabung & Sewakan Barang
      <span className="ml-2">→</span>
    </button>
  );
}
