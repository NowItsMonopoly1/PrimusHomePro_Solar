// PRIMUS HOME PRO - Data Layer: Leads (Contract v1.0 Aligned)
// Server-side queries for CRM dashboard

import { prisma } from '@/lib/db/prisma'
import type { LeadWithMeta } from '@/types'

/**
 * Get all leads for an agent
 * Contract v1.0: Uses agentId field
 */
export async function getLeadsForAgent(agentId: string): Promise<LeadWithMeta[]> {
  const leads = await prisma.lead.findMany({
    where: { agentId },
    include: {
      messages: {
        orderBy: { sentAt: 'desc' },
        take: 5,
      },
      project: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return leads.map((lead) => {
    const lastMessage = lead.messages[0]

    return {
      ...lead,
      lastEventAt: lastMessage?.sentAt ?? lead.createdAt,
      project: lead.project,
      messages: lead.messages,
    }
  })
}

// Legacy alias for backward compatibility during migration
export const getLeadsForUser = getLeadsForAgent

/**
 * Get a single lead by ID with messages
 * Contract v1.0: Uses Message model
 */
export async function getLeadById(leadId: string, agentId: string): Promise<LeadWithMeta | null> {
  const lead = await prisma.lead.findFirst({
    where: { 
      id: leadId,
      agentId,
    },
    include: {
      messages: {
        orderBy: { sentAt: 'desc' },
      },
      project: {
        select: { id: true },
      },
    },
  })

  if (!lead) return null

  const lastMessage = lead.messages[0]

  return {
    ...lead,
    lastEventAt: lastMessage?.sentAt ?? lead.createdAt,
    project: lead.project,
    messages: lead.messages,
  }
}
