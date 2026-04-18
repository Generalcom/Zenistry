'use client'

import { useState, useEffect } from 'react'
import { products as defaultProducts, Product } from '@/lib/products'
import { getProductsWithOverrides } from '@/lib/admin-products'

export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(defaultProducts)

  useEffect(() => {
    const refresh = () => setProducts(getProductsWithOverrides())
    refresh()
    // same-tab updates (admin saves on same page)
    window.addEventListener('ZENistry-products-updated', refresh)
    // cross-tab updates (admin in one tab, shop in another)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('ZENistry-products-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return products
}

export function useProduct(id: string): Product | undefined {
  const products = useProducts()
  return products.find((p) => p.id === id)
}
