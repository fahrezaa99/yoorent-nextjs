"use client";
import { FaWallet, FaBoxOpen, FaCartArrowDown, FaStar, FaBell, FaPlus, FaSearch, FaListAlt, FaCommentDots, FaMoneyBillWave, FaBoxes, FaCheck, FaCrown, FaChartPie, FaGift } from "react-icons/fa";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { useRole } from "@/components/common/RoleContext";

// Data dummy bisa diganti dengan fetch dari backend
const penyewaChart = [
  { name: "Jan", sewa: 3 }, { name: "Feb", sewa: 5 }, { name: "Mar", sewa: 2 }, { name: "Apr", sewa: 7 }, { name: "Mei", sewa: 6 }, { name: "Jun", sewa: 8 },
];
const pemilikChart = [
  { name: "Jan", penghasilan: 600 }, { name: "Feb", penghasilan: 1200 }, { name: "Mar", penghasilan: 900 }, { name: "Apr", penghasilan: 1700 }, { name: "Mei", penghasilan: 1400 }, { name: "Jun", penghasilan: 2000 },
];

const aktivitasPenyewa = [
  { icon: <FaCartArrowDown className="text-blue-500" />, text: "Sewa barang 'Canon EOS' berhasil.", time: "2 jam lalu" },
  { icon: <FaMoneyBillWave className="text-green-500" />, text: "Pembayaran untuk 'Tenda Camping' diterima.", time: "5 jam lalu" },
  { icon: <FaCheck className="text-green-500" />, text: "Barang 'Tenda Camping' dikembalikan.", time: "1 hari lalu" },
  { icon: <FaBell className="text-indigo-500" />, text: "Promo Referral: Sewa 2 gratis 1!", time: "2 hari lalu" },
];
const aktivitasPemilik = [
  { icon: <FaBoxOpen className="text-orange-500" />, text: "Barang 'Kamera Fuji' baru saja disewa.", time: "1 jam lalu" },
  { icon: <FaCheck className="text-green-500" />, text: "Barang 'Kamera Fuji' dikembalikan.", time: "6 jam lalu" },
  { icon: <FaStar className="text-yellow-400" />, text: "Dapat review 5⭐ dari Rini.", time: "2 hari lalu" },
  { icon: <FaBell className="text-indigo-500" />, text: "Promo Komisi 0% untuk pemilik aktif!", time: "3 hari lalu" },
];

const kategoriPopuler = [
  { icon: <FaCrown className="text-yellow-500" />, label: "Elektronik", jumlah: 12 },
  { icon: <FaBoxOpen className="text-blue-500" />, label: "Camping", jumlah: 8 },
  { icon: <FaChartPie className="text-pink-400" />, label: "Musik", jumlah: 6 },
  { icon: <FaGift className="text-green-500" />, label: "Alat Pesta", jumlah: 4 },
];

export default function DashboardSection() {
  const { role } = useRole();

  // Data sesuai role
  const stats =
    role === "penyewa"
      ? [
          { icon: <FaCartArrowDown className="text-blue-600 w-8 h-8 opacity-30 absolute right-2 top-2" />, title: "Transaksi Berhasil", value: "12", color: "from-blue-50", bgicon: <FaCartArrowDown className="text-blue-200 absolute right-3 bottom-2 text-5xl opacity-10" /> },
          { icon: <FaBoxOpen className="text-green-600 w-8 h-8 opacity-30 absolute right-2 top-2" />, title: "Barang Disewa", value: "4", color: "from-green-50", bgicon: <FaBoxOpen className="text-green-200 absolute right-3 bottom-2 text-5xl opacity-10" /> },
          { icon: <FaWallet className="text-indigo-600 w-8 h-8 opacity-30 absolute right-2 top-2" />, title: "Saldo Sewa", value: "Rp 150.000", color: "from-indigo-50", bgicon: <FaWallet className="text-indigo-200 absolute right-3 bottom-2 text-5xl opacity-10" /> },
          { icon: <FaStar className="text-yellow-400 w-8 h-8 opacity-30 absolute right-2 top-2" />, title: "Rating Diberikan", value: "4.7", color: "from-yellow-50", bgicon: <FaStar className="text-yellow-200 absolute right-3 bottom-2 text-5xl opacity-10" /> },
        ]
      : [
          { icon: <FaWallet className="text-blue-600 w-8 h-8 opacity-30 absolute right-2 top-2" />, title: "Pendapatan Bulan Ini", value: "Rp 2.400.000", color: "from-blue-50", bgicon: <FaWallet className="text-blue-200 absolute right-3 bottom-2 text-5xl opacity-10" /> },
          { icon: <FaBoxes className="text-orange-500 w-8 h-8 opacity-30 absolute right-2 top-2" />, title: "Barang Disewakan", value: "8", color: "from-orange-50", bgicon: <FaBoxes className="text-orange-200 absolute right-3 bottom-2 text-5xl opacity-10" /> },
          { icon: <FaCartArrowDown className="text-green-600 w-8 h-8 opacity-30 absolute right-2 top-2" />, title: "Sewa Aktif", value: "3", color: "from-green-50", bgicon: <FaCartArrowDown className="text-green-200 absolute right-3 bottom-2 text-5xl opacity-10" /> },
          { icon: <FaStar className="text-yellow-400 w-8 h-8 opacity-30 absolute right-2 top-2" />, title: "Rating Pemilik", value: "4.9", color: "from-yellow-50", bgicon: <FaStar className="text-yellow-200 absolute right-3 bottom-2 text-5xl opacity-10" /> },
        ];

  const quickActions =
    role === "penyewa"
      ? [
          { icon: <FaSearch />, label: "Cari Barang", onClick: () => window.location.href = "/cari-barang" },
          { icon: <FaListAlt />, label: "Riwayat Sewa", onClick: () => window.location.href = "/dashboard/sewa" },
          { icon: <FaWallet />, label: "Top Up", onClick: () => alert("Top Up coming soon") },
          { icon: <FaCommentDots />, label: "Chat Bantuan", onClick: () => window.location.href = "/dashboard/support" },
        ]
      : [
          { icon: <FaPlus />, label: "Tambah Barang", onClick: () => window.location.href = "/dashboard/barang/tambah" },
          { icon: <FaListAlt />, label: "Riwayat Disewakan", onClick: () => window.location.href = "/dashboard/disewakan" },
          { icon: <FaWallet />, label: "Tarik Dana", onClick: () => alert("Tarik dana coming soon") },
          { icon: <FaBoxes />, label: "Kelola Barang", onClick: () => window.location.href = "/dashboard/barang" },
        ];

  const chartData = role === "penyewa" ? penyewaChart : pemilikChart;
  const chartKey = role === "penyewa" ? "sewa" : "penghasilan";
  const chartLabel = role === "penyewa" ? "Statistik Sewa 6 Bulan Terakhir" : "Pendapatan 6 Bulan Terakhir";
  const aktivitas = role === "penyewa" ? aktivitasPenyewa : aktivitasPemilik;

  // Dummy donut progress, bisa ganti data sesuai kebutuhan
  const donutData = [
    { name: "Done", value: 80 },
    { name: "Sisa", value: 20 }
  ];
  const donutColors = ["#2563eb", "#dbeafe"];
  const donutLabel = role === "penyewa" ? "Target Sewa Bulan Ini" : "Target Penghasilan Bulan Ini";

  // Personalized greeting dan banner promo
  const namaUser = "Hani"; // Ganti dari session/user kalau ada
  const greeting = role === "penyewa"
    ? `Selamat datang kembali, ${namaUser}! Siap eksplor barang baru hari ini?`
    : `Welcome, ${namaUser}! Yuk optimalkan penghasilan sewamu.`;

  const bannerPromo = role === "penyewa"
    ? "🔥 Promo Referral: Sewa 2 gratis 1! Ajak teman, dapatkan bonus saldo."
    : "🎉 Komisi 0% bulan ini untuk pemilik aktif. Upload barang, dapatkan ekstra reward!";

  return (
    <motion.div className="flex flex-col gap-6 w-full" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      {/* Banner promo */}
      <motion.div className="w-full bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow p-3 text-blue-800 font-bold text-sm flex items-center gap-2 mb-2">
        <span className="animate-pulse">{role === "penyewa" ? "🔥" : "🎉"}</span>
        <span>{bannerPromo}</span>
      </motion.div>
      {/* Greeting */}
      <div className="text-xl md:text-2xl font-bold text-blue-900 mt-1 mb-3">{greeting}</div>
      {/* Card statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} className={`relative bg-white rounded-2xl shadow-xl p-5 min-w-[130px] overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition duration-200 group`}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 + i * 0.08 }}>
            <span className="absolute right-2 top-2">{stat.icon}</span>
            <span className="absolute right-3 bottom-2 opacity-20">{stat.bgicon}</span>
            <div className="z-10 pr-8">
  <div className="text-2xl md:text-3xl font-bold text-blue-900">{stat.value}</div>
  <div className="font-semibold text-blue-950 text-base">{stat.title}</div>
</div>
          </motion.div>
        ))}
      </div>
      {/* Progress & donut */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-blue-900">{chartLabel}</h3>
          </div>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: "#2563eb", fontWeight: 600, fontSize: 13 }} />
                <Tooltip />
                <Bar dataKey={chartKey} fill="#2563eb" radius={[8, 8, 0, 0]} barSize={28} isAnimationActive animationDuration={900} animationBegin={200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Donut/Progress */}
        <div className="w-full md:w-56 flex flex-col justify-center items-center bg-white rounded-2xl shadow-lg p-5 gap-3">
          <div className="font-bold text-blue-800 mb-1">{donutLabel}</div>
          <PieChart width={120} height={120}>
            <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={38} outerRadius={55} startAngle={90} endAngle={-270}>
              {donutData.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={donutColors[idx]} />
              ))}
            </Pie>
          </PieChart>
          <div className="font-bold text-2xl text-blue-900">{donutData[0].value}%</div>
          <div className="text-xs text-gray-500">{role === "penyewa" ? "Sewa target tercapai!" : "Penghasilan target bulan ini"}</div>
        </div>
      </div>
      {/* Quick action */}
      <div className="flex flex-wrap gap-3 items-center">
        {quickActions.map((a, idx) => (
          <button
            key={idx}
            onClick={a.onClick}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-blue-700 active:scale-95 transition-all duration-150 text-sm"
          >
            <span className="text-base">{a.icon}</span>
            {a.label}
          </button>
        ))}
      </div>
      {/* Aktivitas terbaru */}
      <motion.div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3"
        initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-blue-900">Aktivitas Terbaru</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {aktivitas.map((a, idx) => (
            <motion.li key={idx} className="flex items-start gap-3 text-sm text-gray-700"
              initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.11 * idx }}>
              <span>{a.icon}</span>
              <span className="flex-1">{a.text}</span>
              <span className="text-gray-400 text-xs">{a.time}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      {/* Kategori Populer */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h4 className="font-bold text-blue-900 mb-2">Kategori Barang Paling Populer</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kategoriPopuler.map((kat, idx) => (
            <div key={kat.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100 transition cursor-pointer group">
              <div className="text-3xl">{kat.icon}</div>
              <div className="font-semibold text-blue-800">{kat.label}</div>
              <span className="text-xs text-gray-500">{kat.jumlah} barang</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
