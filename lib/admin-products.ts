import { products as defaultProducts, Product } from '@/lib/products'

const OVERRIDES_KEY = 'ZENistry-product-overrides'

export interface ProductOverride {
  price?: number
  originalPrice?: number | null
  image?: string
  name?: string
  description?: string
  badge?: string | null
}

export function getOverrides(): Record<string, ProductOverride> {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(OVERRIDES_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function notifyUpdate() {
  window.dispatchEvent(new CustomEvent('ZENistry-products-updated'))
}

export function setOverride(id: string, override: Partial<ProductOverride>): void {
  const all = getOverrides()
  all[id] = { ...(all[id] ?? {}), ...override }
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all))
  notifyUpdate()
}

export function resetOverride(id: string): void {
  const all = getOverrides()
  delete all[id]
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all))
  notifyUpdate()
}

export function getProductsWithOverrides(): Product[] {
  const overrides = getOverrides()
  return defaultProducts.map((p) => {
    const o = overrides[p.id]
    if (!o) return p
    return {
      ...p,
      price: o.price ?? p.price,
      originalPrice:
        o.originalPrice === null
          ? undefined
          : (o.originalPrice ?? p.originalPrice),
      image: o.image || p.image,
      name: o.name || p.name,
      description: o.description || p.description,
      badge: o.badge === null ? undefined : (o.badge ?? p.badge),
    }
  })
}

export function exportOverrides(): string {
  return JSON.stringify(getOverrides(), null, 2)
}

export function importOverrides(json: string): void {
  const data = JSON.parse(json)
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(data))
}
