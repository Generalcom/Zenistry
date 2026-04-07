'use client'

import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '27828277990'

interface WhatsAppButtonProps {
  message?: string
  className?: string
}

export function WhatsAppButton({
  message = "Hi Angela! I'd love to find out more about ZENistry products.",
  className,
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={
        className ??
        'fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#1ebe5d] transition-all duration-300 hover:scale-105 hover:shadow-xl group'
      }
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      <span className="text-sm font-medium max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        Chat with Angela
      </span>
    </a>
  )
}

export function WhatsAppOrderButton({
  productName,
  price,
  className,
}: {
  productName: string
  price: number
  className?: string
}) {
  const message = `Hi Angela! I'd like to order:\n\n• ${productName} × 1 — R${price}\n\nPlease let me know how to proceed with payment. Thank you!`
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        'flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02]'
      }
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      Order via WhatsApp
    </a>
  )
}
