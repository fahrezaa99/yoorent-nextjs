"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import SewaKtpForm from "@/components/sewa/SewaKtpForm";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [barang, setBarang] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ tanggal: "", durasi: 1 });
  const [penyewa, setPenyewa] = useState<any>(null); // hasil submit KTP form
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // 1. Cek user login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      // 2. Ambil profile user
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, nama, is_verified")
        .eq("id", user.id)
        .single();
      setUser(profile);

      // 3. Fetch barang detail
      const { data: barang } = await supabase
        .from("barang")
        .select("id, nama, harga, foto, owner_id")
        .eq("id", params.id)
        .single();
      setBarang(barang);

      setLoading(false);
    }
    fetchData();
  }, [params.id, router]);

  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;

  // Stepper UI (optional, bisa diganti style lain)
  const steps = [
    "Pilih Barang & Tanggal",
    "Data Penyewa",
    "Pembayaran",
    "Selesai",
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-4 md:p-8 my-10">
      {/* Stepper */}
      <div className="flex items-center mb-8">
        {steps.map((label, idx) => (
          <div key={label} className="flex items-center w-full">
            <div className={`rounded-full border-2 ${step === idx + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-gray-200 text-gray-500'} w-8 h-8 flex items-center justify-center font-bold`}>
              {idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-1 ${step > idx + 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Pilih barang & tanggal */}
      {step === 1 && (
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <img src={barang?.foto?.[0] || "/file.svg"} alt={barang?.nama} className="w-full md:w-48 h-40 object-cover rounded-xl border" />
            <div>
              <h2 className="text-xl font-bold">{barang?.nama}</h2>
              <div className="text-blue-700 font-bold text-lg mt-1 mb-2">
                {barang?.harga && "Rp " + barang.harga.toLocaleString("id-ID") + "/hari"}
              </div>
            </div>
          </div>
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              if (!form.tanggal || !form.durasi) return;
              setStep(2);
            }}
          >
            <div>
              <label className="block font-medium mb-1">Tanggal Sewa</label>
              <input
                type="date"
                className="w-full border rounded-lg p-2"
                min={new Date().toISOString().split("T")[0]}
                value={form.tanggal}
                onChange={e => setForm({ ...form, tanggal: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Durasi (hari)</label>
              <input
                type="number"
                min={1}
                max={30}
                className="w-full border rounded-lg p-2"
                value={form.durasi}
                onChange={e => setForm({ ...form, durasi: Number(e.target.value) })}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-bold mt-2 transition"
            >
              Lanjutkan
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Data Penyewa (cek sudah upload KTP atau belum) */}
      {step === 2 && (
        <div>
          {/* Cek: Jika user belum is_verified, wajib isi KTP form */}
          {!user?.is_verified ? (
            <div>
              <SewaKtpForm onSubmit={() => setStep(3)} />
              <div className="text-sm text-gray-500 mt-4">
                <b>Note:</b> Upload KTP & selfie wajib sebelum lanjut!
              </div>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                setStep(3);
              }}
            >
              <div>
                <label className="block font-medium mb-1">Nama Lengkap</label>
                <input type="text" className="input w-full" value={user.nama} disabled />
              </div>
              {/* Bisa tambahkan field lain jika mau */}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-bold mt-2 transition">
                Lanjut ke Pembayaran
              </button>
            </form>
          )}
        </div>
      )}

      {/* Step 3: Pembayaran */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-xl font-bold mb-2 text-center text-blue-700">Pembayaran</div>
          {/* --- Ganti komponen pembayaran aslinya sesuai kebutuhan --- */}
          <div className="bg-blue-50 rounded p-4 mb-2 text-center">
            <div>
              Total: <span className="text-lg font-bold text-blue-700">{"Rp " + (barang?.harga * form.durasi).toLocaleString("id-ID")}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">Pembayaran via transfer / QRIS / dll</div>
          </div>
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-bold mt-2 transition"
            onClick={() => setStep(4)}
          >
            Saya Sudah Bayar
          </button>
        </div>
      )}

      {/* Step 4: Selesai */}
      {step === 4 && (
        <div className="text-center py-10">
          <div className="text-2xl mb-2 font-bold text-green-700">Sewa Selesai!</div>
          <div className="mb-5 text-gray-700">
            Terima kasih, booking kamu sudah terekam.<br />
            Silakan cek dashboard untuk status transaksi.
          </div>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold" onClick={() => router.push("/dashboard")}>
            Kembali ke Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
