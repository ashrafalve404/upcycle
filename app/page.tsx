import { Navbar, Hero, HowItWorks, FeaturedProducts, BecomeDesigner, Footer } from '@/components/layout';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturedProducts />
        <BecomeDesigner />
      </main>
      <Footer />
    </div>
  );
}
