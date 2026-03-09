import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/services/api/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const conditionLabels: Record<string, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

const locationMap: Record<string, string> = {
  '1': 'Brooklyn, NY',
  '2': 'Austin, TX',
  '3': 'Portland, OR',
  '4': 'Denver, CO',
  '5': 'Seattle, WA',
  '6': 'Chicago, IL',
  '7': 'San Francisco, CA',
};

export function ProductCard({ product }: ProductCardProps) {
  const location = locationMap[product.seller.id] || 'Online';

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-white/90 rounded-full text-gray-700">
              {conditionLabels[product.condition]}
            </span>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 truncate hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          by {product.seller.first_name} {product.seller.last_name}
        </p>
        <p className="text-xs text-gray-400 mt-1">{location}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-lg font-bold text-emerald-600">
          {formatPrice(product.price)}
        </span>
        <Link href={`/product/${product.id}`}>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
