"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

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
                Natural Wellness
              </span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight text-foreground">
              Nourish Your
              <span className="block text-primary">Skin & Soul</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Discover handcrafted skincare and wellness products infused with nature&apos;s finest ingredients. 
              Elevate your self-care ritual with our artisanal honey blends, serums, and body care essentials.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 group px-8 h-14 text-base"
              >
                <Link href="/shop">
                  Explore Collection
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
                  <Play className="mr-2 w-5 h-5" />
                  Our Story
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 sm:gap-8 pt-4">
              <div className="text-center">
                <p className="font-serif text-3xl font-semibold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Natural</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-serif text-3xl font-semibold text-foreground">8</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-serif text-3xl font-semibold text-foreground">SA</p>
                <p className="text-sm text-muted-foreground">Handcrafted</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className={`relative pb-12 sm:pb-8 lg:pb-0 ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl animate-float">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0015-umyaVKdF9wtazQGpic6PevVDsNbBJT.jpg"
                  alt="Zenestry honey collection"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Product Card */}
              <div className="absolute -bottom-4 -left-3 sm:-bottom-6 sm:-left-6 bg-card p-3 sm:p-4 rounded-2xl shadow-xl border border-border w-36 sm:w-48 animate-float animation-delay-400">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 sm:mb-3">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0021-Y257qdrVojSAHkr0VCrhGIt0ZvrPoP.jpg"
                    alt="Hydrating Face Oil"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="font-medium text-xs sm:text-sm">Hydrating Face Oil</p>
                <p className="text-accent font-semibold text-xs sm:text-base">R 350</p>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-accent text-accent-foreground px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg animate-float animation-delay-600">
                <p className="font-medium text-xs sm:text-sm">Bestseller</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-sm text-muted-foreground">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
