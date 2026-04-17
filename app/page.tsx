import { Header } from "@/components/header"
import { Hero } from "@/components/hero-dynamic"
import { PhilosophyBar } from "@/components/philosophy-bar"
import { FeaturedProducts } from "@/components/featured-products"
import { Categories } from "@/components/categories"
import { About } from "@/components/about-dynamic"
import { Podcast } from "@/components/podcast"
import { Testimonials } from "@/components/testimonials-dynamic"
import { Newsletter } from "@/components/newsletter-dynamic"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer-dynamic"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <PhilosophyBar />
      <FeaturedProducts />
      <Categories />
      <About />
      <Podcast />
      <Testimonials />
      <Newsletter />
      <ContactForm />
      <Footer />
    </main>
  )
}
