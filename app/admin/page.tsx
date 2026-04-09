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
import { toast } from 'sonner'
import {
  LogOut, Save, RotateCcw, Eye, EyeOff, Download, Upload,
  Package, ShoppingBag, ArrowUpRight, ImageIcon, ChevronDown,
  ChevronUp, Truck, CheckCircle2, TrendingUp, BarChart2, Clock,
  Banknote, ArrowRight, Shield,
} from 'lucide-react'
import { PasswordChange } from '@/components/admin/password-change'
import { getCurrentPassword, initializePassword } from '@/lib/password-manager'

const SESSION_KEY = 'ZENistry-admin-auth'
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
  const [isLoading, setIsLoading] = useState(false)
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if password is already set
    const checkPassword = async () => {
      try {
        const currentPassword = await getCurrentPassword()
        setHasPassword(!!currentPassword)
      } catch (error) {
        console.error('Error checking password:', error)
        setHasPassword(false)
      }
    }
    checkPassword()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const currentPassword = await getCurrentPassword()
      
      // If no password exists, initialize with the provided password
      if (!currentPassword) {
        const result = await initializePassword(pw)
        if (result.success) {
          sessionStorage.setItem(SESSION_KEY, '1')
          onLogin()
        } else {
          setError(true)
          setTimeout(() => setError(false), 2000)
        }
      } else {
        // Verify against existing password
        if (pw === currentPassword) {
          sessionStorage.setItem(SESSION_KEY, '1')
          onLogin()
        } else {
          setError(true)
          setTimeout(() => setError(false), 2000)
        }
      }
    } catch (error) {
      setError(true)
      setTimeout(() => setError(false), 2000)
    } finally {
      setIsLoading(false)
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
          <Button type="submit" disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {isLoading ? 'Logging in...' : 'Log In'}
        </Button>
        </form>
        {hasPassword === false && (
          <p className="text-center text-xs text-muted-foreground">
            First time setup: Enter a secure password to initialize admin access.
          </p>
        )}
        {hasPassword === true && (
          <p className="text-center text-xs text-muted-foreground">
            Enter your admin password to access the dashboard.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Sales Panel ───────────────────────────────────────────────────────────────
function SalesPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [range, setRange] = useState<7 | 14 | 30>(14)

  useEffect(() => {
    const all = getAllOrders()
    setOrders(Object.values(all).sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }, [])

  const paidOrders = orders.filter((o) => PAID_STATUSES.includes(o.status))
  const pendingOrders = orders.filter((o) => o.status === 'ordered')

  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0)
  const pendingRevenue = pendingOrders.reduce((s, o) => s + o.total, 0)
  const avgOrder = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0

  // Chart: revenue per day for chosen range
  const chartData = Array.from({ length: range }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (range - 1 - i))
    const dateStr = d.toISOString().split('T')[0]
    const dayOrders = paidOrders.filter((o) => o.createdAt.startsWith(dateStr))
    return {
      label: d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' }),
      revenue: parseFloat(dayOrders.reduce((s, o) => s + o.total, 0).toFixed(2)),
      orders: dayOrders.length,
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

      {/* Summary cards */}
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
            label: 'Paid Orders',
            value: String(paidOrders.length),
            sub: 'Confirmed payments',
            icon: CheckCircle2,
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

      {/* Revenue chart */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-serif text-lg font-medium text-foreground">Revenue Over Time</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Confirmed payments only</p>
          </div>
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
        </div>

        {!hasData ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No paid orders yet — revenue will appear here once payments are confirmed.</p>
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
                  tickFormatter={(v) => `R${v}`}
                />
                <Tooltip
                  cursor={{ fill: 'var(--accent)', opacity: 0.08 }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
                        <p className="font-medium text-foreground mb-1">{label}</p>
                        <p className="text-emerald-600 font-semibold">{fmt(payload[0]?.value as number)}</p>
                        <p className="text-muted-foreground text-xs">{payload[0]?.payload?.orders} order{payload[0]?.payload?.orders !== 1 ? 's' : ''}</p>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.revenue > 0 ? 'var(--accent)' : 'var(--border)'}
                      opacity={entry.revenue > 0 ? 1 : 0.4}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

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

// ── Product editor row ─────────────────────────────────────────────────────────
function ProductRow({
  product, override, onSave, onReset,
}: {
  product: Product
  override: ProductOverride | undefined
  onSave: (id: string, data: ProductOverride) => void
  onReset: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
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

  return (
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
              <ImageIcon className="w-3 h-3" /> Product Image URL
            </label>
            <div className="flex gap-3">
              <Input value={form.image} onChange={set('image')} placeholder="https://..." className="bg-background border-border/50 text-sm flex-1" />
              <Button type="button" variant="outline" size="sm" onClick={() => setPreviewImg(form.image)} className="shrink-0">Preview</Button>
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
  )
}

// ── Orders Panel ──────────────────────────────────────────────────────────────
function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [updating, setUpdating] = useState<string | null>(null)

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

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
        <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-muted-foreground text-sm">No orders yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
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
                <p className="text-xs text-muted-foreground">{order.customer.city} · {formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-lg font-semibold text-foreground">R{order.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
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
      })}
    </div>
  )
}

// ── Main Admin ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [activeTab, setActiveTab] = useState<'sales' | 'products' | 'orders' | 'settings'>('sales')
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
    { key: 'settings' as const, label: 'Settings', icon: Shield },
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
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{defaultProducts.length} products · click a product to edit</p>
              <div className="flex gap-2">
                <Button onClick={handleExport} variant="outline" size="sm" className="gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export
                </Button>
                <Button onClick={() => importRef.current?.click()} variant="outline" size="sm" className="gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Import
                </Button>
                <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
              </div>
            </div>
            <div className="space-y-3">
              {defaultProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  override={overrides[product.id]}
                  onSave={handleSave}
                  onReset={handleReset}
                />
              ))}
            </div>
          </div>
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

        {/* Settings tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Manage your admin account settings and security preferences.
            </p>
            <PasswordChange onPasswordChanged={() => {
              toast.success('Password changed successfully!')
            }} />
          </div>
        )}

      </div>
    </div>
  )
}
