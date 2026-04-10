'use client'

import { useEffect, useState } from 'react'
import { getAllContentSections } from '@/lib/content-manager'

interface DynamicContentProps {
  sectionId: string
  fallback?: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  children?: React.ReactNode
}

export function DynamicContent({ sectionId, fallback, className, as: Component = 'p', children }: DynamicContentProps) {
  const [content, setContent] = useState(fallback || '')

  useEffect(() => {
    const loadContent = async () => {
      try {
        const sections = await getAllContentSections()
        const section = sections.find(s => s.metadata?.category === sectionId)
        setContent(section?.content || fallback || '')
      } catch (error) {
        console.error(`Error loading content for ${sectionId}:`, error)
        setContent(fallback || '')
      }
    }
    loadContent()
  }, [sectionId, fallback])

  const ComponentTag = Component

  const contentWithChildren = children ? content : content

  return (
    <ComponentTag className={className} dangerouslySetInnerHTML={{ __html: contentWithChildren }} />
  )
}

export function DynamicImage({ sectionId, fallback, className, alt }: { sectionId: string; fallback?: string; className?: string; alt?: string }) {
  const [src, setSrc] = useState(fallback || '')

  useEffect(() => {
    const loadImage = async () => {
      try {
        const sections = await getAllContentSections()
        const section = sections.find(s => s.metadata?.category === sectionId)
        setSrc(section?.content || fallback || '')
      } catch (error) {
        console.error(`Error loading image for ${sectionId}:`, error)
        setSrc(fallback || '')
      }
    }
    loadImage()
  }, [sectionId, fallback])

  if (!src) return null

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
    />
  )
}
