import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { errorResponse, AppError } from '@/lib/errors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    const { success } = await rateLimit(`checkout:${ip}`, 5, '10 m');
    if (!success) throw new AppError('Too many checkout attempts', 'RATE_LIMIT', 429);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new AppError('Authentication required', 'AUTH_REQUIRED', 401);

    const { priceId, plan } = await req.json();
    if (!priceId) throw new AppError('Price ID required', 'VALIDATION_ERROR', 400);

    const { data: org } = await supabase
      .from('organizations')
      .select('id, stripe_customer_id')
      .single();

    const session = await stripe.checkout.sessions.create({
      customer: org?.stripe_customer_id || undefined,
      customer_email: !org?.stripe_customer_id ? user.email : undefined,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { organizationId: org?.id, plan },
      },
      metadata: { organizationId: org?.id ?? '', plan: plan ?? '' },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return errorResponse(error);
  }
}