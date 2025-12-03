// DOMAIN: Commissions - Create Commission Unlock
// Pure business logic - NO DB, NO API, NO side effects, NO hardcoded %

import { MilestoneKey } from '../projects';

// Contract v1.0: lowercase status values
export type CommissionStatus = 'pending' | 'confirmed' | 'paid';

export interface CommissionUnlockInput {
  projectId: string;
  agentId: string;
  milestoneKey: MilestoneKey;
  projectGrossValue: number;
  milestonePercent: number; // Passed from config, NOT hardcoded
}

export interface CommissionUnlock {
  projectId: string;
  agentId: string;
  milestoneKey: MilestoneKey;
  amount: number;
  status: CommissionStatus;
}

/**
 * Create a commission unlock record
 * Pure function - NO hardcoded percentages, amount calculated from inputs
 * 
 * The milestonePercent comes from company configuration (loaded elsewhere)
 * This keeps the domain logic pure and flexible
 */
export function createCommissionUnlock(input: CommissionUnlockInput): CommissionUnlock {
  const { projectId, agentId, milestoneKey, projectGrossValue, milestonePercent } = input;

  // Calculate amount from project value × milestone percentage
  // milestonePercent is a decimal (e.g., 0.10 for 10%)
  const amount = Math.round(projectGrossValue * milestonePercent);

  return {
    projectId,
    agentId,
    milestoneKey,
    amount,
    status: 'pending',
  };
}
