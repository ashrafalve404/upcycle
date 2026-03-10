'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { productService } from '@/services/productService';
import { Product } from '@/services/api/types';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

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
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'cash'>('stripe');
  const [offerAmount, setOfferAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delivery information state
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      addToast({
        title: 'Please login',
        description: 'You need to login to purchase items',
        variant: 'warning',
      });
      router.push('/login');
      return;
    }

    if (user?.account_type === 'designer' || user?.account_type === 'admin') {
      addToast({
        title: 'Cannot purchase',
        description: 'Only buyers can purchase items',
        variant: 'error',
      });
      return;
    }

    // Show delivery information dialog
    setShowDeliveryDialog(true);
  };

  const handleDeliverySubmit = () => {
    // Validate delivery information
    if (!deliveryInfo.fullName || !deliveryInfo.email || !deliveryInfo.address || !deliveryInfo.city || 
        !deliveryInfo.state || !deliveryInfo.zipCode || !deliveryInfo.phone) {
      addToast({
        title: 'Missing information',
        description: 'Please fill in all delivery information fields',
        variant: 'error',
      });
      return;
    }

    // Close delivery dialog and show payment method selection
    setShowDeliveryDialog(false);
    setShowPaymentDialog(true);
  };

  const handlePaymentSubmit = async () => {
    setIsSubmitting(true);

    if (selectedPaymentMethod === 'stripe') {
      // Process with Stripe
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product?.id,
            productTitle: product?.title,
            productPrice: product?.price,
            productImage: product?.images?.[0],
            deliveryInfo,
            userId: user?.id,
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('Failed to get checkout URL');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        setIsSubmitting(false);
        addToast({
          title: 'Payment Error',
          description: 'Failed to initiate payment. Please try again.',
          variant: 'error',
        });
      }
    } else {
      // Cash on Delivery - simulate order processing
      setTimeout(() => {
        setIsSubmitting(false);
        setShowPaymentDialog(false);
        setDeliveryInfo({
          fullName: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          phone: '',
        });
        addToast({
          title: 'Order Placed!',
          description: `Your order for ${product?.title} has been placed. You will pay ${formatPrice(product?.price || 0)} in cash upon delivery.`,
          variant: 'success',
        });
      }, 1500);
    }
  };

  const handleMakeOffer = () => {
    if (!isAuthenticated) {
      addToast({
        title: 'Please login',
        description: 'You need to login to make an offer',
        variant: 'warning',
      });
      router.push('/login');
      return;
    }

    if (user?.account_type === 'designer' || user?.account_type === 'admin') {
      addToast({
        title: 'Cannot make offer',
        description: 'Only buyers can make offers',
        variant: 'error',
      });
      return;
    }

    setShowOfferDialog(true);
  };

  const handleSubmitOffer = async () => {
    const offer = parseFloat(offerAmount);
    
    if (isNaN(offer) || offer <= 0) {
      addToast({
        title: 'Invalid amount',
        description: 'Please enter a valid offer amount',
        variant: 'error',
      });
      return;
    }

    if (product && offer > product.price * 1.5) {
      addToast({
        title: 'Offer too high',
        description: 'Your offer cannot exceed 150% of the asking price',
        variant: 'warning',
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOfferDialog(false);
      setOfferAmount('');
      addToast({
        title: 'Offer submitted!',
        description: `Your offer of ${formatPrice(offer)} has been sent to the seller.`,
        variant: 'success',
      });
    }, 1000);
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
  const isOwnProduct = user?.id === product.seller.id;

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
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                  onClick={handleBuyNow}
                  disabled={isOwnProduct}
                >
                  Buy Now
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-lg py-6 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  onClick={handleMakeOffer}
                  disabled={isOwnProduct}
                >
                  Make Offer
                </Button>
              </div>

              {isOwnProduct && (
                <p className="text-sm text-orange-600 text-center">
                  This is your listing
                </p>
              )}

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
                </CardContent>
              </Card>

              {/* Seller Section */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Seller</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                      {product.seller.first_name[0]}{product.seller.last_name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.seller.first_name} {product.seller.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{location}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50">
                    View Seller Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Designer Section */}
              {product.designer && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Designer</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-lg">
                        {product.designer.first_name[0]}{product.designer.last_name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.designer.first_name} {product.designer.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{product.designer.account_type === 'designer' ? 'Upcycling Designer' : 'Designer'}</p>
                      </div>
                    </div>
                    <Link href={`/designers/${product.designer.id}`}>
                      <Button variant="outline" className="w-full mt-4 border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                        View Designer Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              <div className="text-sm text-gray-500">
                <p>Posted on {new Date(product.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Make Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make an Offer</DialogTitle>
            <DialogDescription>
              Enter your offer amount for {product?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Offer ({formatPrice(product?.price || 0)} asking price)
            </label>
            <input
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="1"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-2">
              Suggested: {formatPrice((product?.price || 0) * 0.8)} - {formatPrice(product?.price || 0)}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitOffer}
              disabled={isSubmitting || !offerAmount}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delivery Information Dialog */}
      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delivery Information</DialogTitle>
            <DialogDescription>
              Please provide your delivery details to complete the purchase of {product?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={deliveryInfo.fullName}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={deliveryInfo.email}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={deliveryInfo.address}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                placeholder="123 Main Street, Apt 4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deliveryInfo.city}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                  placeholder="New York"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deliveryInfo.state}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
                  placeholder="NY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deliveryInfo.zipCode}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, zipCode: e.target.value })}
                  placeholder="10001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={deliveryInfo.phone}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Order Total</p>
                  <p className="text-xs text-gray-500">Including shipping & taxes</p>
                </div>
                <p className="text-xl font-bold text-emerald-600">{formatPrice(product?.price || 0)}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeliveryDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeliverySubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Continue to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Selection Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you would like to pay for {product?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Stripe / Card Option */}
            <label
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentMethod === 'stripe' 
                  ? 'border-emerald-600 bg-emerald-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={selectedPaymentMethod === 'stripe'}
                onChange={() => setSelectedPaymentMethod('stripe')}
                className="sr-only"
              />
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Credit / Debit Card</p>
                <p className="text-sm text-gray-500">Pay securely with Visa, Mastercard, etc.</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === 'stripe' ? 'border-emerald-600' : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'stripe' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                )}
              </div>
            </label>

            {/* Cash on Delivery Option */}
            <label
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentMethod === 'cash' 
                  ? 'border-emerald-600 bg-emerald-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={selectedPaymentMethod === 'cash'}
                onChange={() => setSelectedPaymentMethod('cash')}
                className="sr-only"
              />
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay with cash when the product is delivered</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPaymentMethod === 'cash' ? 'border-emerald-600' : 'border-gray-300'
              }`}>
                {selectedPaymentMethod === 'cash' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                )}
              </div>
            </label>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Order Total</p>
                  <p className="text-xs text-gray-500">
                    {selectedPaymentMethod === 'cash' ? 'Pay upon delivery' : 'Secure payment'}
                  </p>
                </div>
                <p className="text-xl font-bold text-emerald-600">{formatPrice(product?.price || 0)}</p>
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t">
                <p>Delivery to: {deliveryInfo.address}, {deliveryInfo.city}, {deliveryInfo.state} {deliveryInfo.zipCode}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Back
            </Button>
            <Button 
              onClick={handlePaymentSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {selectedPaymentMethod === 'stripe' ? 'Pay with Card' : 'Confirm Order'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
