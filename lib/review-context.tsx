'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

interface ReviewContextType {
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'date'>) => void
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined)

const MOCK_IDS = ['1', '2', '3']

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount, stripping any legacy mock reviews
  useEffect(() => {
    const savedReviews = localStorage.getItem('ZENistry-reviews')
    if (savedReviews) {
      try {
        const parsed: Review[] = JSON.parse(savedReviews)
        const real = parsed.filter((r) => !MOCK_IDS.includes(r.id))
        setReviews(real)
      } catch {
        setReviews([])
      }
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever reviews change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('ZENistry-reviews', JSON.stringify(reviews))
    }
  }, [reviews, isHydrated])

  const addReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    }
    setReviews(prevReviews => [review, ...prevReviews])
  }

  return (
    <ReviewContext.Provider value={{ reviews, addReview }}>
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
