'use server'

// PRIMUS HOME PRO - Billing Actions
// Server actions for Stripe checkout and portal
// NOTE: Contract v1.0 Agent model does not include billing fields.
// This is a placeholder implementation.

import { stripe } from '@/lib/billing/stripe'
import { prisma } from '@/lib/db/prisma'
import { PLANS } from '@/lib/billing/plans'
import type { ActionResponse } from '@/types'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * Create Stripe checkout session for plan upgrade
 * NOTE: Billing fields not in Contract v1.0 - placeholder implementation
 */
export async function createCheckoutSession(
  agentId: string,
  planId: string
): Promise<ActionResponse<{ url: string }>> {
  try {
    const agent = await prisma.agent.findUnique({ where: { id: agentId } })
    if (!agent || !agent.email) {
      return { success: false, error: 'Agent not found' }
    }

    const plan = PLANS.find((p) => p.id === planId)
    if (!plan || !plan.stripePriceId || plan.priceMonthly === 0) {
      return { success: false, error: 'Invalid plan' }
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: agent.email,
      name: agent.name || undefined,
      metadata: { agentId: agent.id },
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      metadata: { agentId: agent.id, planId: plan.id },
      success_url: `${APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${APP_URL}/dashboard/billing?canceled=true`,
    })

    if (!session.url) {
      return { success: false, error: 'Failed to create checkout session' }
    }

    return { success: true, data: { url: session.url } }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return { success: false, error: 'Failed to create checkout session' }
  }
}

/**
 * Create Stripe customer portal session for subscription management
 * NOTE: Billing fields not in Contract v1.0 - placeholder implementation
 */
export async function createPortalSession(
  agentId: string
): Promise<ActionResponse<{ url: string }>> {
  try {
    // NOTE: Without stripeCustomer field, we cannot create portal session
    // This is a placeholder that returns an error
    return { 
      success: false, 
      error: 'Billing management not yet available. Contact support for subscription changes.' 
    }
  } catch (error) {
    console.error('Error creating portal session:', error)
    return { success: false, error: 'Failed to create portal session' }
  }
}
