'use client'

import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { DynamicContent } from "./dynamic-content"

const footerLinks = {
  shop: [
    { label: "Wellness Honeys", href: "/shop?category=Wellness+Honey" },
    { label: "Skincare", href: "/shop?category=Skincare" },
    { label: "Body Care", href: "/shop?category=Body+Care" },
    { label: "Aromatherapy", href: "/shop?category=Aromatherapy" },
    { label: "All Products", href: "/shop" },
  ],
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Our Story", href: "/#about" },
    { label: "Podcast", href: "/#podcast" },
    { label: "Reviews", href: "/#reviews" },
  ],
  support: [
    { label: "Track My Order", href: "/track" },
    { label: "Contact", href: "/#contact" },
    { label: "WhatsApp Us", href: "https://wa.me/27828277990" },
    { label: "Returns", href: "/#contact" },
  ],
}

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/ZENistry", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/ZENistry", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@ZENistry", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'oklch(0.16 0.028 140)' }}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 texture-bg opacity-40 pointer-events-none" />

      {/* Top accent line */}
      <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, oklch(0.60 0.090 148 / 0.40), transparent)' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 py-16 lg:py-20 border-b"
          style={{ borderColor: 'oklch(0.99 0 0 / 0.06)' }}>

          {/* Brand — 4 cols */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="ZENistry"
                width={110}
                height={55}
                className="h-14 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: 'oklch(0.99 0 0 / 0.50)' }}>
              <DynamicContent
                sectionId="footer-description"
                fallback="Nourishing your skin and soul with nature's finest ingredients. Handcrafted wellness products for mindful living."
              />
            </p>

            <div className="space-y-3 mb-8">
              <a href="tel:+27828277990" className="flex items-center gap-3 text-sm transition-colors group" style={{ color: 'oklch(0.99 0 0 / 0.45)' }}>
                <Phone className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-white transition-colors" style={{ color: 'oklch(0.70 0.09 148)' }} />
                <span className="group-hover:text-white transition-colors">
                  <DynamicContent sectionId='footer-phone' fallback='082 827 7990' />
                </span>
              </a>
              <p className="flex items-center gap-3 text-sm" style={{ color: 'oklch(0.99 0 0 / 0.45)' }}>
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'oklch(0.70 0.09 148)' }} />
                <DynamicContent sectionId='footer-location' fallback='South Africa' />
              </p>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'oklch(0.99 0 0 / 0.08)', color: 'oklch(0.99 0 0 / 0.55)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'oklch(0.40 0.072 148)'
                    ;(e.currentTarget as HTMLElement).style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'oklch(0.99 0 0 / 0.08)'
                    ;(e.currentTarget as HTMLElement).style.color = 'oklch(0.99 0 0 / 0.55)'
                  }}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer on large screens */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Shop */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] tracking-[0.28em] uppercase font-semibold mb-5" style={{ color: 'oklch(0.99 0 0 / 0.35)' }}>Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'oklch(0.99 0 0 / 0.50)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] tracking-[0.28em] uppercase font-semibold mb-5" style={{ color: 'oklch(0.99 0 0 / 0.35)' }}>Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'oklch(0.99 0 0 / 0.50)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] tracking-[0.28em] uppercase font-semibold mb-5" style={{ color: 'oklch(0.99 0 0 / 0.35)' }}>Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: 'oklch(0.99 0 0 / 0.50)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Shop CTA */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-7 text-[11px] font-medium tracking-[0.18em] uppercase px-5 py-3 rounded-lg transition-all duration-200"
              style={{
                background: 'oklch(0.40 0.072 148)',
                color: '#fff',
              }}
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-center sm:text-left" style={{ color: 'oklch(0.99 0 0 / 0.30)' }}>
            <DynamicContent sectionId="footer-copyright" fallback="© 2026 ZENistry. All rights reserved. Made with love in South Africa." />
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Privacy Policy', href: '/#contact' },
              { label: 'Terms', href: '/#contact' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs transition-colors hover:text-white"
                style={{ color: 'oklch(0.99 0 0 / 0.30)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
