'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Podcast() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail('')
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  return (
    <section id="podcast" ref={sectionRef} className="py-20 lg:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-10">

          {/* Header */}
          <div className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">
              The ZENistry Podcast
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              Conversations for the Soul
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Join us weekly as we explore the intersection of beauty, wellness, and mindful living. 
              From expert interviews to guided meditations, our podcast is your companion on the 
              journey to holistic wellbeing.
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className={`bg-card rounded-2xl border-2 border-accent/30 p-10 md:p-16 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Bell className="w-8 h-8 text-accent" strokeWidth={1.5} />
              </div>
            </div>

            <h3 className="font-serif text-3xl text-foreground mb-3">Coming Soon</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The ZENistry podcast is launching very soon. Be among the first to listen to our inaugural episodes.
            </p>

            {/* Email Signup */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border/50 h-12"
                />
              </div>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium h-12 px-8 whitespace-nowrap"
              >
                {isSubmitted ? 'Notified!' : 'Notify Me'}
              </Button>
            </form>

            {/* Success Message */}
            {isSubmitted && (
              <div className="mt-6 flex items-center justify-center gap-2 text-accent font-medium text-sm animate-fade-in">
                <Mail className="w-4 h-4" />
                Thanks! We'll send you a notification when we launch.
              </div>
            )}
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-6 text-center transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div>
              <p className="font-serif text-2xl md:text-3xl font-semibold text-foreground">50+</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Episodes Coming</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-3xl font-semibold text-foreground">Weekly</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Release Schedule</p>
            </div>
            <div>
              <p className="font-serif text-2xl md:text-3xl font-semibold text-foreground">Free</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Access</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
