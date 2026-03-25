"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Wellness Honeys",
    description: "Adaptogenic herbs and superfoods infused in pure raw honey",
    count: "3 Products",
    href: "/shop?category=Wellness+Honey",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0012-u2yv70r1CDsR6zX5K8XmXASXjXCwnz.jpg",
    color: "from-amber-900/80 to-amber-700/60"
  },
  {
    id: 2,
    name: "Face Care",
    description: "Serums, oils, and treatments for radiant skin",
    count: "2 Products",
    href: "/shop?category=Skincare",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0003-AiSVHyLDXwJeBGbzTFkZ7nTHAhydsW.jpg",
    color: "from-stone-900/80 to-stone-700/60"
  },
  {
    id: 3,
    name: "Body Care",
    description: "Luxurious body washes and creams for silky smooth skin",
    count: "2 Products",
    href: "/shop?category=Body+Care",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0017-83x9Dd1xS42jSb3KmABulyrk2HQrV9.jpg",
    color: "from-emerald-900/80 to-emerald-700/60"
  },
  {
    id: 4,
    name: "Aromatherapy",
    description: "Essential oil blends for mental wellness and calm",
    count: "1 Product",
    href: "/shop?category=Aromatherapy",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0006-AhDYUdGotO6w3sj7rf10Z3HtNlI1jt.jpg",
    color: "from-zinc-900/80 to-zinc-700/60"
  },
]

export function Categories() {
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
    <section id="categories" ref={sectionRef} className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
            Shop by Category
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            Explore Our Collections
          </h2>
          <p className="text-muted-foreground">
            From nourishing honeys to luxurious skincare, find the perfect products 
            for your wellness journey.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              href={category.href}
              key={category.id}
              className={`group relative aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Background Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-card">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <p className="text-xs md:text-sm opacity-80 mb-1 md:mb-2">{category.count}</p>
                  <h3 className="font-serif text-lg md:text-2xl font-medium mb-1 md:mb-2">{category.name}</h3>
                  <p className="text-xs md:text-sm opacity-0 group-hover:opacity-90 transition-opacity duration-300 leading-relaxed">
                    {category.description}
                  </p>
                </div>
                
                {/* Arrow Icon */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 w-8 md:w-10 h-8 md:h-10 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-card group-hover:text-foreground">
                  <ArrowUpRight className="w-4 md:w-5 h-4 md:h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
