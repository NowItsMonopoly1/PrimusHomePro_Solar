// DOMAIN: Leads - Update Lead Status
// Pure business logic

export type LeadStatus = 'new' | 'qualified' | 'contacted' | 'proposal_sent' | 'closed' | 'lost';

export interface UpdateLeadStatusInput {
  leadId: string;
  newStatus: LeadStatus;
  reason?: string;
}

/**
 * Update lead status with business logic validation
 * 
 * Domain rules:
 * - Cannot go from 'closed' to 'new'
 * - Cannot skip qualification step for high-value leads
 */
export async function updateLeadStatus(input: UpdateLeadStatusInput): Promise<void> {
  // TODO: Implement status transition validation
  // TODO: Call service layer to persist
  
  console.log(`Updating lead ${input.leadId} to status: ${input.newStatus}`);
}
