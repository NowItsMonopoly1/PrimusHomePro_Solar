// PRIMUS HOME PRO - Dashboard: Team Management
// Manage team members and roles
// RBAC: Only ADMIN role can access this page

export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { guardTeamPage } from '@/lib/auth/route-guards'
import { getCurrentCompany, getTeamMembers } from '@/lib/auth/auth-service'
import { TeamManagementPanel } from '@/components/team/team-management-panel'

export const metadata = {
  title: 'Team | Primus Home Pro',
  description: 'Manage your team members and roles',
}

export default async function TeamPage() {
  // RBAC: Check if user has permission to manage team
  const guard = await guardTeamPage()
  if (!guard.allowed) {
    redirect(guard.redirectTo || '/dashboard')
  }

  const company = await getCurrentCompany()
  const teamMembers = await getTeamMembers()

  if (!company) {
    // User doesn't have a company yet - show onboarding
    return (
      <div className="mx-auto max-w-2xl space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Set Up Your Company</h1>
          <p className="mt-2 text-muted-foreground">
            Create your company to start inviting team members.
          </p>
        </div>
        {/* TODO: Company onboarding form */}
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Company onboarding coming soon. For now, your account is set up as a solo user.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your team members and their access levels.
        </p>
      </div>

      {/* Team Panel */}
      <TeamManagementPanel 
        company={company} 
        teamMembers={teamMembers} 
      />
    </div>
  )
}
