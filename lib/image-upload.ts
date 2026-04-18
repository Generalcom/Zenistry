'use client'

import * as React from 'react'

export interface UploadedImage {
  id: string
  url: string
  name: string
  size: number
  uploadedAt: string
  productId?: string
}

const STORAGE_KEY = 'ZENistry-uploaded-images'

// Configuration
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
const MAX_IMAGE_WIDTH = 1200
const IMAGE_QUALITY = 0.8

// Helper: Compress image before storage
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()
    
    reader.onload = (e) => {
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width
        let height = img.height
        
        if (width > MAX_IMAGE_WIDTH) {
          height = (height * MAX_IMAGE_WIDTH) / width
          width = MAX_IMAGE_WIDTH
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to JPEG for better compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', IMAGE_QUALITY)
        resolve(compressedDataUrl)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

// Validate file before upload
function validateImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`)
  }
  
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`File too large. Max size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`)
  }
}

export async function uploadImage(file: File): Promise<UploadedImage> {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate file
      validateImageFile(file)
      
      // Compress image
      const compressedBase64 = await compressImage(file)
      
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      
      const uploadedImage: UploadedImage = {
        id: imageId,
        url: compressedBase64,
        name: file.name,
        size: compressedBase64.length, // Store compressed size
        uploadedAt: new Date().toISOString(),
      }
      
      const existingImages = getUploadedImages()
      existingImages[imageId] = uploadedImage
      
      // Check storage quota
      const storageSize = getTotalStorageSize()
      if (storageSize > 4.5) { // 4.5MB warning threshold
        console.warn(`Storage usage: ${storageSize}MB. Consider clearing old images.`)
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingImages))
      
      resolve(uploadedImage)
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Failed to process image'))
    }
  })
}

export function getUploadedImages(): Record<string, UploadedImage> {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    console.error('Failed to parse stored images')
    return {}
  }
}

export function deleteImage(imageId: string): boolean {
  try {
    const images = getUploadedImages()
    if (!images[imageId]) {
      console.warn(`Image ${imageId} not found`)
      return false
    }
    
    delete images[imageId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
    return true
  } catch (error) {
    console.error('Failed to delete image:', error)
    return false
  }
}

export function deleteMultipleImages(imageIds: string[]): { success: string[]; failed: string[] } {
  const success: string[] = []
  const failed: string[] = []
  
  imageIds.forEach(id => {
    if (deleteImage(id)) {
      success.push(id)
    } else {
      failed.push(id)
    }
  })
  
  return { success, failed }
}

export function assignImageToProduct(imageId: string, productId: string): boolean {
  try {
    const images = getUploadedImages()
    if (images[imageId]) {
      images[imageId].productId = productId
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to assign image to product:', error)
    return false
  }
}

export function unassignImageFromProduct(imageId: string): boolean {
  try {
    const images = getUploadedImages()
    if (images[imageId] && images[imageId].productId) {
      delete images[imageId].productId
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to unassign image:', error)
    return false
  }
}

export function getProductImages(productId: string): UploadedImage[] {
  const images = getUploadedImages()
  return Object.values(images).filter(img => img.productId === productId)
}

export function getUnassignedImages(): UploadedImage[] {
  const images = getUploadedImages()
  return Object.values(images).filter(img => !img.productId)
}

export function getImageById(imageId: string): UploadedImage | null {
  const images = getUploadedImages()
  return images[imageId] || null
}

export function clearAllImages(): void {
  if (typeof window === 'undefined') return
  
  const confirmed = confirm('Are you sure you want to delete all images? This action cannot be undone.')
  if (confirmed) {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function getTotalStorageSize(): number {
  const images = getUploadedImages()
  const totalBase64Length = Object.values(images).reduce(
    (sum, img) => sum + img.url.length,
    0
  )
  // Base64 is ~75% of actual binary size
  const approximateBytes = totalBase64Length * 0.75
  return Math.round((approximateBytes / 1024 / 1024) * 100) / 100 // Return in MB with 2 decimals
}

export function getImageStats(): {
  total: number
  assigned: number
  unassigned: number
  totalSizeMB: number
  oldestImage: string | null
  newestImage: string | null
} {
  const images = Object.values(getUploadedImages())
  
  if (images.length === 0) {
    return {
      total: 0,
      assigned: 0,
      unassigned: 0,
      totalSizeMB: 0,
      oldestImage: null,
      newestImage: null,
    }
  }
  
  const assigned = images.filter(img => img.productId).length
  const unassigned = images.length - assigned
  
  const dates = images.map(img => new Date(img.uploadedAt).getTime())
  const oldest = new Date(Math.min(...dates)).toISOString()
  const newest = new Date(Math.max(...dates)).toISOString()
  
  return {
    total: images.length,
    assigned,
    unassigned,
    totalSizeMB: getTotalStorageSize(),
    oldestImage: oldest,
    newestImage: newest,
  }
}

export function exportImagesData(): UploadedImage[] {
  return Object.values(getUploadedImages())
}

export function importImagesData(images: UploadedImage[]): { success: number; failed: number } {
  try {
    const currentImages = getUploadedImages()
    let success = 0
    let failed = 0
    
    images.forEach(image => {
      if (!currentImages[image.id]) {
        currentImages[image.id] = image
        success++
      } else {
        failed++
      }
    })
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentImages))
    return { success, failed }
  } catch (error) {
    console.error('Failed to import images:', error)
    return { success: 0, failed: images.length }
  }
}

// React Hook for real-time image updates
export function useUploadedImages() {
  const [images, setImages] = React.useState<UploadedImage[]>([])
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState<ReturnType<typeof getImageStats> | null>(null)
  
  React.useEffect(() => {
    const updateImages = () => {
      const imageList = Object.values(getUploadedImages())
      setImages(imageList)
      setStats(getImageStats())
      setLoading(false)
    }
    
    // Initial load
    updateImages()
    
    // Listen for storage events (for cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        updateImages()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-tab updates
    const handleCustomUpdate = () => updateImages()
    window.addEventListener('imagesUpdated', handleCustomUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('imagesUpdated', handleCustomUpdate)
    }
  }, [])
  
  const refresh = React.useCallback(() => {
    setImages(Object.values(getUploadedImages()))
    setStats(getImageStats())
  }, [])
  
  return { images, loading, stats, refresh }
}

// Helper to dispatch custom events
export function notifyImagesUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('imagesUpdated'))
  }
}

// Override original functions to dispatch events
const originalDeleteImage = deleteImage
const originalAssignImageToProduct = assignImageToProduct
const originalUnassignImageFromProduct = unassignImageFromProduct

// Re-export with event dispatch
export const deleteImageWithNotify = (imageId: string): boolean => {
  const result = originalDeleteImage(imageId)
  if (result) notifyImagesUpdated()
  return result
}

export const assignImageToProductWithNotify = (imageId: string, productId: string): boolean => {
  const result = originalAssignImageToProduct(imageId, productId)
  if (result) notifyImagesUpdated()
  return result
}

export const unassignImageFromProductWithNotify = (imageId: string): boolean => {
  const result = originalUnassignImageFromProduct(imageId)
  if (result) notifyImagesUpdated()
  return result
}

// Clean up old images (older than specified days)
export function cleanupOldImages(daysOld: number): number {
  const images = getUploadedImages()
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)
  
  let deletedCount = 0
  Object.keys(images).forEach(imageId => {
    const image = images[imageId]
    if (new Date(image.uploadedAt) < cutoffDate) {
      delete images[imageId]
      deletedCount++
    }
  })
  
  if (deletedCount > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
    notifyImagesUpdated()
  }
  
  return deletedCount
}