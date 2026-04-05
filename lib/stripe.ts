import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  starter: {
    name: 'Starter',
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    price: 9900,
    maxUsers: 10,
    maxFrameworks: 1,
  },
  professional: {
    name: 'Professional',
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    price: 29900,
    maxUsers: 50,
    maxFrameworks: 3,
  },
} as const
