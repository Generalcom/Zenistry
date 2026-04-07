'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { products as defaultProducts, Product } from '@/lib/products'
import {
  getOverrides, setOverride, resetOverride,
  exportOverrides, importOverrides, ProductOverride,
} from '@/lib/admin-products'
import {
  getAllOrders, ORDER_STATUSES, formatDate, Order, OrderStatus,
} from '@/lib/orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageManager } from '@/components/admin/image-manager'
import { toast } from 'sonner'
import {
  LogOut, Save, RotateCcw, Eye, EyeOff, Download, Upload,
  Package, ShoppingBag, ArrowUpRight, ImageIcon, ChevronDown,
  ChevronUp, Truck, CheckCircle2, TrendingUp, BarChart2, Clock,
  Banknote, ArrowRight, Users, Search, Filter, X,
} from 'lucide-react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'zenestry2026'
const SESSION_KEY = 'zenestry-admin-auth'
const BADGE_OPTIONS = ['', 'Bestseller', 'New', 'Premium', 'Popular', 'Sale']
const PAID_STATUSES: OrderStatus[] = ['confirmed', 'packaged', 'out_for_delivery', 'delivered']

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return `R ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2 text-sm">ZENistry — Store Management</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border/50 p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Enter admin password"
                className={`bg-background border-border/50 pr-10 ${error ? 'border-destructive' : ''}`}
                autoFocus
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-destructive text-xs">Incorrect password.</p>}
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Log In</Button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          Default password: <code className="bg-secondary px-1 rounded">zenestry2026</code>
          <br />Set <code className="bg-secondary px-1 rounded">NEXT_PUBLIC_ADMIN_PASSWORD</code> in your environment to change it.
        </p>
      </div>
    </div>
  )
}

// ── Enhanced Sales Panel ───────────────────────────────────────────────────────────
function SalesPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [range, setRange] = useState<7 | 14 | 30>(14)
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'customers'>('revenue')

  useEffect(() => {
    const all = getAllOrders()
    setOrders(Object.values(all).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }, [])

  const paidOrders = orders.filter((o) => PAID_STATUSES.includes(o.status))
  const pendingOrders = orders.filter((o) => o.status === 'ordered')

  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0)
  const pendingRevenue = pendingOrders.reduce((s, o) => s + o.total, 0)
  const avgOrder = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  // Unique customers
  const uniqueCustomers = new Set(paidOrders.map(o => `${o.customer.firstName} ${o.customer.lastName}`)).size
  const repeatCustomers = paidOrders.filter((order, index, self) => 
    self.findIndex(o => 
      `${o.customer.firstName} ${o.customer.lastName}` === `${order.customer.firstName} ${order.customer.lastName}`
    ) !== index
  ).length

  // Category performance
  const categoryPerformance: Record<string, { revenue: number; orders: number; items: number }> = {}
  paidOrders.forEach(order => {
    order.items.forEach(item => {
      const product = defaultProducts.find(p => p.id === item.id)
      if (product) {
        if (!categoryPerformance[product.category]) {
          categoryPerformance[product.category] = { revenue: 0, orders: 0, items: 0 }
        }
        categoryPerformance[product.category].revenue += item.price * item.quantity
        categoryPerformance[product.category].items += item.quantity
      }
    })
    Object.keys(categoryPerformance).forEach(cat => {
      if (order.items.some(item => {
        const product = defaultProducts.find(p => p.id === item.id)
        return product?.category === cat
      })) {
        categoryPerformance[cat].orders += 1
      }
    })
  })

  // Chart data based on selected metric
  const chartData = Array.from({ length: range }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (range - 1 - i))
    const dateStr = d.toISOString().split('T')[0]
    const dayOrders = paidOrders.filter((o) => o.createdAt.startsWith(dateStr))
    
    const dayCustomers = new Set(dayOrders.map(o => `${o.customer.firstName} ${o.customer.lastName}`)).size
    
    return {
      label: d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' }),
      revenue: parseFloat(dayOrders.reduce((s, o) => s + o.total, 0).toFixed(2)),
      orders: dayOrders.length,
      customers: dayCustomers,
    }
  })

  // Top products by revenue
  const productMap: Record<string, { name: string; qty: number; revenue: number; image: string }> = {}
  paidOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productMap[item.id]) {
        productMap[item.id] = { name: item.name, qty: 0, revenue: 0, image: item.image }
      }
      productMap[item.id].qty += item.quantity
      productMap[item.id].revenue += item.price * item.quantity
    })
  })
  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)

  const hasData = paidOrders.length > 0

  return (
    <div className="space-y-8">

      {/* Enhanced Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: fmt(totalRevenue),
            sub: `${paidOrders.length} paid order${paidOrders.length !== 1 ? 's' : ''}`,
            icon: Banknote,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          },
          {
            label: 'Unique Customers',
            value: String(uniqueCustomers),
            sub: `${repeatCustomers} repeat${repeatCustomers !== 1 ? 's' : ''}`,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-950/30',
          },
          {
            label: 'Avg Order Value',
            value: fmt(avgOrder),
            sub: 'Per paid order',
            icon: TrendingUp,
            color: 'text-violet-600',
            bg: 'bg-violet-50 dark:bg-violet-950/30',
          },
          {
            label: 'Pending Revenue',
            value: fmt(pendingRevenue),
            sub: `${pendingOrders.length} awaiting confirmation`,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-950/30',
          },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card rounded-xl border border-border/50 p-5 space-y-3">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="font-serif text-2xl font-semibold text-foreground mt-0.5">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Revenue/Orders/Customers chart */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-serif text-lg font-medium text-foreground">Performance Over Time</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Track revenue, orders, and customers</p>
          </div>
          <div className="flex gap-2">
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
              {([7, 14, 30] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    range === r ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
              {[
                { key: 'revenue' as const, label: 'Revenue' },
                { key: 'orders' as const, label: 'Orders' },
                { key: 'customers' as const, label: 'Customers' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedMetric === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No paid orders yet — data will appear here once payments are confirmed.</p>
          </div>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={range === 30 ? 8 : 16} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  interval={range === 30 ? 4 : range === 14 ? 1 : 0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => selectedMetric === 'revenue' ? `R${v}` : String(v)}
                />
                <Tooltip
                  cursor={{ fill: 'var(--accent)', opacity: 0.08 }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    const value = payload[0]?.value as number
                    const metricLabel = selectedMetric === 'revenue' ? 'Revenue' : selectedMetric === 'orders' ? 'Orders' : 'Customers'
                    const formattedValue = selectedMetric === 'revenue' ? fmt(value) : String(value)
                    
                    return (
                      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
                        <p className="font-medium text-foreground mb-1">{label}</p>
                        <p className="text-emerald-600 font-semibold">{metricLabel}: {formattedValue}</p>
                        {selectedMetric === 'revenue' && (
                          <p className="text-muted-foreground text-xs">{payload[0]?.payload?.orders} order{payload[0]?.payload?.orders !== 1 ? 's' : ''}</p>
                        )}
                      </div>
                    )
                  }}
                />
                <Bar dataKey={selectedMetric} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => {
                    const value = entry[selectedMetric]
                    return (
                      <Cell
                        key={i}
                        fill={value > 0 ? 'var(--accent)' : 'var(--border)'}
                        opacity={value > 0 ? 1 : 0.4}
                      />
                    )
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Category Performance */}
      {Object.keys(categoryPerformance).length > 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h3 className="font-serif text-lg font-medium text-foreground">Category Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryPerformance)
              .sort(([,a], [,b]) => b.revenue - a.revenue)
              .map(([category, data]) => (
                <div key={category} className="bg-secondary/30 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-foreground">{category}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-semibold">{fmt(data.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Orders:</span>
                      <span>{data.orders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span>{data.items}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Top products + recent orders */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Top products */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <h3 className="font-serif text-lg font-medium text-foreground">Top Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-4 shrink-0">#{i + 1}</span>
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary/40 shrink-0">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.qty} sold</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground shrink-0">{fmt(p.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent paid orders */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium text-foreground">Recent Paid Orders</h3>
            <span className="text-xs text-muted-foreground">{paidOrders.length} total</span>
          </div>
          {paidOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No confirmed payments yet</p>
          ) : (
            <div className="space-y-3">
              {paidOrders.slice(0, 6).map((order) => {
                const statusInfo = ORDER_STATUSES.find((s) => s.key === order.status)
                return (
                  <div key={order.trackingNumber} className="flex items-start justify-between gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-accent">{order.trackingNumber}</p>
                      <p className="text-sm text-foreground truncate mt-0.5">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                        {' · '}
                        <span className="text-accent">{statusInfo?.label}</span>
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground shrink-0">
                      {fmt(order.total)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

// ── Enhanced Product editor row ─────────────────────────────────────────────────────────
function ProductRow({
  product, override, onSave, onReset,
}: {
  product: Product
  override: ProductOverride | undefined
  onSave: (id: string, data: ProductOverride) => void
  onReset: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [showImageManager, setShowImageManager] = useState(false)
  const [form, setForm] = useState({
    name: override?.name ?? product.name,
    price: String(override?.price ?? product.price),
    originalPrice: String(override?.originalPrice ?? product.originalPrice ?? ''),
    badge: override?.badge !== undefined ? (override.badge ?? '') : (product.badge ?? ''),
    image: override?.image ?? product.image,
    description: override?.description ?? product.description,
  })
  const [previewImg, setPreviewImg] = useState(form.image)
  const hasOverride = !!override

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSave = () => {
    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) { toast.error('Price must be a valid number'); return }
    onSave(product.id, {
      name: form.name.trim() || product.name,
      price,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) || null : null,
      badge: form.badge || null,
      image: form.image.trim() || product.image,
      description: form.description.trim() || product.description,
    })
    setPreviewImg(form.image.trim() || product.image)
    setOpen(false)
  }

  const handleReset = () => {
    setForm({
      name: product.name,
      price: String(product.price),
      originalPrice: String(product.originalPrice ?? ''),
      badge: product.badge ?? '',
      image: product.image,
      description: product.description,
    })
    setPreviewImg(product.image)
    onReset(product.id)
  }

  const handleImageSelect = (imageUrl: string) => {
    setForm(prev => ({ ...prev, image: imageUrl }))
    setPreviewImg(imageUrl)
    setShowImageManager(false)
  }

  return (
    <>
      <div className={`bg-card rounded-xl border ${hasOverride ? 'border-accent/40' : 'border-border/50'} overflow-hidden`}>
        <div className="flex items-center gap-4 p-4">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/40">
            <Image src={previewImg} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground text-sm truncate">{form.name}</p>
              {hasOverride && (
                <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded-full shrink-0">Edited</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-semibold text-foreground">R {form.price}</p>
            {form.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">R {form.originalPrice}</p>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shrink-0"
          >
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border/50 p-5 space-y-5 bg-secondary/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Name</label>
                <Input value={form.name} onChange={set('name')} className="bg-background border-border/50 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Price (R) *</label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} className="bg-background border-border/50 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Original Price (R) <span className="normal-case text-muted-foreground font-normal">— strike-through</span>
                </label>
                <Input type="number" min="0" step="0.01" value={form.originalPrice} onChange={set('originalPrice')} placeholder="Leave blank to remove" className="bg-background border-border/50 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Badge</label>
                <select value={form.badge} onChange={set('badge')} className="w-full h-10 px-3 rounded-md border border-border/50 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {BADGE_OPTIONS.map((b) => <option key={b} value={b}>{b || '— None —'}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Product Image
              </label>
              <div className="flex gap-3">
                <Input value={form.image} onChange={set('image')} placeholder="https://..." className="bg-background border-border/50 text-sm flex-1" />
                <Button type="button" variant="outline" size="sm" onClick={() => setPreviewImg(form.image)} className="shrink-0">Preview</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowImageManager(true)} className="shrink-0 gap-1">
                  <ImageIcon className="w-3 h-3" /> Browse
                </Button>
              </div>
              <div className="relative h-40 rounded-lg overflow-hidden bg-secondary/30">
                <Image src={previewImg} alt="Preview" fill className="object-contain" onError={() => toast.error('Image URL could not be loaded')} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Short Description</label>
              <textarea value={form.description} onChange={set('description')} rows={2} className="w-full px-3 py-2 rounded-md border border-border/50 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
              {hasOverride && (
                <Button onClick={handleReset} variant="outline" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5">
                  <RotateCcw className="w-4 h-4" /> Reset to Default
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {showImageManager && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="font-serif text-lg font-medium">Image Library</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowImageManager(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <ImageManager onSelectImage={handleImageSelect} showUnassigned={true} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Enhanced Orders Panel ───────────────────────────────────────────────────────────
function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [updating, setUpdating] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')

  useEffect(() => {
    const all = getAllOrders()
    setOrders(Object.values(all).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }, [])

  const updateStatus = (trackingNumber: string, status: OrderStatus) => {
    setUpdating(trackingNumber)
    const all = getAllOrders()
    if (all[trackingNumber]) {
      all[trackingNumber].status = status
      localStorage.setItem('zenestry-orders', JSON.stringify(all))
      setOrders(Object.values(all).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      toast.success('Order status updated')
    }
    setUpdating(null)
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    const searchMatch = searchTerm === '' || 
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm)

    // Status filter
    const statusMatch = statusFilter === 'all' || order.status === statusFilter

    // Date filter
    let dateMatch = true
    const orderDate = new Date(order.createdAt)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (dateFilter === 'today') {
      const orderDay = new Date(order.createdAt)
      orderDay.setHours(0, 0, 0, 0)
      dateMatch = orderDay.getTime() === today.getTime()
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      dateMatch = orderDate >= weekAgo
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      dateMatch = orderDate >= monthAgo
    }

    return searchMatch && statusMatch && dateMatch
  })

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter('all')
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || dateFilter !== 'all'

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
        <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-muted-foreground text-sm">No orders yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card rounded-xl border border-border/50 p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking number, customer name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={(value: OrderStatus | 'all') => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status.key} value={status.key}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={(value: 'all' | 'today' | 'week' | 'month') => setDateFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <Filter className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Showing {filteredOrders.length} of {orders.length} orders
            {hasActiveFilters && ' (filtered)'}
          </p>
          <div className="flex gap-4 text-muted-foreground">
            <span>Paid: {orders.filter(o => PAID_STATUSES.includes(o.status)).length}</span>
            <span>Pending: {orders.filter(o => o.status === 'ordered').length}</span>
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
            <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-muted-foreground text-sm">No orders found matching your filters</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const currentIdx = ORDER_STATUSES.findIndex((s) => s.key === order.status)
            const isPaid = PAID_STATUSES.includes(order.status)
            return (
              <div key={order.trackingNumber} className={`bg-card rounded-xl border p-5 space-y-4 ${isPaid ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-border/50'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-bold text-accent">{order.trackingNumber}</p>
                      {isPaid && (
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">Paid</span>
                      )}
                    </div>
                    <p className="text-sm text-foreground mt-0.5">
                      {order.customer.firstName} {order.customer.lastName} — {order.customer.phone}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer.address}, {order.customer.city} {order.customer.postalCode}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-lg font-semibold text-foreground">R{order.total.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                {/* Order items */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Order Items</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-border/20 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 relative rounded overflow-hidden bg-secondary/40">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">R {item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground">×{item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {ORDER_STATUSES.map((s, idx) => (
                      <button
                        key={s.key}
                        disabled={updating === order.trackingNumber}
                        onClick={() => updateStatus(order.trackingNumber, s.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          s.key === order.status
                            ? 'bg-accent text-accent-foreground ring-2 ring-accent/30'
                            : idx < currentIdx
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {s.key === order.status && <CheckCircle2 className="w-3 h-3" />}
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ── Customer Management Panel ─────────────────────────────────────────────────────
function CustomersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'orders' | 'revenue' | 'recent'>('recent')

  useEffect(() => {
    const all = getAllOrders()
    setOrders(Object.values(all).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }, [])

  // Aggregate customer data
  const customerMap: Record<string, {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    orders: Order[]
    totalSpent: number
    firstOrder: string
    lastOrder: string
  }> = {}

  orders.forEach(order => {
    const key = `${order.customer.firstName} ${order.customer.lastName}`
    if (!customerMap[key]) {
      customerMap[key] = {
        name: key,
        email: order.customer.email,
        phone: order.customer.phone,
        address: order.customer.address,
        city: order.customer.city,
        postalCode: order.customer.postalCode,
        orders: [],
        totalSpent: 0,
        firstOrder: order.createdAt,
        lastOrder: order.createdAt,
      }
    }
    
    const customer = customerMap[key]
    customer.orders.push(order)
    customer.totalSpent += order.total
    
    if (order.createdAt < customer.firstOrder) {
      customer.firstOrder = order.createdAt
    }
    if (order.createdAt > customer.lastOrder) {
      customer.lastOrder = order.createdAt
    }
  })

  // Filter and sort customers
  let customers = Object.values(customerMap)
  
  if (searchTerm) {
    customers = customers.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  customers.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'orders':
        return b.orders.length - a.orders.length
      case 'revenue':
        return b.totalSpent - a.totalSpent
      case 'recent':
      default:
        return b.lastOrder.localeCompare(a.lastOrder)
    }
  })

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
  const repeatCustomers = customers.filter(c => c.orders.length > 1).length

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Customers',
            value: String(totalCustomers),
            sub: `${repeatCustomers} repeat customers`,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-950/30',
          },
          {
            label: 'Customer Revenue',
            value: fmt(totalRevenue),
            sub: 'All time',
            icon: Banknote,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          },
          {
            label: 'Avg Customer Value',
            value: fmt(avgCustomerValue),
            sub: 'Per customer',
            icon: TrendingUp,
            color: 'text-violet-600',
            bg: 'bg-violet-50 dark:bg-violet-950/30',
          },
          {
            label: 'Repeat Rate',
            value: totalCustomers > 0 ? `${Math.round((repeatCustomers / totalCustomers) * 100)}%` : '0%',
            sub: `${repeatCustomers} of ${totalCustomers} customers`,
            icon: CheckCircle2,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-950/30',
          },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card rounded-xl border border-border/50 p-5 space-y-3">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="font-serif text-2xl font-semibold text-foreground mt-0.5">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and search */}
      <div className="bg-card rounded-xl border border-border/50 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, phone, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={sortBy} onValueChange={(value: 'name' | 'orders' | 'revenue' | 'recent') => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="orders">Most Orders</SelectItem>
              <SelectItem value="revenue">Highest Value</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customers list */}
      {customers.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-muted-foreground text-sm">
            {searchTerm ? 'No customers found matching your search' : 'No customers yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map((customer, index) => (
            <Card key={`${customer.name}-${index}`} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="ml-2 text-foreground">{customer.phone}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Address:</span>
                          <span className="ml-2 text-foreground">
                            {customer.address}, {customer.city} {customer.postalCode}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-muted-foreground">Orders:</span>
                          <span className="ml-2 font-semibold text-foreground">{customer.orders.length}</span>
                          {customer.orders.length > 1 && (
                            <span className="ml-1 text-xs text-emerald-600">Repeat customer</span>
                          )}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Spent:</span>
                          <span className="ml-2 font-semibold text-foreground">{fmt(customer.totalSpent)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">First Order:</span>
                          <span className="ml-2 text-foreground">
                            {new Date(customer.firstOrder).toLocaleDateString('en-ZA', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Enhanced Products Panel with Bulk Operations ─────────────────────────────────────
function EnhancedProductsPanel({ 
  overrides, onSave, onReset, onExport, onImport, importRef 
}: {
  overrides: Record<string, ProductOverride>
  onSave: (id: string, data: ProductOverride) => void
  onReset: (id: string) => void
  onExport: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  importRef: React.RefObject<HTMLInputElement>
}) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'none' | 'badge' | 'price' | 'reset'>('none')
  const [bulkBadge, setBulkBadge] = useState('')
  const [bulkPriceChange, setBulkPriceChange] = useState({ type: 'percentage' as 'percentage' | 'fixed', value: '' })

  const handleSelectAll = () => {
    if (selectedProducts.size === defaultProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(defaultProducts.map(p => p.id)))
    }
  }

  const handleBulkAction = () => {
    if (selectedProducts.size === 0) {
      toast.error('Please select products first')
      return
    }

    if (bulkAction === 'badge') {
      selectedProducts.forEach(id => {
        setOverride(id, { badge: bulkBadge || null })
      })
      toast.success(`Updated badge for ${selectedProducts.size} products`)
    } else if (bulkAction === 'price') {
      const changeValue = parseFloat(bulkPriceChange.value)
      if (isNaN(changeValue)) {
        toast.error('Please enter a valid number')
        return
      }

      selectedProducts.forEach(id => {
        const product = defaultProducts.find(p => p.id === id)
        if (product) {
          const currentPrice = overrides[id]?.price ?? product.price
          let newPrice: number
          
          if (bulkPriceChange.type === 'percentage') {
            newPrice = currentPrice * (1 + changeValue / 100)
          } else {
            newPrice = currentPrice + changeValue
          }
          
          setOverride(id, { price: Math.max(0, newPrice) })
        }
      })
      toast.success(`Updated prices for ${selectedProducts.size} products`)
    } else if (bulkAction === 'reset') {
      selectedProducts.forEach(id => {
        resetOverride(id)
      })
      toast.success(`Reset ${selectedProducts.size} products to default`)
    }

    setSelectedProducts(new Set())
    setBulkAction('none')
  }

  const editedCount = Object.keys(overrides).length

  return (
    <div className="space-y-6">
      {/* Bulk operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bulk Operations</span>
            <span className="text-sm font-normal text-muted-foreground">
              {selectedProducts.size} of {defaultProducts.length} selected
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="gap-2"
            >
              {selectedProducts.size === defaultProducts.length ? (
                <><X className="w-4 h-4" /> Deselect All</>
              ) : (
                <>✓ Select All</>
              )}
            </Button>
            
            <Select value={bulkAction} onValueChange={(value: typeof bulkAction) => setBulkAction(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Choose action...</SelectItem>
                <SelectItem value="badge">Set Badge</SelectItem>
                <SelectItem value="price">Change Price</SelectItem>
                <SelectItem value="reset">Reset to Default</SelectItem>
              </SelectContent>
            </Select>

            {bulkAction === 'badge' && (
              <Select value={bulkBadge} onValueChange={setBulkBadge}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Badge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Remove</SelectItem>
                  {BADGE_OPTIONS.filter(b => b).map(badge => (
                    <SelectItem key={badge} value={badge}>{badge}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {bulkAction === 'price' && (
              <div className="flex items-center gap-2">
                <Select 
                  value={bulkPriceChange.type} 
                  onValueChange={(value: 'percentage' | 'fixed') => 
                    setBulkPriceChange(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">R</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder={bulkPriceChange.type === 'percentage' ? '10' : '50'}
                  value={bulkPriceChange.value}
                  onChange={(e) => setBulkPriceChange(prev => ({ ...prev, value: e.target.value }))}
                  className="w-24"
                />
              </div>
            )}

            {bulkAction !== 'none' && (
              <Button onClick={handleBulkAction} className="gap-2">
                <Save className="w-4 h-4" /> Apply to Selected
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Header with export/import */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {defaultProducts.length} products · {editedCount} override{editedCount !== 1 ? 's' : ''} active
        </p>
        <div className="flex gap-2">
          <Button onClick={onExport} variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button onClick={() => importRef.current?.click()} variant="outline" size="sm" className="gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Import
          </Button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={onImport} />
        </div>
      </div>

      {/* Products list */}
      <div className="space-y-3">
        {defaultProducts.map((product) => {
          const isSelected = selectedProducts.has(product.id)
          return (
            <div key={product.id} className="relative">
              <div className="absolute left-4 top-4 z-10">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    const newSelected = new Set(selectedProducts)
                    if (e.target.checked) {
                      newSelected.add(product.id)
                    } else {
                      newSelected.delete(product.id)
                    }
                    setSelectedProducts(newSelected)
                  }}
                  className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="pl-12">
                <ProductRow
                  product={product}
                  override={overrides[product.id]}
                  onSave={onSave}
                  onReset={onReset}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Admin ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [activeTab, setActiveTab] = useState<'sales' | 'products' | 'orders' | 'customers'>('sales')
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>({})
  const importRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAuthed(true)
  }, [])

  useEffect(() => {
    if (authed) setOverrides(getOverrides())
  }, [authed])

  const handleSave = (id: string, data: ProductOverride) => {
    setOverride(id, data)
    setOverrides(getOverrides())
    toast.success('Product updated')
  }

  const handleReset = (id: string) => {
    resetOverride(id)
    setOverrides(getOverrides())
    toast.success('Product reset to default')
  }

  const handleExport = () => {
    const json = exportOverrides()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zenestry-overrides-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Settings exported')
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        importOverrides(ev.target?.result as string)
        setOverrides(getOverrides())
        toast.success('Settings imported successfully')
      } catch {
        toast.error('Invalid file — please use an exported JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const editedCount = Object.keys(overrides).length

  const TABS = [
    { key: 'sales' as const, label: 'Sales', icon: BarChart2 },
    { key: 'products' as const, label: 'Products', icon: Package },
    { key: 'orders' as const, label: 'Orders', icon: Truck },
    { key: 'customers' as const, label: 'Customers', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border/50 bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-xl text-foreground">ZENistry Admin</h1>
            {editedCount > 0 && (
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium hidden sm:inline">
                {editedCount} override{editedCount !== 1 ? 's' : ''} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5 hidden sm:flex">
              <Link href="/" target="_blank">
                <Eye className="w-3.5 h-3.5" /> View Site <ArrowUpRight className="w-3 h-3" />
              </Link>
            </Button>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl">

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl mb-8 w-fit">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Sales tab */}
        {activeTab === 'sales' && <SalesPanel />}

        {/* Products tab */}
        {activeTab === 'products' && (
          <EnhancedProductsPanel 
            overrides={overrides}
            onSave={handleSave}
            onReset={handleReset}
            onExport={handleExport}
            onImport={handleImport}
            importRef={importRef}
          />
        )}

        {/* Orders tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Update order statuses here. Confirmed orders count toward sales revenue.
            </p>
            <OrdersPanel />
          </div>
        )}

        {/* Customers tab */}
        {activeTab === 'customers' && <CustomersPanel />}

      </div>
    </div>
  )
}
