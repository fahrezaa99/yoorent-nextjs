"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "Bagaimana cara menyewa barang di YooRent?",
    a: "Cari barang yang ingin disewa, klik 'Sewa Sekarang', lalu ikuti proses booking dan pembayaran aman di YooRent.",
  },
  {
    q: "Apakah transaksi di YooRent aman?",
    a: "Aman! Semua pembayaran memakai sistem escrow & barang diasuransikan. CS siap bantu 24 jam jika ada masalah.",
  },
  {
    q: "Apakah bisa menyewakan barang sendiri?",
    a: "Tentu! Klik tombol 'Gabung & Sewakan Barang', daftarkan barangmu, dan mulai dapatkan penghasilan tambahan.",
  },
  {
    q: "Bagaimana jika barang rusak atau hilang?",
    a: "Setiap transaksi didukung asuransi. Jika ada kerusakan/hilang, proses klaim bisa dibantu tim YooRent.",
  },
  {
    q: "Apa bisa sewa lebih dari 1 barang sekaligus?",
    a: "Bisa! Kamu dapat menambah lebih dari satu barang ke daftar booking sebelum checkout.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 bg-blue-50/70">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          FAQ - Pertanyaan Umum
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-blue-100 rounded-xl shadow overflow-hidden">
              <button
                className="w-full flex justify-between items-center px-5 py-4 focus:outline-none"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="font-semibold text-left text-gray-800">{faq.q}</span>
                {open === idx ? (
                  <ChevronUp className="w-6 h-6 text-blue-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-blue-500" />
                )}
              </button>
              {open === idx && (
                <div className="px-5 pb-4 text-gray-600">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
