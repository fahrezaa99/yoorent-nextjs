import React, { useState } from "react";
import { CheckCircle2, ArrowRight, CreditCard, User, X } from "lucide-react";
import SewaOrderSummary from "@/components/sewa/SewaOrderSummary";
import SewaUserForm from "@/components/sewa/SewaUserForm";
import SewaPaymentMethod from "@/components/sewa/SewaPaymentMethod";
import SewaSuccessScreen from "@/components/sewa/SewaSuccessScreen";

type OrderData = {
  item: string;
  price: number;
  location: string;
  startDate: string;
  endDate: string;
  totalBayar: number;
};

type Props = {
  orderData: OrderData;
  onClose: () => void;
};

const BookingStepper: React.FC<Props> = ({ orderData, onClose }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<any>({});
  const [paymentData, setPaymentData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1000);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xl p-0 md:p-0 overflow-hidden animate-fade-in">
      {/* Close Button */}
      <button
        className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 transition text-2xl z-20"
        onClick={onClose}
        aria-label="Tutup"
        type="button"
      >
        <X size={30} />
      </button>
      <div className="p-8 pb-0">
        <Stepper step={step} />
      </div>
      <div className="p-8 pt-3 pb-8">
        {step === 1 && (
          <SewaOrderSummary 
            orderData={orderData}
            onNext={() => setStep(2)}
            onClose={onClose}
          />
        )}
        {step === 2 && (
          <SewaUserForm 
            userData={userData}
            setUserData={setUserData}
            onPrev={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <SewaPaymentMethod 
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            onPrev={() => setStep(2)}
            onPay={handlePay}
            loading={loading}
          />
        )}
        {step === 4 && (
          <SewaSuccessScreen onClose={onClose} />
        )}
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(32px);}
          to   { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  );
};

const steps = [
  { label: "Ringkasan", icon: <ArrowRight className="w-5 h-5" /> },
  { label: "Data Penyewa", icon: <User className="w-5 h-5" /> },
  { label: "Pembayaran", icon: <CreditCard className="w-5 h-5" /> },
  { label: "Selesai", icon: <CheckCircle2 className="w-5 h-5" /> },
];

const Stepper = ({ step }: { step: number }) => (
  <div className="flex items-center justify-between gap-3 mb-6">
    {steps.map((s, i) => (
      <div key={s.label} className="flex flex-col items-center flex-1">
        <div className={`
          rounded-full w-11 h-11 flex items-center justify-center 
          shadow ${i + 1 <= step ? "bg-gradient-to-br from-blue-600 to-blue-400 text-white border-blue-500 border-2" : "bg-gray-100 text-gray-400 border border-gray-200"}
          transition-all duration-200
        `}>
          {s.icon}
        </div>
        <span className={`mt-2 text-xs font-bold tracking-wide ${i + 1 <= step ? "text-blue-700" : "text-gray-400"}`}>
          {s.label}
        </span>
      </div>
    ))}
  </div>
);

export default BookingStepper;
