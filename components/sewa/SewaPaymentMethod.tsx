import React, { useState } from "react";
import { CreditCard } from "lucide-react";

type Props = {
  paymentData: { method?: string };
  setPaymentData: (data: { method: string }) => void;
  onPrev: () => void;
  onPay: () => void;
  loading?: boolean;
};

const methods = [
  { label: "Bank Transfer (Virtual Account)", value: "bank" },
  { label: "QRIS (E-wallet/Bank Digital)", value: "qris" },
  { label: "Kartu Kredit/Debit", value: "card" },
];

const BookingPaymentMethod: React.FC<Props> = ({
  paymentData,
  setPaymentData,
  onPrev,
  onPay,
  loading,
}) => {
  const [touched, setTouched] = useState(false);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        setTouched(true);
        if (paymentData.method) onPay();
      }}
    >
      <h2 className="font-bold text-xl mb-4">Metode Pembayaran</h2>
      <div className="grid gap-4">
        {methods.map((m) => (
          <button
            key={m.value}
            type="button"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition text-left ${
              paymentData.method === m.value
                ? "border-blue-600 bg-blue-50 shadow"
                : "border-gray-200 bg-gray-50 hover:bg-blue-100"
            }`}
            onClick={() => setPaymentData({ method: m.value })}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-semibold">{m.label}</span>
          </button>
        ))}
      </div>
      {!paymentData.method && touched && (
        <div className="text-xs text-red-600 mt-2">
          Pilih salah satu metode pembayaran.
        </div>
      )}
      <div className="flex gap-2 mt-8">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 font-semibold"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={!paymentData.method || loading}
          className={`flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition ${
            !paymentData.method || loading
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
        >
          {loading ? "Memproses..." : "Bayar Sekarang"}
        </button>
      </div>
    </form>
  );
};

export default BookingPaymentMethod;
