'use server'

// PRIMUS HOME PRO - Server Actions: CRM (Contract v1.0 Aligned)
// Handles status changes and messaging

import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types'

/**
 * Update lead status
 * Contract v1.0: Uses 'status' field (not 'stage')
 * Valid values: 'new', 'qualified', 'disqualified', 'proposed', 'sold'
 */
export async function updateLeadStatus(
  leadId: string,
  status: string
): Promise<ActionResponse> {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    })

    // Contract v1.0: Log via AutomationEvent
    await prisma.automationEvent.create({
      data: {
        leadId,
        eventType: 'status_change',
        triggeredAt: new Date(),
        handled: true,
        handledAt: new Date(),
        metadata: {
          newStatus: status,
        },
      },
    })

    revalidatePath('/dashboard/leads')
    return { success: true, data: null }
  } catch (error) {
    console.error('Error updating lead status:', error)
    return { success: false, error: 'Failed to update status' }
  }
}

// Legacy alias for backward compatibility
export async function updateLeadStage(
  leadId: string,
  stage: string
): Promise<ActionResponse> {
  return updateLeadStatus(leadId, stage.toLowerCase())
}

/**
 * Add internal note to lead
 * Contract v1.0: Uses Message model with direction='internal'
 */
export async function addLeadNote(formData: FormData): Promise<ActionResponse> {
  const leadId = formData.get('leadId') as string
  const content = formData.get('note') as string

  if (!leadId || !content) {
    return { success: false, error: 'Missing required fields' }
  }

  try {
    // Contract v1.0: Store notes as internal messages
    await prisma.message.create({
      data: {
        leadId,
        direction: 'internal',
        channel: 'note',
        body: content,
      },
    })

    revalidatePath('/dashboard/leads')
    return { success: true, data: null }
  } catch (error) {
    console.error('Error adding note:', error)
    return { success: false, error: 'Failed to add note' }
  }
}
