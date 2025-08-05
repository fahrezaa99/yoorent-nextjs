"use client";
import { useState } from "react";
import LoginModal from "@/components/common/LoginModal";
import LoadingModal from "@/components/common/LoadingModal";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const router = useRouter();

  // Ketika login sukses:
  const handleLoginSuccess = () => {
    setShowLogin(false);      // Modal login langsung ditutup
    setShowLoading(true);     // LoadingModal tampil sendiri di layar
    setTimeout(() => {
      setShowLoading(false);  // Sembunyikan loading
      router.push("/");       // Redirect ke halaman utama/dashboard
    }, 4000);
  };

  return (
    <>
      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
      />
      <LoadingModal
        show={showLoading}
        message="Sedang login ke YooRent..."
      />
    </>
  );
}
