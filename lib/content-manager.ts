const CONTENT_KEY = 'ZENistry-content'

export interface ContentSection {
  id: string
  label: string
  value: string
  multiline?: boolean
  category: string
}

export const EDITABLE_SECTIONS: Omit<ContentSection, 'value'>[] = [
  // Footer
  { id: 'footer-description', label: 'Footer Tagline', multiline: true, category: 'Footer' },
  { id: 'footer-phone', label: 'Phone Number', category: 'Footer' },
  { id: 'footer-location', label: 'Location', category: 'Footer' },
  { id: 'footer-copyright', label: 'Copyright Text', category: 'Footer' },
  // Contact
  { id: 'contact-title', label: 'Section Title', category: 'Contact' },
  { id: 'contact-description', label: 'Section Description', multiline: true, category: 'Contact' },
  { id: 'contact-info-title', label: 'Info Box Title', category: 'Contact' },
  { id: 'contact-email', label: 'Contact Email', category: 'Contact' },
  { id: 'contact-phone', label: 'Contact Phone', category: 'Contact' },
  { id: 'contact-response-time', label: 'Response Time', category: 'Contact' },
  // About
  { id: 'about-subtitle', label: 'Subtitle', category: 'About' },
  { id: 'about-title', label: 'Title', multiline: true, category: 'About' },
  { id: 'about-description-1', label: 'Description (paragraph 1)', multiline: true, category: 'About' },
  { id: 'about-description-2', label: 'Description (paragraph 2)', multiline: true, category: 'About' },
  { id: 'about-button', label: 'Button Text', category: 'About' },
  // Testimonials
  { id: 'testimonials-title', label: 'Section Title', category: 'Testimonials' },
  { id: 'testimonials-subtitle', label: 'Subtitle', category: 'Testimonials' },
  { id: 'testimonials-description', label: 'Description', multiline: true, category: 'Testimonials' },
  // Newsletter
  { id: 'newsletter-title', label: 'Title', category: 'Newsletter' },
  { id: 'newsletter-description', label: 'Description', multiline: true, category: 'Newsletter' },
]

export function getAllContent(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const raw = localStorage.getItem(CONTENT_KEY)
  if (!raw) return {}
  try { return JSON.parse(raw) } catch { return {} }
}

export function getContent(sectionId: string, fallback?: string): string {
  const all = getAllContent()
  return all[sectionId] !== undefined ? all[sectionId] : (fallback ?? '')
}

export function setContent(sectionId: string, value: string): void {
  if (typeof window === 'undefined') return
  const all = getAllContent()
  all[sectionId] = value
  localStorage.setItem(CONTENT_KEY, JSON.stringify(all))
  window.dispatchEvent(new CustomEvent('ZENistry-content-updated'))
}

export function resetContent(sectionId: string): void {
  if (typeof window === 'undefined') return
  const all = getAllContent()
  delete all[sectionId]
  localStorage.setItem(CONTENT_KEY, JSON.stringify(all))
  window.dispatchEvent(new CustomEvent('ZENistry-content-updated'))
}
