'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';
import type { UserRole } from '@/types';

// ============================================================================
// PRIMUS HOME PRO - Auth Service (Contract v1.0 Aligned)
// Uses Agent model instead of User
// ============================================================================

export interface AuthContext {
  agentId: string;      // Internal Prisma agent ID
  clerkId: string;      // Clerk's user ID
  role: string;         // Contract v1.0: lowercase role string
  email: string;
  name: string;
}

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

// Role hierarchy for permission checks (Contract v1.0: lowercase roles)
const ROLE_HIERARCHY: Record<string, number> = {
  admin: 100,
  scheduler: 50,
  sales: 30,
  installer: 10,
};

// ============================================================================
// CORE AUTH FUNCTIONS
// ============================================================================

/**
 * Get the current authenticated agent's full context
 * Contract v1.0: Uses Agent model
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    return null;
  }

  const agent = await prisma.agent.findUnique({
    where: { clerkId },
  });

  if (!agent) {
    return null;
  }

  return {
    agentId: agent.id,
    clerkId: agent.clerkId,
    role: agent.role,
    email: agent.email,
    name: agent.name,
  };
}

/**
 * Get the current agent's internal database ID
 */
export async function getCurrentAgentId(): Promise<string | null> {
  const context = await getAuthContext();
  return context?.agentId ?? null;
}

// Legacy alias for backward compatibility
export async function getCurrentUserId(): Promise<string | null> {
  return getCurrentAgentId();
}

/**
 * Get the current agent's role
 */
export async function getAgentRole(): Promise<string> {
  const context = await getAuthContext();
  return context?.role ?? 'sales';
}

// Legacy alias
export async function getUserRole(): Promise<UserRole> {
  const role = await getAgentRole();
  // Convert lowercase to uppercase for legacy compatibility
  return role.toUpperCase() as UserRole;
}

// ============================================================================
// PERMISSION CHECKS
// ============================================================================

/**
 * Check if current agent has at least the specified role level
 */
export async function hasMinimumRole(minRole: string): Promise<boolean> {
  const agentRole = await getAgentRole();
  const normalizedMinRole = minRole.toLowerCase();
  return (ROLE_HIERARCHY[agentRole] || 0) >= (ROLE_HIERARCHY[normalizedMinRole] || 0);
}

/**
 * Check if current agent is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getAgentRole();
  return role === 'admin';
}

/**
 * Check if current agent can access billing features
 */
export async function canAccessBilling(): Promise<PermissionCheck> {
  const role = await getAgentRole();
  
  if (role !== 'admin') {
    return {
      allowed: false,
      reason: 'Only administrators can access billing settings',
    };
  }
  
  return { allowed: true };
}

/**
 * Check if current agent can access automations
 */
export async function canAccessAutomations(): Promise<PermissionCheck> {
  const role = await getAgentRole();
  
  if (role !== 'admin') {
    return {
      allowed: false,
      reason: 'Only administrators can manage automations',
    };
  }
  
  return { allowed: true };
}

/**
 * Check if current agent can manage team settings
 */
export async function canManageTeam(): Promise<PermissionCheck> {
  const role = await getAgentRole();
  
  if (role !== 'admin') {
    return {
      allowed: false,
      reason: 'Only administrators can manage team members',
    };
  }
  
  return { allowed: true };
}

/**
 * Check if current agent can view a specific lead
 * Contract v1.0: Uses agentId field
 */
export async function canViewLead(leadId: string): Promise<PermissionCheck> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, reason: 'Not authenticated' };
  }

  // Check lead belongs to agent
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      agentId: context.agentId,
    },
  });
  
  return lead 
    ? { allowed: true }
    : { allowed: false, reason: 'Lead not found or access denied' };
}

/**
 * Check if current agent can edit a lead
 */
export async function canEditLead(leadId: string): Promise<PermissionCheck> {
  return canViewLead(leadId);
}

/**
 * Check if current agent can view a specific project
 * Contract v1.0: Project has leadId, check via lead.agentId
 */
export async function canViewProject(projectId: string): Promise<PermissionCheck> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, reason: 'Not authenticated' };
  }

  // Contract v1.0: Project -> Lead -> agentId
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      lead: {
        agentId: context.agentId,
      },
    },
  });
  
  return project 
    ? { allowed: true }
    : { allowed: false, reason: 'Project not found or access denied' };
}

/**
 * Check if current agent can update project milestones
 */
export async function canUpdateMilestone(projectId: string): Promise<PermissionCheck> {
  return canViewProject(projectId);
}

// ============================================================================
// DATA ISOLATION HELPERS
// ============================================================================

/**
 * Build a WHERE clause for querying leads
 * Contract v1.0: Uses agentId field
 */
export async function getLeadWhereClause(): Promise<Record<string, unknown>> {
  const context = await getAuthContext();
  
  if (!context) {
    throw new Error('Not authenticated');
  }

  return { agentId: context.agentId };
}

/**
 * Build a WHERE clause for querying projects
 * Contract v1.0: Project -> Lead -> agentId
 */
export async function getProjectWhereClause(): Promise<Record<string, unknown>> {
  const context = await getAuthContext();
  
  if (!context) {
    throw new Error('Not authenticated');
  }

  return { lead: { agentId: context.agentId } };
}

// ============================================================================
// TEAM MANAGEMENT (Stubs - for future expansion)
// ============================================================================

/**
 * Get current company (stub for future implementation)
 * Contract v1.0: No Company model
 */
export async function getCurrentCompany(): Promise<null> {
  console.log('[AUTH] getCurrentCompany called (stub - no Company model)')
  return null
}

/**
 * Get team members (stub for future implementation)
 */
export async function getTeamMembers() {
  // Contract v1.0: No Company model - single-agent for MVP
  return [];
}

/**
 * Invite a new team member (stub)
 */
export async function inviteTeamMember(
  email: string,
  role: string
): Promise<{ success: boolean; invitationId?: string; error?: string }> {
  return { 
    success: false, 
    error: 'Team management is not available in this version.' 
  };
}

/**
 * Accept a team invitation (stub)
 */
export async function acceptInvitation(token: string): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: 'Team invitations are not available in this version.' };
}

/**
 * Update a team member's role (stub)
 */
export async function updateTeamMemberRole(
  memberId: string,
  newRole: string
): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: 'Team management is not available in this version.' };
}

/**
 * Remove a team member (stub)
 */
export async function removeTeamMember(
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: 'Team management is not available in this version.' };
}

