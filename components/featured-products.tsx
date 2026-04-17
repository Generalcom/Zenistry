'use client'

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useProducts } from "@/hooks/use-products"

export function FeaturedProducts() {
  const products = useProducts()
  const [visibleProducts, setVisibleProducts] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const displayProducts = products.slice(0, 6)
  const totalPages = displayProducts.length

  useEffect(() => {
    const headerObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true) },
      { threshold: 0.3 }
    )
    if (headerRef.current) headerObs.observe(headerRef.current)
    return () => headerObs.disconnect()
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          displayProducts.forEach((p, i) => {
            setTimeout(() => {
              setVisibleProducts((prev) => [...new Set([...prev, p.id])])
            }, i * 110)
          })
        }
      },
      { threshold: 0.12 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [products])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const maxScroll = scrollWidth - clientWidth
      const page = maxScroll > 0 ? Math.round((scrollLeft / maxScroll) * (totalPages - 1)) : 0
      setCurrentPage(page)
    }
  }

  return (
    <section id="shop" className="py-24 lg:py-32 bg-background texture-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Header */}
        <div
          ref={headerRef}
          className={`flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-6 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <span className="section-label mb-4 block">Our Products</span>
            <h2
              className="font-serif text-foreground"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}
            >
              Intentionally Formulated
            </h2>
            <div className="divider-line mt-4" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="hidden sm:flex w-10 h-10 rounded-full border border-border items-center justify-center text-foreground/50 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="hidden sm:flex w-10 h-10 rounded-full border border-border items-center justify-center text-foreground/50 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Products row */}
        <div ref={sectionRef}>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex lg:grid lg:grid-cols-3 gap-5 lg:gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide"
          >
            {displayProducts.map((product, index) => (
              <div
                key={product.id}
                data-product-id={product.id}
                className={`flex-shrink-0 w-[72vw] sm:w-80 lg:w-auto snap-start card-lift transition-all duration-700 ${
                  visibleProducts.includes(product.id)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="group bg-card rounded-2xl overflow-hidden border border-border/30">
                  {/* Image */}
                  <Link href={`/shop/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-108"
                      style={{ transformOrigin: 'center' }}
                      sizes="(max-width: 768px) 72vw, 33vw"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/8 transition-all duration-500" />

                    {/* Badge */}
                    {product.badge && (
                      <span
                        className="absolute top-3.5 left-3.5 px-3 py-1 text-[9px] font-medium tracking-[0.18em] uppercase"
                        style={{ backgroundColor: 'oklch(0.40 0.072 148)', color: '#fff', borderRadius: 0 }}
                      >
                        {product.badge}
                      </span>
                    )}

                    {/* Quick shop label */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 bg-foreground/90 backdrop-blur-sm py-3 text-center">
                      <span className="text-primary-foreground text-[10px] tracking-[0.22em] uppercase font-medium">
                        Quick View
                      </span>
                    </div>
                  </Link>

                  {/* Card content */}
                  <div className="p-5 pb-6">
                    <Link href={`/shop/${product.id}`}>
                      <h3
                        className="font-serif text-foreground group-hover:text-primary transition-colors duration-200 mb-1 text-center"
                        style={{ fontSize: '1.05rem', fontWeight: 400, lineHeight: 1.35 }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    {product.price != null && (
                      <p className="text-center text-sm font-medium text-muted-foreground mb-4">
                        R{Number(product.price).toFixed(2)}
                      </p>
                    )}
                    <Link
                      href={`/shop/${product.id}`}
                      className="btn-primary w-full justify-center text-[10px]"
                      style={{ borderRadius: '8px', padding: '0.65rem 1rem' }}
                    >
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile dots + CTA */}
        <div className="mt-8 flex flex-col items-center gap-5 lg:hidden">
          <div className="flex gap-2">
            {displayProducts.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (scrollRef.current) {
                    const { scrollWidth, clientWidth } = scrollRef.current
                    scrollRef.current.scrollTo({
                      left: (i / (totalPages - 1)) * (scrollWidth - clientWidth),
                      behavior: 'smooth',
                    })
                  }
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === currentPage ? 'w-6 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-border hover:bg-primary/40'
                }`}
                aria-label={`Go to product ${i + 1}`}
              />
            ))}
          </div>
          <Link href="/shop" className="btn-primary rounded-lg px-8">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
