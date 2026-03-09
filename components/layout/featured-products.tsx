import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

const featuredProducts = [
  {
    id: 1,
    title: 'Vintage Oak Dresser',
    price: 350,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    condition: 'Good',
    location: 'Brooklyn, NY',
  },
  {
    id: 2,
    title: 'Upcycled Leather Bag',
    price: 120,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop',
    condition: 'Like New',
    location: 'Austin, TX',
  },
  {
    id: 3,
    title: 'Restored Mid-Century Chair',
    price: 275,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop',
    condition: 'Excellent',
    location: 'Portland, OR',
  },
  {
    id: 4,
    title: 'Reclaimed Wood Coffee Table',
    price: 425,
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop',
    condition: 'Good',
    location: 'Denver, CO',
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Upcycled Products</h2>
            <p className="mt-4 text-lg text-gray-600">Discover unique pieces given a new lease of life</p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            View All Products
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 text-xs font-medium bg-white/90 rounded-full text-gray-700">
                    {product.condition}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.location}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="text-lg font-bold text-emerald-600">
                  {formatPrice(product.price)}
                </span>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
