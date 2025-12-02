'use server';

import { redirect } from 'next/navigation';
import { 
  getAuthContext, 
  canAccessBilling, 
  canAccessAutomations, 
  canManageTeam,
  hasMinimumRole 
} from '@/lib/auth/auth-service';
// TODO: Import from @prisma/client after running prisma generate
import type { UserRole } from '@/types/rbac';

// ============================================================================
// PRIMUS HOME PRO - Route Guards for Protected Pages (Module K)
// ============================================================================

export type RouteGuardResult = {
  allowed: boolean;
  redirectTo?: string;
  reason?: string;
};

/**
 * Guard for billing page - only ADMIN can access
 */
export async function guardBillingPage(): Promise<RouteGuardResult> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, redirectTo: '/sign-in', reason: 'Not authenticated' };
  }

  const permission = await canAccessBilling();
  
  if (!permission.allowed) {
    return { 
      allowed: false, 
      redirectTo: '/dashboard', 
      reason: permission.reason 
    };
  }

  return { allowed: true };
}

/**
 * Guard for automations page - only ADMIN can access
 */
export async function guardAutomationsPage(): Promise<RouteGuardResult> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, redirectTo: '/sign-in', reason: 'Not authenticated' };
  }

  const permission = await canAccessAutomations();
  
  if (!permission.allowed) {
    return { 
      allowed: false, 
      redirectTo: '/dashboard', 
      reason: permission.reason 
    };
  }

  return { allowed: true };
}

/**
 * Guard for team/settings page - only ADMIN can access
 */
export async function guardTeamPage(): Promise<RouteGuardResult> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, redirectTo: '/sign-in', reason: 'Not authenticated' };
  }

  const permission = await canManageTeam();
  
  if (!permission.allowed) {
    return { 
      allowed: false, 
      redirectTo: '/dashboard', 
      reason: permission.reason 
    };
  }

  return { allowed: true };
}

/**
 * Guard for leads page - INSTALLER cannot access
 */
export async function guardLeadsPage(): Promise<RouteGuardResult> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, redirectTo: '/sign-in', reason: 'Not authenticated' };
  }

  // INSTALLER role cannot access leads page
  if (context.role === 'INSTALLER') {
    return { 
      allowed: false, 
      redirectTo: '/dashboard/projects', 
      reason: 'Installers can only access assigned projects' 
    };
  }

  return { allowed: true };
}

/**
 * Guard for projects page - all authenticated users can view
 * (filtering happens at data level)
 */
export async function guardProjectsPage(): Promise<RouteGuardResult> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, redirectTo: '/sign-in', reason: 'Not authenticated' };
  }

  return { allowed: true };
}

/**
 * Generic guard for minimum role requirement
 */
export async function guardMinimumRole(minRole: UserRole): Promise<RouteGuardResult> {
  const context = await getAuthContext();
  
  if (!context) {
    return { allowed: false, redirectTo: '/sign-in', reason: 'Not authenticated' };
  }

  const hasPermission = await hasMinimumRole(minRole);
  
  if (!hasPermission) {
    return { 
      allowed: false, 
      redirectTo: '/dashboard', 
      reason: `This page requires ${minRole} access or higher` 
    };
  }

  return { allowed: true };
}

/**
 * Helper to use guards in page components
 * Automatically redirects if not allowed
 */
export async function enforceGuard(guard: () => Promise<RouteGuardResult>): Promise<void> {
  const result = await guard();
  
  if (!result.allowed && result.redirectTo) {
    redirect(result.redirectTo);
  }
}

/**
 * Get the current user's dashboard based on their role
 * Used for default redirects after login
 */
export async function getDefaultDashboard(): Promise<string> {
  const context = await getAuthContext();
  
  if (!context) {
    return '/sign-in';
  }

  switch (context.role) {
    case 'ADMIN':
    case 'SCHEDULER':
      return '/dashboard';
    case 'SALES':
      return '/dashboard/leads';
    case 'INSTALLER':
      return '/dashboard/projects';
    default:
      return '/dashboard';
  }
}
