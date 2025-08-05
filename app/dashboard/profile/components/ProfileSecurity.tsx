// app/dashboard/profile/components/ProfileSecurity.tsx
"use client";
import React from "react";

export default function ProfileSecurity() {
  return (
    <section className="bg-white rounded-2xl shadow p-4 md:p-6 mb-8">
      <h2 className="text-lg font-bold text-blue-700 mb-3">Keamanan Akun</h2>
      <div className="flex flex-col gap-3">
        <button className="px-4 py-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold shadow border border-blue-100 transition">
          Ubah Password
        </button>
        {/* Tambah fitur lain: 2FA, dsb */}
      </div>
    </section>
  );
}
