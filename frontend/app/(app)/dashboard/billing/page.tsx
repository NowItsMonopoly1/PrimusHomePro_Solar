// PRIMUS HOME PRO - Dashboard: Billing
// Subscription management and plan selection
// RBAC: Only ADMIN role can access this page

export const dynamic = 'force-dynamic'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { getPlanConfig } from '@/lib/billing/plans'
import { BillingPanel } from '@/components/billing/billing-panel'
import { guardBillingPage } from '@/lib/auth/route-guards'

export const metadata = {
  title: 'Billing | Primus Home Pro',
  description: 'Manage your subscription',
}

export default async function BillingPage() {
  // RBAC: Check if user has permission to access billing
  const guard = await guardBillingPage()
  if (!guard.allowed) {
    redirect(guard.redirectTo || '/dashboard')
  }

  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({ 
    where: { clerkId: userId },
    // TODO: After migration, include company relation
    // include: { company: true },
  })
  if (!user) {
    redirect('/sign-in')
  }

  // TODO: After migration, use company subscription if available
  // const subscriptionPlan = user.company?.subscriptionPlan || user.subscriptionPlan
  const subscriptionPlan = user.subscriptionPlan
  const currentPlan = getPlanConfig(subscriptionPlan)

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
        <p className="mt-2 text-muted-foreground">
          Upgrade to unlock more leads and automation power.
        </p>
      </div>

      {/* Current Plan Status */}
      {user.subscriptionStatus && user.subscriptionStatus !== 'canceled' && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Current Plan: {currentPlan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Status:{' '}
                <span className="capitalize">{user.subscriptionStatus}</span>
              </p>
              {user.subscriptionCurrentEnd && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Renews: {new Date(user.subscriptionCurrentEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${currentPlan.priceMonthly}</div>
              <div className="text-sm text-muted-foreground">per month</div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Selection */}
      <BillingPanel user={user} currentPlan={currentPlan} />

      {/* FAQ */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold">Frequently Asked Questions</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Can I cancel anytime?</p>
            <p className="mt-1 text-muted-foreground">
              Yes, you can cancel your subscription at any time. You'll retain access until
              the end of your billing period.
            </p>
          </div>
          <div>
            <p className="font-medium">What happens when I reach my lead limit?</p>
            <p className="mt-1 text-muted-foreground">
              You'll be notified when approaching your limit. Upgrade to a higher tier to
              continue capturing leads.
            </p>
          </div>
          <div>
            <p className="font-medium">Do you offer refunds?</p>
            <p className="mt-1 text-muted-foreground">
              We offer a 14-day money-back guarantee. Contact support for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
