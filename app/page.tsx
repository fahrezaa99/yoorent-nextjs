"use client";
import Navbar from "@/components/common/Navbar";
import HeroSection from "@/components/common/HeroSection";
import PopularCategories from "@/components/common/PopularCategories";
import ProductGrid from "@/components/barang/ProductGrid";
import CTASection from "@/components/common/CTASection";
import Testimonials from "@/components/common/Testimonials";
import CaraKerjaSection from "@/components/common/CaraKerjaSection";
import KeamananBenefitSection from "@/components/common/KeamananBenefitSection";
import FAQSection from "@/components/common/FAQSection";
import Footer from "@/components/common/Footer";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import PageSlideTransition from "@/components/common/PageSlideTransition"; // <--- Tambahkan ini
import SafetyBanner from "@/components/common/SafetyBanner";

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
      <SafetyBanner />
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
