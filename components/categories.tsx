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
    count: "4 Products",
    href: "/shop?category=Wellness+Honey",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0012-u2yv70r1CDsR6zX5K8XmXASXjXCwnz.jpg",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    id: 2,
    name: "Face Care",
    description: "Serums, oils, and treatments for radiant skin",
    count: "2 Products",
    href: "/shop?category=Skincare",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0003-AiSVHyLDXwJeBGbzTFkZ7nTHAhydsW.jpg",
    span: "",
  },
  {
    id: 3,
    name: "Body Care",
    description: "Bodywash, body butter & natural deodorant for everyday luxury",
    count: "3 Products",
    href: "/shop?category=Body+Care",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0017-83x9Dd1xS42jSb3KmABulyrk2HQrV9.jpg",
    span: "",
  },
  {
    id: 4,
    name: "Pain Relief",
    description: "Natural oils, creams and sprays to ease muscles and joints",
    count: "4 Products",
    href: "/shop?category=Pain+Relief",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0021-Y257qdrVojSAHkr0VCrhGIt0ZvrPoP.jpg",
    span: "",
  },
  {
    id: 5,
    name: "Men's Grooming",
    description: "Nourishing beard care crafted for the intentional man",
    count: "1 Product",
    href: "/shop?category=Men%27s+Grooming",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0022-H7TeEV7MkcozQwvxc3HUECypz6NO0k.jpg",
    span: "",
  },
  {
    id: 6,
    name: "Aromatherapy",
    description: "Essential oil blends for mental wellness and calm",
    count: "1 Product",
    href: "/shop?category=Aromatherapy",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260320-WA0006-AhDYUdGotO6w3sj7rf10Z3HtNlI1jt.jpg",
    span: "",
  },
]

export function Categories() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.12 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="categories" ref={sectionRef} className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <span className="section-label mb-4 block mx-auto w-fit">Collections</span>
          <h2
            className="font-serif text-foreground mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}
          >
            Explore Our Collections
          </h2>
          <div className="divider-center mx-auto mt-4 mb-4" />
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            From nourishing honeys to luxurious skincare — find the perfect products for your wellness journey.
          </p>
        </div>

        {/* Bento grid — desktop */}
        <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-4 h-[600px]">
          {categories.map((category, index) => (
            <Link
              href={category.href}
              key={category.id}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ${category.span} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 1200px) 50vw, 33vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-foreground/0 group-hover:from-foreground/90 transition-all duration-400" />

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <p className="text-[10px] tracking-[0.22em] uppercase font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {category.count}
                  </p>
                  <h3
                    className="font-serif text-white mb-1"
                    style={{ fontSize: category.span ? '1.6rem' : '1.15rem', fontWeight: 400, lineHeight: 1.2 }}
                  >
                    {category.name}
                  </h3>
                  <p
                    className="text-xs leading-relaxed opacity-0 group-hover:opacity-80 transition-opacity duration-300 max-w-[220px]"
                    style={{ color: 'rgba(255,255,255,0.80)' }}
                  >
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff' }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile grid — standard 2-col */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <Link
              href={category.href}
              key={category.id}
              className={`group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <p className="text-[10px] tracking-[0.20em] uppercase font-medium mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {category.count}
                </p>
                <h3 className="font-serif text-white text-lg font-normal">{category.name}</h3>
              </div>
              <div
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#fff' }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
