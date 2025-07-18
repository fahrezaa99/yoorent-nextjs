"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import SmoothLayout from '@/components/SmoothLayout';
import ClientLayout from '@/components/ClientLayout';
import Toast from '@/components/Toast';
import { useState } from 'react';
import { Toaster } from "react-hot-toast"; // Notifikasi

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State global untuk toast notifikasi
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");

  return (
    <html lang="id" className={inter.className}>
      <body>
        {/* Komponen Toast global */}
        <Toast show={toastOpen} message={toastMsg} onHide={() => setToastOpen(false)} />
        
        {/* Toaster NOTIFIKASI */}
        <Toaster position="top-right" /> {/* Wajib! */}

        {/* Prop toast diteruskan ke ClientLayout, bisa dipakai child manapun */}
        <ClientLayout
          setShowToast={setToastOpen}
          setToastMsg={setToastMsg}
        >
          <SmoothLayout>{children}</SmoothLayout>
        </ClientLayout>
      </body>
    </html>
  );
}
