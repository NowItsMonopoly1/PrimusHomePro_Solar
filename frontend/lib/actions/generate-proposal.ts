// PRIMUS HOME PRO - Generate Proposal Server Action (Contract v1.0)
// Creates financial proposals for leads with solar qualification

'use server'

import { prisma } from '@/lib/db/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import type { ActionResponse } from '@/types'

// ============================================================================
// TYPES (Contract v1.0 Simplified)
// ============================================================================

interface GenerateProposalInput {
  leadId: string
  pricingMode?: 'loan' | 'cash' | 'ppa'
}

interface ProposalSummary {
  id: string
  leadId: string
  totalSystemCost: number
  netCostAfterIncentives: number
  estMonthlyPayment: number
  estMonthlySavings: number
  pricingMode: string
  createdAt: Date
}

// ============================================================================
// SOLAR CALCULATION HELPERS
// Contract v1.0: Keep calculation logic simple
// ============================================================================

const COST_PER_WATT = 2.85 // Industry average
const FEDERAL_ITC_RATE = 0.30 // 30% federal tax credit
const LOAN_RATE_10YR = 0.055 // 5.5% APR
const AVG_UTILITY_RATE = 0.15 // $/kWh

function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 12
  const numPayments = years * 12
  if (monthlyRate === 0) return principal / numPayments
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1)
}

// ============================================================================
// MAIN SERVER ACTION
// ============================================================================

/**
 * Generate a financial proposal for a lead with solar qualification
 * Contract v1.0: Simplified flow using SolarQualification model
 */
export async function generateProposal(
  input: GenerateProposalInput
): Promise<ActionResponse<ProposalSummary>> {
  try {
    // Authenticate agent
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return { success: false, error: 'Unauthorized' }
    }

    const agent = await prisma.agent.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!agent) {
      return { success: false, error: 'Agent not found' }
    }

    // Fetch lead with solar qualification
    const lead = await prisma.lead.findUnique({
      where: { id: input.leadId },
      include: { solarQualification: true },
    })

    if (!lead) {
      return { success: false, error: 'Lead not found' }
    }

    // Verify lead belongs to agent
    if (lead.agentId !== agent.id) {
      return { success: false, error: 'Unauthorized access to lead' }
    }

    // Check if solar qualification exists
    if (!lead.solarQualification) {
      return { 
        success: false, 
        error: 'Solar qualification required before generating proposal. Please qualify the lead first.' 
      }
    }

    const qual = lead.solarQualification
    
    // Check if roof is viable
    if (!qual.roofViable) {
      return {
        success: false,
        error: 'This property is not suitable for solar installation based on the roof analysis.',
      }
    }

    // Calculate system size based on roof area
    // Assume ~20W per sq ft, and 1 sqm = 10.764 sq ft
    const roofAreaSqFt = qual.roofAreaSqM * 10.764
    const usableRoofPct = (100 - qual.shadingPercent) / 100
    const systemSizeWatts = Math.min(roofAreaSqFt * 20 * usableRoofPct, 15000) // Cap at 15kW
    const systemSizeKW = systemSizeWatts / 1000

    // Annual production estimate
    const annualProductionKWh = systemSizeKW * qual.sunshineHoursYear * 0.80 // 80% efficiency factor

    // Cost calculations
    const totalSystemCost = systemSizeWatts * COST_PER_WATT
    const federalITC = totalSystemCost * FEDERAL_ITC_RATE
    const netCostAfterIncentives = totalSystemCost - federalITC

    // Savings calculations
    const annualSavings = annualProductionKWh * AVG_UTILITY_RATE
    const estMonthlySavings = annualSavings / 12

    // Payment calculation based on pricing mode
    const pricingMode = input.pricingMode || 'loan'
    let estMonthlyPayment: number

    switch (pricingMode) {
      case 'cash':
        estMonthlyPayment = 0 // No monthly payment for cash
        break
      case 'ppa':
        // PPA: Pay per kWh produced, typically 80% of utility rate
        estMonthlyPayment = (annualProductionKWh / 12) * (AVG_UTILITY_RATE * 0.80)
        break
      case 'loan':
      default:
        // 10-year loan on net cost
        estMonthlyPayment = calculateMonthlyPayment(netCostAfterIncentives, LOAN_RATE_10YR, 10)
        break
    }

    // Create proposal in database
    const proposal = await prisma.proposal.create({
      data: {
        leadId: lead.id,
        totalSystemCost,
        netCostAfterIncentives,
        estMonthlyPayment,
        estMonthlySavings,
        pricingMode,
      },
    })

    // Log via AutomationEvent
    await prisma.automationEvent.create({
      data: {
        leadId: lead.id,
        eventType: 'proposal_generated',
        triggeredAt: new Date(),
        handled: true,
        handledAt: new Date(),
        metadata: {
          proposalId: proposal.id,
          systemSizeKW,
          totalSystemCost,
          netCostAfterIncentives,
          pricingMode,
        },
      },
    })

    // Update lead status to 'proposed' if not already sold
    if (lead.status !== 'sold') {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { status: 'proposed' },
      })
    }

    revalidatePath('/dashboard/leads')
    revalidatePath(`/dashboard/leads/${lead.id}`)

    console.log(`[Proposal] Generated proposal ${proposal.id} for lead ${lead.id}`)

    return {
      success: true,
      data: {
        id: proposal.id,
        leadId: proposal.leadId,
        totalSystemCost: proposal.totalSystemCost,
        netCostAfterIncentives: proposal.netCostAfterIncentives,
        estMonthlyPayment: proposal.estMonthlyPayment,
        estMonthlySavings: proposal.estMonthlySavings,
        pricingMode: proposal.pricingMode,
        createdAt: proposal.createdAt,
      },
    }
  } catch (error) {
    console.error('[Proposal] Error generating proposal:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate proposal',
    }
  }
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

/**
 * Get all proposals for a lead
 */
export async function getLeadProposals(
  leadId: string
): Promise<ActionResponse<ProposalSummary[]>> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return { success: false, error: 'Unauthorized' }
    }

    const proposals = await prisma.proposal.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    })

    return { 
      success: true, 
      data: proposals.map(p => ({
        id: p.id,
        leadId: p.leadId,
        totalSystemCost: p.totalSystemCost,
        netCostAfterIncentives: p.netCostAfterIncentives,
        estMonthlyPayment: p.estMonthlyPayment,
        estMonthlySavings: p.estMonthlySavings,
        pricingMode: p.pricingMode,
        createdAt: p.createdAt,
      }))
    }
  } catch (error) {
    console.error('[Proposal] Error fetching proposals:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch proposals',
    }
  }
}

/**
 * Get full proposal details
 */
export async function getProposalDetails(
  proposalId: string
): Promise<ActionResponse<ProposalSummary & { lead: { name: string | null; address: string | null } }>> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return { success: false, error: 'Unauthorized' }
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { 
        lead: {
          select: { name: true, address: true }
        }
      },
    })

    if (!proposal) {
      return { success: false, error: 'Proposal not found' }
    }

    return {
      success: true,
      data: {
        id: proposal.id,
        leadId: proposal.leadId,
        totalSystemCost: proposal.totalSystemCost,
        netCostAfterIncentives: proposal.netCostAfterIncentives,
        estMonthlyPayment: proposal.estMonthlyPayment,
        estMonthlySavings: proposal.estMonthlySavings,
        pricingMode: proposal.pricingMode,
        createdAt: proposal.createdAt,
        lead: proposal.lead,
      },
    }
  } catch (error) {
    console.error('[Proposal] Error fetching proposal details:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch proposal details',
    }
  }
}
