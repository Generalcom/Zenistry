'use client'

import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  legal: [
    { label: "Privacy Policy", href: "/#contact" },
    { label: "Terms of Service", href: "/#contact" },
  ]
}

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/ZENistry", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/ZENistry", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@ZENistry", label: "YouTube" },
]

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground pt-12 md:pt-16 lg:pt-20 pb-6 md:pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-12 pb-8 md:pb-12 lg:pb-16 border-b border-primary-foreground/10">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-block mb-4 md:mb-6">
              <Image
                src="/logo.png"
                alt="ZENistry"
                width={110}
                height={55}
                className="h-14 w-auto invert mix-blend-screen"
              />
            </Link>
            <p className="text-xs md:text-sm text-primary-foreground/70 leading-relaxed mb-4 md:mb-6 max-w-sm">
              <DynamicContent 
                sectionId="footer-description" 
                fallback="Nourishing your skin and soul with nature's finest ingredients. Handcrafted wellness products for mindful living." 
              />
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 md:space-y-3">
              <a href="tel:<DynamicContent sectionId='footer-phone' fallback='0828277990' />" className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Phone className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                <span><DynamicContent sectionId='footer-phone' fallback='082 827 7990' /></span>
              </a>
              <a href="mailto:<DynamicContent sectionId='footer-email' fallback='hello@ZENistry.co.za' />" className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                <span><DynamicContent sectionId='footer-email' fallback='hello@ZENistry.co.za' /></span>
              </a>
              <p className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-primary-foreground/70">
                <MapPin className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                <span><DynamicContent sectionId='footer-location' fallback='South Africa' /></span>
              </p>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-span-1">
            <h4 className="font-medium text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-6">Shop</h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-xs md:text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1">
            <h4 className="font-medium text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-6">Company</h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-xs md:text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-span-1">
            <h4 className="font-medium text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-6">Support</h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-xs md:text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & App */}
          <div className="col-span-1">
            <h4 className="font-medium text-xs md:text-sm uppercase tracking-wider mb-3 md:mb-6">Connect</h4>
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <social.icon className="w-4 md:w-5 h-4 md:h-5" />
                </a>
              ))}
            </div>
            
            {/* Shop Now CTA */}
            <Button 
              asChild
              variant="outline" 
              className="w-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 group text-xs md:text-sm"
            >
              <Link href="/shop">
                Shop Now
                <ArrowUpRight className="ml-2 w-3 md:w-4 h-3 md:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-xs md:text-sm text-primary-foreground/50 text-center md:text-left">
            <DynamicContent sectionId="footer-copyright" fallback="© 2026 ZENistry. All rights reserved. Made with love in South Africa." />
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className="text-xs md:text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors"
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
