"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyYooRent from "@/components/WhyYooRent";
import PopularCategories from "@/components/PopularCategories";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhyYooRent />
      <PopularCategories />
    </>
  );
}
