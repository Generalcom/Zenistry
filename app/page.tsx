import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedProducts } from "@/components/featured-products"
import { Categories } from "@/components/categories"
import { About } from "@/components/about"
import { Podcast } from "@/components/podcast"
import { Reviews } from "@/components/reviews"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedProducts />
      <Categories />
      <About />
      <Podcast />
      <Reviews />
      <Newsletter />
      <Footer />
    </main>
  )
}
