'use client'

import { useState } from 'react'
import { useReviews } from '@/lib/review-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star } from 'lucide-react'

export function ReviewSubmission() {
  const { addReview } = useReviews()
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && comment.trim()) {
      addReview({ name: name.trim(), rating, comment: comment.trim() })
      setName('')
      setRating(5)
      setComment('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-2xl border border-border/50 p-6 lg:p-8">
      <h3 className="font-serif text-2xl font-medium text-foreground">Share Your Experience</h3>
      
      {/* Rating */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-accent text-accent'
                    : 'text-border'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">Your Name</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="bg-background border-border/50 text-foreground placeholder:text-muted-foreground"
          required
        />
      </div>

      {/* Review */}
      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium text-foreground">Your Review</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about Zenestry products..."
          rows={4}
          className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          required
        />
        <p className="text-xs text-muted-foreground">{comment.length}/500 characters</p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-all"
      >
        {submitted ? '✓ Review Submitted!' : 'Submit Review'}
      </Button>

      {submitted && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">Thank you for your review! Your feedback helps us improve.</p>
        </div>
      )}
    </form>
  )
}
