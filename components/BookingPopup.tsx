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
    foto?: string | string[];
  };
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [nama, setNama] = useState("");
  const [kontak, setKontak] = useState("");
  const [syarat, setSyarat] = useState(false);
  const [success, setSuccess] = useState(false);

  const hitungHari = () => {
    if (!start || !end) return 0;
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24)) || 1;
    return days > 0 ? days : 0;
  };
  const totalHarga = hitungHari() * barang.harga;

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleClose = () => {
    setSuccess(false);
    setStart("");
    setEnd("");
    setNama("");
    setKontak("");
    setSyarat(false);
    onClose();
  };

  const fotoUtama = Array.isArray(barang.foto) ? barang.foto[0] : barang.foto;

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
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-md px-0 py-0 border border-blue-100 mx-0 sm:mx-0 flex flex-col max-h-[98dvh] sm:max-h-[90vh]"
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
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                  {/* HEADER BARANG */}
                  <div className="flex items-center gap-3 p-4 pb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-green-400 rounded-t-2xl shadow-md">
                    <div className="w-12 h-12 bg-white border-4 border-white shadow rounded-xl overflow-hidden flex items-center justify-center">
                      {fotoUtama && (
                        <img
                          src={fotoUtama}
                          alt={barang.nama}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-base text-white drop-shadow mb-0.5 truncate">
                        {barang.nama}
                      </div>
                      <div className="text-white/80 text-xs">
                        {barang.lokasi}
                      </div>
                      <div className="font-bold text-[15px] mt-1 text-yellow-300 drop-shadow">
                        Rp {barang.harga.toLocaleString("id-ID")}/
                        <span className="text-xs">hari</span>
                      </div>
                    </div>
                  </div>
                  {/* ➕ Tambah form input di sini kalau mau */}
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  className="flex flex-col items-center px-4 py-8"
                >
                  <div className="text-green-500 text-4xl mb-2">✅</div>
                  <h3 className="font-bold text-xl mb-2 text-center">
                    Booking Berhasil!
                  </h3>
                  <p className="text-center text-gray-600 mb-3 text-sm">
                    Booking Anda sudah terekam.
                    <br />
                    Kami akan segera menghubungi Anda.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-3 mb-3 w-full text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      Total Booking
                    </div>
                    <div className="font-bold text-base text-blue-700 mb-1">
                      Rp {totalHarga.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Atas Nama:{" "}
                      <span className="font-semibold">{nama}</span>
                    </div>
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
