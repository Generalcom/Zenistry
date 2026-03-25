'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCart, CartItem } from '@/hooks/use-cart'
import { ShoppingBag, Check, Heart, Leaf, Star, Sparkles } from 'lucide-react'

// ---------------------------------------------------------------------------
// Personalized message generator — reads the cart items and the buyer's name
// ---------------------------------------------------------------------------
function getPersonalizedMessage(
  items: CartItem[],
  firstName: string
): { heading: string; body: string; icon: React.ReactNode } {
  const names = items.map((i) => i.name.toLowerCase()).join(' ')
  const name = firstName.trim() || 'Beautiful Soul'

  const hasAshwagandha = names.includes('ashwagandha')
  const hasBlackSeed = names.includes('black seed')
  const hasShilajit = names.includes('shilajit')
  const hasSerum = names.includes('serum') || names.includes('glow')
  const hasFaceOil = names.includes('face oil') || names.includes('hydrating')
  const hasBodyWash = names.includes('bodywash') || names.includes('body wash')
  const hasBodyCreme = names.includes('crème') || names.includes('creme') || names.includes('body cr')
  const hasHoney = names.includes('honey')

  if (hasAshwagandha && hasBlackSeed) {
    return {
      heading: `${name}, you have chosen true power.`,
      body: `Ashwagandha to calm your mind and Black Seed Oil to strengthen your body — this honey is one of nature's most ancient and revered gifts. A single spoon each morning is an act of deep love toward yourself. Your inner balance begins right now, and Angela cannot wait for you to feel the difference.`,
      icon: <Leaf className="w-7 h-7 text-accent" />,
    }
  }
  if (hasShilajit) {
    return {
      heading: `${name}, you are investing in your vitality.`,
      body: `Shilajit is the mineral of the mountains — used for centuries to restore energy, mental clarity, and deep-rooted strength. By choosing this honey, you are choosing to nourish yourself from the very core. This is a powerful and intentional step on your wellness journey, and you deserve every benefit it brings.`,
      icon: <Star className="w-7 h-7 text-accent" />,
    }
  }
  if (hasHoney && (hasSerum || hasFaceOil)) {
    return {
      heading: `${name}, you are glowing from the inside out.`,
      body: `You have chosen to nourish your body both inside and out — and that is the most complete and beautiful form of self-care. Nature's honey heals and restores within, while your skincare ritual illuminates what the world sees. You deserve every drop of this radiance. Angela handcrafted these with you in mind.`,
      icon: <Sparkles className="w-7 h-7 text-accent" />,
    }
  }
  if (hasSerum || hasFaceOil) {
    return {
      heading: `${name}, your skin is about to transform.`,
      body: `You chose something truly special. Every formulation is crafted with intention and the purest botanical ingredients to reveal your skin's natural luminosity. Be gentle and consistent — this is a relationship, not a quick fix. Glow is not just a look, it is a feeling, and you are about to feel it every single day.`,
      icon: <Sparkles className="w-7 h-7 text-accent" />,
    }
  }
  if (hasBodyWash && hasBodyCreme) {
    return {
      heading: `${name}, your self-care ritual just levelled up.`,
      body: `The White Tea collection is pure sensory indulgence. Warm water, a silky lather, and the gentle embrace of botanical White Tea — followed by the most luxurious crème on your skin. Every shower from today will feel like a private spa. Small, sacred rituals are where wellness truly lives, and you just chose one.`,
      icon: <Heart className="w-7 h-7 text-accent" />,
    }
  }
  if (hasBodyWash) {
    return {
      heading: `${name}, every shower will now feel sacred.`,
      body: `The White Tea Bodywash is more than a cleanser — it is a ritual you give yourself each day. Let the calming botanicals wash over you and turn an ordinary shower into a moment of peace that belongs entirely to you. Self-care does not have to be grand. Sometimes it is just this: warm water and something made with love.`,
      icon: <Heart className="w-7 h-7 text-accent" />,
    }
  }
  if (hasBodyCreme) {
    return {
      heading: `${name}, softer skin and a softer spirit await.`,
      body: `The White Tea Body Crème is crafted to melt into your skin and soothe your senses at the same time. Apply it slowly after a warm shower, breathe in the gentle fragrance, and let it be your daily reminder that you are absolutely worth taking care of. You chose yourself today. That is everything.`,
      icon: <Heart className="w-7 h-7 text-accent" />,
    }
  }
  if (hasHoney) {
    return {
      heading: `${name}, nature's medicine is on its way to you.`,
      body: `Pure, raw, and infused with purpose — every Zenestry honey is made with love and deep intention. Whether you stir it into your morning tea, take it by the spoon, or share it with someone you treasure, know that Angela crafted every single jar by hand. Your wellness journey has a beautiful and powerful new companion.`,
      icon: <Leaf className="w-7 h-7 text-accent" />,
    }
  }
  return {
    heading: `${name}, your Zenestry journey begins right now.`,
    body: `Everything in your order was made with pure ingredients and genuine care by Angela herself. What you have chosen is more than skincare or wellness products — it is a commitment to yourself, to slowing down, and to living with intention. You chose nature. You chose quality. You chose you. Thank you for trusting Zenestry with your wellbeing.`,
    icon: <Heart className="w-7 h-7 text-accent" />,
  }
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedItems, setSavedItems] = useState<CartItem[]>([])
  const [savedTotal, setSavedTotal] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setIsSubmitting(true)
    setSavedItems([...items])
    setSavedTotal(total)
    setTimeout(() => {
      clearCart()
      setIsSubmitting(false)
      setOrderPlaced(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1200)
  }

  const message = getPersonalizedMessage(
    savedItems.length ? savedItems : items,
    formData.firstName
  )

  // -------
  // ORDER CONFIRMATION SCREEN
  // -------
  if (orderPlaced) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center px-4 py-24">
          <div className="max-w-2xl w-full mx-auto space-y-8">

            {/* Check circle */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                <Check className="w-10 h-10 text-accent" strokeWidth={2.5} />
              </div>
            </div>

            {/* Personalized message */}
            <div className="bg-card rounded-2xl border border-accent/20 p-8 md:p-10 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                {message.icon}
                <span className="text-xs font-medium tracking-widest text-accent uppercase">A message from Angela</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground leading-snug">
                {message.heading}
              </h2>
              <p className="text-foreground/75 leading-relaxed">
                {message.body}
              </p>
              <div className="pt-1 border-t border-border/40 space-y-1 text-sm text-muted-foreground">
                <p>
                  Angela will reach out to{' '}
                  <strong className="text-foreground">{formData.phone}</strong> to confirm your order and arrange payment.
                </p>
                <p>
                  You can also WhatsApp her directly at{' '}
                  <a href="tel:0828277990" className="text-accent font-medium hover:underline">082 827 7990</a>.
                </p>
              </div>
            </div>

            {/* Order recap */}
            <div className="bg-card rounded-xl border border-border/50 p-6 space-y-4">
              <h3 className="font-serif text-lg font-medium text-foreground">What you ordered</h3>
              <div className="space-y-3">
                {savedItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/40">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <span className="font-serif text-base font-medium text-foreground">Total</span>
                <span className="font-serif text-xl font-semibold text-foreground">R{savedTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/">Return Home</Link>
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

  // -------------------------------------------------------------------------
  // CHECKOUT FORM
  // -------------------------------------------------------------------------
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">

        {/* Page header */}
        <div className="border-b border-border/50 py-10 bg-secondary/20">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-serif text-4xl text-foreground">Checkout</h1>
            <p className="text-muted-foreground mt-1 text-sm">Review your order and complete your details below</p>
          </div>
        </div>

        {/* Empty cart */}
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

              {/* ---- LEFT: Form ---- */}
              <div className="lg:col-span-2">
                <form onSubmit={handlePlaceOrder} className="space-y-8">

                  {/* Your Details */}
                  <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-6">
                    <h2 className="font-serif text-2xl font-medium text-foreground">Your Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">First Name</label>
                        <Input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="e.g. Nomsa"
                          required
                          className="bg-background border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Last Name</label>
                        <Input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="e.g. Dlamini"
                          required
                          className="bg-background border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Email Address</label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="you@email.com"
                          required
                          className="bg-background border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Phone Number</label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="082 XXX XXXX"
                          required
                          className="bg-background border-border/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-6">
                    <h2 className="font-serif text-2xl font-medium text-foreground">Delivery Address</h2>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-foreground">Street Address</label>
                        <Input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="12 Maple Street, Apartment 4B"
                          required
                          className="bg-background border-border/50"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">City</label>
                          <Input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Cape Town"
                            required
                            className="bg-background border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-foreground">Postal Code</label>
                          <Input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="7441"
                            required
                            className="bg-background border-border/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment note */}
                  <div className="rounded-2xl border border-accent/25 bg-accent/5 p-6 md:p-8 space-y-3">
                    <h3 className="font-serif text-lg font-medium text-foreground">Payment Arrangement</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      After placing your order Angela will personally contact{' '}
                      <strong className="text-foreground">{formData.phone || 'your number'}</strong> to confirm and arrange payment via EFT, SnapScan, or PayShap.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prefer to reach out first? WhatsApp Angela on{' '}
                      <a href="tel:0828277990" className="text-accent font-medium hover:underline">082 827 7990</a>.
                    </p>
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-12 text-base rounded-xl disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Placing your order…
                      </span>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </form>
              </div>

              {/* ---- RIGHT: Order Summary ---- */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 sticky top-24 space-y-6">
                  <h2 className="font-serif text-2xl font-medium text-foreground">Order Summary</h2>

                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {items.map(item => (
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
