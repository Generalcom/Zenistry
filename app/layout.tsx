import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { CartProvider } from '@/hooks/use-cart'
import { ReviewProvider } from '@/lib/review-context'
import { WhatsAppButton } from '@/components/whatsapp-button'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ZENistry | Holistic Skincare & Wellness — South Africa',
  description: 'Discover natural skincare and wellness products crafted with love. Infused honeys, serums, body care, and holistic wellness — handmade in South Africa.',
  keywords: ['skincare', 'wellness', 'natural products', 'honey', 'holistic', 'body care', 'South Africa'],
}

export const viewport: Viewport = {
  themeColor: '#F5F2EB',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <ReviewProvider>
            {children}
            <WhatsAppButton />
          </ReviewProvider>
        </CartProvider>
        <Toaster position="bottom-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
