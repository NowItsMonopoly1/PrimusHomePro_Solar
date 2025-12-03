// PRIMUS HOME PRO - Accept Proposal Server Action (Contract v1.0 Aligned)
// NOTE: Contract v1.0 Proposal model is simplified.
// Advanced features (e-signature, scenarios) will be added in future phase.

'use server'

import { prisma } from '@/lib/db/prisma'
import { headers } from 'next/headers'
import type { ActionResponse } from '@/types'

// ============================================================================
// TYPES (Contract v1.0 Simplified)
// ============================================================================

interface AcceptProposalInput {
  proposalId: string
  customerName: string
  customerEmail: string
}

interface AcceptProposalResult {
  proposalId: string
  leadId: string
  acceptedAt: Date
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get client IP address from headers
 */
async function getClientIP(): Promise<string> {
  const headersList = await headers()
  
  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIP = headersList.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// ============================================================================
// PUBLIC PROPOSAL ACCESS
// ============================================================================

/**
 * Get proposal details for public viewing
 * Contract v1.0: Simplified proposal fields
 */
export async function getPublicProposalDetails(
  proposalId: string
): Promise<ActionResponse<{
  proposal: {
    id: string
    totalSystemCost: number
    netCostAfterIncentives: number
    estMonthlyPayment: number
    estMonthlySavings: number
    pricingMode: string
    pdfUrl: string | null
    createdAt: Date
  }
  lead: {
    name: string | null
    address: string | null
  }
}>> {
  try {
    if (!proposalId) {
      return { success: false, error: 'Invalid request' }
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        lead: {
          select: {
            name: true,
            address: true,
          },
        },
      },
    })

    if (!proposal) {
      return { success: false, error: 'Proposal not found' }
    }

    return {
      success: true,
      data: {
        proposal: {
          id: proposal.id,
          totalSystemCost: proposal.totalSystemCost,
          netCostAfterIncentives: proposal.netCostAfterIncentives,
          estMonthlyPayment: proposal.estMonthlyPayment,
          estMonthlySavings: proposal.estMonthlySavings,
          pricingMode: proposal.pricingMode,
          pdfUrl: proposal.pdfUrl,
          createdAt: proposal.createdAt,
        },
        lead: {
          name: proposal.lead.name,
          address: proposal.lead.address,
        },
      },
    }
  } catch (error) {
    console.error('[Proposal] Error fetching proposal:', error)
    return { success: false, error: 'Failed to load proposal' }
  }
}

// ============================================================================
// ACCEPT PROPOSAL ACTION
// ============================================================================

/**
 * Accept a proposal
 * Contract v1.0: Simplified - updates lead status to 'sold'
 */
export async function acceptProposal(
  input: AcceptProposalInput
): Promise<ActionResponse<AcceptProposalResult>> {
  try {
    const { proposalId, customerName, customerEmail } = input

    if (!proposalId) {
      return { success: false, error: 'Invalid request' }
    }

    if (!customerName || customerName.trim().length < 2) {
      return { success: false, error: 'Please enter your full name' }
    }

    if (!customerEmail || !validateEmail(customerEmail)) {
      return { success: false, error: 'Please enter a valid email address' }
    }

    // Fetch proposal
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { lead: true },
    })

    if (!proposal) {
      return { success: false, error: 'Proposal not found' }
    }

    const acceptedAt = new Date()

    // Contract v1.0: Update lead status to 'sold'
    await prisma.lead.update({
      where: { id: proposal.leadId },
      data: {
        status: 'sold',
        email: proposal.lead.email || customerEmail.toLowerCase().trim(),
        name: proposal.lead.name || customerName.trim(),
      },
    })

    // Log acceptance via AutomationEvent
    await prisma.automationEvent.create({
      data: {
        leadId: proposal.leadId,
        eventType: 'proposal_accepted',
        triggeredAt: acceptedAt,
        handled: true,
        handledAt: acceptedAt,
        metadata: {
          proposalId,
          customerName,
          customerEmail,
        },
      },
    })

    console.log(`[Proposal] Proposal ${proposalId} accepted by ${customerName}`)

    return {
      success: true,
      data: {
        proposalId: proposal.id,
        leadId: proposal.leadId,
        acceptedAt,
      },
    }
  } catch (error) {
    console.error('[Proposal] Error accepting proposal:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to accept proposal',
    }
  }
}

// ============================================================================
// GENERATE SHAREABLE LINK
// ============================================================================

/**
 * Generate a shareable link for a proposal
 */
export async function getProposalShareLink(
  proposalId: string
): Promise<ActionResponse<{ url: string }>> {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { id: true },
    })

    if (!proposal) {
      return { success: false, error: 'Proposal not found' }
    }

    // Construct the public URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const url = `${baseUrl}/proposals/${proposal.id}`

    return {
      success: true,
      data: { url },
    }
  } catch (error) {
    console.error('[Proposal] Error generating share link:', error)
    return { success: false, error: 'Failed to generate link' }
  }
}