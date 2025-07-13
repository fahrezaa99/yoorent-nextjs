"use client";
import { PackageCheck, Wallet2, Truck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: <PackageCheck className="w-10 h-10 text-blue-500" />,
    title: "Cari Barang",
    desc: "Temukan barang sewaan sesuai kebutuhanmu, dari gadget hingga properti.",
  },
  {
    icon: <Wallet2 className="w-10 h-10 text-green-500" />,
    title: "Booking & Bayar",
    desc: "Pesan barang dan lakukan pembayaran aman lewat YooRent.",
  },
  {
    icon: <Truck className="w-10 h-10 text-indigo-500" />,
    title: "Ambil / Diantar",
    desc: "Ambil sendiri atau pilih layanan antar ke lokasi kamu.",
  },
  {
    icon: <CheckCircle2 className="w-10 h-10 text-yellow-500" />,
    title: "Pakai & Kembalikan",
    desc: "Gunakan barang sewaannya, lalu kembalikan sesuai perjanjian.",
  },
];

export default function CaraKerjaSection() {
  return (
    <section id="carakerja" className="py-16 px-4 bg-blue-50/70">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Cara Kerja YooRent
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Proses sewa-menyewa di YooRent sangat mudah, aman, dan fleksibel baik untuk penyewa maupun pemilik barang!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center bg-white shadow-md rounded-2xl p-6 hover:scale-105 transition-all duration-200">
              <div className="mb-3">{step.icon}</div>
              <div className="font-bold text-lg mb-1 text-gray-800">{step.title}</div>
              <div className="text-gray-600 text-sm text-center">{step.desc}</div>
              <div className="text-sm text-blue-400 mt-3 font-bold">{`Step ${i + 1}`}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
