'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { Star, ChevronLeft, Heart, SlidersHorizontal } from 'lucide-react'

const categoryFilters = ['All', 'Wellness Honey', 'Skincare', 'Body Care', 'Aromatherapy']

function ShopContent() {
  const { addToCart } = useCart()
  const products = useProducts()
  const searchParams = useSearchParams()
  const [addedItems, setAddedItems] = useState<string[]>([])

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
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    setAddedItems((prev) => [...prev, product.id])
    toast.success(`Added to cart`)
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== product.id))
    }, 2000)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Breadcrumb */}
        <div className="border-b border-border/50 bg-card/50">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ChevronLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="border-b border-border/50 py-12">
          <div className="container mx-auto px-4 lg:px-8 space-y-3">
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground">Shop All Products</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover our complete collection of natural skincare, wellness honeys, and body care
              products — handcrafted with love by Angela.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop only */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-serif text-lg font-medium text-foreground">Filter</h3>
                </div>
                <div className="space-y-1">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        selectedCategory === cat
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'hover:bg-secondary text-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Mobile filter pills */}
              <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-4 px-4 mb-6">
                <div className="flex gap-2 pb-1">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${
                        selectedCategory === cat
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'bg-card text-foreground border-border hover:bg-secondary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-xl border border-border/50 overflow-hidden hover:border-accent/30 transition-all duration-300 hover:shadow-md flex flex-col group"
                  >
                    {/* Image */}
                    <Link
                      href={`/shop/${product.id}`}
                      className="relative aspect-square overflow-hidden bg-secondary/30 block"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                          {product.badge}
                        </span>
                      )}
                      <button className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-accent hover:text-accent-foreground transition-colors opacity-0 group-hover:opacity-100">
                        <Heart size={18} />
                      </button>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-xs uppercase tracking-wider text-accent font-medium mb-2">
                        {product.category}
                      </p>
                      <Link href={`/shop/${product.id}`}>
                        <h3 className="font-serif text-lg font-medium text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-2 mb-4">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">({product.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/30">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-semibold text-foreground">
                            R {product.price}
                          </span>
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
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-primary text-primary-foreground hover:bg-primary/90'
                          }`}
                        >
                          {addedItems.includes(product.id) ? '✓' : 'Add'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ShopContent />
    </Suspense>
  )
}
