interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}
export default function LoginModal({ show, onClose }: LoginModalProps) {
  if (!show) return null;
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white max-w-xs w-full rounded-2xl p-6 text-center shadow-xl">
        <h3 className="font-bold text-xl mb-3">Login Dulu</h3>
        <p className="text-gray-500 mb-6">
          Untuk menyewa barang, silakan login terlebih dahulu.
        </p>
        <a
          href="/masuk"
          className="inline-block w-full rounded-xl px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 mb-3"
        >
          Login / Daftar
        </a>
        <button
          className="w-full rounded-xl px-4 py-2 bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300"
          onClick={onClose}
        >
          Batal
        </button>
      </div>
    </div>
  );
}
