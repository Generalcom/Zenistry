'use client'

import { useEffect, useRef, useState } from "react"
import { Mail, ArrowRight, Gift, Sparkles, Zap, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DynamicContent } from "./dynamic-content"

const benefits = [
  { icon: Gift, title: "10% Off", desc: "Your first order" },
  { icon: Zap, title: "Early Access", desc: "New products" },
  { icon: Sparkles, title: "Weekly Tips", desc: "Wellness advice" },
  { icon: Users, title: "Exclusive", desc: "Member offers" },
]

export function Newsletter() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
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
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: 'oklch(0.96 0.014 80)' }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle, oklch(0.40 0.072 148) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>

          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
            style={{ background: 'oklch(0.40 0.072 148 / 0.10)' }}
          >
            <Mail className="w-6 h-6 text-primary" />
          </div>

          <span className="section-label mb-5 block mx-auto w-fit">Newsletter</span>

          <h2
            className="font-serif text-foreground mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2 }}
          >
            <DynamicContent sectionId="newsletter-title" fallback="Join the ZENistry Community" />
          </h2>

          <div className="divider-center mx-auto mt-4 mb-6" />

          <p className="text-muted-foreground text-[0.9375rem] max-w-lg mx-auto mb-10 leading-relaxed">
            <DynamicContent
              sectionId="newsletter-description"
              fallback="Subscribe to receive exclusive offers, wellness tips, new product launches, and mindful living inspiration."
            />
          </p>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-13 bg-background border-border/60 focus:border-primary text-sm rounded-xl h-[52px]"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-primary rounded-xl h-[52px] whitespace-nowrap"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div
              className="flex flex-col items-center gap-3 p-8 rounded-2xl mb-12 max-w-md mx-auto"
              style={{ background: 'oklch(0.40 0.072 148 / 0.08)', border: '1px solid oklch(0.40 0.072 148 / 0.20)' }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
              <p className="font-serif text-xl text-foreground">Welcome to the family!</p>
              <p className="text-sm text-muted-foreground">Check your inbox for a special welcome gift.</p>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border/50 pt-10">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className={`text-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${200 + i * 80}ms` }}
              >
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.40 0.072 148 / 0.10)' }}>
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="font-medium text-foreground text-sm">
                  <DynamicContent sectionId={`newsletter-benefit-${i + 1}`} fallback={title} />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <DynamicContent sectionId={`newsletter-benefit-${i + 1}-description`} fallback={desc} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
