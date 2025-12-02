// PRIMUS HOME PRO - Data Layer: Leads
// Server-side queries for CRM dashboard with RBAC

import { prisma } from '@/lib/db/prisma'
import { getAuthContext, getLeadWhereClause, canViewLead } from '@/lib/auth/auth-service'
import type { LeadWithMeta } from '@/types'

/**
 * Get all leads for the current user with proper RBAC filtering
 * - ADMIN/SCHEDULER: All company leads
 * - SALES: Only assigned or created leads
 * Used by CRM dashboard
 */
export async function getLeadsForUser(userId: string): Promise<LeadWithMeta[]> {
  const context = await getAuthContext()
  
  if (!context) {
    return []
  }

  // Get RBAC-compliant WHERE clause
  const whereClause = await getLeadWhereClause()
  
  const leads = await prisma.lead.findMany({
    where: whereClause,
    include: {
      events: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      project: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return leads.map((lead) => {
    const lastEvent = lead.events[0]
    const meta = lastEvent?.metadata as Record<string, unknown> | undefined

    return {
      ...lead,
      lastEventAt: lastEvent?.createdAt ?? lead.createdAt,
      lastIntent: (meta?.intent as string) ?? lead.intent ?? 'New',
      lastScore: (meta?.score as number) ?? lead.score ?? 0,
      lastSentiment: (meta?.sentiment as string) ?? lead.sentiment ?? 'Neutral',
    }
  })
}

/**
 * Get a single lead with full event history
 * Enforces RBAC - user must have permission to view this lead
 */
export async function getLeadById(leadId: string): Promise<LeadWithMeta | null> {
  // Check permission first
  const permission = await canViewLead(leadId)
  if (!permission.allowed) {
    return null
  }

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      events: {
        orderBy: { createdAt: 'desc' },
      },
      project: {
        select: { id: true },
      },
    },
  })

  if (!lead) return null

  const lastEvent = lead.events[0]
  const meta = lastEvent?.metadata as Record<string, unknown> | undefined

  return {
    ...lead,
    lastEventAt: lastEvent?.createdAt ?? lead.createdAt,
    lastIntent: (meta?.intent as string) ?? lead.intent ?? 'New',
    lastScore: (meta?.score as number) ?? lead.score ?? 0,
    lastSentiment: (meta?.sentiment as string) ?? lead.sentiment ?? 'Neutral',
  }
}
