// DOMAIN: Projects - Initialize Project For Lead
// Pure business logic - NO DB, NO API, NO side effects

export type ProjectStatus = 
  | 'engineering'
  | 'permitting'
  | 'scheduled'
  | 'installation'
  | 'inspection'
  | 'pto';

export type MilestoneKey =
  | 'CLOSE'
  | 'SITE_SURVEY'
  | 'PERMIT_APPROVAL'
  | 'INSTALL_COMPLETE'
  | 'PTO';

export interface Milestone {
  key: MilestoneKey;
  label: string;
  order: number;
  commissionUnlockKey: MilestoneKey;
}

export interface ProjectTemplate {
  leadId: string;
  agentId: string;
  initialStatus: ProjectStatus;
  milestones: Milestone[];
}

/**
 * Standard milestone definitions per Master Spec v2.0
 * Each milestone maps to a commission unlock event
 */
const STANDARD_MILESTONES: Milestone[] = [
  { key: 'CLOSE', label: 'Deal Closed', order: 1, commissionUnlockKey: 'CLOSE' },
  { key: 'SITE_SURVEY', label: 'Site Survey Complete', order: 2, commissionUnlockKey: 'SITE_SURVEY' },
  { key: 'PERMIT_APPROVAL', label: 'Permit Approved', order: 3, commissionUnlockKey: 'PERMIT_APPROVAL' },
  { key: 'INSTALL_COMPLETE', label: 'Installation Complete', order: 4, commissionUnlockKey: 'INSTALL_COMPLETE' },
  { key: 'PTO', label: 'Permission to Operate', order: 5, commissionUnlockKey: 'PTO' },
];

/**
 * Initialize a project template for a lead
 * Pure function - returns data structure, NO side effects
 */
export function initializeProjectForLead(leadId: string, agentId: string): ProjectTemplate {
  return {
    leadId,
    agentId,
    initialStatus: 'engineering',
    milestones: [...STANDARD_MILESTONES],
  };
}
