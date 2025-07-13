"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingPopup({
  open,
  onClose,
  barang,
}: {
  open: boolean;
  onClose: () => void;
  barang: {
    nama: string;
    lokasi: string;
    harga: number;
    foto?: string;
  };
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [nama, setNama] = useState("");
  const [kontak, setKontak] = useState("");
  const [catatan, setCatatan] = useState("");
  const [ktp, setKtp] = useState<File | null>(null);
  const [syarat, setSyarat] = useState(false);
  const [success, setSuccess] = useState(false);

  const hitungHari = () => {
    if (!start || !end) return 0;
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24)) || 1;
    return days > 0 ? days : 0;
  };
  const totalHarga = hitungHari() * barang.harga;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!nama || !kontak || !start || !end) {
      alert("Semua data wajib diisi!");
      return;
    }
    if (!syarat) {
      alert("Anda harus menyetujui syarat & ketentuan!");
      return;
    }
    setSuccess(true);
    // TODO: Integrasi API booking & upload file
  };

  // Reset saat modal di-close
  const handleClose = () => {
    setSuccess(false);
    setStart("");
    setEnd("");
    setNama("");
    setKontak("");
    setCatatan("");
    setKtp(null);
    setSyarat(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99] bg-black/50 flex items-center justify-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-md px-0 py-0 border border-blue-100
            mx-0 sm:mx-0 
            flex flex-col
            max-h-[98dvh] sm:max-h-[90vh]
            "
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
          >
            <button
              className="absolute right-3 top-3 text-gray-400 hover:text-blue-700 text-2xl z-10"
              onClick={handleClose}
              aria-label="Tutup modal"
              type="button"
            >
              ×
            </button>
            <div className="flex flex-col overflow-y-auto max-h-[98dvh]">
              {!success ? (
                <>
                  {/* HEADER BARANG */}
                  <div className="flex items-center gap-3 p-4 pb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-green-400 rounded-t-2xl shadow-md">
                    <div className="w-12 h-12 bg-white border-4 border-white shadow rounded-xl overflow-hidden flex items-center justify-center">
                      {barang.foto && (
                        <img src={barang.foto} alt={barang.nama} className="w-full h-full object-cover rounded-lg" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-base text-white drop-shadow mb-0.5 truncate">{barang.nama}</div>
                      <div className="text-white/80 text-xs">{barang.lokasi}</div>
                      <div className="font-bold text-[15px] mt-1 text-yellow-300 drop-shadow">
                        Rp {barang.harga.toLocaleString("id-ID")}/<span className="text-xs">hari</span>
                      </div>
                    </div>
                  </div>
                  {/* FORM */}
                  <form onSubmit={handleSubmit} className="space-y-3 px-3 py-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-xs mb-1 block">Tanggal Sewa</label>
                        <input
                          type="date"
                          value={start}
                          onChange={e => setStart(e.target.value)}
                          className="w-full rounded-xl border px-3 py-2 focus:border-blue-400 outline-none text-xs"
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-xs mb-1 block">Tanggal Kembali</label>
                        <input
                          type="date"
                          value={end}
                          onChange={e => setEnd(e.target.value)}
                          className="w-full rounded-xl border px-3 py-2 focus:border-blue-400 outline-none text-xs"
                          min={start || new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-xs mb-1 block">Nama Lengkap</label>
                      <input
                        type="text"
                        value={nama}
                        onChange={e => setNama(e.target.value)}
                        placeholder="Nama penyewa"
                        className="w-full rounded-xl border px-3 py-2 focus:border-blue-400 outline-none text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-xs mb-1 block">No. WhatsApp / Email</label>
                      <input
                        type="text"
                        value={kontak}
                        onChange={e => setKontak(e.target.value)}
                        placeholder="0812xxxx / email"
                        className="w-full rounded-xl border px-3 py-2 focus:border-blue-400 outline-none text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-xs mb-1 block">Catatan (opsional)</label>
                      <textarea
                        value={catatan}
                        onChange={e => setCatatan(e.target.value)}
                        placeholder="Request jam/antar, dll"
                        className="w-full rounded-xl border px-3 py-2 focus:border-blue-400 outline-none text-xs min-h-[34px]"
                      />
                    </div>
                    {/* Upload KTP/SIM */}
                    <div>
                      <label className="font-semibold text-xs mb-1 block">Upload KTP/SIM <span className="text-gray-400">(opsional)</span></label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full rounded-xl border px-3 py-2 focus:border-blue-400 outline-none text-xs"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setKtp(e.target.files[0]);
                          }
                        }}
                      />
                      {ktp && (
                        <span className="text-xs text-gray-500 mt-1 block truncate">
                          File: {ktp.name}
                        </span>
                      )}
                    </div>
                    {/* Checkbox S&K */}
                    <div className="flex items-start mt-1">
                      <input
                        type="checkbox"
                        checked={syarat}
                        onChange={e => setSyarat(e.target.checked)}
                        required
                        className="mt-1 mr-2"
                      />
                      <span className="text-xs text-gray-600">
                        Saya menyetujui <a href="/syarat" target="_blank" className="text-blue-600 underline">syarat & ketentuan</a>
                      </span>
                    </div>
                    {/* Info keamanan */}
                    <div className="text-[10px] text-gray-400 mt-1">
                      Data Anda aman, tidak dibagikan ke pihak lain. Hanya untuk verifikasi booking.
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 rounded-xl px-3 py-2 mt-3">
                      <div className="mb-2 sm:mb-0">
                        <span className="text-[10px] text-gray-500">Total Hari</span>
                        <div className="font-bold text-blue-700 text-xs">{hitungHari()} hari</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500">Total</span>
                        <div className="font-bold text-green-600 text-base">Rp {totalHarga.toLocaleString()}</div>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 via-green-400 to-blue-500 text-white font-bold py-2 mt-4 rounded-xl shadow hover:opacity-90 text-base transition"
                    >
                      Booking Sekarang
                    </motion.button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  className="flex flex-col items-center px-4 py-8"
                >
                  <div className="text-green-500 text-4xl mb-2">✅</div>
                  <h3 className="font-bold text-xl mb-2 text-center">Booking Berhasil!</h3>
                  <p className="text-center text-gray-600 mb-3 text-sm">
                    Booking Anda sudah terekam.<br />
                    Kami akan segera menghubungi Anda.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-3 mb-3 w-full text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Booking</div>
                    <div className="font-bold text-base text-blue-700 mb-1">
                      Rp {totalHarga.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Atas Nama: <span className="font-semibold">{nama}</span></div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-full py-2 mt-2 bg-blue-600 text-white rounded-xl font-bold shadow hover:bg-blue-700 transition text-base"
                  >
                    Tutup
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
