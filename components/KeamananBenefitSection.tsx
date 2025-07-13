"use client";
import { ShieldCheck, CreditCard, Clock4, CheckCircle2 } from "lucide-react";

const benefits = [
  {
    icon: <ShieldCheck className="w-9 h-9 text-blue-600" />,
    title: "Barang Diasuransikan",
    desc: "Setiap transaksi dilindungi asuransi agar barang tetap aman selama masa sewa.",
  },
  {
    icon: <CreditCard className="w-9 h-9 text-green-600" />,
    title: "Pembayaran Aman",
    desc: "Pembayaran menggunakan sistem escrow, uang ditahan sampai barang diterima sesuai pesanan.",
  },
  {
    icon: <Clock4 className="w-9 h-9 text-yellow-500" />,
    title: "CS Fast Response",
    desc: "Customer service siap bantu kamu 24 jam, solusi cepat jika ada kendala sewa.",
  },
  {
    icon: <CheckCircle2 className="w-9 h-9 text-indigo-600" />,
    title: "Aman dari Penipuan",
    desc: "Setiap user & barang diverifikasi, transaksi terpantau & transparan.",
  },
];

export default function KeamananBenefitSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Keamanan & Benefit YooRent
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Kami selalu mengutamakan keamanan transaksi dan kenyamanan pengguna — baik penyewa maupun pemilik barang.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-blue-50/60 rounded-2xl p-8 flex flex-col items-center shadow hover:scale-105 transition-all duration-200 border border-blue-100">
              <div className="mb-3">{benefit.icon}</div>
              <div className="font-bold text-lg mb-1 text-gray-800">{benefit.title}</div>
              <div className="text-gray-600 text-sm text-center">{benefit.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
