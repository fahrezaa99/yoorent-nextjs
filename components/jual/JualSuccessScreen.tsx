import React from "react";

interface JualSuccessScreenProps {
  onFinish?: () => void;
}

const JualSuccessScreen: React.FC<JualSuccessScreenProps> = ({ onFinish }) => (
  <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center gap-4 mx-auto">
    <div className="rounded-full bg-green-100 p-6 mb-2">
      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    </div>
    <h2 className="text-2xl font-extrabold text-green-700 mb-2">Pembelian Berhasil!</h2>
    <p className="text-gray-500 text-center">
      Pesanan kamu sudah dicatat.<br />
      Penjual akan segera menghubungi kamu untuk proses selanjutnya.
    </p>
    <button
      className="mt-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
      onClick={onFinish}
    >
      Kembali ke Beranda
    </button>
  </div>
);

export default JualSuccessScreen;
