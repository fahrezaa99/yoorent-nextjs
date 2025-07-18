"use client";
import './globals.css'
import { Inter } from 'next/font/google'
import SmoothLayout from '@/components/SmoothLayout'
import ClientLayout from '@/components/ClientLayout'
import Toast from '@/components/Toast'
import { useState } from 'react'
import { Toaster } from "react-hot-toast" // <--- Import Toaster (react-hot-toast)

// Jika mau pakai sonner, ganti: 
// import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // State global untuk toast notifikasi
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  return (
    <html lang="id" className={inter.className}>
      <body>
        {/* Komponen Toast global */}
        <Toast show={toastOpen} message={toastMsg} onHide={() => setToastOpen(false)} />
        
        {/* Toaster NOTIFIKASI */}
        <Toaster position="top-right" />   {/* <-- Ini wajib! */}

        {/* Prop toast diteruskan ke ClientLayout, bisa dipakai child manapun */}
        <ClientLayout
          setShowToast={setToastOpen}
          setToastMsg={setToastMsg}
        >
          <SmoothLayout>{children}</SmoothLayout>
        </ClientLayout>
      </body>
    </html>
  )
}
