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

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek status login Supabase
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
      setLoading(false);
    };
    getUser();

    // Listen perubahan login Supabase
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
      {/* TIDAK ADA LAGI LOGIN/REGISTER MANUAL DI SINI */}
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
