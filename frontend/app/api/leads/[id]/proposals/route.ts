import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { calculateSavingsModel } from '@domain/proposals/calculate-savings-model'
import { generateProposal } from '@domain/proposals/generate-proposal'
import type { SolarQualification } from '@domain/solar'
import { generateProposalPdf } from '@services/pdf/generator'
import { getUtilityRate } from '@services/utility/lookup'

const PricingConfigSchema = z.object({
  systemCostPerKw: z.number().positive(),
  loanApr: z.number().min(0),
  loanTermYears: z.number().positive(),
  ppaRate: z.number().min(0),
  utilityRateOverride: z.number().min(0).optional(),
  currentMonthlyBill: z.number().min(0).optional(),
})

interface Params {
  params: { id: string }
}

export async function POST(req: NextRequest, { params }: Params) {
  const leadId = params.id

  try {
    const json = await req.json()
    const config = PricingConfigSchema.parse(json)

    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const qualificationRecord = await prisma.solarQualification.findFirst({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    })

    if (!qualificationRecord) {
      return NextResponse.json({ error: 'Solar qualification missing' }, { status: 404 })
    }

    const zipMatch = lead.address?.match(/\b\d{5}(?:-\d{4})?\b/)
    const zipCode = zipMatch ? zipMatch[0].slice(0, 5) : '00000'
    const utilityRate = config.utilityRateOverride ?? getUtilityRate(zipCode).rate

    // Contract v1.0: SolarQualification doesn't have recommendedSystemKw
    // Derive annual production from roofArea and sunshineHours
    const estAnnualProductionKwh = Math.max(
      0,
      Math.round(qualificationRecord.roofAreaSqM * qualificationRecord.sunshineHoursYear * 0.18)
    )

    const domainQualification: SolarQualification = {
      leadId,
      roofViable: qualificationRecord.roofViable,
      solarScore: qualificationRecord.solarScore,
      shadingScore: Math.max(0, 100 - qualificationRecord.shadingPercent),
      viabilityReason: qualificationRecord.roofViable
        ? 'Roof meets viability criteria'
        : 'Roof failed viability checks',
      estAnnualProductionKwh,
    }

    const pricingConfig = {
      systemCostPerKw: config.systemCostPerKw,
      loanApr: config.loanApr,
      loanTermYears: config.loanTermYears,
      ppaRate: config.ppaRate,
      utilityRate,
    }

    const savingsModel = calculateSavingsModel({ estAnnualProductionKwh }, pricingConfig)
    const domainProposal = generateProposal({
      leadId,
      qualification: domainQualification,
      pricingConfig,
      currentMonthlyBill: config.currentMonthlyBill ?? 200,
    })

    // Contract v1.0: Proposal only has approved fields
    const createdProposal = await prisma.proposal.create({
      data: {
        leadId,
        totalSystemCost: savingsModel.grossCost,
        netCostAfterIncentives: savingsModel.netCostAfterIncentives,
        estMonthlyPayment: savingsModel.estMonthlyPayment,
        estMonthlySavings: savingsModel.estMonthlySavings,
        pricingMode: 'loan',
      },
    })

    const pdfResult = await generateProposalPdf({
      leadId,
      customerName: lead.name ?? 'Homeowner',
      address: lead.address ?? '',
      grossCost: savingsModel.grossCost,
      netCostAfterIncentives: savingsModel.netCostAfterIncentives,
      estimatedAnnualSavings: domainProposal.estimatedAnnualSavings,
    })

    const proposalWithPdf = await prisma.proposal.update({
      where: { id: createdProposal.id },
      data: {
        pdfUrl: `/api/proposals/${createdProposal.id}/pdf/${pdfResult.fileName}`,
      },
    })

    return NextResponse.json(
      {
        proposal: proposalWithPdf,
        savingsModel,
        domainProposal,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Error generating proposal:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
