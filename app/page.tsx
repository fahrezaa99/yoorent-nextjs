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

// Import LoginManual & RegisterManual
import LoginManual from "@/components/LoginManual";
import RegisterManual from "@/components/RegisterManual";

// Tambah import Supabase client
import { supabase } from "@/lib/supabaseClient";

// Tidak ada perubahan pada struktur atau urutan komponen
export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />

      {/* Tambahkan form Login dan Register di bawah HeroSection */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 40, margin: '40px 0' }}>
        <LoginManual />
        <RegisterManual />
      </div>

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
