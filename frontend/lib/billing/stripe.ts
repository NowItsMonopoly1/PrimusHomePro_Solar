// PRIMUS HOME PRO - Stripe Client
// Lazy-loaded Stripe instance to avoid build-time errors

import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

// Lazy getter for Stripe - only initializes when actually called
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  }
  
  return stripeInstance
}

// For backwards compatibility - but will throw at runtime if not configured
export const stripe = {
  get webhooks() { return getStripe().webhooks },
  get subscriptions() { return getStripe().subscriptions },
  get customers() { return getStripe().customers },
  get checkout() { return getStripe().checkout },
  get billingPortal() { return getStripe().billingPortal },
} as unknown as Stripe

// Helper to check if Stripe is properly configured
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}
