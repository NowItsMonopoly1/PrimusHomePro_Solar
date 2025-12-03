'use server';

// PRIMUS HOME PRO - Project Actions (Contract v1.0 Aligned)
// Uses Project, ProjectMilestone models with contract-approved fields

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { runAutomations } from '@/lib/automations/engine';

// Contract v1.0: Standard milestones with unlockKey
const STANDARD_MILESTONES: Array<{
  unlockKey: string;
  title: string;
}> = [
  { unlockKey: 'site_survey', title: 'Site Survey Completed' },
  { unlockKey: 'engineering', title: 'Engineering Design Finalized' },
  { unlockKey: 'hoa_submitted', title: 'HOA Application Submitted' },
  { unlockKey: 'hoa_approved', title: 'HOA Approval Received' },
  { unlockKey: 'permit_submitted', title: 'Permit Application Submitted' },
  { unlockKey: 'permit_approved', title: 'Permit Approved' },
  { unlockKey: 'materials_ordered', title: 'Materials Ordered' },
  { unlockKey: 'materials_received', title: 'Materials Received' },
  { unlockKey: 'install_scheduled', title: 'Installation Scheduled' },
  { unlockKey: 'install_complete', title: 'Installation Complete' },
  { unlockKey: 'inspection_passed', title: 'Final Inspection Passed' },
  { unlockKey: 'utility_applied', title: 'Utility Interconnection Applied' },
  { unlockKey: 'meter_installed', title: 'Utility Meter Installed' },
  { unlockKey: 'pto_granted', title: 'PTO Received - System Live!' },
];

export interface CreateProjectResult {
  success: boolean;
  projectId?: string;
  error?: string;
}

/**
 * Creates a new project from a sold lead
 * Contract v1.0: Uses agentId, status field
 */
export async function createProjectFromLead(leadId: string): Promise<CreateProjectResult> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Contract v1.0: Get agent by clerkId
    const agent = await prisma.agent.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }

    // Get the lead and verify ownership
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, agentId: agent.id },
      include: {
        project: true,
      },
    });

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    // Check if project already exists
    if (lead.project) {
      return { success: true, projectId: lead.project.id };
    }

    // Contract v1.0: Verify lead status is 'sold'
    if (lead.status !== 'sold') {
      return { 
        success: false, 
        error: 'Lead must be in "sold" status to create a project' 
      };
    }

    // Contract v1.0: Create project with milestones
    const project = await prisma.project.create({
      data: {
        leadId: lead.id,
        status: 'active', // Contract v1.0: lowercase status
        milestones: {
          create: STANDARD_MILESTONES.map((m, i) => ({
            name: m.title,
            unlockKey: m.unlockKey,
            sortOrder: i,
            status: 'pending', // Contract v1.0: lowercase status
          })),
        },
      },
      include: {
        milestones: true,
      },
    });

    // Log via AutomationEvent
    await prisma.automationEvent.create({
      data: {
        leadId: lead.id,
        eventType: 'project_created',
        triggeredAt: new Date(),
        handled: true,
        handledAt: new Date(),
        metadata: {
          projectId: project.id,
          milestonesCreated: project.milestones.length,
        },
      },
    });

    revalidatePath('/dashboard/leads');
    revalidatePath(`/dashboard/projects/${project.id}`);

    return { success: true, projectId: project.id };
  } catch (error) {
    console.error('Create project error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create project' 
    };
  }
}

/**
 * Get project details with milestones
 * Contract v1.0 compliant
 */
export async function getProjectDetails(projectId: string) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const agent = await prisma.agent.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!agent) return null;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      lead: { agentId: agent.id },
    },
    include: {
      lead: true,
      milestones: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return project;
}

/**
 * Update milestone completion status
 * Contract v1.0: Uses status field instead of isComplete
 */
export async function updateMilestoneStatus(
  milestoneId: string,
  completed: boolean
): Promise<{ success: boolean; error?: string }> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const agent = await prisma.agent.findUnique({
      where: { clerkId: clerkUserId },
    });

    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }

    // Verify ownership through project -> lead -> agent chain
    const milestone = await prisma.projectMilestone.findFirst({
      where: {
        id: milestoneId,
        project: {
          lead: { agentId: agent.id },
        },
      },
      include: {
        project: {
          include: { lead: true },
        },
      },
    });

    if (!milestone) {
      return { success: false, error: 'Milestone not found' };
    }

    // Contract v1.0: Update milestone with status field
    await prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        status: completed ? 'completed' : 'pending',
        completedAt: completed ? new Date() : null,
        completedBy: completed ? agent.id : null,
      },
    });

    // Check if all milestones completed
    const allMilestones = await prisma.projectMilestone.findMany({
      where: { projectId: milestone.projectId },
    });

    const allCompleted = allMilestones.every(m => m.status === 'completed');

    // Update project status if all milestones completed
    if (allCompleted) {
      await prisma.project.update({
        where: { id: milestone.projectId },
        data: { status: 'completed' },
      });
    }

    // Log via AutomationEvent
    await prisma.automationEvent.create({
      data: {
        leadId: milestone.project.leadId,
        eventType: completed ? 'milestone_completed' : 'milestone_reset',
        triggeredAt: new Date(),
        handled: true,
        handledAt: new Date(),
        metadata: {
          milestoneId,
          unlockKey: milestone.unlockKey,
          milestoneName: milestone.name,
          completed,
        },
      },
    });

    // Trigger automation if completing
    if (completed) {
      runAutomations({
        leadId: milestone.project.leadId,
        trigger: 'milestone.completed',
        data: {
          projectId: milestone.projectId,
          unlockKey: milestone.unlockKey,
          milestoneName: milestone.name,
        },
      }).catch((err) => console.error('[AUTO] Milestone trigger error:', err));
    }

    revalidatePath(`/dashboard/projects/${milestone.projectId}`);
    revalidatePath('/dashboard/leads');

    return { success: true };
  } catch (error) {
    console.error('Update milestone error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update milestone' 
    };
  }
}

/**
 * Get all projects for current agent
 * Contract v1.0 compliant
 */
export async function getUserProjects() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return [];

  const agent = await prisma.agent.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!agent) return [];

  const projects = await prisma.project.findMany({
    where: {
      lead: { agentId: agent.id },
    },
    include: {
      lead: true,
      milestones: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate progress for each project
  return projects.map((project) => {
    const totalMilestones = project.milestones.length;
    const completedMilestones = project.milestones.filter(
      (m) => m.status === 'completed'
    ).length;
    const progress = totalMilestones > 0 
      ? Math.round((completedMilestones / totalMilestones) * 100) 
      : 0;

    return {
      ...project,
      progress,
      completedMilestones,
      totalMilestones,
    };
  });
}
