// PRIMUS HOME PRO - Stripe Webhook Handler
// Syncs subscription status from Stripe events
// NOTE: Contract v1.0 does not include billing fields on Agent model.
// This webhook is a placeholder for future billing integration.

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/billing/stripe'
import { prisma } from '@/lib/db/prisma'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  // Check if Stripe is configured
  if (!isStripeConfigured()) {
    return new NextResponse('Stripe not configured', { status: 503 })
  }

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('Stripe-Signature')

  if (!signature) {
    return new NextResponse('Missing Stripe signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return new NextResponse('Webhook Error', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (!session?.metadata?.agentId) {
          console.error('Missing agentId in session metadata')
          return new NextResponse('Agent ID missing', { status: 400 })
        }

        // TODO: Store subscription info when billing fields are added to schema
        // For now, just log the successful checkout
        console.log(`✓ Checkout completed for agent ${session.metadata.agentId}`)
        console.log(`  Plan: ${session.metadata.planId}`)
        console.log(`  Customer: ${session.customer}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const agentId = subscription.metadata.agentId

        if (!agentId) {
          console.error('Missing agentId in subscription metadata')
          break
        }

        // TODO: Update agent subscription status when billing fields are added
        console.log(`✓ Subscription updated for agent ${agentId}`)
        console.log(`  Status: ${subscription.status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const agentId = subscription.metadata.agentId

        if (!agentId) {
          console.error('Missing agentId in subscription metadata')
          break
        }

        // TODO: Handle subscription cancellation when billing fields are added
        console.log(`✓ Subscription canceled for agent ${agentId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Webhook handler failed', { status: 500 })
  }
}
