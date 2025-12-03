import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { completeMilestone } from '@domain/projects/complete-milestone'
import { initializeProjectForLead, type MilestoneKey } from '@domain/projects/initialize-project-for-lead'
import { createCommissionUnlock } from '@domain/commissions/create-commission-unlock'

const CompleteMilestoneSchema = z.object({
  completedBy: z.string().min(1).optional(),
  milestonePercent: z.number().min(0).max(1).optional(),
  projectGrossValueOverride: z.number().min(0).optional(),
})

interface Params {
  params: { id: string; milestoneId: string }
}

function resolveMilestonePercent(key: MilestoneKey, override?: number): number {
  if (typeof override === 'number') {
    return override
  }

  const envKey = `COMMISSION_PCT_${key}`
  const fromEnv = Number(process.env[envKey])
  return Number.isFinite(fromEnv) ? Math.max(0, fromEnv) / 100 : 0
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id: projectId, milestoneId } = params

  try {
    const body = await req.json().catch(() => ({}))
    const parsed = CompleteMilestoneSchema.parse(body)

    const milestone = await prisma.projectMilestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: {
          include: {
            lead: true,
          },
        },
      },
    })

    if (!milestone || milestone.projectId !== projectId) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 })
    }

    const projectMilestones = await prisma.projectMilestone.findMany({
      where: { projectId },
      orderBy: { sortOrder: 'asc' },
    })

    // Contract v1.0: Lead has agentId, Project doesn't
    const template = initializeProjectForLead(
      milestone.project.leadId,
      milestone.project.lead.agentId ?? 'unassigned'
    )

    // Contract v1.0: ProjectMilestone uses unlockKey not milestoneKey
    const currentMilestones = projectMilestones.map((m) => ({
      key: m.unlockKey as MilestoneKey,
      completedAt: m.completedAt ?? null,
      completedBy: m.completedBy ?? null,
    }))

    const completedBy = parsed.completedBy ?? 'system'
    const targetKey = milestone.unlockKey as MilestoneKey

    const domainResult = completeMilestone({
      milestoneKey: targetKey,
      completedBy,
      currentMilestones,
      allMilestones: template.milestones,
    })

    if (!domainResult.success || !domainResult.updatedMilestone) {
      return NextResponse.json({ error: domainResult.error ?? 'Unable to complete milestone' }, { status: 400 })
    }

    // Contract v1.0: ProjectMilestone uses status string not isComplete boolean
    const updatedMilestone = await prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        status: 'completed',
        completedAt: domainResult.updatedMilestone.completedAt,
        completedBy: domainResult.updatedMilestone.completedBy,
      },
    })

    let commissionUnlock = null
    // Contract v1.0: Agent is on Lead, not Project directly
    const agentId = milestone.project.lead.agentId

    if (!agentId) {
      console.warn('Skipping commission unlock: no agent assigned')
    }

    // Contract v1.0: CommissionUnlock uses milestoneId relation, unlockKey, lowercase status
    if (agentId && domainResult.commissionUnlockKey) {
      const existingUnlock = await prisma.commissionUnlock.findFirst({
        where: {
          milestoneId,
          unlockKey: targetKey,
        },
      })

      if (!existingUnlock) {
        const latestProposal = await prisma.proposal.findFirst({
          where: { leadId: milestone.project.leadId },
          orderBy: { createdAt: 'desc' },
        })

        const projectGrossValue = parsed.projectGrossValueOverride ?? latestProposal?.totalSystemCost ?? 0
        const milestonePercent = resolveMilestonePercent(targetKey, parsed.milestonePercent)

        const unlockDomain = createCommissionUnlock({
          projectId,
          agentId,
          milestoneKey: targetKey,
          projectGrossValue,
          milestonePercent,
        })

        commissionUnlock = await prisma.commissionUnlock.create({
          data: {
            milestoneId,
            agentId: unlockDomain.agentId,
            unlockKey: unlockDomain.milestoneKey,
            status: 'confirmed',
            amountEstimated: unlockDomain.amount,
            amountConfirmed: unlockDomain.amount,
          },
        })
      }
    }

    return NextResponse.json(
      {
        milestone: updatedMilestone,
        commissionUnlock,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error completing milestone:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
