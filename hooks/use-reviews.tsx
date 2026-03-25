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

  const initialReviews: Review[] = [
    {
      id: '1',
      name: 'Sarah M.',
      email: 'sarah@example.com',
      rating: 5,
      comment: 'The Ashwagandha honey is absolutely incredible. I\'ve noticed a significant improvement in my anxiety levels. Truly a game-changer!',
      date: '2024-03-15',
      verified: true,
    },
    {
      id: '2',
      name: 'James K.',
      email: 'james@example.com',
      rating: 5,
      comment: 'Premium quality products. The podcast episodes have helped me so much with my mental wellness journey.',
      date: '2024-03-10',
      verified: true,
    },
    {
      id: '3',
      name: 'Emma R.',
      email: 'emma@example.com',
      rating: 5,
      comment: 'My skin has never looked better. The hydrating face oil is a staple in my skincare routine now.',
      date: '2024-03-05',
      verified: true,
    },
  ]

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('zenestry-reviews')
    if (saved) {
      setReviews(JSON.parse(saved))
    } else {
      setReviews(initialReviews)
      localStorage.setItem('zenestry-reviews', JSON.stringify(initialReviews))
    }
    setMounted(true)
  }, [])

  // Save to localStorage when reviews change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('zenestry-reviews', JSON.stringify(reviews))
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
