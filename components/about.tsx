"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Leaf, Heart, Sparkles, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "All ingredients are ethically sourced and free from harmful chemicals"
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Each product is handcrafted with care and attention to detail"
  },
  {
    icon: Sparkles,
    title: "Holistic Wellness",
    description: "Designed to nourish both body and mind for complete wellbeing"
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the finest ingredients make it into our formulations"
  }
]

export function About() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-16 md:py-20 lg:py-32 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content - Images */}
          <div className={`relative transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}>
            <div className="relative grid grid-cols-2 gap-3 md:gap-4">
              {/* Main Image */}
              <div className="col-span-2 aspect-[4/3] rounded-lg md:rounded-2xl overflow-hidden relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0015-umyaVKdF9wtazQGpic6PevVDsNbBJT.jpg"
                  alt="Zenestry honey collection"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Secondary Images */}
              <div className="aspect-square rounded-lg md:rounded-2xl overflow-hidden relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0005-ntmBxWZ8snBtHijpFMGAd4k3KAjc0l.jpg"
                  alt="Infused honey"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg md:rounded-2xl overflow-hidden relative">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0008-jxcEILg2ZO2VG5BBazP7B5gyqNODsw.jpg"
                  alt="Black seed honey"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 md:-bottom-8 -right-6 md:-right-8 bg-card p-4 md:p-6 rounded-lg md:rounded-2xl shadow-lg md:shadow-xl border border-border hidden sm:block lg:block w-fit max-w-xs">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 md:w-8 h-6 md:h-8 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-2xl md:text-3xl font-semibold text-foreground">1+ Years</p>
                  <p className="text-xs md:text-sm text-muted-foreground">of Crafting Wellness</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Text */}
          <div className={`space-y-6 md:space-y-8 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
          }`}>
            <div>
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs md:text-sm font-medium rounded-full mb-3 md:mb-4">
                Our Story
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 md:mb-6 leading-tight">
                Crafting Natural Wellness for Mind, Body & Soul
              </h2>
              <div className="space-y-3 md:space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  At Zenestry, we believe that true beauty comes from within. Our journey began with a 
                  simple mission: to create products that nourish not just your skin, but your entire being.
                </p>
                <p>
                  Each product in our collection is thoughtfully formulated using nature&apos;s most powerful 
                  ingredients—from adaptogenic herbs like Ashwagandha to the ancient healing properties of 
                  black seed oil and raw honey.
                </p>
                <p>
                  We&apos;re more than just a skincare brand. Through our wellness podcast and mindful approach 
                  to beauty, we&apos;re building a community dedicated to holistic self-care.
                </p>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="p-3 md:p-4 rounded-lg md:rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-colors"
                >
                  <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-2 md:mb-3">
                    <value.icon className="w-4 md:w-5 h-4 md:h-5 text-accent" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1 text-sm md:text-base">{value.title}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 md:px-8 text-sm md:text-base w-full sm:w-auto"
            >
              <Link href="/shop">Shop Our Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
