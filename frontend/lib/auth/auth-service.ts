'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';
// TODO: Import from @prisma/client after running prisma generate
import type { UserRole } from '@/types/rbac';

// ============================================================================
// PRIMUS HOME PRO - Auth Service for Multi-Tenancy & RBAC (Module K)
// ============================================================================
// NOTE: Full RBAC enforcement will be active after running:
//   npx prisma generate
//   npx prisma migrate dev --name add_multitenancy_rbac
// ============================================================================

export interface AuthContext {
  userId: string;       // Internal Prisma user ID
  clerkId: string;      // Clerk's user ID
  companyId: string | null;
  role: UserRole;
  email: string;
  name: string | null;
}

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

// Role hierarchy for permission checks
const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 100,
  SCHEDULER: 50,
  SALES: 30,
  INSTALLER: 10,
};

// ============================================================================
// CORE AUTH FUNCTIONS
// ============================================================================

/**
 * Get the current authenticated user's full context
 * NOTE: After migration, this will include companyId and role from the database
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return null;
  }

  // TODO: After migration, use user.companyId and user.role
  return {
    userId: user.id,
    clerkId: user.clerkId,
    companyId: null, // Will be: user.companyId
    role: 'ADMIN' as UserRole, // Will be: user.role
    email: user.email,
    name: user.name,
  };
}

/**
 * Get the current user's company ID
 */
export async function getCurrentUserCompanyId(): Promise<string | null> {
  const context = await getAuthContext();
  return context?.companyId ?? null;
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<UserRole> {
  const context = await getAuthContext();
  return context?.role ?? 'ADMIN';
}

/**
 * Get the current user's internal database ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const context = await getAuthContext();
  return context?.userId ?? null;
}

// ============================================================================
// PERMISSION CHECKS
// ============================================================================

/**
 * Check if current user has at least the specified role level
 */
export async function hasMinimumRole(minRole: UserRole): Promise<boolean> {
  const userRole = await getUserRole();
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}

/**
 * Check if current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'ADMIN';
}

/**
 * Check if current user can access billing features
 */
export async function canAccessBilling(): Promise<PermissionCheck> {
  const role = await getUserRole();
  
  if (role !== 'ADMIN') {
    return {
      allowed: false,
      reason: 'Only administrators can access billing settings',
    };
  }
  
  return { allowed: true };
}

/**
 * Check if current user can access automations
 */
export async function canAccessAutomations(): Promise<PermissionCheck> {
  const role = await getUserRole();
  
  if (role !== 'ADMIN') {
    return {
      allowed: false,
      reason: 'Only administrators can manage automations',
    };
  }
  
  return { allowed: true };
}

/**
 * Check if current user can manage team settings
 */
export async function canManageTeam(): Promise<PermissionCheck> {
  const role = await getUserRole();
  
  if (role !== 'ADMIN') {
    return {
      allowed: false,
      reason: 'Only administrators can manage team members',
    };
  }
  
  return { allowed: true };
}

/**
 * Check if current user can view a specific lead
 * TODO: After migration, implement full RBAC with company/assignment checks
 */
export async function canViewLead(leadId: string): Promise<PermissionCheck> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, reason: 'Not authenticated' };
  }

  // For now, check lead belongs to user
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      userId: context.userId,
    },
  });
  
  return lead 
    ? { allowed: true }
    : { allowed: false, reason: 'Lead not found or access denied' };
}

/**
 * Check if current user can edit a lead
 */
export async function canEditLead(leadId: string): Promise<PermissionCheck> {
  return canViewLead(leadId);
}

/**
 * Check if current user can view a specific project
 */
export async function canViewProject(projectId: string): Promise<PermissionCheck> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, reason: 'Not authenticated' };
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      lead: { userId: context.userId },
    },
  });
  
  return project 
    ? { allowed: true }
    : { allowed: false, reason: 'Project not found or access denied' };
}

/**
 * Check if current user can update project milestones
 */
export async function canUpdateMilestone(projectId: string): Promise<PermissionCheck> {
  return canViewProject(projectId);
}

// ============================================================================
// DATA ISOLATION HELPERS
// ============================================================================

/**
 * Build a WHERE clause for querying leads
 * TODO: After migration, implement full RBAC with company/role filtering
 */
export async function getLeadWhereClause(): Promise<Record<string, unknown>> {
  const context = await getAuthContext();
  
  if (!context) {
    throw new Error('Not authenticated');
  }

  // For now, filter by userId
  return { userId: context.userId };
}

/**
 * Build a WHERE clause for querying projects
 */
export async function getProjectWhereClause(): Promise<Record<string, unknown>> {
  const context = await getAuthContext();
  
  if (!context) {
    throw new Error('Not authenticated');
  }

  // For now, filter by lead's userId
  return { lead: { userId: context.userId } };
}

// ============================================================================
// COMPANY & TEAM MANAGEMENT (Stubs - enabled after migration)
// ============================================================================

/**
 * Get the current user's company details
 */
export async function getCurrentCompany() {
  // TODO: Implement after migration
  return null;
}

/**
 * Get team members for the current company
 */
export async function getTeamMembers() {
  // TODO: Implement after migration
  return [];
}

/**
 * Invite a new team member
 */
export async function inviteTeamMember(
  email: string,
  role: UserRole
): Promise<{ success: boolean; invitationId?: string; error?: string }> {
  // TODO: Implement after migration
  return { 
    success: false, 
    error: 'Team management will be available after the multi-tenancy migration.' 
  };
}

/**
 * Accept a team invitation
 */
export async function acceptInvitation(token: string): Promise<{ success: boolean; error?: string }> {
  // TODO: Implement after migration
  return { success: false, error: 'Team invitations will be available after migration.' };
}

/**
 * Update a team member's role
 */
export async function updateTeamMemberRole(
  memberId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  // TODO: Implement after migration
  return { success: false, error: 'Team management will be available after migration.' };
}

/**
 * Remove a team member from the company
 */
export async function removeTeamMember(
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  // TODO: Implement after migration
  return { success: false, error: 'Team management will be available after migration.' };
}

