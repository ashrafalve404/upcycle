import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { productService } from '@/services/productService';

export default async function NewArrivalsPage() {
  const products = await productService.getProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="bg-emerald-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold">New Arrivals</h1>
            <p className="mt-4 text-emerald-100">Fresh items just listed</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  {product.images[0] && (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600">{product.title}</h3>
                  <p className="text-emerald-600 font-bold mt-2">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
