"use client"

import { useEffect, useRef, useState } from "react"
import { Mail, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
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
      setEmail("")
    }
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className={`relative max-w-4xl mx-auto transition-all duration-700 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}>
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl md:rounded-3xl" />
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-primary/10 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative p-6 md:p-8 lg:p-16 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-12 md:w-16 h-12 md:h-16 rounded-full bg-accent/10 mb-4 md:mb-6">
              <Sparkles className="w-6 md:w-8 h-6 md:h-8 text-accent" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-3 md:mb-4">
              Join the Zenestry Community
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-6 md:mb-8 leading-relaxed">
              Subscribe to receive exclusive offers, wellness tips, new product announcements, 
              and mindful living inspiration delivered straight to your inbox.
            </p>

            {/* Form */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 md:pl-12 h-12 md:h-14 bg-card border-border/50 focus:border-accent rounded-lg md:rounded-xl text-sm md:text-base"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 md:h-14 px-6 md:px-8 rounded-lg md:rounded-xl group text-sm md:text-base"
                >
                  Subscribe
                  <ArrowRight className="ml-2 w-4 md:w-5 h-4 md:h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            ) : (
              <div className="bg-accent/10 text-accent p-4 md:p-6 rounded-lg md:rounded-xl max-w-md mx-auto">
                <Sparkles className="w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 md:mb-3" />
                <p className="font-medium text-base md:text-lg mb-1">Welcome to the family!</p>
                <p className="text-xs md:text-sm opacity-80">Check your inbox for a special welcome gift.</p>
              </div>
            )}

            {/* Trust Note */}
            <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-6">
              No spam, ever. Unsubscribe anytime. We respect your privacy.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8 md:mt-12 pt-8 md:pt-12 border-t border-border/50">
              <div className="text-center">
                <p className="font-medium text-foreground text-sm md:text-base">10% Off</p>
                <p className="text-xs md:text-sm text-muted-foreground">First Order</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground text-sm md:text-base">Early Access</p>
                <p className="text-xs md:text-sm text-muted-foreground">New Products</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground text-sm md:text-base">Weekly Tips</p>
                <p className="text-xs md:text-sm text-muted-foreground">Wellness Advice</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground text-sm md:text-base">Exclusive</p>
                <p className="text-xs md:text-sm text-muted-foreground">Member Offers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
