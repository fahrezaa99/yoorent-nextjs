"use client";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PopularCategories from "@/components/PopularCategories";
import ProductGrid from "@/components/ProductGrid";
import CTASection from "@/components/CTASection";
import Testimonials from "@/components/Testimonials";
import CaraKerjaSection from "@/components/CaraKerjaSection";
import KeamananBenefitSection from "@/components/KeamananBenefitSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

// --- Komponen BarangList ---
type Barang = {
  id: string;
  nama: string;
  harga: number;
  kategori?: string;
  // Tambah field lain kalau ada
};

function BarangList() {
  const [barang, setBarang] = useState<Barang[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("barang")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setBarang(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-6">Loading daftar barang...</div>;
  if (error) return <div className="text-red-500 text-center py-6">{error}</div>;
  if (barang.length === 0) return <div className="text-center py-6">Belum ada barang milikmu.</div>;

  return (
    <div className="max-w-xl mx-auto my-8 bg-white rounded-xl shadow p-6">
      <h2 className="font-bold text-lg mb-4">Barang Saya</h2>
      <div className="space-y-4">
        {barang.map((item) => (
          <div key={item.id} className="border p-3 rounded">
            <div className="font-semibold">{item.nama}</div>
            <div className="text-sm text-gray-600">{item.kategori}</div>
            <div>Harga: Rp{item.harga}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// === Page utama ===
export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setLoading(false);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />
      {/* 
      --- BarangList bisa diaktifkan kalau ingin tampilkan barang user login di homepage ---
      <BarangList /> 
      */}
      <PopularCategories />
      <ProductGrid />
      <CTASection />
      <Testimonials />
      <CaraKerjaSection />
      <KeamananBenefitSection />
      <FAQSection />
      <Footer />
    </>
  );
}
