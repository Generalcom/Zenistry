'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { WhatsAppOrderButton } from '@/components/whatsapp-button'
import { useCart } from '@/hooks/use-cart'
import { useProduct, useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import {
  ChevronLeft,
  ShoppingBag,
  CheckCircle2,
  Minus,
  Plus,
} from 'lucide-react'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = useProduct(id)
  const allProducts = useProducts()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return null

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })
    setAdded(true)
    toast.success(`${quantity > 1 ? `${quantity}x ` : ''}${product.name.split(' ').slice(0, 3).join(' ')}… added to cart`)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Breadcrumb */}
        <div className="border-b border-border/50 bg-card/50">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-foreground transition-colors">
                Shop
              </Link>
              <span>/</span>
              <span className="text-foreground line-clamp-1">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/20 shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <span className="absolute top-6 left-6 px-4 py-1.5 bg-accent text-accent-foreground text-sm font-medium rounded-full shadow">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-accent font-medium">
                  {product.category}
                </span>
              </div>

              {/* Name */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">
                {product.name}
              </h1>


              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>

              {/* Benefits */}
              <div className="space-y-3">
                <h3 className="font-medium text-foreground">Benefits</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Quantity</span>
                <div className="flex items-center gap-2 border border-border rounded-lg px-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 hover:text-accent transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 hover:text-accent transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className={`w-full h-14 text-base rounded-xl transition-all ${
                    added
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="mr-2 w-5 h-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-2 w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <WhatsAppOrderButton
                  productName={product.name}
                  price={product.price * quantity}
                />
              </div>

              {/* How to Use */}
              <div className="bg-secondary/30 rounded-xl p-5 space-y-2 border border-border/50">
                <h3 className="font-medium text-foreground text-sm">How to Use</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.howToUse}</p>
              </div>

              {/* Back to shop */}
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to all products
              </Link>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    href={`/shop/${related.id}`}
                    key={related.id}
                    className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:border-accent/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1">
                        {related.category}
                      </p>
                      <h3 className="font-serif text-base font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {related.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
