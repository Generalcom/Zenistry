'use client'

import { useReviews } from '@/lib/review-context'
import { Star } from 'lucide-react'
import { ReviewSubmission } from './review-submission'
import { DynamicContent } from './dynamic-content'
import { useRef, useEffect, useState } from 'react'

export function Testimonials() {
  const { reviews } = useReviews()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="reviews" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
            <DynamicContent sectionId="testimonials-title" fallback="Customer Reviews" />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            <DynamicContent sectionId="testimonials-subtitle" fallback="Loved by Our Community" />
          </h2>
          <p className="text-muted-foreground">
            <DynamicContent 
              sectionId="testimonials-description" 
              fallback="Real feedback from customers who have experienced ZENistry" 
            />
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Reviews Grid */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.slice(0, 6).map((review) => (
              <div key={review.id} className="bg-card rounded-xl border border-border/50 p-6 hover:border-accent/30 transition-colors hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-serif font-medium text-foreground">
                      <DynamicContent 
                        sectionId={`testimonial-${review.id}-name`} 
                        fallback={review.name} 
                      />
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? 'fill-accent text-accent' : 'text-border'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  <DynamicContent 
                    sectionId={`testimonial-${review.id}-comment`} 
                    fallback={review.comment} 
                  />
                </p>
              </div>
            ))}
          </div>

          {/* Review Submission Form */}
          <div>
            <ReviewSubmission />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 text-center border-t border-border/50 pt-12">
          <div className="space-y-2">
            <p className="font-serif text-3xl lg:text-4xl font-semibold text-primary">
              {reviews.length}+
            </p>
            <p className="text-sm text-muted-foreground">Reviews</p>
          </div>
          {reviews.length > 0 && (
            <div className="space-y-2">
              <p className="font-serif text-3xl lg:text-4xl font-semibold text-primary">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}★
              </p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          )}
          <div className="space-y-2">
            <p className="font-serif text-3xl lg:text-4xl font-semibold text-primary">10K+</p>
            <p className="text-sm text-muted-foreground">Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  )
}
