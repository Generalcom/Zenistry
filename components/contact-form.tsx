'use client'

import { useState } from 'react'
import { Mail, Phone, Send, User, Tag, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          category: 'general'
        })
      } else {
        alert(result.error || 'Failed to submit contact form')
      }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('An error occurred while submitting your message')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-green-800 font-medium text-lg mb-2">Message Sent Successfully!</h3>
          <p className="text-green-700 mb-4">
            Thank you for contacting ZENistry. We'll get back to you within 24 hours.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <section className="py-16 md:py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              <DynamicContent 
                sectionId="contact-title" 
                fallback="Get in Touch" 
              />
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              <DynamicContent 
                sectionId="contact-description" 
                fallback="Have questions about our products? Need help with an order? Want to learn more about our wellness journey? We're here to help." 
              />
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Contact Form */}
            <div className="bg-card rounded-xl border border-border/50 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="w-full"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    className="w-full"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+27 82 123 4567"
                    className="w-full"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Tag className="w-4 h-4 inline mr-2" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border/50 rounded-lg focus:border-accent bg-background text-sm"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="order">Order Issue</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help you?"
                    required
                    className="w-full"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide as much detail as possible..."
                    rows={6}
                    required
                    minLength={10}
                    className="w-full px-3 py-2 border border-border/50 rounded-lg focus:border-accent bg-background text-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border/50 p-6 md:p-8">
                <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                  <DynamicContent 
                    sectionId="contact-info-title" 
                    fallback="Contact Information" 
                  />
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Email</h4>
                    <p className="text-muted-foreground">
                      <DynamicContent 
                        sectionId="contact-email" 
                        fallback="hello@zenistry.co.za" 
                      />
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Phone</h4>
                    <p className="text-muted-foreground">
                      <DynamicContent 
                        sectionId="contact-phone" 
                        fallback="+27 82 827 7990" 
                      />
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Response Time</h4>
                    <p className="text-muted-foreground">
                      <DynamicContent 
                        sectionId="contact-response-time" 
                        fallback="Within 24 hours" 
                      />
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Business Hours</h4>
                    <p className="text-muted-foreground">
                      <DynamicContent 
                        sectionId="contact-hours" 
                        fallback="Monday - Friday: 9AM - 5PM" 
                      />
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-card rounded-xl border border-border/50 p-6 md:p-8">
                <h3 className="font-serif text-xl font-medium text-foreground mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <a
                    href="/shop"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent/5"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Browse Products
                  </a>
                  <a
                    href="#reviews"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent/5"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Customer Reviews
                  </a>
                  <a
                    href="/track"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent/5"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Track Order
                  </a>
                  <a
                    href="tel:+27828277990"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent/5"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
