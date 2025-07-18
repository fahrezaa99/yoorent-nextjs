"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;

const emptyForm = {
  nama: "",
  kategori: "",
  lokasi: "",
  harga: "",
  kondisi: "",
  status: "",
};

export default function DaftarBarangPage() {
  const [barangs, setBarangs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [lightbox, setLightbox] = useState<{ urls: string[]; index: number } | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [formId, setFormId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [notif, setNotif] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Cek user login di awal
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };
    getUser();
    // Listen auth change (biar gak error pas logout/login)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // ==== INI BAGIAN PENTING: hanya fetch barang milik user login ====
  const fetchBarangs = async () => {
    setLoading(true);
    if (!user) return; // User harus ada!
    const { data, error } = await supabase
      .from("barang")
      .select("*")
      .eq("user_id", user.id) // FILTER berdasarkan user yang login!
      .order("created_at", { ascending: false });
    if (!error && data) setBarangs(data);
    setLoading(false);
  };

  useEffect(() => {
    if (user !== null) fetchBarangs();
  }, [user]);

  const handleEdit = (item: any) => {
    setFormId(item.id);
    setForm({
      nama: item.nama,
      kategori: item.kategori,
      lokasi: item.lokasi,
      harga: item.harga,
      kondisi: item.kondisi,
      status: item.status,
    });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!formId) return;
    setLoading(true);
    const { error } = await supabase.from("barang").update(form).eq("id", formId);
    if (error) {
      setNotif({ type: "error", msg: "Gagal update barang!" });
    } else {
      setNotif({ type: "success", msg: "Barang berhasil diupdate!" });
      setEditOpen(false);
      fetchBarangs();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    const { error } = await supabase.from("barang").delete().eq("id", deleteId);
    if (error) {
      setNotif({ type: "error", msg: "Gagal menghapus barang!" });
    } else {
      setNotif({ type: "success", msg: "Barang dihapus!" });
      setDeleteId(null);
      fetchBarangs();
    }
    setLoading(false);
  };

  // Jika belum login, tampilkan pesan
  if (user === null) {
    return (
      <div className="text-center py-10">Loading...</div>
    );
  }
  if (!user) {
    return (
      <div className="text-center py-12 text-red-600 font-semibold">
        Kamu harus login dulu untuk melihat daftar barang kamu.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      {/* Notification */}
      {notif && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-[110] ${
            notif.type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"
          }`}
        >
          {notif.msg}
          <button className="ml-3" onClick={() => setNotif(null)}>✕</button>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl px-7 py-7 relative animate-fadeIn">
            <button
              className="absolute top-4 right-5 text-2xl text-gray-400 hover:text-gray-700 transition"
              onClick={() => setEditOpen(false)}
              aria-label="Tutup"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-6 text-gray-800">Edit Barang</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-5"
            >
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Barang
                </label>
                <input
                  className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-[15px]"
                  placeholder="Nama Barang"
                  value={form.nama}
                  onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <input
                  className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-[15px]"
                  placeholder="Kategori"
                  value={form.kategori}
                  onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                  required
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <input
                  className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-[15px]"
                  placeholder="Lokasi"
                  value={form.lokasi}
                  onChange={e => setForm(f => ({ ...f, lokasi: e.target.value }))}
                  required
                />
              </div>

              {/* Harga */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-[15px]"
                  placeholder="Harga"
                  value={form.harga}
                  onChange={e => setForm(f => ({ ...f, harga: e.target.value }))}
                  min={0}
                  required
                />
              </div>

              {/* Kondisi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kondisi
                </label>
                <input
                  className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-[15px]"
                  placeholder="Kondisi"
                  value={form.kondisi}
                  onChange={e => setForm(f => ({ ...f, kondisi: e.target.value }))}
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Verifikasi
                </label>
                <select
                  className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-[15px]"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  required
                >
                  <option value="Sedang Diverifikasi">Sedang Diverifikasi</option>
                  <option value="Tayang">Tayang</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              {/* Tombol */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow font-semibold transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]">
          <div className="bg-white max-w-xs w-full p-6 rounded-2xl shadow-xl text-center">
            <p className="mb-4 font-medium">Yakin ingin menghapus barang ini?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-blue-700 mb-2">Daftar Barang Disewakan</h1>
      <p className="text-gray-500 mb-6">Semua barang yang kamu tambahkan akan tampil di sini.</p>

      {/* Lightbox Modal */}
      {lightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="relative w-full max-w-2xl p-4">
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setLightbox(null)}
            >
              &times;
            </button>
            <div className="overflow-hidden rounded-lg">
              <img
                src={lightbox.urls[lightbox.index]}
                alt={`Foto ${lightbox.index + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
            {lightbox.urls.length > 1 && (
              <div className="mt-4 flex justify-between">
                <button
                  className="px-4 py-2 bg-white rounded"
                  onClick={() =>
                    setLightbox({
                      urls: lightbox.urls,
                      index: (lightbox.index - 1 + lightbox.urls.length) % lightbox.urls.length,
                    })
                  }
                >
                  ‹ Sebelumnya
                </button>
                <button
                  className="px-4 py-2 bg-white rounded"
                  onClick={() =>
                    setLightbox({
                      urls: lightbox.urls,
                      index: (lightbox.index + 1) % lightbox.urls.length,
                    })
                  }
                >
                  Selanjutnya ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : barangs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Belum ada barang.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {barangs.map((item) => {
            const fotos: string[] = Array.isArray(item.foto) ? item.foto : [];
            const urls = fotos.map((f) =>
              f.startsWith("http")
                ? f
                : `${BASE_URL}/storage/v1/object/public/barang-foto/${f}`
            );

            let statusColor = "bg-yellow-100 text-yellow-700";
            if (item.status === "Tayang") statusColor = "bg-green-100 text-green-700";
            else if (item.status === "Ditolak") statusColor = "bg-red-100 text-red-600";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md border hover:shadow-lg transition p-4 flex flex-col relative overflow-hidden group"
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={urls[0]}
                    alt={item.nama}
                    className="w-full h-48 object-cover rounded-xl cursor-pointer bg-gray-100"
                    onClick={() => urls.length > 0 && setLightbox({ urls, index: 0 })}
                  />
                  {urls.length > 1 && (
                    <button
                      onClick={() => setLightbox({ urls, index: 0 })}
                      className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded hover:bg-opacity-80 transition"
                    >
                      📷 Lihat {urls.length} Foto
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 mt-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1 gap-2">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{item.nama}</h2>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${statusColor}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <span className="inline-block text-xs text-blue-700 bg-blue-100 rounded px-2 py-1 mb-2">
                      {item.kategori}
                    </span>
                    <p className="text-sm text-gray-600">{item.lokasi}</p>
                  </div>
                  <div>
                    <p className="text-green-600 font-bold text-lg">
                      Rp {Number(item.harga).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Kondisi: {item.kondisi}</p>
                  </div>
                </div>

                {/* Tombol di bawah */}
                <div className="flex gap-2 mt-4 justify-end">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm flex items-center gap-1"
                  >
                    <span aria-hidden>✏️</span>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="px-3 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-sm flex items-center gap-1"
                  >
                    <span aria-hidden>🗑️</span>
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
