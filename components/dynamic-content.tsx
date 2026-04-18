'use client'

import { useEffect, useState } from 'react'
import { getContent } from '@/lib/content-manager'

interface DynamicContentProps {
  sectionId: string
  fallback?: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function DynamicContent({ sectionId, fallback, className, as: Tag = 'span' }: DynamicContentProps) {
  const [content, setContent] = useState(() => getContent(sectionId, fallback))

  useEffect(() => {
    const refresh = () => setContent(getContent(sectionId, fallback))
    refresh()
    window.addEventListener('ZENistry-content-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('ZENistry-content-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [sectionId, fallback])

  return <Tag className={className}>{content}</Tag>
}

export function DynamicImage({ sectionId, fallback, className, alt }: {
  sectionId: string
  fallback?: string
  className?: string
  alt?: string
}) {
  const [src, setSrc] = useState(() => getContent(sectionId, fallback))

  useEffect(() => {
    const refresh = () => setSrc(getContent(sectionId, fallback))
    refresh()
    window.addEventListener('ZENistry-content-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('ZENistry-content-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [sectionId, fallback])

  if (!src) return null
  return <img src={src} alt={alt || ''} className={className} />
}
