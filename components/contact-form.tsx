'use client'

import { useState } from 'react'
import { Phone, Send, User, Tag, MessageSquare, Clock, MapPin, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { DynamicContent } from './dynamic-content'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general' as 'general' | 'product' | 'order' | 'technical'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await response.json()
      if (result.success) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' })
      } else {
        alert(result.error || 'Failed to submit contact form')
      }
    } catch {
      alert('An error occurred while submitting your message')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "h-12 bg-background border-border/50 focus:border-primary rounded-xl text-sm placeholder:text-muted-foreground/60 transition-colors"

  if (isSubmitted) {
    return (
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'oklch(0.40 0.072 148 / 0.10)' }}>
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-3">Message Sent!</h3>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-outline rounded-xl"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="section-label mb-4 block mx-auto w-fit">Contact Us</span>
            <h2 className="font-serif text-foreground mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}>
              <DynamicContent sectionId="contact-title" fallback="Get in Touch" />
            </h2>
            <div className="divider-center mx-auto mt-4 mb-4" />
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              <DynamicContent
                sectionId="contact-description"
                fallback="Have questions about our products? Need help with an order? We're here to help."
              />
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Form — takes 3 cols */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl border border-border/40 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/60 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/60 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Phone + Category row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/60 mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+27 82 000 0000"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/60 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 border border-border/50 focus:border-primary rounded-xl bg-background text-sm transition-colors outline-none"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="product">Product Question</option>
                        <option value="order">Order Issue</option>
                        <option value="technical">Technical Support</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/60 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      required
                      className={inputClass}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-medium tracking-[0.14em] uppercase text-foreground/60 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more..."
                      rows={5}
                      required
                      minLength={10}
                      className="w-full px-4 py-3 border border-border/50 focus:border-primary rounded-xl bg-background text-sm resize-none transition-colors outline-none leading-relaxed placeholder:text-muted-foreground/60"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                    className="btn-primary w-full justify-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info — takes 2 cols */}
            <div className="lg:col-span-2 space-y-5">
              {/* Info card */}
              <div className="bg-card rounded-2xl border border-border/40 p-6">
                <h3 className="font-serif text-lg text-foreground mb-5">
                  <DynamicContent sectionId="contact-info-title" fallback="Contact Information" />
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Phone, label: 'Phone',
                      value: <DynamicContent sectionId="contact-phone" fallback="+27 82 827 7990" />
                    },
                    {
                      icon: Clock, label: 'Response Time',
                      value: <DynamicContent sectionId="contact-response-time" fallback="Within 24 hours" />
                    },
                    {
                      icon: MapPin, label: 'Location',
                      value: 'South Africa'
                    },
                  ].map(({ icon: Icon, label, value }, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'oklch(0.40 0.072 148 / 0.10)' }}>
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.16em] uppercase font-medium text-muted-foreground mb-0.5">{label}</p>
                        <p className="text-sm text-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-card rounded-2xl border border-border/40 p-6">
                <h3 className="font-serif text-lg text-foreground mb-4">Quick Links</h3>
                <div className="space-y-1">
                  {[
                    { href: '/shop', label: 'Browse Products' },
                    { href: '#reviews', label: 'Customer Reviews' },
                    { href: '/track', label: 'Track Your Order' },
                    { href: 'tel:+27828277990', label: 'Call Now' },
                  ].map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors flex-shrink-0" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/27828277990"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-5 rounded-2xl transition-all duration-300 hover:shadow-md"
                style={{ background: '#25D366', color: '#fff', borderRadius: '16px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <div>
                  <p className="font-medium text-sm">Chat on WhatsApp</p>
                  <p className="text-[11px] opacity-80">Usually responds quickly</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
