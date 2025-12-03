// PRIMUS HOME PRO - Automation Engine (Contract v1.0 Stub)
// NOTE: Full automation system will be implemented in future phase
// Contract v1.0 does NOT include Automation model - placeholder for future

import { prisma } from '@/lib/db/prisma'

export interface AutomationTriggerData {
  leadId: string
  trigger: string
  data?: Record<string, unknown>
}

/**
 * Run automations for a given lead and trigger
 * Contract v1.0 Stub - Returns empty result
 */
export async function runAutomations(triggerData: AutomationTriggerData): Promise<{
  executedCount: number
  results: unknown[]
}> {
  console.log('[AUTO] Automation trigger received (stub):', triggerData.trigger)
  
  // Contract v1.0: No Automation model yet
  // Log the trigger as an AutomationEvent for future processing
  try {
    await prisma.automationEvent.create({
      data: {
        leadId: triggerData.leadId,
        eventType: triggerData.trigger,
        triggeredAt: new Date(),
        handled: false,
        metadata: (triggerData.data || {}) as object,
      },
    })
  } catch (error) {
    console.error('[AUTO] Failed to log automation event:', error)
  }

  return {
    executedCount: 0,
    results: [],
  }
}

/**
 * Get pending automation events for a lead
 */
export async function getPendingAutomations(leadId: string) {
  return prisma.automationEvent.findMany({
    where: {
      leadId,
      handled: false,
    },
    orderBy: { triggeredAt: 'desc' },
  })
}

/**
 * Mark automation event as handled
 */
export async function markAutomationHandled(eventId: string) {
  return prisma.automationEvent.update({
    where: { id: eventId },
    data: {
      handled: true,
      handledAt: new Date(),
    },
  })
}

/**
 * Evaluate if lead matches conditions (stub)
 * Full implementation in future phase
 */
export function evaluateConditions(
  _lead: unknown,
  _conditions: Record<string, unknown>
): boolean {
  // Stub - always returns false until full automation system is implemented
  return false
}
