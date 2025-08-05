import React, { useState } from "react";

interface JualUserFormProps {
  onSubmit: (data: { nama: string; alamat: string; telp: string }) => void;
  onBack: () => void;
}

const JualUserForm: React.FC<JualUserFormProps> = ({ onSubmit, onBack }) => {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telp, setTelp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nama, alamat, telp });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 flex flex-col gap-4 mx-auto">
      <h2 className="text-2xl font-extrabold mb-3">Data Pembeli</h2>
      <div>
        <label className="font-semibold block mb-1">Nama Lengkap</label>
        <input
          type="text"
          value={nama}
          onChange={e => setNama(e.target.value)}
          required
          className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div>
        <label className="font-semibold block mb-1">Alamat Pengiriman</label>
        <textarea
          value={alamat}
          onChange={e => setAlamat(e.target.value)}
          required
          rows={2}
          className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div>
        <label className="font-semibold block mb-1">No. HP/Whatsapp</label>
        <input
          type="text"
          value={telp}
          onChange={e => setTelp(e.target.value)}
          required
          className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 rounded-xl py-2 font-semibold hover:bg-gray-300"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white rounded-xl py-2 font-bold hover:bg-blue-700"
        >
          Lanjutkan
        </button>
      </div>
    </form>
  );
};

export default JualUserForm;
