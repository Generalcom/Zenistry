'use client'

import { Suspense, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getOrderByTracking,
  ORDER_STATUSES,
  formatDate,
  Order,
} from '@/lib/orders'
import {
  Search,
  Package,
  CheckCircle2,
  Circle,
  Truck,
  MapPin,
  ShoppingBag,
  Clock,
  MessageCircle,
} from 'lucide-react'

const STATUS_ICONS = {
  ordered: ShoppingBag,
  confirmed: CheckCircle2,
  packaged: Package,
  out_for_delivery: Truck,
  delivered: CheckCircle2,
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState(searchParams.get('number') ?? '')
  const [searched, setSearched] = useState(!!searchParams.get('number'))
  const [order, setOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const num = searchParams.get('number')
    if (num) {
      setInputValue(num)
      doLookup(num)
    }
  }, [searchParams])

  function doLookup(val: string) {
    const result = getOrderByTracking(val.trim())
    setSearched(true)
    if (result) {
      setOrder(result)
      setNotFound(false)
    } else {
      setOrder(null)
      setNotFound(true)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    doLookup(inputValue)
  }

  const currentStatusIndex = order
    ? ORDER_STATUSES.findIndex((s) => s.key === order.status)
    : -1

  const whatsappMsg = order
    ? `Hi Angela! I'd like a status update on my order.\n\nTracking: *${order.trackingNumber}*\nName: ${order.customer.firstName} ${order.customer.lastName}\n\nThank you!`
    : ''

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-20">
        {/* Hero */}
        <div className="border-b border-border/50 bg-secondary/20 py-12">
          <div className="container mx-auto px-4 lg:px-8 space-y-3 text-center max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full">
              Order Tracking
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl text-foreground">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your tracking number to see where your ZENistry order is right now.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-12 max-w-3xl">

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. ZEN-A7K3M9X2"
                className="pl-11 h-14 text-base bg-card border-border/50 font-mono"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8"
            >
              Track
            </Button>
          </form>

          {/* Not found */}
          {searched && notFound && (
            <div className="text-center py-16 space-y-4 bg-card rounded-2xl border border-border/50">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-xl text-foreground">Order Not Found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                We couldn't find an order with that tracking number. Please double-check the number
                from your confirmation page.
              </p>
              <a
                href="https://wa.me/27828277990"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#25D366] font-medium hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Angela on WhatsApp
              </a>
            </div>
          )}

          {/* Order found */}
          {order && (
            <div className="space-y-8">

              {/* Tracking header */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Tracking Number</p>
                  <p className="font-mono text-2xl font-bold text-foreground">{order.trackingNumber}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ordered {formatDate(order.createdAt)}
                  </p>
                </div>
                <a
                  href={`https://wa.me/27828277990?text=${encodeURIComponent(whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Ask Angela
                </a>
              </div>

              {/* Status Timeline */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-2">
                <h2 className="font-serif text-xl font-medium text-foreground mb-6">Order Status</h2>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />

                  <div className="space-y-0">
                    {ORDER_STATUSES.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex
                      const isCurrent = index === currentStatusIndex
                      const Icon = STATUS_ICONS[status.key]

                      return (
                        <div
                          key={status.key}
                          className={`relative flex gap-5 pb-8 last:pb-0 ${
                            isCompleted ? '' : 'opacity-40'
                          }`}
                        >
                          {/* Icon */}
                          <div
                            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isCurrent
                                ? 'bg-accent text-accent-foreground shadow-lg ring-4 ring-accent/20'
                                : isCompleted
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-border text-muted-foreground'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="pt-1.5 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <p
                                className={`font-medium ${
                                  isCurrent ? 'text-accent' : 'text-foreground'
                                }`}
                              >
                                {status.label}
                              </p>
                              {isCurrent && (
                                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {status.description}
                            </p>
                            {isCurrent && status.key === 'ordered' && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Angela will contact you shortly to confirm
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Estimated delivery */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border/50 rounded-xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      Estimated Delivery
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                </div>
                <div className="bg-card border border-border/50 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      Delivering to
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.customer.city}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
                <h3 className="font-serif text-lg font-medium text-foreground">
                  Items in this order
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/40">
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
                  <span className="font-serif text-sm font-medium text-foreground">Order Total</span>
                  <span className="font-serif text-xl font-semibold text-foreground">
                    R{order.total.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* Empty state — no search yet */}
          {!searched && (
            <div className="text-center py-12 text-muted-foreground space-y-3">
              <Package className="w-12 h-12 mx-auto opacity-30" />
              <p className="text-sm">Enter your tracking number above to get started.</p>
              <p className="text-xs">
                Your tracking number looks like <span className="font-mono text-foreground">ZEN-XXXXXXXX</span> and was shown on your order confirmation page.
              </p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TrackingContent />
    </Suspense>
  )
}
