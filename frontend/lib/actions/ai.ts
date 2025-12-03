'use server'

// PRIMUS HOME PRO - AI Server Actions (Contract v1.0 Aligned)
// Triggers AI reply generation and sending

import { generateLeadReply } from '@/lib/ai/service'
import { prisma } from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'
import type { ActionResponse, AIReplyDraft, AIChannel, AITone } from '@/types'

/**
 * Generate AI draft reply for a lead
 * Returns draft for user review/edit
 */
export async function draftLeadReply(
  leadId: string,
  channel: AIChannel,
  tone?: AITone
): Promise<ActionResponse<AIReplyDraft>> {
  try {
    const draft = await generateLeadReply({ leadId, channel, tone })

    return {
      success: true,
      data: draft,
    }
  } catch (error) {
    console.error('AI Draft Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate draft',
    }
  }
}

/**
 * Send reply to lead
 * Contract v1.0: Uses Message model (no metadata field)
 */
export async function sendLeadReply(
  leadId: string,
  channel: AIChannel,
  body: string
): Promise<ActionResponse> {
  try {
    // Fetch lead with contact info
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, name: true, email: true, phone: true, agentId: true },
    })

    if (!lead) {
      return { success: false, error: 'Lead not found' }
    }

    // Real SMS Sending via Twilio
    if (channel === 'sms') {
      if (!lead.phone) {
        return { success: false, error: 'Lead has no phone number' }
      }

      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

      if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
        console.warn('[SMS] Twilio credentials missing. SMS will be logged but not sent.')
        
        // Contract v1.0: Log as Message (no metadata field)
        await prisma.message.create({
          data: {
            leadId,
            direction: 'outbound',
            channel: 'sms',
            body: `[SIMULATED] ${body}`,
          },
        })
        
        return { 
          success: false, 
          error: 'Twilio not configured. Please set environment variables.' 
        }
      }

      try {
        const twilio = require('twilio')(twilioAccountSid, twilioAuthToken)
        const twilioMsg = await twilio.messages.create({
          from: twilioPhoneNumber,
          to: lead.phone,
          body: body,
        })

        console.log(`[SMS] ✓ Sent to ${lead.phone} - SID: ${twilioMsg.sid}`)

        // Contract v1.0: Log as Message
        await prisma.message.create({
          data: {
            leadId,
            direction: 'outbound',
            channel: 'sms',
            body,
            providerMessageId: twilioMsg.sid,
          },
        })
      } catch (twilioError: any) {
        console.error('[SMS] Twilio error:', twilioError)
        return { 
          success: false, 
          error: `SMS send failed: ${twilioError.message || 'Unknown Twilio error'}` 
        }
      }
    }

    // Real Email Sending via Resend
    if (channel === 'email') {
      if (!lead.email) {
        return { success: false, error: 'Lead has no email address' }
      }

      const resendApiKey = process.env.RESEND_API_KEY

      if (!resendApiKey) {
        console.warn('[EMAIL] Resend API key missing. Email will be logged but not sent.')
        
        await prisma.message.create({
          data: {
            leadId,
            direction: 'outbound',
            channel: 'email',
            body: `[SIMULATED] ${body}`,
          },
        })
        
        return { 
          success: false, 
          error: 'Resend not configured. Please set RESEND_API_KEY environment variable.' 
        }
      }

      try {
        const { Resend } = require('resend')
        const resend = new Resend(resendApiKey)
        
        const result = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'hello@primushomepro.com',
          to: lead.email,
          subject: `Re: Your Home Pro Inquiry`,
          text: body,
          html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
        })

        console.log(`[EMAIL] ✓ Sent to ${lead.email} - ID: ${result.id}`)

        // Contract v1.0: Log as Message
        await prisma.message.create({
          data: {
            leadId,
            direction: 'outbound',
            channel: 'email',
            body,
            providerMessageId: result.id,
          },
        })
      } catch (emailError: any) {
        console.error('[EMAIL] Resend error:', emailError)
        return { 
          success: false, 
          error: `Email send failed: ${emailError.message || 'Unknown Resend error'}` 
        }
      }
    }

    // Contract v1.0: Update lead status if still 'new'
    const currentLead = await prisma.lead.findUnique({ 
      where: { id: leadId },
      select: { status: true }
    })
    
    if (currentLead && currentLead.status === 'new') {
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: 'qualified' },
      })
    }

    revalidatePath('/dashboard/leads')
    revalidatePath(`/dashboard/leads/${leadId}`)

    return {
      success: true,
      data: { message: `${channel === 'email' ? 'Email' : 'SMS'} sent successfully` },
    }
  } catch (error) {
    console.error('Send Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    }
  }
}
