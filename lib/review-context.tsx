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

const defaultReviews: Review[] = [
  {
    id: '1',
    name: 'Sarah M.',
    rating: 5,
    comment: 'The Ashwagandha honey has completely transformed my morning routine. I feel more energized and less stressed throughout the day. Absolutely love it!',
    date: '2024-03-15'
  },
  {
    id: '2',
    name: 'Jessica K.',
    rating: 5,
    comment: 'I\'ve tried so many face oils, but the Hydrating Face Oil from Zenestry is on another level. My skin has never looked better!',
    date: '2024-03-12'
  },
  {
    id: '3',
    name: 'Amanda T.',
    rating: 5,
    comment: 'The podcast episodes are so calming and informative. Combined with the White Tea body products, my self-care routine is now complete.',
    date: '2024-03-10'
  }
]

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('zenestry-reviews')
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews))
      } catch {
        setReviews(defaultReviews)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever reviews change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('zenestry-reviews', JSON.stringify(reviews))
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
