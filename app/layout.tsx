"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';
import Toast from '@/components/Toast';
import { useState } from 'react';
import { Toaster } from "react-hot-toast";
import { PageTransitionProvider } from '@/components/PageTransitionContext';

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
        <Toaster position="top-right" />
        {/* Bungkus seluruh layout dengan PageTransitionProvider */}
        <PageTransitionProvider>
          <ClientLayout
            setShowToast={setToastOpen}
            setToastMsg={setToastMsg}
          >
            {children}
          </ClientLayout>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
