'use client'

export interface UploadedImage {
  id: string
  url: string
  name: string
  size: number
  uploadedAt: string
  productId?: string
}

const STORAGE_KEY = 'ZENistry-uploaded-images'

export function uploadImage(file: File): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    // In a real app, this would upload to a service like Vercel Blob, AWS S3, etc.
    // For now, we'll simulate upload and store in localStorage as base64
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const base64 = e.target?.result as string
        const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const uploadedImage: UploadedImage = {
          // H
          id: imageId,
          url: base64,
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        }
        
        const existingImages = getUploadedImages()
        existingImages[imageId] = uploadedImage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingImages))
        
        resolve(uploadedImage)
      } catch (error) {
        reject(new Error('Failed to process image'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function getUploadedImages(): Record<string, UploadedImage> {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export function deleteImage(imageId: string): void {
  const images = getUploadedImages()
  delete images[imageId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
}

export function assignImageToProduct(imageId: string, productId: string): void {
  const images = getUploadedImages()
  if (images[imageId]) {
    images[imageId].productId = productId
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
  }
}

export function getProductImages(productId: string): UploadedImage[] {
  const images = getUploadedImages()
  return Object.values(images).filter(img => img.productId === productId)
}

export function unassignedImages(): UploadedImage[] {
  const images = getUploadedImages()
  return Object.values(images).filter(img => !img.productId)
}
