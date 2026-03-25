'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CartDrawer } from './cart-drawer'
import { useCart } from '@/hooks/use-cart'

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/#categories', label: 'Categories' },
  { href: '/#about', label: 'About' },
  { href: '/#podcast', label: 'Podcast' },
  { href: '/#reviews', label: 'Reviews' },
  { href: '/track', label: 'Track Order' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { items } = useCart()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <svg
                  viewBox="0 0 40 40"
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 5C20 5 15 10 15 15C15 18 17 20 20 20C23 20 25 18 25 15C25 10 20 5 20 5Z"
                    className="fill-primary"
                  />
                  <path
                    d="M12 12C12 12 8 16 8 20C8 22.5 10 24 12.5 24C15 24 17 22.5 17 20C17 16 13 12 12 12Z"
                    className="fill-accent"
                  />
                  <path
                    d="M28 12C28 12 32 16 32 20C32 22.5 30 24 27.5 24C25 24 23 22.5 23 20C23 16 27 12 28 12Z"
                    className="fill-accent"
                  />
                  <path
                    d="M20 22C20 22 16 26 16 30C16 33 18 35 20 35C22 35 24 33 24 30C24 26 20 22 20 22Z"
                    className="fill-primary/70"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-semibold tracking-wide text-foreground">
                  ZENistry
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Beauty & Lifestyle
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-accent/10"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-accent/10"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-background p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-border">
                      <div className="flex items-center gap-2">
                        <svg
                          viewBox="0 0 40 40"
                          className="w-8 h-8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 5C20 5 15 10 15 15C15 18 17 20 20 20C23 20 25 18 25 15C25 10 20 5 20 5Z"
                            className="fill-primary"
                          />
                          <path
                            d="M12 12C12 12 8 16 8 20C8 22.5 10 24 12.5 24C15 24 17 22.5 17 20C17 16 13 12 12 12Z"
                            className="fill-accent"
                          />
                          <path
                            d="M28 12C28 12 32 16 32 20C32 22.5 30 24 27.5 24C25 24 23 22.5 23 20C23 16 27 12 28 12Z"
                            className="fill-accent"
                          />
                        </svg>
                        <span className="font-serif text-lg font-semibold">ZENistry</span>
                      </div>
                    </div>
                    <nav className="flex flex-col p-6 gap-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-accent/10 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  )
}
