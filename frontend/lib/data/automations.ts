// PRIMUS HOME PRO - Automations Data Layer (Contract v1.0 Stub)
// NOTE: Contract v1.0 does NOT include Automation model
// This is a placeholder for future implementation

import { prisma } from '@/lib/db/prisma'
import type { AutomationConfig, AutomationWithConfig } from '@/types'

// Placeholder automation type - matches AutomationWithConfig from types
export type AutomationStub = AutomationWithConfig

/**
 * Get automations for agent (stub)
 * Contract v1.0: No Automation model yet
 */
export async function getAgentAutomations(_agentId: string): Promise<AutomationWithConfig[]> {
  // Return empty array - no Automation model in Contract v1.0
  console.log('[DATA] getAgentAutomations called (stub)')
  return []
}

/**
 * Alias for backward compatibility with pages using old name
 */
export async function getAutomationsForUser(_clerkUserId: string): Promise<AutomationWithConfig[]> {
  console.log('[DATA] getAutomationsForUser called (stub)')
  return []
}

/**
 * Get automation by ID (stub)
 */
export async function getAutomationById(_id: string): Promise<AutomationWithConfig | null> {
  console.log('[DATA] getAutomationById called (stub)')
  return null
}

/**
 * Create automation (stub)
 */
export async function createAutomation(
  _agentId: string,
  _data: Partial<AutomationWithConfig>
): Promise<AutomationWithConfig | null> {
  console.log('[DATA] createAutomation called (stub)')
  return null
}

/**
 * Update automation (stub)
 */
export async function updateAutomation(
  _id: string,
  _data: Partial<AutomationStub>
): Promise<AutomationStub | null> {
  console.log('[DATA] updateAutomation called (stub)')
  return null
}

/**
 * Delete automation (stub)
 */
export async function deleteAutomation(_id: string): Promise<boolean> {
  console.log('[DATA] deleteAutomation called (stub)')
  return false
}

/**
 * Toggle automation active status (stub)
 */
export async function toggleAutomationActive(_id: string): Promise<AutomationStub | null> {
  console.log('[DATA] toggleAutomationActive called (stub)')
  return null
}

/**
 * Get automation event history for a lead
 * Uses Contract v1.0 AutomationEvent model
 */
export async function getLeadAutomationEvents(leadId: string) {
  return prisma.automationEvent.findMany({
    where: { leadId },
    orderBy: { triggeredAt: 'desc' },
    take: 50,
  })
}
