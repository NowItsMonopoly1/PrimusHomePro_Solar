// PRIMUS HOME PRO - Template 2 Demo Page
// Scheduler with urgency - high-ticket services

export const dynamic = 'force-dynamic'

import { LeadCaptureScheduler } from '@/components/forms/lead-capture-scheduler'

export default function TemplateSchedulerPage() {
  return (
    <LeadCaptureScheduler
      headline="Book Your Strategy Call"
      offerEndsInMinutes={240}
    />
  )
}
