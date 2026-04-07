'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import {
  ShoppingBag,
  CheckCircle2,
  Copy,
  Package,
  Truck,
  CreditCard,
  Smartphone,
} from 'lucide-react'
import {
  generateTrackingNumber,
  getEstimatedDelivery,
  saveOrder,
} from '@/lib/orders'
import { toast } from 'sonner'

type Step = 'checkout' | 'confirmed'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [step, setStep] = useState<Step>('checkout')
  const [trackingNumber] = useState(() => generateTrackingNumber())
  const openCardPopup = () => {
    const w = 480, h = 720
    const left = Math.round(window.screenX + (window.outerWidth - w) / 2)
    const top = Math.round(window.screenY + (window.outerHeight - h) / 2)
    window.open(
      'https://pay.ikhokha.com/ZENistry-skincare--wellness/buy/ZENistry',
      'ikhokha-payment',
      `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )
  }

  const handleMarkAsPaid = () => {
    saveOrder({
      trackingNumber,
      status: 'ordered',
      createdAt: new Date().toISOString(),
      estimatedDelivery: getEstimatedDelivery(),
      customer: { firstName: '', lastName: '', email: '', phone: '', address: '', city: '', postalCode: '' },
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, image: i.image, quantity: i.quantity })),
      total,
    })
    clearCart()
    setStep('confirmed')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  // ── CONFIRMED ──────────────────────────────────────────────────────────────
  if (step === 'confirmed') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto space-y-8 text-center">

            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="font-serif text-3xl text-foreground">Payment Sent!</h1>
                <p className="text-muted-foreground mt-1">
                  Angela will verify your payment and update your order status shortly.
                </p>
              </div>
            </div>

            <div className="bg-accent/5 border-2 border-accent/30 rounded-2xl p-8 space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-accent uppercase">
                <Package className="w-4 h-4" /> Your Tracking Number
              </div>
              <div className="font-mono text-4xl font-bold text-foreground tracking-widest">
                {trackingNumber}
              </div>
              <p className="text-sm text-muted-foreground">Save this to track your order status</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => copyText(trackingNumber, 'Tracking number')}
                  variant="outline"
                  className="gap-2 border-accent/30 hover:bg-accent/10"
                >
                  <Copy className="w-4 h-4" /> Copy Number
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Link href={`/track?number=${trackingNumber}`}>
                    <Truck className="w-4 h-4" /> Track My Order
                  </Link>
                </Button>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>

          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ── CHECKOUT ───────────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        <div className="border-b border-border/50 py-10 bg-secondary/20">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-serif text-4xl text-foreground">Checkout</h1>
            <p className="text-muted-foreground text-sm mt-1">Choose how you&apos;d like to pay</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="container mx-auto px-4 lg:px-8 py-24">
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-secondary/40 flex items-center justify-center mx-auto">
                <ShoppingBag size={36} className="text-muted-foreground" />
              </div>
              <h2 className="font-serif text-2xl text-foreground">Your cart is empty</h2>
              <p className="text-muted-foreground">Add some beautiful products before checking out.</p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/shop">Browse the Shop</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="grid lg:grid-cols-3 gap-10 items-start">

              {/* Payment options */}
              <div className="lg:col-span-2 space-y-6">

                {/* iKhokha card payment */}
                <div className="bg-card border-2 border-foreground/10 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 flex items-center gap-3 bg-foreground/5">
                    <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Pay by Card</p>
                      <p className="text-xs text-muted-foreground">Credit or debit card via iKhokha</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Pay securely with your card. Your details stay here — no redirect needed.
                    </p>
                    <button
                      onClick={openCardPopup}
                      className="flex items-center justify-center w-full h-12 bg-foreground text-background rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      Pay by Card
                    </button>
                    <p className="text-center text-[10px] text-muted-foreground">Powered by iKhokha</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">or pay via PayShap</span>
                  <div className="flex-1 h-px bg-border/50" />
                </div>

                {/* PayShap */}
                <div className="bg-card border-2 border-accent/30 rounded-2xl overflow-hidden">
                  <div className="bg-accent/10 px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Pay via PayShap</p>
                      <p className="text-xs text-muted-foreground">Instant bank-to-bank payment</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {[
                      { label: 'PayShap Number', value: '082 827 7990', copy: '0828277990' },
                      { label: 'Account Name',   value: 'Angela / ZENistry', copy: 'ZENistry' },
                      { label: 'Amount',         value: `R ${total.toFixed(2)}`, copy: total.toFixed(2) },
                      { label: 'Reference',      value: trackingNumber, copy: trackingNumber },
                    ].map(({ label, value, copy }) => (
                      <div key={label} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
                          <p className={`font-medium text-foreground mt-0.5 ${label === 'Reference' ? 'font-mono text-accent' : ''}`}>
                            {value}
                          </p>
                        </div>
                        <button
                          onClick={() => copyText(copy, label)}
                          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                          aria-label={`Copy ${label}`}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="px-6 pb-6 space-y-4">
                    <div className="bg-secondary/30 rounded-xl border border-border/50 p-5 space-y-3">
                      <p className="text-sm font-medium text-foreground">How to pay with PayShap</p>
                      <ol className="space-y-2">
                        {[
                          'Open your banking app',
                          'Navigate to Pay → PayShap',
                          'Enter the PayShap number: 082 827 7990',
                          `Enter the amount: R ${total.toFixed(2)}`,
                          `Use reference: ${trackingNumber}`,
                          'Confirm the payment',
                        ].map((s, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="w-5 h-5 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                              {i + 1}
                            </span>
                            {s}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <Button
                      onClick={handleMarkAsPaid}
                      size="lg"
                      className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-base rounded-xl"
                    >
                      <CheckCircle2 className="mr-2 w-5 h-5" />
                      I&apos;ve Completed Payment
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Angela will verify your payment and update your order status.
                    </p>
                  </div>
                </div>

              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl border border-border/50 p-6 sticky top-24 space-y-6">
                  <h2 className="font-serif text-2xl font-medium text-foreground">Order Summary</h2>
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-4 border-b border-border/30 last:border-0 last:pb-0">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/30">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-foreground mt-1">R{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border/50 pt-5 space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span><span>R{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery</span><span className="text-accent font-medium">Free</span>
                    </div>
                    <div className="flex justify-between font-serif text-xl font-semibold text-foreground pt-3 border-t border-border/50">
                      <span>Total</span><span>R{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/shop">+ Add More Items</Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
      <Footer />

</>
  )
}
