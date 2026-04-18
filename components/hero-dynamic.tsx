'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '90vh', minHeight: '560px', maxHeight: '820px' }}>
      {/* Background image */}
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0015-umyaVKdF9wtazQGpic6PevVDsNbBJT.jpg"
        alt="ZENistry holistic skincare collection"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />

      {/* Warm gradient overlay — left clear, right fades to cream for text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(245,240,232,0.05) 0%, rgba(245,240,232,0.40) 42%, rgba(245,240,232,0.82) 62%, rgba(245,240,232,0.94) 100%)',
        }}
      />

      {/* Text content — right side */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-end">
            <div
              className={`max-w-md lg:max-w-lg transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <h1
                className="font-serif text-foreground mb-8"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.18 }}
              >
                Holistic Skincare
                <br />
                &amp; Wellness,
                <br />
                <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Crafted with Intention</em>
              </h1>

              <Link
                href="/shop"
                className="inline-block px-10 py-3.5 text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:opacity-85 hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: '#5e6b52',
                  color: '#fff',
                  letterSpacing: '0.18em',
                }}
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
