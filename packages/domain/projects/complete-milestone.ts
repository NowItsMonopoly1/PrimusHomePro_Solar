// DOMAIN: Projects - Complete Milestone
// Pure business logic - NO DB, NO API, NO side effects

import { MilestoneKey, Milestone } from './initialize-project-for-lead';

export interface MilestoneRecord {
  key: MilestoneKey;
  completedAt: Date | null;
  completedBy: string | null;
}

export interface CompleteMilestoneInput {
  milestoneKey: MilestoneKey;
  completedBy: string;
  currentMilestones: MilestoneRecord[];
  allMilestones: Milestone[];
}

export interface CompleteMilestoneResult {
  success: boolean;
  updatedMilestone: MilestoneRecord | null;
  commissionUnlockKey: MilestoneKey | null;
  error: string | null;
}

/**
 * Complete a milestone and determine if commission should unlock
 * Pure function - validates and returns result
 */
export function completeMilestone(input: CompleteMilestoneInput): CompleteMilestoneResult {
  const { milestoneKey, completedBy, currentMilestones, allMilestones } = input;

  // Find the milestone definition
  const milestoneDef = allMilestones.find(m => m.key === milestoneKey);
  if (!milestoneDef) {
    return { success: false, updatedMilestone: null, commissionUnlockKey: null, error: 'Milestone not found' };
  }

  // Check if already completed
  const existing = currentMilestones.find(m => m.key === milestoneKey);
  if (existing?.completedAt) {
    return { success: false, updatedMilestone: null, commissionUnlockKey: null, error: 'Milestone already completed' };
  }

  // Check dependencies (all prior milestones must be complete)
  const priorMilestones = allMilestones.filter(m => m.order < milestoneDef.order);
  for (const prior of priorMilestones) {
    const priorRecord = currentMilestones.find(m => m.key === prior.key);
    if (!priorRecord?.completedAt) {
      return { success: false, updatedMilestone: null, commissionUnlockKey: null, error: `Dependency not met: ${prior.label}` };
    }
  }

  // Success - return updated milestone and commission unlock key
  return {
    success: true,
    updatedMilestone: { key: milestoneKey, completedAt: new Date(), completedBy },
    commissionUnlockKey: milestoneDef.commissionUnlockKey,
    error: null,
  };
}
