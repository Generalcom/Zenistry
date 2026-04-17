'use client'

import { useReviews } from '@/lib/review-context'
import { Star, Quote } from 'lucide-react'
import { ReviewSubmission } from './review-submission'
import { DynamicContent } from './dynamic-content'
import { useRef, useEffect, useState } from 'react'

export function Testimonials() {
  const { reviews } = useReviews()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <section ref={sectionRef} id="reviews" className="py-24 lg:py-36 bg-secondary/30 texture-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="section-label mb-4 block mx-auto w-fit">
            <DynamicContent sectionId="testimonials-title" fallback="Customer Reviews" />
          </span>
          <h2
            className="font-serif text-foreground mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}
          >
            <DynamicContent sectionId="testimonials-subtitle" fallback="Loved by Our Community" />
          </h2>
          <div className="divider-center mx-auto mt-4 mb-4" />
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            <DynamicContent
              sectionId="testimonials-description"
              fallback="Real feedback from customers who have experienced ZENistry"
            />
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {/* Reviews */}
          <div className="lg:col-span-2 space-y-5">
            {reviews.slice(0, 6).map((review, i) => (
              <div
                key={review.id}
                className={`bg-card rounded-2xl border border-border/40 p-6 hover:border-primary/20 hover:shadow-md transition-all duration-400 card-lift transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar initial */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm text-primary-foreground"
                      style={{ background: 'oklch(0.40 0.072 148)' }}
                    >
                      {review.name?.charAt(0)?.toUpperCase() || 'Z'}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">
                        <DynamicContent sectionId={`testimonial-${review.id}-name`} fallback={review.name} />
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < review.rating ? 'fill-primary text-primary' : 'text-border fill-border'}
                      />
                    ))}
                  </div>
                </div>

                {/* Quote mark */}
                <Quote className="w-6 h-6 text-primary/20 mb-2" />

                <p className="text-sm text-foreground/75 leading-relaxed">
                  <DynamicContent sectionId={`testimonial-${review.id}-comment`} fallback={review.comment} />
                </p>
              </div>
            ))}
          </div>

          {/* Review Submission */}
          <div>
            <ReviewSubmission />
          </div>
        </div>

        {/* Stats bar */}
        <div className={`grid grid-cols-3 gap-6 text-center border-t border-border/40 pt-12 transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div>
            <p className="font-serif mb-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 400, color: 'oklch(0.40 0.072 148)' }}>
              {reviews.length}+
            </p>
            <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground font-medium">Reviews</p>
          </div>
          <div>
            <p className="font-serif mb-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 400, color: 'oklch(0.40 0.072 148)' }}>
              {avgRating}★
            </p>
            <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground font-medium">Avg Rating</p>
          </div>
          <div>
            <p className="font-serif mb-1" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 400, color: 'oklch(0.40 0.072 148)' }}>
              10K+
            </p>
            <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground font-medium">Happy Customers</p>
          </div>
        </div>
      </div>
    </section>
  )
}
