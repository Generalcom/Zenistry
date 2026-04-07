'use client'

import { useState } from 'react'
import { useReviews } from '@/lib/review-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star } from 'lucide-react'
import { toast } from 'sonner'

export function Reviews() {
  const { reviews, addReview } = useReviews()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.comment.trim()) {
      toast.error('Please fill in all fields before submitting.')
      return
    }
    addReview({
      name: formData.name.trim(),
      rating: formData.rating,
      comment: formData.comment.trim(),
    })
    setFormData({ name: '', rating: 5, comment: '' })
    setIsFormOpen(false)
    toast.success('Thank you for your review! It means the world to us.')
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null

  return (
    <section id="reviews" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Customer Love
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-4">
            Loved by Our Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from people who have made ZENistry part of their wellness journey
          </p>
        </div>

        {/* Rating Summary */}
        <div className="bg-accent/5 rounded-2xl p-8 mb-12 border border-accent/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {averageRating ? (
              <>
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-1 mb-2 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
                </div>
                <div className="text-center">
                  <div className="font-serif text-5xl font-bold text-foreground">{averageRating}</div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No reviews yet — be the first!</p>
            )}
            <Button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
            >
              {isFormOpen ? 'Cancel' : 'Leave a Review'}
            </Button>
          </div>
        </div>

        {/* Review Form */}
        {isFormOpen && (
          <div className="bg-card rounded-2xl p-8 mb-12 border border-border/50 shadow-sm animate-in fade-in slide-in-from-top-4">
            <h3 className="font-serif text-2xl font-medium mb-6 text-foreground">
              Share Your Experience
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background border-border/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || formData.rating)
                            ? 'fill-accent text-accent'
                            : 'text-border'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Review</label>
                <textarea
                  placeholder="Tell us about your experience with ZENistry..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full p-4 border border-border/50 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  rows={5}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 flex-1"
                >
                  Submit Review
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  className="px-8"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-card rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-accent text-accent' : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                    <h4 className="font-serif font-medium text-foreground">{review.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(review.date).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
