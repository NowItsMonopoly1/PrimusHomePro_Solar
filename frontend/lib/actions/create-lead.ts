// PRIMUS HOME PRO - Server Action: Create Lead
// Handles lead creation from landing page forms (Contract v1.0 Aligned)

'use server'

import { prisma } from '@/lib/db/prisma'
import { leadCaptureSchema } from '@/lib/validations/lead'
import { runAutomations } from '@/lib/automations/engine'
import type { ActionResponse, Lead } from '@/types'
import { auth } from '@clerk/nextjs/server'

/**
 * Create a new lead from a landing page form submission
 * Contract v1.0: Uses Agent model, agentId field, status field
 */
export async function createLead(
  input: unknown
): Promise<ActionResponse<Lead>> {
  try {
    // Validate input
    const validatedData = leadCaptureSchema.parse(input)

    // Get authenticated agent (if available)
    const { userId: clerkUserId } = await auth()

    let agentId: string | null = null

    if (clerkUserId) {
      // Contract v1.0: Find Agent by Clerk ID
      const agent = await prisma.agent.findUnique({
        where: { clerkId: clerkUserId },
      })
      agentId = agent?.id || null
    }

    // If no authenticated agent, try to find a default agent
    if (!agentId) {
      const defaultAgent = await prisma.agent.findFirst({
        where: { role: 'admin' },
      })

      if (!defaultAgent) {
        // Create a system agent if none exists
        const systemAgent = await prisma.agent.findFirst()
        if (!systemAgent) {
          return {
            success: false,
            error: 'No agent found. Please set up your account first.',
          }
        }
        agentId = systemAgent.id
      } else {
        agentId = defaultAgent.id
      }
    }

    // Contract v1.0: Create lead with approved fields only
    const lead = await prisma.lead.create({
      data: {
        agentId,
        name: validatedData.name || null,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        source: validatedData.source,
        status: 'new', // Contract v1.0: lowercase status
      },
    })

    console.log('✓ Lead created:', lead.id)

    // Trigger automations asynchronously (don't block response)
    runAutomations({
      leadId: lead.id,
      trigger: 'lead.created',
    }).catch((error) => {
      console.error('Error running automations:', error)
    })

    return {
      success: true,
      data: lead as Lead,
    }
  } catch (error) {
    console.error('Error creating lead:', error)

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: 'Failed to create lead. Please try again.',
    }
  }
}
