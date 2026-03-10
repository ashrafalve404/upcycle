import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productId, 
      productTitle, 
      productPrice, 
      productImage,
      deliveryInfo,
      userId 
    } = body;

    if (!productId || !productTitle || !productPrice) {
      return NextResponse.json(
        { error: 'Missing required product information' },
        { status: 400 }
      );
    }

    // Create line items for Stripe checkout
    const lineItems = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productTitle,
            description: `Delivery to: ${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zipCode}`,
            images: productImage ? [productImage] : [],
            metadata: {
              productId,
              userId: userId || '',
              deliveryInfo: JSON.stringify(deliveryInfo),
            },
          },
          unit_amount: Math.round(productPrice * 100), // Convert to cents
        },
        quantity: 1,
      },
    ];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/product/${productId}?cancelled=true`,
      metadata: {
        productId,
        userId: userId || '',
        deliveryInfo: JSON.stringify(deliveryInfo),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
