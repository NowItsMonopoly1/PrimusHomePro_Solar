'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  inviteTeamMember, 
  updateTeamMemberRole, 
  removeTeamMember 
} from '@/lib/auth/auth-service';
// TODO: Import from @prisma/client after running prisma generate
import type { UserRole } from '@/types/rbac';

// ============================================================================
// PRIMUS HOME PRO - Team Management Panel (Module K)
// ============================================================================

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  jobTitle: string | null;
  phone: string | null;
  createdAt: Date;
  _count: {
    assignedLeads: number;
    assignedProjects: number;
  };
}

interface Company {
  id: string;
  name: string;
  subscriptionPlan: string;
  maxUsers: number;
  _count: {
    users: number;
    leads: number;
    projects: number;
  };
}

interface TeamManagementPanelProps {
  company: Company;
  teamMembers: TeamMember[];
}

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  SALES: 'Sales Rep',
  SCHEDULER: 'Scheduler/Office',
  INSTALLER: 'Installer/Field Tech',
};

const roleDescriptions: Record<UserRole, string> = {
  ADMIN: 'Full access to billing, settings, and all data',
  SALES: 'Can manage assigned leads and create proposals',
  SCHEDULER: 'Can view all projects and update milestones',
  INSTALLER: 'Read-only access to assigned projects',
};

const roleColors: Record<UserRole, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  SALES: 'bg-blue-100 text-blue-800',
  SCHEDULER: 'bg-green-100 text-green-800',
  INSTALLER: 'bg-orange-100 text-orange-800',
};

export function TeamManagementPanel({ company, teamMembers }: TeamManagementPanelProps) {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('SALES');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInvite = () => {
    if (!inviteEmail) return;

    startTransition(async () => {
      const result = await inviteTeamMember(inviteEmail, inviteRole);
      
      if (result.success) {
        setMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}` });
        setInviteEmail('');
        setIsInviting(false);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send invitation' });
      }

      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    });
  };

  const handleRoleChange = (memberId: string, newRole: UserRole) => {
    startTransition(async () => {
      const result = await updateTeamMemberRole(memberId, newRole);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Role updated successfully' });
        // Trigger page refresh
        window.location.reload();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update role' });
      }

      setTimeout(() => setMessage(null), 5000);
    });
  };

  const handleRemove = (memberId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from the team? Their leads and projects will be unassigned.`)) {
      return;
    }

    startTransition(async () => {
      const result = await removeTeamMember(memberId);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Team member removed' });
        window.location.reload();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to remove team member' });
      }

      setTimeout(() => setMessage(null), 5000);
    });
  };

  const canAddMore = company._count.users < company.maxUsers;

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Company Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{company.name}</CardTitle>
          <CardDescription>
            {company.subscriptionPlan.charAt(0).toUpperCase() + company.subscriptionPlan.slice(1)} Plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{company._count.users}</div>
              <div className="text-sm text-muted-foreground">
                of {company.maxUsers} team members
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{company._count.leads}</div>
              <div className="text-sm text-muted-foreground">Total leads</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{company._count.projects}</div>
              <div className="text-sm text-muted-foreground">Active projects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Team Member */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage who has access to your Primus Home Pro account
              </CardDescription>
            </div>
            {!isInviting && (
              <Button 
                onClick={() => setIsInviting(true)} 
                disabled={!canAddMore}
              >
                {canAddMore ? '+ Invite Member' : 'Upgrade to Add More'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Invite Form */}
          {isInviting && (
            <div className="mb-6 rounded-lg border bg-muted/50 p-4">
              <h4 className="font-medium mb-3">Invite New Team Member</h4>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="rounded-md border bg-background px-3 py-2"
                >
                  <option value="SALES">Sales Rep</option>
                  <option value="SCHEDULER">Scheduler/Office</option>
                  <option value="INSTALLER">Installer/Field Tech</option>
                  <option value="ADMIN">Administrator</option>
                </select>
                <Button onClick={handleInvite} disabled={isPending || !inviteEmail}>
                  {isPending ? 'Sending...' : 'Send Invite'}
                </Button>
                <Button variant="outline" onClick={() => setIsInviting(false)}>
                  Cancel
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {roleDescriptions[inviteRole]}
              </p>
            </div>
          )}

          {/* Team Members List */}
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                    {member.name?.charAt(0) || member.email.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <div className="font-medium">
                      {member.name || member.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.email}
                      {member.jobTitle && ` · ${member.jobTitle}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Stats */}
                  <div className="text-sm text-muted-foreground text-right">
                    <div>{member._count.assignedLeads} leads</div>
                    <div>{member._count.assignedProjects} projects</div>
                  </div>

                  {/* Role Badge */}
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleColors[member.role]}`}>
                    {roleLabels[member.role]}
                  </span>

                  {/* Actions Dropdown */}
                  <div className="relative">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                      disabled={isPending}
                      className="rounded-md border bg-background px-2 py-1 text-sm"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SALES">Sales</option>
                      <option value="SCHEDULER">Scheduler</option>
                      <option value="INSTALLER">Installer</option>
                    </select>
                  </div>

                  {/* Remove Button */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemove(member.id, member.name || member.email)}
                    disabled={isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No team members yet. Invite your first team member above.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Reference Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(roleLabels) as UserRole[]).map((role) => (
              <div key={role} className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${roleColors[role]}`}>
                    {roleLabels[role]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {roleDescriptions[role]}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
