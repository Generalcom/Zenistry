'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, ShoppingBag, Instagram, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartDrawer } from './cart-drawer'
import { useCart } from '@/hooks/use-cart'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'Our Story' },
  { href: '/shop', label: 'Shop' },
  { href: '/#podcast', label: 'Wellness' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { items } = useCart()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2.5 px-4 relative z-50">
        <p className="text-[11px] font-sans tracking-[0.20em] uppercase font-medium">
          Free Delivery on Orders Over R500 &nbsp;·&nbsp; SA Wide Shipping
        </p>
      </div>

      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/96 backdrop-blur-xl shadow-[0_1px_0_0_oklch(0.90_0.014_80)]'
            : 'bg-background/90 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          {/* Desktop: three-column layout */}
          <div className="hidden lg:grid lg:grid-cols-3 items-center h-[72px]">

            {/* Left Nav */}
            <nav className="flex items-center gap-8">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group text-[11px] font-medium tracking-[0.18em] text-foreground/65 hover:text-foreground transition-colors duration-200 uppercase"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Center Logo */}
            <div className="flex flex-col items-center">
              <Link href="/" className="flex flex-col items-center group">
                <Image
                  src="/logo.png"
                  alt="ZENistry"
                  width={52}
                  height={52}
                  className="h-[52px] w-auto transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
                  priority
                />
                <span className="text-[9px] tracking-[0.32em] text-foreground/45 uppercase mt-1 font-sans font-medium">
                  Holistic Skincare &amp; Wellness
                </span>
              </Link>
            </div>

            {/* Right Nav + Icons */}
            <div className="flex items-center justify-end gap-8">
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group text-[11px] font-medium tracking-[0.18em] text-foreground/65 hover:text-foreground transition-colors duration-200 uppercase"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}

              <div className="flex items-center gap-1 ml-2 border-l border-border/50 pl-6">
                <a
                  href="https://instagram.com/zenistry"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-full text-foreground/50 hover:text-primary hover:bg-primary/8 transition-all duration-200"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <button
                  className="relative p-2 rounded-full text-foreground/50 hover:text-primary hover:bg-primary/8 transition-all duration-200"
                  onClick={() => setCartOpen(true)}
                  aria-label="Open cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="lg:hidden flex items-center justify-between h-[60px]">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="ZENistry"
                width={40}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <span className="text-[9px] tracking-[0.28em] text-foreground/45 uppercase font-sans font-medium hidden sm:block">
                ZENistry
              </span>
            </Link>

            <div className="flex items-center gap-0.5">
              <button
                className="relative p-2.5 rounded-full text-foreground/55 hover:text-primary hover:bg-primary/8 transition-all"
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                className="p-2.5 rounded-full text-foreground/55 hover:text-primary hover:bg-primary/8 transition-all"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="h-px bg-border/50" />
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-400 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-400 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image src="/logo.png" alt="ZENistry" width={44} height={44} className="h-11 w-auto" />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full text-foreground/50 hover:text-foreground hover:bg-secondary transition-all"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[12px] font-medium tracking-[0.16em] uppercase text-foreground/65 hover:text-foreground hover:bg-secondary transition-all duration-200"
              >
                {link.label}
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </Link>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className="px-6 py-6 border-t border-border/50 space-y-4">
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full justify-center rounded-lg"
            >
              Shop Now
            </Link>
            <div className="flex items-center justify-center gap-1 text-[10px] tracking-[0.20em] text-foreground/40 uppercase font-medium">
              Natural &nbsp;·&nbsp; Mindful &nbsp;·&nbsp; Restorative
            </div>
          </div>
        </div>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
