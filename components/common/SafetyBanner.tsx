// components/SafetyBanner.tsx
import { ShieldCheck } from "lucide-react";

export default function SafetyBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-2 flex items-center justify-center gap-3 mb-8 rounded-2xl shadow">
      <ShieldCheck size={30} className="text-white" />
      <span className="font-bold text-lg md:text-xl text-center">
        Demi keamanan, lakukan transaksi dan pembayaran <span className="underline underline-offset-4">hanya di YooRent</span>. Jangan pernah transfer di luar platform!
      </span>
    </div>
  );
}
