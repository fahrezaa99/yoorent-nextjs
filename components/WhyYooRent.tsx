"use client";

export default function WhyYooRent() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-600/10 rounded-full px-4 py-2 mb-4">
            <span className="text-blue-600 font-medium">Mengapa YooRent?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Kenapa Harus Pilih YooRent?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Pengalaman sewa menyewa yang aman, mudah, dan menguntungkan untuk semua pihak
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <BoltIcon className="w-10 h-10 text-white" />
            }
            title="Penyewaan Super Cepat"
            desc="Booking dalam hitungan menit! Dengan sistem otomatis kami, Anda bisa langsung konfirmasi dan pakai barang yang diinginkan."
            highlight="Rata-rata 2 menit booking"
            color="blue-600"
          />

          <FeatureCard
            icon={
              <ShieldIcon className="w-10 h-10 text-white" />
            }
            title="Keamanan Terjamin"
            desc="Sistem escrow, asuransi barang, dan verifikasi identitas. Transaksi aman 100% dengan jaminan uang kembali jika ada masalah."
            highlight="Asuransi hingga 50 juta"
            color="green-600"
          />

          <FeatureCard
            icon={
              <WalletIcon className="w-10 h-10 text-white" />
            }
            title="Cuan Maksimal"
            desc="Barang nganggur jadi mesin uang! Owner rata-rata meraup 3-8 juta per bulan. Plus komisi rendah dan pembayaran otomatis."
            highlight="Komisi hanya 5%"
            color="purple-600"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  highlight,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  highlight: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
      <div
        className={`w-20 h-20 bg-${color}/80 rounded-2xl flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        {desc}
      </p>
      <div className={`flex items-center text-${color} font-medium`}>
        <span>{highlight}</span>
        <ArrowRightIcon className="w-4 h-4 ml-2" />
      </div>
    </div>
  );
}

// Simple Lucide-style icons
const BoltIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m4-5h-6a2 2 0 000 4h6a2 2 0 000-4z" />
  </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);
