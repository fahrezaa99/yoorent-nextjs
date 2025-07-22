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
import PageSlideTransition from "@/components/PageSlideTransition"; // <--- Tambahkan ini

// --- Komponen BarangList ---
// ... (tidak berubah, skip untuk ringkas)

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
    <PageSlideTransition direction="left">
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
    </PageSlideTransition>
  );
}
