import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { fetchSolarData } from '@services/solar/client'
import { qualifyLeadRoof } from '@domain/solar/qualify-lead-roof'

interface Params {
  params: { id: string }
}

export async function POST(_req: NextRequest, { params }: Params) {
  const leadId = params.id

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const solarRaw = await fetchSolarData(lead.address ?? '')

    const qualification = qualifyLeadRoof(leadId, {
      roofAreaM2: solarRaw.roofAreaM2,
      irradianceKwhM2: solarRaw.irradianceKwhM2,
      shadingPercent: solarRaw.shadingPercent,
    })

    // Contract v1.0: SolarQualification only has approved fields
    const dbQualification = await prisma.solarQualification.create({
      data: {
        leadId,
        roofAreaSqM: solarRaw.roofAreaM2,
        sunshineHoursYear: solarRaw.irradianceKwhM2,
        shadingPercent: solarRaw.shadingPercent,
        roofViable: qualification.roofViable,
        solarScore: qualification.solarScore,
        confidence: qualification.roofViable ? 'high' : 'low',
        rawApiData: solarRaw as unknown as object,
      },
    })

    // Contract v1.0: Lead.status must be lowercase
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: qualification.roofViable ? 'qualified' : 'disqualified' },
    })

    return NextResponse.json(
      {
        qualification: dbQualification,
        domainResult: qualification,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error qualifying roof:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
