import { useState, useEffect } from "react";

type Props = {
  userData: {
    nama?: string;
    hp?: string;
    email?: string;
    alamat?: string;
    catatan?: string;
  };
  setUserData: (data: any) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function SewaUserForm({
  userData = {},
  setUserData,
  onPrev,
  onNext,
}: Props) {
  const [touched, setTouched] = useState(false);

  // Set local form state dari userData prop jika berubah
  const [form, setForm] = useState({
    nama: userData.nama || "",
    hp: userData.hp || "",
    email: userData.email || "",
    alamat: userData.alamat || "",
    catatan: userData.catatan || "",
  });

  useEffect(() => {
    setForm({
      nama: userData.nama || "",
      hp: userData.hp || "",
      email: userData.email || "",
      alamat: userData.alamat || "",
      catatan: userData.catatan || "",
    });
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setUserData({ ...form, [name]: value }); // sync ke parent
  };

  const isValid =
    form.nama.trim() &&
    form.hp.trim() &&
    form.email.trim() &&
    form.alamat.trim();

  return (
    <form
      className="animate-fade-in bg-gradient-to-br from-blue-50 via-white to-slate-50 rounded-2xl shadow-xl px-6 py-8 w-full max-w-md mx-auto"
      onSubmit={e => {
        e.preventDefault();
        setTouched(true);
        if (isValid) onNext();
      }}
    >
      <h2 className="font-bold text-xl text-gray-900 mb-6 text-center">
        <span className="inline-flex items-center gap-2">
          <svg width="28" height="28" fill="none" className="text-blue-500" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Data Penyewa
        </span>
      </h2>
      <div className="grid gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="nama"
            placeholder="Masukkan nama lengkap"
            className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-400 transition ${!form.nama && touched ? "border-red-400" : ""}`}
            value={form.nama}
            onChange={handleChange}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Nomor HP/WA <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name="hp"
            placeholder="08xxxxxxxxxx"
            className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-400 transition ${!form.hp && touched ? "border-red-400" : ""}`}
            value={form.hp}
            onChange={handleChange}
            autoComplete="tel"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            placeholder="email@domain.com"
            className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-400 transition ${!form.email && touched ? "border-red-400" : ""}`}
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Lengkap <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="alamat"
            placeholder="Tulis alamat penjemputan/antar"
            className={`w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-400 transition ${!form.alamat && touched ? "border-red-400" : ""}`}
            value={form.alamat}
            onChange={handleChange}
            autoComplete="street-address"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Tambahan <span className="text-gray-400 font-normal">(opsional)</span></label>
          <textarea
            name="catatan"
            placeholder="Tulis catatan khusus jika ada"
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-300 min-h-[44px] resize-none transition"
            value={form.catatan}
            onChange={handleChange}
            rows={2}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-7">
        <button
          type="button"
          className="w-1/2 py-3 rounded-xl font-semibold border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 transition shadow"
          onClick={onPrev}
        >
          Kembali
        </button>
        <button
          type="submit"
          className={`w-1/2 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition shadow-lg active:scale-95 disabled:opacity-50 text-base ${!isValid ? "cursor-not-allowed" : ""}`}
          disabled={!isValid}
        >
          Lanjut Pembayaran
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-4 text-center">
        Semua data wajib diisi sesuai identitas.
      </div>
    </form>
  );
}
