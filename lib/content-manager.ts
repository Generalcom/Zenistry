// Content Management System for ZENistry
// Manages website text, images, and blog posts

export interface ContentSection {
  id: string
  type: 'text' | 'image' | 'html'
  title: string
  content: string
  metadata?: {
    alt?: string
    caption?: string
    position?: number
    category?: string
  }
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage?: string
  author: string
  status: 'draft' | 'published' | 'archived'
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface ContentResponse {
  success: boolean
  data?: any
  message?: string
}

// In-memory storage for demo purposes
// In production, this should be stored in a database
let contentSections: Record<string, ContentSection> = {}
let blogPosts: Record<string, BlogPost> = {}

// Content Section Management
export async function getContentSection(id: string): Promise<ContentSection | null> {
  try {
    const response = await fetch('/api/admin/content/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', id })
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.section || null
  } catch (error) {
    console.error('Error fetching content section:', error)
    return null
  }
}

export async function getAllContentSections(): Promise<ContentSection[]> {
  try {
    const response = await fetch('/api/admin/content/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getAll' })
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.sections || []
  } catch (error) {
    console.error('Error fetching content sections:', error)
    return []
  }
}

export async function updateContentSection(id: string, data: Partial<ContentSection>): Promise<ContentResponse> {
  try {
    const response = await fetch('/api/admin/content/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, data })
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating content section:', error)
    return { success: false, message: 'Failed to update content section' }
  }
}

export async function createContentSection(data: Omit<ContentSection, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentResponse> {
  try {
    const response = await fetch('/api/admin/content/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', data })
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error creating content section:', error)
    return { success: false, message: 'Failed to create content section' }
  }
}

export async function deleteContentSection(id: string): Promise<ContentResponse> {
  try {
    const response = await fetch('/api/admin/content/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error deleting content section:', error)
    return { success: false, message: 'Failed to delete content section' }
  }
}

// Blog Post Management
export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch('/api/admin/content/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', id })
    })
    if (!response.ok) return null
    const data = await response.json()
    return data.post || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/admin/content/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getAll' })
    })
    if (!response.ok) return []
    const data = await response.json()
    return data.posts || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>): Promise<ContentResponse> {
  try {
    const response = await fetch('/api/admin/content/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, data })
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error updating blog post:', error)
    return { success: false, message: 'Failed to update blog post' }
  }
}

export async function createBlogPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentResponse> {
  try {
    const response = await fetch('/api/admin/content/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', data })
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error creating blog post:', error)
    return { success: false, message: 'Failed to create blog post' }
  }
}

export async function deleteBlogPost(id: string): Promise<ContentResponse> {
  try {
    const response = await fetch('/api/admin/content/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return { success: false, message: 'Failed to delete blog post' }
  }
}

// Utility functions
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function generateExcerpt(content: string, maxLength: number = 150): string {
  const stripped = content.replace(/<[^>]*>/g, '') // Remove HTML tags
  return stripped.length > maxLength ? stripped.substring(0, maxLength) + '...' : stripped
}
