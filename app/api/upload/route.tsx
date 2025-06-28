'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY! // NOT the anon key
// );

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export async function POST(req: NextRequest) {
  try {
    const { email, plan, fileUrls } = await req.json();

    if (!email || !plan || !fileUrls?.length) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const priceMap: Record<string, string> = {
      basic: process.env.STRIPE_PRICE_ID_BASIC!,
      plus: process.env.STRIPE_PRICE_ID_PLUS!,
      pro: process.env.STRIPE_PRICE_ID_PRO!,
    };

    const priceId = priceMap[plan];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        email,
        plan,
        fileUrls: fileUrls.join(','),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?email=${email}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/analyze?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
