// app/dashboard/profile/components/ProfileDetail.tsx
"use client";
import { useState } from "react";

type Props = {
  nama: string;
  hp: string;
  alamat: string;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function ProfileDetail({ nama, hp, alamat, onChange, onSubmit, loading }: Props) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      className="bg-white rounded-2xl shadow p-6 md:p-8 flex flex-col gap-6 w-full max-w-xl mx-auto"
    >
      <h3 className="font-semibold text-xl text-gray-700 mb-2">Edit Data Profil</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-600">Nama Lengkap</label>
          <input
            name="nama"
            type="text"
            value={nama}
            onChange={e => onChange("nama", e.target.value)}
            placeholder="Nama lengkap"
            className="input w-full rounded-lg border-gray-300 focus:border-blue-400 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-600">Nomor HP/WA</label>
          <input
            name="hp"
            type="text"
            value={hp}
            onChange={e => onChange("hp", e.target.value)}
            placeholder="08xxx"
            className="input w-full rounded-lg border-gray-300 focus:border-blue-400 focus:ring-blue-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-600">Alamat Domisili</label>
          <input
            name="alamat"
            type="text"
            value={alamat}
            onChange={e => onChange("alamat", e.target.value)}
            placeholder="Jl. Contoh No.99"
            className="input w-full rounded-lg border-gray-300 focus:border-blue-400 focus:ring-blue-200"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
