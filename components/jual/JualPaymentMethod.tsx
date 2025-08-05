import React from "react";

interface JualPaymentMethodProps {
  payment: string;
  setPayment: (p: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const paymentMethods = [
  { key: "cod", label: "Bayar di Tempat (COD)" },
  { key: "transfer", label: "Transfer Bank" },
  { key: "qris", label: "QRIS" }
];

const JualPaymentMethod: React.FC<JualPaymentMethodProps> = ({
  payment,
  setPayment,
  onBack,
  onNext
}) => (
  <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-6 mx-auto">
    <h2 className="text-2xl font-extrabold mb-3">Metode Pembayaran</h2>
    <div className="flex flex-col gap-3">
      {paymentMethods.map(p => (
        <label key={p.key} className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            checked={payment === p.key}
            onChange={() => setPayment(p.key)}
            className="w-5 h-5 accent-blue-600"
          />
          <span className="text-lg font-semibold">{p.label}</span>
        </label>
      ))}
    </div>
    <div className="flex gap-2 mt-4">
      <button
        type="button"
        onClick={onBack}
        className="flex-1 bg-gray-200 text-gray-700 rounded-xl py-2 font-semibold hover:bg-gray-300"
      >
        Kembali
      </button>
      <button
        type="button"
        className="flex-1 bg-orange-600 text-white rounded-xl py-2 font-bold hover:bg-orange-700"
        onClick={onNext}
      >
        Konfirmasi & Pesan
      </button>
    </div>
  </div>
);

export default JualPaymentMethod;
