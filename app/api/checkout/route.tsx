import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const { email, plan, filename } = await req.json();

    if (!email || !plan || !filename) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: "price_1Rf42vQpFMJ6p7gsKWen8Yxf",
          quantity: 1,
        },
      ],
      metadata: {
        email,
        plan,
        filename,
      },
      success_url: `${BASE_URL}/upload?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe Checkout Error]', err);
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 });
  }
}
