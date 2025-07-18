"use client";
import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingForm() {
  // Dummy harga/hari, bisa di-pass via props nanti
  const pricePerDay = 50000;
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [nama, setNama] = useState<string>("");
  const [kontak, setKontak] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  // Hitung selisih hari
  const hitungHari = (): number => {
    if (!start || !end) return 0;
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24)) || 1;
    return days > 0 ? days : 0;
  };

  // Update total otomatis
  const days: number = hitungHari();
  const totalHarga: number = days * pricePerDay;

  // Validasi & Submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nama || !kontak || !start || !end) {
      alert("Semua data wajib diisi!");
      return;
    }
    setTotal(totalHarga);
    setModalOpen(true);
    // TODO: integrasi API booking di sini
  };

  return (
    <section className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20 pb-8 px-2">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold mb-2 text-blue-600">Form Booking / Sewa Barang</h2>
        <p className="mb-8 text-gray-600">Isi data dengan benar untuk melakukan booking.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold text-sm mb-2 block">Tanggal Sewa</label>
            <input
              type="date"
              value={start}
              onChange={e => setStart(e.target.value)}
              className="w-full rounded-xl border px-4 py-2 focus:border-blue-400 outline-none"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div>
            <label className="font-semibold text-sm mb-2 block">Tanggal Kembali</label>
            <input
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
              className="w-full rounded-xl border px-4 py-2 focus:border-blue-400 outline-none"
              min={start || new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm mb-2 block">Nama Lengkap</label>
              <input
                type="text"
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Nama penyewa"
                className="w-full rounded-xl border px-4 py-2 focus:border-blue-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-sm mb-2 block">No. WhatsApp / Email</label>
              <input
                type="text"
                value={kontak}
                onChange={e => setKontak(e.target.value)}
                placeholder="0812xxxx / email"
                className="w-full rounded-xl border px-4 py-2 focus:border-blue-400 outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-sm mb-2 block">Catatan (opsional)</label>
            <textarea
              value={catatan}
              onChange={e => setCatatan(e.target.value)}
              placeholder="Contoh: request antar, jam pengambilan, dll"
              className="w-full rounded-xl border px-4 py-2 focus:border-blue-400 outline-none min-h-[60px]"
            />
          </div>
          <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 mt-4">
            <div>
              <span className="text-sm text-gray-500">Harga / hari</span>
              <div className="font-bold text-blue-700 text-lg">Rp {pricePerDay.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Total Hari</span>
              <div className="font-bold text-blue-700 text-lg">{days} hari</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Total</span>
              <div className="font-bold text-green-600 text-xl">Rp {totalHarga.toLocaleString()}</div>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-green-400 to-blue-500 text-white font-bold py-3 mt-7 rounded-xl shadow hover:opacity-90 text-lg transition"
          >
            Booking Sekarang
          </motion.button>
        </form>
      </div>

      {/* MODAL sukses */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-xs w-full p-7 flex flex-col items-center"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-green-500 text-4xl mb-2">✅</div>
              <h3 className="font-bold text-2xl mb-2">Booking Berhasil!</h3>
              <p className="text-center text-gray-600 mb-3">
                Booking Anda sudah terekam.<br />
                Kami akan segera menghubungi Anda untuk konfirmasi.
              </p>
              <div className="bg-blue-50 rounded-xl p-3 mb-3 w-full">
                <div className="text-sm text-gray-500 mb-1">Total Booking</div>
                <div className="font-bold text-lg text-blue-700 mb-1">Rp {total.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Atas Nama: <span className="font-semibold">{nama}</span></div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-2 mt-2 bg-blue-600 text-white rounded-xl font-bold shadow hover:bg-blue-700 transition"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
