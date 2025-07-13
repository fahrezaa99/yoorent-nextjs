"use client";

export default function Hero() {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-green-600/5 to-purple-600/5" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-green-600/10 to-purple-600/10" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-white/20">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              🎉 Lebih dari 50,000 pengguna aktif
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Platform Sewa Menyewa
            <span className="block bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
              Terlengkap di Indonesia
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Dari kamera professional hingga alat camping, dari drone hingga sound
            system. Temukan apapun yang Anda butuhkan atau sewakan barang Anda
            untuk mendapatkan penghasilan tambahan.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-2xl transform hover:-translate-y-1">
              Mulai Sewakan & Raup Cuan
            </button>
            <button className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600">
              Jelajahi Barang Sewa
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <FloatingStat value="50K+" label="Pengguna Aktif" color="from-blue-600 via-green-600 to-purple-600" />
          <FloatingStat value="100K+" label="Barang Tersedia" color="from-blue-600 via-green-600 to-purple-600" />
          <FloatingStat value="25+" label="Kota di Indonesia" color="from-blue-600 via-green-600 to-purple-600" />
          <FloatingStat value="99.5%" label="Kepuasan User" color="from-blue-600 via-green-600 to-purple-600" />
        </div>
      </div>

      {/* Floating shapes */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-600/20 rounded-full animate-bounce" />
      <div
        className="absolute top-1/3 right-10 w-16 h-16 bg-green-600/20 rounded-full animate-bounce"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-purple-600/20 rounded-full animate-bounce"
        style={{ animationDelay: "2s" }}
      />
    </section>
  );
}

function FloatingStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
      <div
        className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}
      >
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
    </div>
  );
}
