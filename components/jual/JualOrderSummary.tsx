import React from "react";

interface JualOrderSummaryProps {
  barang: {
    nama: string;
    lokasi: string;
    harga_beli: number;
    foto?: string[];
  };
  onNext: () => void;
}

const JualOrderSummary: React.FC<JualOrderSummaryProps> = ({ barang, onNext }) => (
  <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-4 mx-auto">
    <h2 className="text-2xl font-extrabold mb-3">Ringkasan Pembelian</h2>
    <div className="flex gap-4">
      <img
        src={barang.foto?.[0] || "/placeholder.png"}
        alt={barang.nama}
        className="w-24 h-24 rounded-xl object-cover bg-gray-100"
      />
      <div>
        <div className="font-semibold text-xl mb-1">{barang.nama}</div>
        <div className="text-gray-500 text-sm">{barang.lokasi}</div>
        <div className="text-orange-600 font-bold text-lg mt-3">
          Rp {barang.harga_beli?.toLocaleString("id-ID")}
        </div>
      </div>
    </div>
    <button
      className="w-full py-3 mt-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
      onClick={onNext}
    >
      Lanjutkan
    </button>
  </div>
);

export default JualOrderSummary;
