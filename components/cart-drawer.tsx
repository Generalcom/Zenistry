'use client'

import { useCart } from '@/hooks/use-cart'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, total } = useCart()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[420px] flex flex-col p-0 gap-0 bg-background">

        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl text-foreground">
              Your Cart
            </SheetTitle>
            {itemCount > 0 && (
              <span className="text-xs font-medium bg-accent/10 text-accent px-2.5 py-1 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-5">
            <div className="w-20 h-20 rounded-full bg-secondary/60 flex items-center justify-center">
              <ShoppingBag className="w-9 h-9 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="space-y-1.5">
              <p className="font-serif text-xl text-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Discover our skincare & wellness collection</p>
            </div>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-2"
              onClick={() => onOpenChange(false)}
            >
              <Link href="/shop">
                Browse the Shop <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b border-border/40 last:border-0"
                >
                  {/* Image */}
                  <Link
                    href={`/shop/${item.id}`}
                    onClick={() => onOpenChange(false)}
                    className="relative w-20 h-20 rounded-xl overflow-hidden bg-secondary/40 flex-shrink-0 hover:opacity-90 transition-opacity"
                  >
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/shop/${item.id}`}
                        onClick={() => onOpenChange(false)}
                        className="text-sm font-medium text-foreground leading-snug line-clamp-2 hover:text-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-foreground select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="text-sm font-semibold text-foreground">
                        R{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 bg-card px-6 py-5 space-y-4">

              {/* Free delivery badge */}
              <div className="flex items-center gap-2 text-xs text-accent bg-accent/8 px-3 py-2 rounded-lg border border-accent/20">
                <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium">Free delivery on all orders</span>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-accent font-medium">Free</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-border/50">
                  <span className="font-serif text-lg text-foreground">Total</span>
                  <span className="font-serif text-2xl font-semibold text-foreground">R{total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base rounded-xl gap-2"
              >
                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <button
                onClick={() => onOpenChange(false)}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
