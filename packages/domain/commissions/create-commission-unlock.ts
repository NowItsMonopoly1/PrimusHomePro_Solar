// DOMAIN: Commissions - Create Commission Unlock
// Pure business logic - NO hardcoded percentages yet

export interface CommissionUnlock {
  id: string;
  projectId: string;
  agentId: string;
  milestoneKey: string; // e.g., 'contract_signed', 'install_complete'
  amount: number;
  status: 'pending' | 'unlocked' | 'paid';
  unlockedAt: Date | null;
  paidAt: Date | null;
}

/**
 * Create a commission unlock tied to a milestone
 * 
 * Per Master Spec v2.0:
 * - Commission amounts are NOT hardcoded in v1
 * - Calculated based on project value and company config
 * - Unlocked when milestone is complete
 */
export async function createCommissionUnlock(
  projectId: string,
  agentId: string,
  milestoneKey: string,
  amount: number
): Promise<CommissionUnlock> {
  // TODO: Persist to DB via service layer
  
  return {
    id: `commission_unlock_${Date.now()}`,
    projectId,
    agentId,
    milestoneKey,
    amount,
    status: 'pending',
    unlockedAt: null,
    paidAt: null,
  };
}
