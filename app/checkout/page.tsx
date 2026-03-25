'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart } from '@/hooks/use-cart'
import {
  ShoppingBag,
  CheckCircle2,
  Copy,
  MapPin,
  Package,
  Truck,
} from 'lucide-react'
import {
  generateTrackingNumber,
  getEstimatedDelivery,
  saveOrder,
  formatDate,
  Order,
} from '@/lib/orders'
import { toast } from 'sonner'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  suburb: string
  city: string
  postalCode: string
  province: string
  deliveryNote: string
}

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [step, setStep] = useState<'form' | 'confirm'>(items.length === 0 ? 'form' : 'form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    suburb: '',
    city: '',
    postalCode: '',
    province: '',
    deliveryNote: '',
  })

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setIsSubmitting(true)

    setTimeout(() => {
      const trackingNumber = generateTrackingNumber()
      const estimatedDelivery = getEstimatedDelivery()
      const order: Order = {
        trackingNumber,
        status: 'ordered',
        createdAt: new Date().toISOString(),
        estimatedDelivery,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}${formData.suburb ? ', ' + formData.suburb : ''}`,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          image: i.image,
          quantity: i.quantity,
        })),
        total,
      }
      saveOrder(order)
      clearCart()
      setPlacedOrder(order)
      setStep('confirm')
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1200)
  }

  const copyTracking = () => {
    if (!placedOrder) return
    navigator.clipboard.writeText(placedOrder.trackingNumber)
    toast.success('Tracking number copied!')
  }

  // ── ORDER CONFIRMATION ─────────────────────────────────────────────────────
  if (step === 'confirm' && placedOrder) {
    const whatsappMsg = `Hi Angela! I just placed an order on Zenestry.\n\nTracking: *${placedOrder.trackingNumber}*\nName: ${placedOrder.customer.firstName} ${placedOrder.customer.lastName}\nPhone: ${placedOrder.customer.phone}\nTotal: R${placedOrder.total.toFixed(2)}\n\nPlease let me know how to arrange payment. Thank you!`

    return (
      <>
        <Header />
        <main className="min-h-screen bg-background py-16 px-4">
          <div className="max-w-2xl mx-auto space-y-8">

            {/* Check */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="font-serif text-3xl text-foreground">Order Placed!</h1>
                <p className="text-muted-foreground mt-1">
                  Thank you, {placedOrder.customer.firstName}. Angela will be in touch shortly.
                </p>
              </div>
            </div>

            {/* Tracking Number — hero */}
            <div className="bg-accent/5 border-2 border-accent/30 rounded-2xl p-8 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-accent uppercase">
                <Package className="w-4 h-4" />
                Your Tracking Number
              </div>
              <div className="font-mono text-4xl font-bold text-foreground tracking-widest">
                {placedOrder.trackingNumber}
              </div>
              <p className="text-sm text-muted-foreground">
                Save this number — you'll need it to check your order status
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={copyTracking}
                  variant="outline"
                  className="gap-2 border-accent/30 hover:bg-accent/10"
                >
                  <Copy className="w-4 h-4" />
                  Copy Number
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Link href={`/track?number=${placedOrder.trackingNumber}`}>
                    <Truck className="w-4 h-4" />
                    Track My Order
                  </Link>
                </Button>
              </div>
            </div>

            {/* Estimated delivery */}
            <div className="bg-card border border-border/50 rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">{formatDate(placedOrder.estimatedDelivery)}</p>
              </div>
            </div>

            {/* Delivery address */}
            <div className="bg-card border border-border/50 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Delivering to</p>
                <p className="text-sm text-muted-foreground">
                  {placedOrder.customer.firstName} {placedOrder.customer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{placedOrder.customer.address}</p>
                <p className="text-sm text-muted-foreground">
                  {placedOrder.customer.city}, {placedOrder.customer.postalCode}
                </p>
              </div>
            </div>

            {/* Order items */}
            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-medium text-foreground">What you ordered</h3>
              <div className="space-y-3">
                {placedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/40">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      R{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <span className="font-serif font-medium text-foreground">Total</span>
                <span className="font-serif text-xl font-semibold text-foreground">
                  R{placedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment note */}
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-5 space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Payment</p>
              <p>
                Angela will call or WhatsApp{' '}
                <strong className="text-foreground">{placedOrder.customer.phone}</strong> to confirm
                your order and arrange payment via EFT, SnapScan, or PayShap.
              </p>
              <a
                href={`https://wa.me/27828277990?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-[#25D366] font-medium hover:underline"
              >
                Or WhatsApp Angela directly →
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href={`/track?number=${placedOrder.trackingNumber}`}>Track My Order</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ── CHECKOUT FORM ──────────────────────────────────────────────────────────
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border/50 py-10 bg-secondary/20">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-serif text-4xl text-foreground">Checkout</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Fill in your details and we'll handle the rest
            </p>
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

              {/* ── Form ── */}
              <div className="lg:col-span-2">
                <form onSubmit={handlePlaceOrder} className="space-y-8">

                  {/* Personal Details */}
                  <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-6">
                    <h2 className="font-serif text-2xl font-medium text-foreground">Your Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">First Name *</label>
                        <Input value={formData.firstName} onChange={set('firstName')} placeholder="Nomsa" required className="bg-background border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Last Name *</label>
                        <Input value={formData.lastName} onChange={set('lastName')} placeholder="Dlamini" required className="bg-background border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone Number *</label>
                        <Input type="tel" value={formData.phone} onChange={set('phone')} placeholder="082 XXX XXXX" required className="bg-background border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email Address</label>
                        <Input type="email" value={formData.email} onChange={set('email')} placeholder="you@email.com" className="bg-background border-border/50" />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-6">
                    <h2 className="font-serif text-2xl font-medium text-foreground">Delivery Address</h2>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Street Address *</label>
                        <Input value={formData.address} onChange={set('address')} placeholder="12 Maple Street, Apt 4B" required className="bg-background border-border/50" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Suburb</label>
                          <Input value={formData.suburb} onChange={set('suburb')} placeholder="Sandton" className="bg-background border-border/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">City *</label>
                          <Input value={formData.city} onChange={set('city')} placeholder="Johannesburg" required className="bg-background border-border/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Postal Code *</label>
                          <Input value={formData.postalCode} onChange={set('postalCode')} placeholder="2196" required className="bg-background border-border/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Province *</label>
                          <select
                            value={formData.province}
                            onChange={set('province')}
                            required
                            className="w-full h-10 px-3 py-2 rounded-md border border-border/50 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="">Select province</option>
                            {PROVINCES.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Delivery Note <span className="text-muted-foreground font-normal">(optional)</span></label>
                        <textarea
                          value={formData.deliveryNote}
                          onChange={set('deliveryNote')}
                          placeholder="e.g. Leave at security, ring bell twice..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-md border border-border/50 bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment info */}
                  <div className="rounded-2xl border border-accent/25 bg-accent/5 p-6 space-y-2">
                    <h3 className="font-serif text-lg font-medium text-foreground">Payment</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      After placing your order Angela will personally contact you on{' '}
                      <strong>{formData.phone || 'your number'}</strong> to arrange payment via EFT, SnapScan, or PayShap.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-14 text-base rounded-xl disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Placing your order…
                      </span>
                    ) : (
                      'Place Order & Get Tracking Number'
                    )}
                  </Button>
                </form>
              </div>

              {/* ── Order Summary ── */}
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
                      <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                      <span>R{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery</span>
                      <span className="text-accent font-medium">Free</span>
                    </div>
                    <div className="flex justify-between items-center font-serif text-xl font-semibold text-foreground pt-3 border-t border-border/50">
                      <span>Total</span>
                      <span>R{total.toFixed(2)}</span>
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
