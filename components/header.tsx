'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="ZENistry"
                width={120}
                height={60}
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
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
                      <Image
                        src="/logo.png"
                        alt="ZENistry"
                        width={100}
                        height={50}
                        className="h-10 w-auto"
                      />
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
