'use client';
import { useState, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";

function formatRupiah(amount: number) {
  return "Rp " + (amount || 0).toLocaleString("id-ID");
}

export default function DetailBarang({
  barang,
}: {
  barang: {
    nama: string;
    lokasi: string;
    alamat?: string;
    kategori?: string;
    kondisi?: string;
    harga: number;
    hargaMinggu?: number;
    foto: string[];
    deskripsi?: string;
    syarat?: string[];
    asuransi?: boolean;
    owner?: { name?: string; rating?: number; total?: number }; // ← owner jadi optional
  };
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [agree, setAgree] = useState(false);
  const [showSyarat, setShowSyarat] = useState(false);
  const [syaratCentang, setSyaratCentang] = useState(false);
  const [syaratSudahScroll, setSyaratSudahScroll] = useState(false);
  const syaratRef = useRef<HTMLUListElement>(null);

  const dayCount =
    start && end
      ? Math.max(
          1,
          Math.ceil(
            (new Date(end).getTime() - new Date(start).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;
  const totalSewa = dayCount > 0 ? dayCount * barang.harga : 0;
  const feePlatform = Math.round(totalSewa * 0.1);
  const totalBayar = totalSewa + feePlatform;
  const [showSukses, setShowSukses] = useState(false);

  // Panel Booking
  const BookingPanel = (
    <div className="w-full md:max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:sticky md:top-28 z-10 mx-auto md:mx-0">
      {barang.asuransi && (
        <div className="flex items-center gap-2 mb-2">
          <FaCheckCircle className="text-green-600" size={20} />
          <span className="text-green-700 font-semibold text-sm">
            Barang ini diasuransikan
          </span>
        </div>
      )}
      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl font-bold text-blue-700">{formatRupiah(barang.harga)}</span>
        <span className="text-sm text-gray-400">/hari</span>
        {barang.hargaMinggu && (
          <span className="ml-auto text-gray-500">atau {formatRupiah(barang.hargaMinggu)}/minggu</span>
        )}
      </div>
      <div className="mb-2">
        <span className="block text-xs text-gray-500 mb-1">Lokasi Pengambilan</span>
        <span className="font-semibold text-gray-800">{barang.lokasi}</span>
      </div>
      <form
        className="space-y-3"
        onSubmit={e => {
          e.preventDefault();
          if (agree && start && end) {
            setShowSukses(true);
          }
        }}
      >
        <div>
          <label className="text-xs font-semibold text-gray-700">Rental Start</label>
          <input
            type="date"
            value={start}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => setStart(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700">Rental End</label>
          <input
            type="date"
            value={end}
            min={start || new Date().toISOString().split("T")[0]}
            onChange={e => setEnd(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="bg-blue-50 rounded-xl p-4 my-2">
          <div className="flex justify-between">
            <span>Harga Sewa ({dayCount} hari)</span>
            <span className="font-bold text-blue-700">{formatRupiah(totalSewa)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Fee Platform (10%)</span>
            <span className="font-bold text-yellow-600">{formatRupiah(feePlatform)}</span>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t font-bold text-lg">
            <span>Total Bayar</span>
            <span className="text-green-700">{formatRupiah(totalBayar)}</span>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-2 text-xs">
          <input
            type="checkbox"
            checked={agree}
            readOnly
            className="accent-blue-600 mt-1 w-5 h-5"
          />
          <span>
            Saya setuju dengan{" "}
            <button
              type="button"
              className="underline text-blue-500"
              onClick={() => setShowSyarat(true)}
            >
              Syarat & Ketentuan Sewa
            </button>
            .
          </span>
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold mt-3 text-lg hover:bg-orange-600 transition disabled:opacity-60"
          disabled={!agree || !start || !end}
        >
          SEWA SEKARANG
        </button>
        <button
          type="button"
          className="w-full py-3 mt-2 rounded-xl border border-blue-500 text-blue-700 font-semibold hover:bg-blue-50 transition"
          onClick={() => alert("Chat owner! (implementasikan fitur chat di sini)")}
        >
          CHAT PEMILIK
        </button>
        <div className="mt-3 text-xs text-gray-400 text-center">
          Owner: <b>{barang.owner?.name || "Unknown"}</b>
          {barang.owner?.rating && ` (${barang.owner.rating} ★`}
          {barang.owner?.total && `, ${barang.owner.total} reviews)`}
        </div>
      </form>
      {showSyarat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-700 text-xl"
              onClick={() => {
                setShowSyarat(false);
                setSyaratCentang(false);
                setSyaratSudahScroll(false);
              }}
              title="Tutup"
            >
              ×
            </button>
            <h3 className="font-bold text-lg mb-2">Syarat & Ketentuan Sewa</h3>
            <ul
              ref={syaratRef}
              onScroll={e => {
                const el = e.target as HTMLUListElement;
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
                  setSyaratSudahScroll(true);
                }
              }}
              className="text-xs list-disc pl-5 text-gray-700 space-y-1 max-h-64 overflow-y-auto"
            >
              {barang.syarat?.length
                ? barang.syarat.map((item, idx) => <li key={idx}>{item}</li>)
                : (
                  <>
                    <li>Booking sah setelah pembayaran penuh diterima YooRent.</li>
                    <li>Pembayaran melalui sistem YooRent. Tidak diperkenankan transfer langsung ke pemilik.</li>
                    <li>Barang wajib diambil/dikembalikan sesuai waktu & lokasi yang disepakati.</li>
                    <li>Penyewa wajib mengecek kondisi barang saat serah terima.</li>
                    <li>Barang harus dikembalikan dalam kondisi & kelengkapan semula.</li>
                    <li>Penyewa bertanggung jawab penuh atas barang selama masa sewa.</li>
                    <li>Kerusakan/kehilangan menjadi tanggung jawab penyewa & dikenakan biaya penggantian.</li>
                    <li>Jika diminta, penyewa wajib membayar deposit/jaminan.</li>
                    <li>Keterlambatan pengembalian: denda tarif normal/hari keterlambatan.</li>
                    <li>Keterlambatan &gt;2 hari tanpa konfirmasi = barang hilang, wajib ganti rugi.</li>
                    <li>Pembatalan &lt;24 jam sebelum mulai: refund 50%. &gt;24 jam: refund 90%.</li>
                    <li>Barang ini diasuransikan selama masa sewa. Klaim asuransi sesuai S&K & bukti valid.</li>
                    <li>Penyewa wajib mengupload identitas valid (KTP/SIM) saat booking.</li>
                    <li>Penyalahgunaan/kejahatan jadi tanggung jawab penyewa dan akan diproses hukum.</li>
                    <li>YooRent berhak memblokir akun jika ada pelanggaran S&K.</li>
                    <li>Booking berarti setuju seluruh S&K ini.</li>
                  </>
                )}
            </ul>
            <div className="flex items-start gap-2 mt-4 text-xs">
              <input
                type="checkbox"
                checked={syaratCentang}
                disabled={!syaratSudahScroll}
                onChange={e => setSyaratCentang(e.target.checked)}
                className="accent-blue-600 mt-1 w-5 h-5"
              />
              <span>
                Saya sudah membaca seluruh syarat & ketentuan di atas
              </span>
            </div>
            <button
              className="w-full mt-5 rounded-xl px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400"
              disabled={!syaratCentang}
              onClick={() => {
                setShowSyarat(false);
                setSyaratCentang(false);
                setSyaratSudahScroll(false);
                setAgree(true);
              }}
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
      {showSukses && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl px-8 py-10 text-center shadow-xl max-w-xs mx-auto">
            <FaCheckCircle className="mx-auto mb-2 text-green-600" size={44} />
            <div className="font-bold text-lg mb-2">Booking Berhasil!</div>
            <div className="text-sm text-gray-600 mb-4">Order kamu sudah kami terima.<br />Silakan cek notifikasi YooRent.</div>
            <button
              className="mt-3 w-full rounded-xl px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700"
              onClick={() => setShowSukses(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-36 md:pb-0">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-start gap-8 px-3 md:px-6 pt-8">
        <div className="flex-1 w-full">
          {/* Foto */}
          <div className="rounded-2xl bg-white overflow-hidden mb-5 aspect-square flex items-center justify-center shadow">
            <img
              src={barang.foto?.[0] || "/placeholder.jpg"}
              alt={barang.nama}
              className="object-contain w-full h-full"
              loading="lazy"
            />
          </div>
          <div className="mb-2">
            <div className="font-bold text-xl md:text-2xl mb-1">{barang.nama}</div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <span>📍 {barang.lokasi}</span>
              <span>{barang.alamat}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {barang.kategori && (
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">{barang.kategori}</span>
              )}
              {barang.kondisi && (
                <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Kondisi: {barang.kondisi}</span>
              )}
            </div>
            <span className="font-bold text-blue-700 text-lg">{formatRupiah(barang.harga)}</span>
            <span className="text-gray-400 text-sm">/hari</span>
          </div>
          {/* Deskripsi */}
          {barang.deskripsi && (
            <div className="mb-4">
              <div className="font-semibold">Deskripsi Barang</div>
              <div className="text-gray-800 text-sm">{barang.deskripsi}</div>
            </div>
          )}
          {/* S&K singkat */}
          <div className="mb-6">
            <div className="font-bold text-base">Syarat & Ketentuan Sewa</div>
            <ul className="list-disc pl-5 mt-1 text-gray-700 text-sm space-y-1">
              {barang.syarat?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <a href="/cari-barang" className="text-blue-600 underline text-sm">← Kembali ke Beranda</a>
        </div>
        <div className="hidden md:block">{BookingPanel}</div>
      </div>
      <div className="block md:hidden fixed left-0 bottom-0 w-full z-30 px-1 pb-safe">
        <div className="mx-auto max-w-md">{BookingPanel}</div>
      </div>
    </div>
  );
}
