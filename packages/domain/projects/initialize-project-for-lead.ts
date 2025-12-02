// DOMAIN: Projects - Initialize Project For Lead
// Pure business logic

export interface Project {
  id: string;
  leadId: string;
  agentId: string;
  status: 'engineering' | 'permitting' | 'scheduled' | 'installation' | 'inspection' | 'pto';
  createdAt: Date;
}

/**
 * Initialize a project when a lead is closed/won
 * 
 * Creates standard milestones per Master Spec v2.0
 */
export async function initializeProjectForLead(leadId: string, agentId: string): Promise<Project> {
  // TODO: Create project in DB
  // TODO: Create standard milestones
  
  return {
    id: `project_${Date.now()}`,
    leadId,
    agentId,
    status: 'engineering',
    createdAt: new Date(),
  };
}
