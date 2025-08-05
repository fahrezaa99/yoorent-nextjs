"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/common/ClientLayout';
import Toast from '@/components/common/Toast';
import { useState } from 'react';
import { PageTransitionProvider } from '@/components/common/PageTransitionContext';
import { Toaster } from "sonner"; // PATCH: Import sonner

// Ganti ke AuthProvider custom (bukan SessionContextProvider)
import { AuthProvider } from '@/components/common/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State global untuk toast notifikasi (bisa dipakai toast custom lain)
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");

  return (
    <html lang="id" className={inter.className}>
      <body>
        {/* AuthProvider custom di level paling atas */}
        <AuthProvider>
          {/* Komponen Toast custom (jika masih dipakai) */}
          <Toast show={toastOpen} message={toastMsg} onHide={() => setToastOpen(false)} />
          {/* PATCH: Toaster global untuk sonner */}
          <Toaster position="top-right" richColors />
          {/* Bungkus seluruh layout dengan PageTransitionProvider */}
          <PageTransitionProvider>
            <ClientLayout
              setShowToast={setToastOpen}
              setToastMsg={setToastMsg}
            >
              {children}
            </ClientLayout>
          </PageTransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
