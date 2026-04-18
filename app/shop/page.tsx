'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer-dynamic'
import { useCart } from '@/hooks/use-cart'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { Star, ChevronLeft, Heart, SlidersHorizontal, Check } from 'lucide-react'

const categoryFilters = [
  'All',
  'Wellness Honey',
  'Skincare',
  'Body Care',
  'Pain Relief',
  "Men's Grooming",
  'Aromatherapy',
]

function ShopContent() {
  const { addToCart } = useCart()
  const products = useProducts()
  const searchParams = useSearchParams()
  const [addedItems, setAddedItems] = useState<string[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  const urlCategory = searchParams.get('category') ?? 'All'
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFilters.includes(urlCategory) ? urlCategory : 'All'
  )

  useEffect(() => {
    const cat = searchParams.get('category') ?? 'All'
    setSelectedCategory(categoryFilters.includes(cat) ? cat : 'All')
  }, [searchParams])

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 })
    setAddedItems((prev) => [...prev, product.id])
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setAddedItems((prev) => prev.filter((id) => id !== product.id)), 2200)
  }

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">

        {/* Page hero strip */}
        <div className="border-b border-border/50 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase font-medium text-muted-foreground hover:text-foreground transition-colors mb-5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
            <h1
              className="font-serif text-foreground mb-2"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 400 }}
            >
              Shop All Products
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
              Discover our complete collection of natural skincare, wellness honeys, and body care — handcrafted with love.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="grid lg:grid-cols-4 gap-10">

            {/* Sidebar — desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28">
                <div className="flex items-center gap-2 mb-5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  <h3 className="text-[11px] tracking-[0.22em] uppercase font-semibold text-muted-foreground">Filter by</h3>
                </div>
                <div className="space-y-1">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      {cat}
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                {/* Sidebar brand note */}
                <div className="mt-8 p-4 rounded-xl bg-secondary/60 border border-border/40">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    All products are handcrafted with natural ingredients and made with love in South Africa.
                  </p>
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div className="lg:col-span-3">
              {/* Mobile filter pills */}
              <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-4 px-4 mb-7">
                <div className="flex gap-2 pb-2">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-medium tracking-wide transition-all whitespace-nowrap border ${
                        selectedCategory === cat
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-foreground/70 border-border hover:border-primary/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <p className="text-[11px] tracking-[0.14em] uppercase font-medium text-muted-foreground mb-7">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {selectedCategory !== 'All' && ` · ${selectedCategory}`}
              </p>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                {filteredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="group bg-card rounded-xl sm:rounded-2xl border border-border/40 overflow-hidden card-lift flex flex-col min-w-0"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Image */}
                    <Link href={`/shop/${product.id}`} className="block relative">
                      <div className="relative w-full aspect-square overflow-hidden bg-secondary/20">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* Badge */}
                        {product.badge && (
                          <span
                            className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-medium tracking-[0.16em] uppercase text-primary-foreground"
                            style={{ background: 'oklch(0.40 0.072 148)', borderRadius: 0 }}
                          >
                            {product.badge}
                          </span>
                        )}

                        {/* Wishlist */}
                        <button
                          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id) }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                          style={{
                            background: 'rgba(255,255,255,0.90)',
                            backdropFilter: 'blur(8px)',
                            color: wishlist.includes(product.id) ? 'oklch(0.40 0.072 148)' : 'rgba(0,0,0,0.4)',
                          }}
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-3 sm:p-5 flex flex-col flex-grow">
                      <p className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase font-medium text-primary/70 mb-1">
                        {product.category}
                      </p>
                      <Link href={`/shop/${product.id}`}>
                        <h3
                          className="font-serif text-foreground hover:text-primary transition-colors mb-1.5 line-clamp-2"
                          style={{ fontSize: 'clamp(0.78rem, 2.5vw, 1.05rem)', fontWeight: 400, lineHeight: 1.3 }}
                        >
                          {product.name}
                        </h3>
                      </Link>
                      <p className="hidden sm:block text-xs text-muted-foreground line-clamp-2 mb-4 flex-grow leading-relaxed">
                        {product.description}
                      </p>

                      {/* Rating — hidden on mobile to save space */}
                      <div className="hidden sm:flex items-center gap-1.5 mb-4">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(product.rating ?? 5) ? 'fill-primary text-primary' : 'fill-border text-border'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground">({product.reviews ?? 0})</span>
                      </div>

                      {/* Price + CTA */}
                      <div className="border-t border-border/40 pt-2.5 sm:pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <span className="font-serif text-sm sm:text-lg text-foreground">
                          R{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full sm:flex-1 text-[9px] sm:text-[10px] font-medium tracking-[0.14em] uppercase py-2 sm:py-2.5 rounded-lg transition-all duration-300 ${
                            addedItems.includes(product.id)
                              ? 'bg-green-600 text-white'
                              : 'bg-primary text-primary-foreground hover:bg-primary/85'
                          }`}
                        >
                          {addedItems.includes(product.id) ? '✓ Added' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-serif text-2xl text-foreground/50 mb-3">No products found</p>
                  <p className="text-sm text-muted-foreground">Try selecting a different category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
