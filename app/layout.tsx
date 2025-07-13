import './globals.css'
import { Inter } from 'next/font/google'
import SmoothLayout from '@/components/SmoothLayout'
import ClientLayout from '@/components/ClientLayout'
import { supabase } from '@/lib/supabaseClient';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={inter.className}>
      <body>
        <ClientLayout>
          <SmoothLayout>{children}</SmoothLayout>
        </ClientLayout>
      </body>
    </html>
  )
}
