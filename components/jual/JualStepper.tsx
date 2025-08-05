"use client";
import React, { useState } from "react";
import JualOrderSummary from "./JualOrderSummary";
import JualUserForm from "./JualUserForm";
import JualPaymentMethod from "./JualPaymentMethod";
import JualSuccessScreen from "./JualSuccessScreen";

// Contoh data barang, nanti terima dari props/page
const barangContoh = {
  nama: "iPhone 15 Pro Max",
  lokasi: "Jakarta Utara",
  harga_beli: 14980000,
  foto: ["/produk/iphone.jpg"]
};

const JualStepper: React.FC<{ barang?: any; onFinish?: () => void }> = ({ barang = barangContoh, onFinish }) => {
  const [step, setStep] = useState(0);
  const [buyer, setBuyer] = useState({ nama: "", alamat: "", telp: "" });
  const [payment, setPayment] = useState("cod");

  // Stepper bar UI
  const steps = ["Ringkasan", "Data Pembeli", "Pembayaran", "Sukses"];
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5faff] to-[#f0f6ff] flex flex-col items-center justify-center px-2 py-10">
      <div className="flex justify-center items-center gap-4 mb-8">
        {steps.map((s, idx) => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition
                ${step === idx
                ? "bg-blue-600 scale-110 shadow-lg"
                : step > idx
                  ? "bg-green-400"
                  : "bg-gray-300"
                }`}>
              {idx + 1}
            </div>
            {idx !== steps.length - 1 && (
              <div className={`w-10 h-1 rounded ${step > idx ? "bg-green-400" : "bg-gray-200"}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      {step === 0 && (
        <JualOrderSummary barang={barang} onNext={() => setStep(1)} />
      )}
      {step === 1 && (
        <JualUserForm
          onBack={() => setStep(0)}
          onSubmit={data => {
            setBuyer(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <JualPaymentMethod
          payment={payment}
          setPayment={setPayment}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <JualSuccessScreen
          onFinish={onFinish ? onFinish : () => window.location.href = "/"}
        />
      )}
    </div>
  );
};

export default JualStepper;
