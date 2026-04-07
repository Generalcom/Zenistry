import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { CartProvider } from '@/hooks/use-cart'
import { ReviewProvider } from '@/lib/review-context'
import { WhatsAppButton } from '@/components/whatsapp-button'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif"
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: 'ZENistry | Beauty & Lifestyle - Skincare, Wellness & Podcast',
  description: 'Discover natural skincare and wellness products crafted with love. Infused honeys, serums, body care, and mental wellness podcast for holistic living.',
  keywords: ['skincare', 'wellness', 'natural products', 'honey', 'podcast', 'mental health', 'body care'],
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#F5F0E8',
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
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
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
