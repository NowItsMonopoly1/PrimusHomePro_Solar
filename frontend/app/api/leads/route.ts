import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { createLeadFromForm } from '@domain/leads/create-lead-from-form'

const LeadFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(7).optional().or(z.literal('')),
  addressLine1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2),
  zip: z.string().min(3),
  source: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = LeadFormSchema.parse(json)

    const domainLead = await createLeadFromForm({
      name: parsed.name,
      email: parsed.email || null,
      phone: parsed.phone || null,
      addressLine1: parsed.addressLine1,
      city: parsed.city,
      state: parsed.state,
      zip: parsed.zip,
      source: parsed.source,
    })

    const dbLead = await prisma.lead.create({
      data: {
        name: domainLead.name,
        email: domainLead.email,
        phone: domainLead.phone,
        address: domainLead.address,
        status: 'new',
        source: parsed.source ?? null,
      },
    })

    return NextResponse.json(dbLead, { status: 201 })
  } catch (err) {
    console.error('Error creating lead:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
