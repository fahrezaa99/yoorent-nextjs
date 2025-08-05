import React from "react";
import { CheckCircle2 } from "lucide-react";

type Props = {
  onClose: () => void;
};

const BookingSuccessScreen: React.FC<Props> = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center py-14 animate-fade-in">
    <div className="bg-gradient-to-br from-green-100 via-white to-green-50 rounded-full p-5 mb-6 shadow-lg">
      <CheckCircle2 className="w-20 h-20 text-green-600 animate-bounce-in" />
    </div>
    <h2 className="text-3xl font-extrabold mb-3 text-center tracking-tight text-gray-800 drop-shadow-sm">
      Booking Berhasil!
    </h2>
    <p className="text-gray-500 text-center mb-8 max-w-xs">
      Pesananmu telah berhasil dikonfirmasi.<br />
      Silakan cek email/SMS untuk info lebih lanjut atau hubungi pemilik barang.
    </p>
    <button
      onClick={onClose}
      className="px-8 py-3 bg-gradient-to-tr from-blue-600 to-blue-400 hover:scale-105 hover:shadow-xl text-white rounded-2xl font-bold transition-all duration-150 shadow-lg"
    >
      Kembali ke Booking
    </button>
    <style jsx>{`
      .animate-fade-in {
        animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both;
      }
      .animate-bounce-in {
        animation: bounce-in 0.7s cubic-bezier(.44,1.42,.73,1.19) both;
      }
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(32px);}
        to   { opacity: 1; transform: none;}
      }
      @keyframes bounce-in {
        0% { opacity: 0; transform: scale(.6);}
        60% { opacity: 1; transform: scale(1.08);}
        100% { transform: scale(1);}
      }
    `}</style>
  </div>
);

export default BookingSuccessScreen;
