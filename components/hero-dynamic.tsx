'use client'

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DynamicContent, DynamicImage } from "./dynamic-content"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="space-y-2">
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full">
                <DynamicContent sectionId="hero" fallback="Natural Wellness" />
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight text-foreground">
              <DynamicContent sectionId="hero-subtitle" fallback="Nourish Your" />
              <span className="block text-primary">
                <DynamicContent sectionId="hero-title" fallback="Skin & Soul" />
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              <DynamicContent 
                sectionId="hero-description" 
                fallback="Discover handcrafted skincare and wellness products infused with nature's finest ingredients. Elevate your self-care ritual with our artisanal honey blends, serums, and body care essentials." 
              />
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group px-8 h-14 text-base"
              >
                <Link href="/shop">
                  <DynamicContent sectionId="hero-button-1" fallback="Explore Collection" />
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/5 group px-8 h-14 text-base"
              >
                <Link href="#about">
                  <DynamicContent sectionId="hero-button-2" fallback="Our Story" />
                  <Play className="mr-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 sm:gap-8 pt-4">
              <div className="text-center">
                <p className="font-serif text-3xl font-semibold text-foreground">
                  <DynamicContent sectionId="hero-stat-1" fallback="100" />
                </p>
                <p className="text-sm text-muted-foreground">
                  <DynamicContent sectionId="hero-stat-1-label" fallback="Natural" />
                </p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-serif text-3xl font-semibold text-foreground">
                  <DynamicContent sectionId="hero-stat-2" fallback="8" />
                </p>
                <p className="text-sm text-muted-foreground">
                  <DynamicContent sectionId="hero-stat-2-label" fallback="Products" />
                </p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-serif text-3xl font-semibold text-foreground">
                  <DynamicContent sectionId="hero-stat-3" fallback="SA" />
                </p>
                <p className="text-sm text-muted-foreground">
                  <DynamicContent sectionId="hero-stat-3-label" fallback="Handcrafted" />
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Dynamic Image Grid */}
          <div className={`relative pb-12 sm:pb-8 lg:pb-0 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl animate-float">
                <DynamicImage
                  sectionId="hero-main-image"
                  fallback="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0015-umyaVKdF9wtazQGpic6PevVDsNbBJT.jpg"
                  alt="ZENistry honey collection"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
