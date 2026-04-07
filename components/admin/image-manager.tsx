'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Upload, Trash2, Image as ImageIcon, X, Check, Eye,
  FolderOpen, Grid, List, Search,
} from 'lucide-react'
import {
  uploadImage, getUploadedImages, deleteImage, assignImageToProduct,
  getProductImages, unassignedImages, UploadedImage,
} from '@/lib/image-upload'

interface ImageManagerProps {
  productId?: string
  onSelectImage?: (imageUrl: string) => void
  showUnassigned?: boolean
}

export function ImageManager({ productId, onSelectImage, showUnassigned = false }: ImageManagerProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadImages = () => {
    if (productId && !showUnassigned) {
      setImages(getProductImages(productId))
    } else if (showUnassigned) {
      setImages(unassignedImages())
    } else {
      setImages(Object.values(getUploadedImages()))
    }
  }

  useState(() => {
    loadImages()
  }, [productId, showUnassigned])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadPromises = Array.from(files).map(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return null
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large (max 5MB)`)
        return null
      }
      return uploadImage(file)
    })

    try {
      const results = await Promise.all(uploadPromises)
      const successful = results.filter(Boolean) as UploadedImage[]
      
      if (successful.length > 0) {
        toast.success(`${successful.length} image${successful.length > 1 ? 's' : ''} uploaded successfully`)
        if (productId && successful.length === 1) {
          assignImageToProduct(successful[0].id, productId)
        }
        loadImages()
      }
    } catch (error) {
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteImage = (imageId: string) => {
    deleteImage(imageId)
    setImages(images.filter(img => img.id !== imageId))
    toast.success('Image deleted')
  }

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    if (onSelectImage) {
      onSelectImage(imageUrl)
    }
  }

  const handleAssignToProduct = (imageId: string, targetProductId: string) => {
    assignImageToProduct(imageId, targetProductId)
    toast.success('Image assigned to product')
    loadImages()
  }

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      {/* Header with upload */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-lg font-medium">Image Manager</h3>
          <span className="text-sm text-muted-foreground">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Images display */}
      {filteredImages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {searchTerm ? 'No images found matching your search' : 'No images uploaded yet'}
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="mt-4 gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload First Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
          : 'space-y-3'
        }>
          {filteredImages.map((image) => (
            <Card key={image.id} className={`group relative overflow-hidden ${
              selectedImage === image.url ? 'ring-2 ring-primary' : ''
            }`}>
              <CardContent className="p-0">
                {viewMode === 'grid' ? (
                  <div className="aspect-square relative">
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSelectImage(image.url)}
                        className="gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Select
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                        className="gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                    {selectedImage === image.url && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{image.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(image.size)} • {new Date(image.uploadedAt).toLocaleDateString()}
                      </p>
                      {image.productId && (
                        <p className="text-xs text-primary">Product ID: {image.productId}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSelectImage(image.url)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
