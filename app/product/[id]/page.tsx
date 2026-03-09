'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { Navbar, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { productService } from '@/services/productService';
import { Product } from '@/services/api/types';
import { formatPrice } from '@/lib/utils';

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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [resolvedParams.id]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProduct(resolvedParams.id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
            <Link href="/marketplace">
              <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const location = locationMap[product.seller.id] || 'Online';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Marketplace
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-emerald-600' : 'border-transparent'
                      }`}
                    >
                      <Image src={image} alt={`${product.title} ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                    {conditionLabels[product.condition]}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
                  Buy Now
                </Button>
                <Button variant="outline" className="flex-1 text-lg py-6 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Make Offer
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Seller</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-lg">
                      {product.seller.first_name[0]}{product.seller.last_name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.seller.first_name} {product.seller.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{location}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              <div className="text-sm text-gray-500">
                <p>Posted on {new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
