'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '580px', maxHeight: '960px' }}
    >
      {/* Background image */}
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0015-umyaVKdF9wtazQGpic6PevVDsNbBJT.jpg"
        alt="ZENistry holistic skincare collection"
        fill
        className="object-cover object-center scale-105"
        style={{ transform: 'scale(1.04)' }}
        priority
        sizes="100vw"
      />

      {/* Multi-layered overlay for depth */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(24,28,20,0.18) 0%, rgba(24,28,20,0.05) 40%, rgba(24,28,20,0.55) 100%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(24,28,20,0.0) 0%, rgba(24,28,20,0.0) 30%, rgba(245,242,235,0.75) 65%, rgba(245,242,235,0.96) 100%)'
      }} />

      {/* Content — bottom-right editorial layout */}
      <div className="absolute inset-0 flex items-end lg:items-center pb-16 lg:pb-0">
        <div className="container mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex justify-end">
            <div
              className={`max-w-[480px] lg:max-w-[520px] transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Label */}
              <div
                className={`mb-5 transition-all duration-700 delay-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <span className="section-label">South African Wellness</span>
              </div>

              {/* Headline */}
              <h1
                className={`font-serif text-foreground mb-3 transition-all duration-700 delay-200 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.14, letterSpacing: '-0.02em' }}
              >
                Holistic Skincare
                <br />
                &amp; Wellness,
              </h1>
              <h1
                className={`font-serif text-foreground mb-7 transition-all duration-700 delay-300 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.14, letterSpacing: '-0.02em', color: 'oklch(0.40 0.072 148)' }}
              >
                Crafted with Intention
              </h1>

              {/* Descriptor */}
              <p
                className={`text-foreground/65 mb-10 transition-all duration-700 delay-400 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)', lineHeight: 1.65, maxWidth: '380px', fontFamily: 'var(--font-sans)' }}
              >
                Nature's finest ingredients, mindfully formulated for your skin and soul. Pure, intentional, transformative.
              </p>

              {/* CTAs */}
              <div
                className={`flex flex-wrap items-center gap-3 transition-all duration-700 delay-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <Link href="/shop" className="btn-primary rounded-none" style={{ borderRadius: 0 }}>
                  Shop the Collection
                </Link>
                <Link
                  href="/#about"
                  className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.16em] uppercase text-foreground/60 hover:text-foreground transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  <span className="w-6 h-px bg-foreground/40" />
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-all duration-700 delay-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/40 font-medium">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-foreground/30 to-transparent animate-scroll-indicator" />
      </div>
    </section>
  )
}
