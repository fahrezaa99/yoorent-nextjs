"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/common/AuthProvider"; // Pakai AuthProvider custom

interface GabungSewakanButtonProps {
  openLoginModal: () => void;
}

export default function GabungSewakanButton({
  openLoginModal,
}: GabungSewakanButtonProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const isLoggedIn = !!user;

  const handleClick = () => {
    if (!isLoggedIn) {
      openLoginModal();
    } else {
      router.push("/sewakan-barang");
    }
  };

  // Jangan render button sebelum context siap (opsional, anti flicker)
  if (loading) return null;

  return (
    <button
      className="bg-gradient-to-r from-blue-600 via-green-400 to-blue-500 text-white font-bold py-3 px-7 rounded-xl shadow hover:opacity-90 text-lg transition flex items-center justify-center gap-2"
      onClick={handleClick}
      type="button"
    >
      Gabung &amp; Sewakan Barang
      <span className="ml-2">→</span>
    </button>
  );
}
