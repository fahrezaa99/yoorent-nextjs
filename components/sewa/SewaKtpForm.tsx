"use client";
import React, { useState, useRef } from "react";
import * as faceapi from "face-api.js";
import { uploadToSupabase } from "@/utils/uploadToSupabase";
import { supabase } from "@/lib/supabaseClient";

export default function SewaKtpForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [form, setForm] = useState({ nama: "", email: "", hp: "", alamat: "", catatan: "" });
  const [fotoKtp, setFotoKtp] = useState<File | null>(null);
  const [selfieKtp, setSelfieKtp] = useState<File | null>(null);

  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [ktpFaceDetected, setKtpFaceDetected] = useState<null | boolean>(null);
  const [selfieFaceDetected, setSelfieFaceDetected] = useState<null | boolean>(null);
  const [isLoadingOcr, setIsLoadingOcr] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load face-api.js model (only once)
  const loadedModels = useRef(false);
  async function loadModels() {
    if (loadedModels.current) return;
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    loadedModels.current = true;
  }

  // Convert file to <img>
  function fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (ev) {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // KTP upload & OCR
  async function handleKtpChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFotoKtp(file || null);
    if (!file) return;

    setIsLoadingOcr(true);

    // 1. OCR
    const formData = new FormData();
    formData.append("file", file);
    const resp = await fetch("/api/ocr-ktp", { method: "POST", body: formData });
    const json = await resp.json();
    setOcrResult(json.ocrText);

    // 2. Face detection on KTP
    await loadModels();
    const img = await fileToImage(file);
    const detections = await faceapi.detectAllFaces(img);
    setKtpFaceDetected(detections.length > 0);

    // Auto-fill nama (regex sederhana)
    const lines: string[] = (json.ocrText ?? "").split('\n');
const namaLine = lines.find((line: string) =>
  line.trim().toLowerCase().startsWith("nama")
);
if (namaLine) {
  const namaVal = namaLine.split(":")[1] || namaLine.replace(/nama/gi, "");
  setForm(f => ({ ...f, nama: namaVal.trim() }));
}


    setIsLoadingOcr(false);
  }

  // Selfie upload & face detection
  async function handleSelfieChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setSelfieKtp(file || null);
    if (!file) return;
    await loadModels();
    const img = await fileToImage(file);
    const detections = await faceapi.detectAllFaces(img);
    setSelfieFaceDetected(detections.length > 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fotoKtp || !selfieKtp) {
      alert("Wajib upload KTP & Selfie!");
      return;
    }
    if (!ktpFaceDetected) {
      alert("Wajah tidak terdeteksi di foto KTP!");
      return;
    }
    if (!selfieFaceDetected) {
      alert("Wajah tidak terdeteksi di selfie!");
      return;
    }
    setUploading(true);

    try {
      // 1. Upload file ke Supabase Storage
      const urlKtp = await uploadToSupabase(fotoKtp, "ktp");
      const urlSelfie = await uploadToSupabase(selfieKtp, "selfie");

      // 2. Insert ke table bookings
      const { data, error } = await supabase.from("bookings").insert([
        {
          nama: form.nama,
          email: form.email,
          hp: form.hp,
          alamat: form.alamat,
          catatan: form.catatan,
          foto_ktp: urlKtp,
          selfie_ktp: urlSelfie,
          ocr_result: ocrResult,
        }
      ]);
      if (error) throw error;

      alert("Data berhasil dikirim!");
      // Reset form
      setForm({ nama: "", email: "", hp: "", alamat: "", catatan: "" });
      setFotoKtp(null);
      setSelfieKtp(null);
      setOcrResult(null);
      setKtpFaceDetected(null);
      setSelfieFaceDetected(null);

      // Optional: callback ke parent/stepper
      onSubmit?.(data);

    } catch (err: any) {
      alert("Gagal upload data: " + (err?.message || err));
    }
    setUploading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-2xl font-extrabold mb-2">Data Penyewa</h2>
      <input className="input w-full" placeholder="Nama Lengkap" value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required />
      <input className="input w-full" placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      <input className="input w-full" placeholder="Nomor HP/WA" type="tel" value={form.hp} onChange={e => setForm(f => ({ ...f, hp: e.target.value }))} required />
      <input className="input w-full" placeholder="Alamat Domisili" value={form.alamat} onChange={e => setForm(f => ({ ...f, alamat: e.target.value }))} required />
      <textarea className="input w-full" placeholder="Catatan (opsional)" value={form.catatan} onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))} />

      <div className="mt-3">
        <label className="font-semibold">Upload Foto KTP *</label>
        <input type="file" accept="image/*" onChange={handleKtpChange} required className="block my-2" />
        {isLoadingOcr && <div className="text-blue-500">Memproses OCR & Deteksi Wajah...</div>}
        {ocrResult && <div className="text-xs text-gray-500 mb-1">Hasil scan OCR:<pre className="bg-gray-50 p-2 rounded">{ocrResult}</pre></div>}
        {ktpFaceDetected !== null && (
          <div className={ktpFaceDetected ? "text-green-600" : "text-red-600"}>
            {ktpFaceDetected ? "Wajah terdeteksi di KTP!" : "Tidak ada wajah di foto KTP!"}
          </div>
        )}
      </div>
      <div>
        <label className="font-semibold">Upload Selfie dengan KTP *</label>
        <input type="file" accept="image/*" onChange={handleSelfieChange} required className="block my-2" />
        {selfieFaceDetected !== null && (
          <div className={selfieFaceDetected ? "text-green-600" : "text-red-600"}>
            {selfieFaceDetected ? "Selfie valid!" : "Tidak ada wajah di foto selfie!"}
          </div>
        )}
      </div>
      <button
        className="w-full py-2 mt-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
        type="submit"
        disabled={uploading}
      >
        {uploading ? "Mengupload..." : "Lanjutkan"}
      </button>
    </form>
  );
}
