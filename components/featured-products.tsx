'use client'

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ChevronLeft, ChevronRight, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useProducts } from "@/hooks/use-products"
import { toast } from "sonner"

export function FeaturedProducts() {
  const { addToCart } = useCart()
  const products = useProducts()
  const [visibleProducts, setVisibleProducts] = useState<string[]>([])
  const [addedItems, setAddedItems] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-product-id")
            if (id) {
              setVisibleProducts((prev) => [...new Set([...prev, id])])
            }
          }
        })
      },
      { threshold: 0.2 }
    )

    const productCards = document.querySelectorAll("[data-product-id]")
    productCards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    setAddedItems([...addedItems, product.id])
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')}… added to cart`)
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product.id))
    }, 2000)
  }

  return (
    <section id="shop" className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full">
              Our Products
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground">
              Featured Collection
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Handcrafted with love and nature&apos;s finest ingredients. Each product is designed to 
              nourish your body, calm your mind, and elevate your daily rituals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("left")}
              className="rounded-full border-border hover:bg-accent/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("right")}
              className="rounded-full border-border hover:bg-accent/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Products Grid - Horizontal Scroll on Mobile */}
        <div 
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.slice(0, 6).map((product, index) => (
            <div
              key={product.id}
              data-product-id={product.id}
              className={`flex-shrink-0 w-80 lg:w-auto snap-start group transition-all duration-700 ${
                visibleProducts.includes(product.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-xl">
                {/* Image Container */}
                <Link href={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                      {product.badge}
                    </span>
                  )}

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
                </Link>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <p className="text-xs uppercase tracking-wider text-accent font-medium">
                    {product.category}
                  </p>
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="font-serif text-lg font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold text-foreground">R {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className={`rounded-full transition-all ${
                        addedItems.includes(product.id)
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {addedItems.includes(product.id) ? "✓" : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary/30 hover:bg-primary/5 group px-8"
            onClick={() => { window.location.href = '/shop' }}
          >
            View All Products
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}
