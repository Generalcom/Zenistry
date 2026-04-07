'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Review {
  id: string
  name: string
  email: string
  rating: number
  comment: string
  date: string
  verified?: boolean
}

interface ReviewContextType {
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'date'>) => void
  deleteReview: (id: string) => void
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ZENistry-reviews')
    if (saved) {
      try {
        const parsed: Review[] = JSON.parse(saved)
        setReviews(parsed.filter((r) => !['1', '2', '3'].includes(r.id)))
      } catch {
        setReviews([])
      }
    }
    setMounted(true)
  }, [])

  // Save to localStorage when reviews change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ZENistry-reviews', JSON.stringify(reviews))
    }
  }, [reviews, mounted])

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
    }
    setReviews((prev) => [newReview, ...prev])
  }

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== id))
  }

  return (
    <ReviewContext.Provider value={{ reviews, addReview, deleteReview }}>
      {children}
    </ReviewContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReviews must be used within ReviewProvider')
  }
  return context
}
