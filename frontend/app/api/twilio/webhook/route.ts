import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { parseInboundSms } from '@services/twilio/client'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? ''
    let payload: Record<string, any> = {}

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData()
      formData.forEach((value, key) => {
        payload[key] = value
      })
    } else {
      payload = await req.json().catch(() => ({}))
    }

    const sms = parseInboundSms(payload)

    const lead = await prisma.lead.findFirst({
      where: { phone: sms.from },
    })

    if (lead) {
      await prisma.automationEvent.create({
        data: {
          leadId: lead.id,
          eventType: 'sms_inbound',
          triggeredAt: new Date(),
          handled: false,
          metadata: payload,
        },
      })
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Error handling Twilio webhook:', error)
    return new NextResponse('Error', { status: 500 })
  }
}
