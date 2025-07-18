"use client";
import { SessionProvider } from "next-auth/react";

// Tambahkan props toast di parameter ClientLayout!
export default function ClientLayout({
  children,
  setShowToast,
  setToastMsg,
}: {
  children: React.ReactNode;
  setShowToast: (show: boolean) => void;
  setToastMsg: (msg: string) => void;
}) {
  return (
    <SessionProvider>
      {/* Cara 1: Jika Navbar ada di sini, bisa langsung panggil: */}
      {/* <Navbar setShowToast={setShowToast} setToastMsg={setToastMsg} /> */}

      {/* Cara 2: Jika Navbar/modal toast ada di children, pastikan children menerima props ini */}
      {/* Children akan menerima setShowToast dan setToastMsg sebagai props */}
      {children}
    </SessionProvider>
  );
}
