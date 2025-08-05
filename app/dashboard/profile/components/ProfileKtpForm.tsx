import { useState } from "react";

// Tambahkan tipe props
type ProfileKtpFormProps = {
  onSuccess?: () => void;
};

export default function ProfileKtpForm({ onSuccess }: ProfileKtpFormProps) {
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  // Tambahkan simulasi submit:
  const handleSubmit = () => {
    // ... logic upload dsb ...
    // Setelah berhasil:
    onSuccess && onSuccess();
  };

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-2xl shadow p-6 flex flex-col gap-4 mb-7">
      <div className="flex items-center gap-2 text-yellow-700 font-semibold text-base mb-2">
        <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20"><path d="M10 3a1 1 0 01.993.883L11 4v6a1 1 0 01-1.993.117L9 10V4a1 1 0 011-1zm0 12a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"/></svg>
        Belum Verifikasi KTP!
      </div>
      <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <div>
          <label className="block font-medium mb-1">Upload Foto KTP <span className="text-red-500">*</span></label>
          <input type="file" accept="image/*" onChange={e => setKtpFile(e.target.files?.[0] ?? null)} className="block w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">Upload Selfie dengan KTP <span className="text-red-500">*</span></label>
          <input type="file" accept="image/*" onChange={e => setSelfieFile(e.target.files?.[0] ?? null)} className="block w-full" />
        </div>
        <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded w-full">
          Lanjutkan Verifikasi
        </button>
      </form>
    </div>
  );
}
