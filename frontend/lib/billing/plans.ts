// PRIMUS HOME PRO - Billing Plans Configuration
// Source of truth for pricing and plan limits

export type SubscriptionPlan = 'starter' | 'pro' | 'agency'

export interface PlanConfig {
  id: SubscriptionPlan
  name: string
  description: string
  priceMonthly: number
  stripePriceId: string
  seats: number
  successFee: number // Per accepted proposal
  leadLimit: number | null // null = unlimited
  automationLimit: number | null
}

export const PLANS: PlanConfig[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individual contractors.',
    priceMonthly: 198,
    stripePriceId: process.env.STRIPE_PRICE_STARTER || 'price_1SZlSu05lmCbSdUDPIHc0nJ9',
    seats: 1,
    successFee: 88, // $88 per accepted proposal
    leadLimit: 500,
    automationLimit: 5,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams with multiple reps.',
    priceMonthly: 498,
    stripePriceId: process.env.STRIPE_PRICE_PRO || 'price_1SZlTR05lmCbSdUD5mXIwLWi',
    seats: 5,
    successFee: 68, // $68 per accepted proposal
    leadLimit: 2000,
    automationLimit: null, // unlimited
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'For scaling businesses & multi-location operations.',
    priceMonthly: 1198,
    stripePriceId: process.env.STRIPE_PRICE_AGENCY || 'price_1SZlTy05lmCbSdUDsT2Pv4EX',
    seats: 10,
    successFee: 48, // $48 per accepted proposal
    leadLimit: null, // unlimited
    automationLimit: null, // unlimited
  },
]

/**
 * Get plan configuration by ID
 */
export function getPlanConfig(id: string | null | undefined): PlanConfig {
  return PLANS.find((p) => p.id === id) ?? PLANS[0]
}

/**
 * Check if user has exceeded plan limits
 */
export function checkLimits(
  plan: PlanConfig,
  current: { leads: number; automations: number }
): {
  canAddLead: boolean
  canAddAutomation: boolean
  leadsRemaining: number | null
  automationsRemaining: number | null
} {
  const canAddLead = plan.leadLimit === null || current.leads < plan.leadLimit
  const canAddAutomation =
    plan.automationLimit === null || current.automations < plan.automationLimit

  const leadsRemaining =
    plan.leadLimit === null ? null : Math.max(0, plan.leadLimit - current.leads)
  const automationsRemaining =
    plan.automationLimit === null
      ? null
      : Math.max(0, plan.automationLimit - current.automations)

  return {
    canAddLead,
    canAddAutomation,
    leadsRemaining,
    automationsRemaining,
  }
}
