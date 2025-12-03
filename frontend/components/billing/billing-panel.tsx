'use client'

// PRIMUS HOME PRO - Billing Panel
// Solar-branded plan selection and upgrade interface

import { useTransition } from 'react'
import { PLANS, type PlanConfig } from '@/lib/billing/plans'
import { createCheckoutSession, createPortalSession } from '@/lib/actions/billing'
import { Check, Loader2, Zap, Star, Crown, Users, Sparkles } from 'lucide-react'

// Define Agent type inline to avoid Prisma import issues on Vercel
// NOTE: Contract v1.0 Agent model doesn't have subscription fields
// These are placeholder for future billing integration
interface BillingAgent {
  id: string
}

interface BillingPanelProps {
  agent: BillingAgent
  currentPlan: PlanConfig
}

const planIcons: Record<string, React.ReactNode> = {
  starter: <Star className="w-6 h-6" />,
  pro: <Zap className="w-6 h-6" />,
  agency: <Crown className="w-6 h-6" />,
}

const planGradients: Record<string, string> = {
  starter: 'from-solar-secondary to-solar-secondary-dark',
  pro: 'from-solar-primary to-yellow-500',
  agency: 'from-purple-500 to-purple-700',
}

export function BillingPanel({ agent, currentPlan }: BillingPanelProps) {
  const [isPending, startTransition] = useTransition()

  function handleUpgrade(planId: string) {
    startTransition(async () => {
      const res = await createCheckoutSession(agent.id, planId)
      if (res.success && res.data) {
        window.location.href = res.data.url
      } else {
        alert(res.success ? 'Error creating checkout' : (res as any).error || 'Failed to start checkout')
      }
    })
  }

  function handleManage() {
    startTransition(async () => {
      const res = await createPortalSession(agent.id)
      if (res.success && res.data) {
        window.location.href = res.data.url
      } else {
        alert(res.success ? 'Error opening portal' : (res as any).error || 'Failed to open billing portal')
      }
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PLANS.map((plan) => {
        const isCurrent = currentPlan.id === plan.id
        const isPro = plan.id === 'pro'

        return (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-300 ${
              isPro
                ? 'border-solar-primary bg-gradient-to-br from-solar-secondary to-solar-secondary-dark text-white scale-105 shadow-2xl'
                : isCurrent
                  ? 'border-solar-primary bg-solar-primary/5'
                  : 'border-solar-gray-200 bg-white hover:border-solar-primary/50 hover:shadow-xl'
            }`}
          >
            {isCurrent && (
              <div className="absolute -top-3 left-4 rounded-full bg-solar-success px-3 py-1 text-xs font-bold text-white shadow-lg">
                ✓ CURRENT PLAN
              </div>
            )}
            
            {isPro && !isCurrent && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full solar-gradient px-4 py-1 text-xs font-bold text-solar-gray-900 shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                MOST POPULAR
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isPro ? 'bg-white/20' : `bg-gradient-to-br ${planGradients[plan.id]} text-white`
              }`}>
                {planIcons[plan.id]}
              </div>
              <h3 className={`text-xl font-bold ${isPro ? 'text-white' : 'text-solar-gray-900'}`}>
                {plan.name}
              </h3>
            </div>
            
            <div className="mb-4">
              <span className={`text-4xl font-black ${isPro ? 'text-white' : 'text-solar-gray-900'}`}>
                ${plan.priceMonthly.toLocaleString()}
              </span>
              <span className={`text-sm ${isPro ? 'text-white/70' : 'text-solar-gray-500'}`}>/month</span>
            </div>
            
            <p className={`text-sm mb-6 ${isPro ? 'text-white/80' : 'text-solar-gray-600'}`}>
              {plan.description}
            </p>

            <div className="flex-1 space-y-3 mb-6">
              <PlanFeature isPro={isPro} icon={<Users className="w-4 h-4" />}>
                {plan.seats} Team Seat{plan.seats > 1 ? 's' : ''} Included
              </PlanFeature>
              <PlanFeature isPro={isPro}>
                {plan.leadLimit ? `${plan.leadLimit.toLocaleString()} Leads/month` : 'Unlimited Leads'}
              </PlanFeature>
              <PlanFeature isPro={isPro}>
                {plan.automationLimit
                  ? `${plan.automationLimit} Automation${plan.automationLimit > 1 ? 's' : ''}`
                  : 'Unlimited Automations'}
              </PlanFeature>
              <div className={`flex items-center gap-2 text-sm font-semibold ${
                isPro ? 'text-solar-primary' : 'text-solar-success'
              }`}>
                <Check className="w-4 h-4" />
                <span>${plan.successFee} per Closed Deal</span>
              </div>
            </div>

            {isCurrent ? (
              <button
                onClick={handleManage}
                disabled={isPending}
                className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  isPro
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'border-2 border-solar-gray-300 text-solar-gray-700 hover:bg-solar-gray-50'
                }`}
              >
                Manage Subscription
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isPending}
                className={`flex w-full justify-center rounded-xl py-3.5 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  isPro
                    ? 'solar-gradient text-solar-gray-900 shadow-lg hover:shadow-xl'
                    : 'bg-solar-secondary text-white hover:bg-solar-secondary-dark shadow-md hover:shadow-lg'
                }`}
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Get Started'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

function PlanFeature({ children, isPro, icon }: { children: React.ReactNode; isPro?: boolean; icon?: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${isPro ? 'text-white/90' : 'text-solar-gray-700'}`}>
      {icon || <Check className={`w-4 h-4 ${isPro ? 'text-solar-primary' : 'text-solar-success'}`} />}
      <span>{children}</span>
    </div>
  )
}
