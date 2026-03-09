import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Turn Old Things Into{' '}
            <span className="text-emerald-600">Something New</span>
          </h1>
          
          <p className="mt-6 text-lg text-gray-600 md:text-xl">
            The innovative marketplace to buy, sell, and creatively upcycle pre-loved products. 
            Give your old items a second life with custom designs from talented artists.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8 w-full sm:w-auto">
                Explore Marketplace
              </Button>
            </Link>
            <Link href="/design-requests/new">
              <Button size="lg" variant="outline" className="text-lg px-8 border-emerald-600 text-emerald-600 hover:bg-emerald-50 w-full sm:w-auto">
                Start Upcycling
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
