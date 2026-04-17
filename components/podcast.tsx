'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, Mail, Headphones, Mic, Radio } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Podcast() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
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
      setEmail('')
      setTimeout(() => setIsSubmitted(false), 4000)
    }
  }

  return (
    <section
      id="podcast"
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ background: 'oklch(0.20 0.038 148)' }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-[0.07]"
        style={{ background: 'oklch(0.60 0.090 148)' }} />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full opacity-[0.07]"
        style={{ background: 'oklch(0.60 0.090 148)' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Header */}
          <div className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span
              className="inline-block mb-6 px-4 py-1.5 text-[10px] tracking-[0.28em] uppercase font-medium rounded-full"
              style={{ background: 'oklch(0.60 0.090 148 / 0.15)', color: 'oklch(0.78 0.10 148)', border: '1px solid oklch(0.60 0.090 148 / 0.25)' }}
            >
              The ZENistry Podcast
            </span>
            <h2
              className="font-serif mb-5"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, color: 'oklch(0.96 0.005 80)' }}
            >
              Conversations for the Soul
            </h2>
            <p style={{ color: 'oklch(0.96 0.005 80 / 0.55)', fontSize: '0.9375rem', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 3rem' }}>
              Join us weekly as we explore the intersection of beauty, wellness, and mindful living.
              Expert interviews, guided meditations, and holistic wellbeing.
            </p>
          </div>

          {/* Card */}
          <div className={`rounded-2xl p-8 md:p-12 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
            style={{
              background: 'oklch(0.26 0.030 148)',
              border: '1px solid oklch(0.60 0.090 148 / 0.20)'
            }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-7">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse-ring"
                style={{ background: 'oklch(0.60 0.090 148 / 0.15)' }}
              >
                <Mic className="w-7 h-7" style={{ color: 'oklch(0.78 0.10 148)' }} strokeWidth={1.5} />
              </div>
            </div>

            <h3
              className="font-serif mb-3"
              style={{ fontSize: '1.75rem', fontWeight: 400, color: 'oklch(0.96 0.005 80)' }}
            >
              Coming Soon
            </h3>
            <p style={{ color: 'oklch(0.96 0.005 80 / 0.50)', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: '380px', margin: '0 auto 2rem' }}>
              The ZENistry podcast is launching very soon. Be among the first to listen.
            </p>

            {/* Email Signup */}
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-sm"
                    style={{
                      background: 'oklch(0.30 0.025 148)',
                      border: '1px solid oklch(0.60 0.090 148 / 0.25)',
                      color: 'oklch(0.96 0.005 80)',
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-7 whitespace-nowrap font-medium tracking-wide text-sm"
                  style={{ background: 'oklch(0.60 0.090 148)', color: '#fff', borderRadius: '8px' }}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              </form>
            ) : (
              <div
                className="flex items-center justify-center gap-3 py-4 px-6 rounded-xl max-w-md mx-auto"
                style={{ background: 'oklch(0.60 0.090 148 / 0.15)', border: '1px solid oklch(0.60 0.090 148 / 0.30)' }}
              >
                <Mail className="w-4 h-4" style={{ color: 'oklch(0.78 0.10 148)' }} />
                <span className="text-sm font-medium" style={{ color: 'oklch(0.78 0.10 148)' }}>
                  We'll notify you when we launch!
                </span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-3 gap-6 mt-12 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {[
              { icon: Radio, value: '50+', label: 'Episodes Coming' },
              { icon: Headphones, value: 'Weekly', label: 'New Episodes' },
              { icon: Mic, value: 'Free', label: 'Access' },
            ].map(({ icon: Icon, value, label }, i) => (
              <div key={i} className="text-center">
                <Icon className="w-4 h-4 mx-auto mb-2 opacity-40" style={{ color: 'oklch(0.78 0.10 148)' }} />
                <p className="font-serif text-xl font-medium" style={{ color: 'oklch(0.96 0.005 80)' }}>{value}</p>
                <p className="text-[11px] tracking-wide mt-1" style={{ color: 'oklch(0.96 0.005 80 / 0.40)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
