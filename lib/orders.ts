export type OrderStatus = 'ordered' | 'confirmed' | 'packaged' | 'out_for_delivery' | 'delivered'

export interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  trackingNumber: string
  status: OrderStatus
  createdAt: string
  estimatedDelivery: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  items: OrderItem[]
  total: number
}

export const ORDER_STATUSES: {
  key: OrderStatus
  label: string
  description: string
}[] = [
  {
    key: 'ordered',
    label: 'Order Received',
    description: 'Your order has been received and Angela has been notified.',
  },
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    description: 'Angela has confirmed your order and payment.',
  },
  {
    key: 'packaged',
    label: 'Packaged & Ready',
    description: 'Your items have been carefully packaged and are ready to go.',
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    description: 'Your order is on its way to you!',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Your order has been delivered. Enjoy your Zenestry products!',
  },
]

export function generateTrackingNumber(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `ZEN-${code}`
}

export function getEstimatedDelivery(): string {
  const date = new Date()
  let businessDays = 0
  while (businessDays < 4) {
    date.setDate(date.getDate() + 1)
    const day = date.getDay()
    if (day !== 0 && day !== 6) businessDays++
  }
  return date.toISOString().split('T')[0]
}

export function saveOrder(order: Order): void {
  if (typeof window === 'undefined') return
  const existing = getAllOrders()
  existing[order.trackingNumber] = order
  localStorage.setItem('zenestry-orders', JSON.stringify(existing))
}

export function getAllOrders(): Record<string, Order> {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem('zenestry-orders')
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export function getOrderByTracking(trackingNumber: string): Order | null {
  const orders = getAllOrders()
  return orders[trackingNumber.toUpperCase().trim()] ?? null
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
