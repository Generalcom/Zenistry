'use client'

import { useCart } from '@/hooks/use-cart'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[450px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <p className="text-neutral-500 mb-2">Your cart is empty</p>
              <p className="text-sm text-neutral-400">Add some beautiful products to get started!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-neutral-200">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900">{item.name}</h3>
                    <p className="text-sm text-accent-800 font-semibold">R{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 ml-auto text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-serif text-lg text-neutral-600">Total:</span>
                <span className="font-serif text-2xl text-accent-800">R{total.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => clearCart()}
                  className="flex-1"
                >
                  Clear Cart
                </Button>
                <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/checkout" onClick={() => onOpenChange(false)}>Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
