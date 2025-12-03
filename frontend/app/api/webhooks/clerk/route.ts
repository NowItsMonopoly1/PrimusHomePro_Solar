// PRIMUS HOME PRO - Clerk Webhook Handler
// Syncs Clerk users to our Agent table on user.created event

import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    try {
      // Create Agent in our database (Contract v1.0)
      await prisma.agent.create({
        data: {
          clerkId: id,
          email: email_addresses[0]?.email_address ?? '',
          name: `${first_name ?? ''} ${last_name ?? ''}`.trim() || 'New Agent',
          role: 'sales', // Default role for new agents
        },
      })

      console.log(`✓ Agent synced to database: ${id}`)
    } catch (error) {
      console.error('Error creating agent in database:', error)
      return new Response('Error: Database sync failed', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data

    try {
      await prisma.agent.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0]?.email_address ?? '',
          name: `${first_name ?? ''} ${last_name ?? ''}`.trim() || 'Agent',
        },
      })

      console.log(`✓ Agent updated in database: ${id}`)
    } catch (error) {
      console.error('Error updating agent in database:', error)
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      await prisma.agent.delete({
        where: { clerkId: id ?? '' },
      })

      console.log(`✓ Agent deleted from database: ${id}`)
    } catch (error) {
      console.error('Error deleting agent from database:', error)
    }
  }

  return new Response('Webhook processed', { status: 200 })
}
