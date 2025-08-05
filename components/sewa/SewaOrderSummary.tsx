import React from "react";
import { Star } from "lucide-react";
import Image from "next/image";

type Owner = {
  name: string;
  rating?: number;
  totalReview?: number;
  foto?: string;
};

type OrderData = {
  item: string;
  price: number;
  location: string;
  startDate: string;
  endDate: string;
  totalBayar: number;
  kategori?: string;
  fotoBarang?: string;
  owner?: Owner;
  hariSewa?: number;
  feePlatform?: number;
};

type Props = {
  orderData: OrderData;
  onNext: () => void;
  onClose: () => void;
};

const BookingOrderSummary: React.FC<Props> = ({ orderData, onNext, onClose }) => {
  // Helper format tanggal ke “27 Jul 2025 (Senin)”
  const formatTanggal = (tgl: string) => {
    if (!tgl) return "-";
    const d = new Date(tgl);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "long"
    });
  };
  const formatRupiah = (v: number) =>
    "Rp " + (v || 0).toLocaleString("id-ID");

  // Hitung hari sewa (default 1 jika tanggal sama)
  const hari =
    orderData.hariSewa ||
    (orderData.startDate && orderData.endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(orderData.endDate).getTime() -
              new Date(orderData.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 1);

  const feePlatform =
    typeof orderData.feePlatform === "number"
      ? orderData.feePlatform
      : Math.round(orderData.price * hari * 0.1);
  const hargaSewa = orderData.price * hari;
console.log("FOTO BARANG =", orderData.fotoBarang);

  // Responsive card, subtle gradient
  return (
    <div className="animate-fade-in">
      {/* Card utama */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50 rounded-2xl shadow p-4 px-4 sm:px-6 mb-4">
        <div className="flex items-center gap-4">
          {/* Foto barang */}
          <div className="min-w-[54px] min-h-[54px] flex items-center justify-center rounded-xl bg-white border border-blue-100 shadow-sm">
            {orderData.fotoBarang ? (
              <img
                src={orderData.fotoBarang}
                alt={orderData.item}
                className="w-12 h-12 object-cover rounded-lg"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="font-bold text-base text-gray-900">{orderData.item}</div>
              {orderData.kategori && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded font-bold">
                  {orderData.kategori}
                </span>
              )}
            </div>
            <div className="text-xs text-blue-700 font-semibold">{orderData.location}</div>
            {orderData.owner && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                {/* Owner photo (optional) */}
                {orderData.owner.foto && (
                  <img
                    src={orderData.owner.foto}
                    alt={orderData.owner.name}
                    className="w-5 h-5 rounded-full object-cover border"
                  />
                )}
                <span>{orderData.owner.name}</span>
                {orderData.owner.rating && (
                  <>
                    <Star className="w-3.5 h-3.5 text-yellow-400 ml-1" />
                    <span className="text-yellow-500 font-bold">
                      {orderData.owner.rating}
                    </span>
                    {orderData.owner.totalReview && (
                      <span className="ml-1 text-gray-300">
                        ({orderData.owner.totalReview})
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Divider */}
        <hr className="my-4 border-blue-100" />
        {/* Detail tanggal */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm mb-2">
          <span className="text-gray-500">Tanggal Sewa</span>
          <span className="font-semibold text-gray-700">
            {formatTanggal(orderData.startDate)} - {formatTanggal(orderData.endDate)}
          </span>
        </div>
        {/* Rincian biaya */}
        <div className="grid grid-cols-1 gap-1 text-sm mb-2">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Harga Sewa ({hari} hari)
            </span>
            <span className="font-medium text-blue-700">
              {formatRupiah(hargaSewa)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fee Platform (10%)</span>
            <span className="font-medium text-gray-500">
              {formatRupiah(feePlatform)}
            </span>
          </div>
        </div>
        {/* Divider & total */}
        <div className="py-2" />
        <div className="flex justify-between items-center bg-blue-100 rounded-xl px-4 py-3 mt-1 shadow-inner">
          <span className="font-bold text-base text-blue-900 tracking-tight">
            Total Bayar
          </span>
          <span className="text-blue-700 text-2xl font-black drop-shadow">
            {formatRupiah(hargaSewa + feePlatform)}
          </span>
        </div>
      </div>
      {/* Button Layer */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 font-semibold transition-all"
        >
          Batal
        </button>
        <button
          type="button"
          className="flex-1 py-3 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-xl font-bold hover:scale-[1.04] hover:shadow-lg transition-all duration-150"
          onClick={onNext}
        >
          Lanjut
        </button>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(28px);}
          to   { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
};

export default BookingOrderSummary;
