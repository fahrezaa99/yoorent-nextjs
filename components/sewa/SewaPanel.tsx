import { useState, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import SewaStepper from "@/components/sewa/SewaStepper";

function formatRupiah(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}

export default function BookingPanelYooRent({
  namaBarang = "",
  hargaPerHari = 120000,
  hargaPerMinggu = 700000,
  lokasi = "Jakarta Selatan",
  kategori = "",
  fotoBarang = "",
  owner = { name: "Teguh A.", rating: 4.9, total: 22, foto: "" },
  onBook,
  onMessage,
}: {
  namaBarang?: string;
  hargaPerHari?: number;
  hargaPerMinggu?: number;
  lokasi?: string;
  kategori?: string;
  fotoBarang?: string;
  owner?: { name: string; rating?: number; total?: number; foto?: string };
  onBook?: () => void;
  onMessage?: () => void;
}) {
  // --- Tambahan state untuk stepper dan orderData ---
  const [showStepper, setShowStepper] = useState(false);
  const [orderData, setOrderData] = useState({
    item: namaBarang,
    price: hargaPerHari,
    location: lokasi,
    startDate: "",
    endDate: "",
    totalBayar: 0,
    kategori,
    fotoBarang,
    owner,
  });
  // --- END state ---

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [showSyarat, setShowSyarat] = useState(false);
  const [agree, setAgree] = useState(false);

  // S&K state
  const syaratRef = useRef<HTMLUListElement>(null);
  const [syaratCentang, setSyaratCentang] = useState(false);
  const [syaratSudahScroll, setSyaratSudahScroll] = useState(false);

  // Hitung hari sewa dan harga total
  const dayCount =
    start && end
      ? Math.max(
          1,
          Math.ceil(
            (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;
  const totalSewa = dayCount > 0 ? dayCount * hargaPerHari : 0;
  const feePlatform = Math.round(totalSewa * 0.1);
  const totalBayar = totalSewa + feePlatform;

  // Handler untuk buka stepper
  const handleSewaSekarang = () => {
    setOrderData({
      item: namaBarang,
      price: hargaPerHari,
      location: lokasi,
      startDate: start,
      endDate: end,
      totalBayar: totalBayar,
      kategori,
      fotoBarang,
      owner,
    });
    setShowStepper(true);
  };

  const handleCloseStepper = () => setShowStepper(false);

  // --- RENDER ---
  if (showStepper) {
    return (
      <SewaStepper 
        orderData={orderData}
        onClose={handleCloseStepper}
      />
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sticky top-28 z-10">
      <div className="flex items-center gap-2 mb-2">
        <FaCheckCircle className="text-green-600" size={20} />
        <span className="text-green-700 font-semibold text-sm">
          Barang ini diasuransikan
        </span>
      </div>
      <div className="flex items-end gap-4 mb-3">
        <span className="text-3xl font-bold text-blue-700">{formatRupiah(hargaPerHari)}</span>
        <span className="text-sm text-gray-400">/hari</span>
        <span className="ml-auto text-gray-500">atau {formatRupiah(hargaPerMinggu)}/minggu</span>
      </div>
      <div className="mb-2">
        <span className="block text-xs text-gray-500 mb-1">Lokasi Pengambilan</span>
        <span className="font-semibold text-gray-800">{lokasi}</span>
      </div>
      <form
        className="space-y-3"
        onSubmit={e => {
          e.preventDefault();
          if (agree && start && end) {
            handleSewaSekarang();
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
          onClick={onMessage || (() => alert("Chat owner! (implementasikan fitur chat di sini)"))}
        >
          CHAT PEMILIK
        </button>
        <div className="mt-3 text-xs text-gray-400 text-center">
          Owner: <b>{owner.name}</b> ({owner.rating} ★, {owner.total} reviews)
        </div>
      </form>
      {/* Modal Syarat & Ketentuan */}
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
              style={{ scrollbarGutter: "stable" }}
            >
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
              <li>Pembatalan <b>&lt;24 jam</b> sebelum mulai: refund 50%. &gt;24 jam: refund 90%.</li>
              <li>Barang ini diasuransikan selama masa sewa. Klaim asuransi sesuai S&K & bukti valid.</li>
              <li>Penyewa wajib mengupload identitas valid (KTP/SIM) saat booking.</li>
              <li>Penyalahgunaan/kejahatan jadi tanggung jawab penyewa dan akan diproses hukum.</li>
              <li>YooRent berhak memblokir akun jika ada pelanggaran S&K.</li>
              <li>Booking berarti setuju seluruh S&K ini.</li>
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
    </div>
  );
}
