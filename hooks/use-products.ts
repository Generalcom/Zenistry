'use client'

import { useState, useEffect } from 'react'
import { products as defaultProducts, Product } from '@/lib/products'
import { getProductsWithOverrides } from '@/lib/admin-products'

export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(defaultProducts)

  useEffect(() => {
    setProducts(getProductsWithOverrides())
  }, [])

  return products
}

export function useProduct(id: string): Product | undefined {
  const products = useProducts()
  return products.find((p) => p.id === id)
}
