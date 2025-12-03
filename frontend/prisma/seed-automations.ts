// PRIMUS HOME PRO - Seed Script: Default Automations
// Contract v1.0: Automation model not yet implemented
// This is a placeholder for future automation seeding

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding default automations...')
  console.log('NOTE: Contract v1.0 does not include Automation model')
  console.log('This script is a placeholder for future implementation.\n')

  // Contract v1.0: Use Agent model instead of User
  const agent = await prisma.agent.findFirst()

  if (!agent) {
    console.error('No agent found. Please sign up first via Clerk.')
    process.exit(1)
  }

  console.log(`Found agent: ${agent.email}`)

  // Contract v1.0: No Automation model, so we'll just create sample AutomationEvents
  // This demonstrates the event logging structure for future automations

  // Check if we have any leads to associate events with
  const lead = await prisma.lead.findFirst({
    where: { agentId: agent.id }
  })

  if (lead) {
    // Create sample automation events to show structure
    const sampleEvent = await prisma.automationEvent.upsert({
      where: { id: 'sample_event_1' },
      update: {},
      create: {
        id: 'sample_event_1',
        leadId: lead.id,
        eventType: 'lead_created',
        triggeredAt: new Date(),
        handled: true,
        handledAt: new Date(),
        metadata: {
          note: 'Sample seed event - demonstrates automation event structure',
          source: 'seed-automations.ts',
        },
      },
    })
    console.log(`✓ Created sample automation event for lead: ${lead.id}`)
  } else {
    console.log('No leads found - skipping sample event creation')
  }

  console.log('\n✅ Automation seed complete!')
  console.log('\nNOTE: Full automation rules will be implemented in a future phase.')
  console.log('Contract v1.0 supports AutomationEvent logging for tracking triggers.')
}

main()
  .catch((e) => {
    console.error('Error seeding automations:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
