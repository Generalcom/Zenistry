'use client'

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Leaf, Heart, Sparkles, Award } from "lucide-react"
import { DynamicContent, DynamicImage } from "./dynamic-content"

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Ethically sourced, free from harmful chemicals"
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Each product handcrafted with care"
  },
  {
    icon: Sparkles,
    title: "Holistic Wellness",
    description: "Nourishes both your body and mind"
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the finest ingredients"
  }
]

export function About() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-36 overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Image collage */}
          <div className={`relative transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-14'
          }`}>
            {/* Mobile: stacked images */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
              <div className="col-span-2 aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                <DynamicImage
                  sectionId="about-main-image"
                  fallback="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0015-umyaVKdF9wtazQGpic6PevVDsNbBJT.jpg"
                  alt="ZENistry collection"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                <DynamicImage
                  sectionId="about-secondary-image-1"
                  fallback="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0005-ntmBxWZ8snBtHijpFMGAd4k3KAjc0l.jpg"
                  alt="Infused honey"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                <DynamicImage
                  sectionId="about-secondary-image-2"
                  fallback="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0008-jxcEILg2ZO2VG5BBazP7B5gyqNODsw.jpg"
                  alt="Black seed honey"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Desktop: bento collage */}
            <div className="hidden lg:grid grid-cols-12 grid-rows-10 gap-3 h-[560px]">
              {/* Main large image */}
              <div className="col-span-8 row-span-7 rounded-2xl overflow-hidden shadow-lg">
                <DynamicImage
                  sectionId="about-main-image"
                  fallback="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0015-umyaVKdF9wtazQGpic6PevVDsNbBJT.jpg"
                  alt="ZENistry collection"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top right portrait */}
              <div className="col-span-4 row-span-5 rounded-2xl overflow-hidden shadow-md col-start-9 row-start-1">
                <DynamicImage
                  sectionId="about-secondary-image-1"
                  fallback="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0005-ntmBxWZ8snBtHijpFMGAd4k3KAjc0l.jpg"
                  alt="Infused honey"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom right */}
              <div className="col-span-4 row-span-4 rounded-2xl overflow-hidden shadow-md col-start-9 row-start-6">
                <DynamicImage
                  sectionId="about-secondary-image-2"
                  fallback="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0008-jxcEILg2ZO2VG5BBazP7B5gyqNODsw.jpg"
                  alt="Black seed honey"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom left accent strip */}
              <div className="col-span-8 row-span-3 rounded-2xl overflow-hidden shadow-md col-start-1 row-start-8">
                <DynamicImage
                  sectionId="about-accent-image"
                  fallback="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0012-u2yv70r1CDsR6zX5K8XmXASXjXCwnz.jpg"
                  alt="Wellness honey"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-4 sm:right-8 glass rounded-2xl px-5 py-4 shadow-xl border border-border/40">
              <p className="font-serif text-2xl font-semibold text-primary leading-none">100%</p>
              <p className="text-[10px] tracking-[0.22em] uppercase text-foreground/55 font-medium mt-1">Natural</p>
            </div>
          </div>

          {/* Right: Text content */}
          <div className={`space-y-8 transition-all duration-1000 delay-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-14'
          }`}>
            <div>
              <span className="section-label mb-5 block w-fit">
                <DynamicContent sectionId="about-subtitle" fallback="Our Story" />
              </span>
              <h2
                className="font-serif text-foreground mb-2"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, lineHeight: 1.2 }}
              >
                <DynamicContent
                  sectionId="about-title"
                  fallback="Crafting Natural Wellness for Mind, Body & Soul"
                />
              </h2>
              <div className="divider-line mt-5 mb-7" />
              <div className="space-y-4 text-[0.9375rem] text-muted-foreground leading-relaxed">
                <p>
                  <DynamicContent
                    sectionId="about-description-1"
                    fallback="At ZENistry, we believe that true beauty comes from within. Our journey began with a simple mission: to create products that nourish not just your skin, but your entire being."
                  />
                </p>
                <p>
                  <DynamicContent
                    sectionId="about-description-2"
                    fallback="Each product is thoughtfully formulated using nature's most powerful ingredients—from adaptogenic herbs like Ashwagandha to the ancient healing properties of black seed oil and raw honey."
                  />
                </p>
              </div>
            </div>

            {/* Pull quote */}
            <blockquote className="border-l-2 border-primary pl-5 py-1">
              <p className="font-serif text-foreground/70 italic" style={{ fontSize: '1.1rem', fontWeight: 400, lineHeight: 1.55 }}>
                "We're more than a skincare brand — we're building a community dedicated to holistic self-care."
              </p>
            </blockquote>

            {/* Values grid */}
            <div className="grid grid-cols-2 gap-3">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-secondary/60 border border-border/40 hover:border-primary/25 hover:bg-secondary transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                    <value.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    <DynamicContent sectionId={`about-value-${index + 1}`} fallback={value.title} />
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <DynamicContent sectionId={`about-value-${index + 1}-description`} fallback={value.description} />
                  </p>
                </div>
              ))}
            </div>

            <Link href="/shop" className="btn-primary inline-flex" style={{ borderRadius: '8px' }}>
              <DynamicContent sectionId="about-button" fallback="Shop Our Products" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
