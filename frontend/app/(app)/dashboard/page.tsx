// PRIMUS HOME PRO - Dashboard Home
// Solar-branded overview and quick stats

export const dynamic = 'force-dynamic'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, CheckCircle, Clock, Sun, Zap, ArrowRight, Target, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-solar-bg">
        <div className="text-center">
          <div className="w-16 h-16 solar-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sun className="w-8 h-8 text-solar-gray-900" />
          </div>
          <p className="text-solar-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Get stats
  const totalLeads = await prisma.lead.count({ where: { userId: user.id } })
  const newLeads = await prisma.lead.count({
    where: { userId: user.id, stage: 'New' },
  })
  const qualifiedLeads = await prisma.lead.count({
    where: { userId: user.id, stage: 'Qualified' },
  })
  const closedLeads = await prisma.lead.count({
    where: { userId: user.id, stage: 'Closed' },
  })

  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: Users,
      description: 'All-time captures',
      gradient: 'from-solar-secondary to-solar-secondary-dark',
      iconColor: 'text-white',
    },
    {
      title: 'New Leads',
      value: newLeads,
      icon: Clock,
      description: 'Awaiting contact',
      gradient: 'from-amber-400 to-orange-500',
      iconColor: 'text-white',
    },
    {
      title: 'Qualified',
      value: qualifiedLeads,
      icon: Target,
      description: 'High-intent leads',
      gradient: 'from-solar-primary to-yellow-500',
      iconColor: 'text-solar-gray-900',
    },
    {
      title: 'Closed Deals',
      value: closedLeads,
      icon: CheckCircle,
      description: 'Won this month',
      gradient: 'from-solar-success to-emerald-500',
      iconColor: 'text-white',
    },
  ]

  return (
    <section className="mx-auto max-w-7xl space-y-8 p-6 md:p-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-solar-gray-900">
            Welcome back, <span className="text-solar-secondary">{user.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="mt-2 text-lg text-solar-gray-600">
            Here's what's happening with your solar leads today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" asChild>
            <Link href="/templates/simple" className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              View Landing Page
            </Link>
          </Button>
          <Button variant="solar" size="lg" asChild>
            <Link href="/dashboard/leads" className="flex items-center gap-2">
              View All Leads
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} variant="elevated" className="overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-solar-gray-500 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-black text-solar-gray-900">{stat.value}</p>
                  <p className="text-sm text-solar-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Capture Leads Card */}
        <Card variant="solar" className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-solar-primary/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-solar-primary-dark" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-solar-gray-900 mb-1">Capture More Leads</h3>
                <p className="text-sm text-solar-gray-600 mb-3">
                  Share your landing page to start generating solar leads automatically.
                </p>
                <Button variant="solar-outline" size="sm" asChild>
                  <Link href="/templates/simple">View Templates</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automations Card */}
        <Card variant="solar" className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-solar-secondary/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-solar-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-solar-gray-900 mb-1">Set Up Automations</h3>
                <p className="text-sm text-solar-gray-600 mb-3">
                  Automate follow-ups and never miss an opportunity again.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/automations">Configure</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Card */}
        <Card variant="solar" className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-solar-success/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-solar-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-solar-gray-900 mb-1">Upgrade Your Plan</h3>
                <p className="text-sm text-solar-gray-600 mb-3">
                  Unlock unlimited leads and advanced AI features.
                </p>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/dashboard/billing">View Plans</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card variant="elevated">
        <CardHeader className="border-b border-solar-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription className="text-solar-gray-500">Your latest lead interactions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/leads" className="flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {totalLeads === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-solar-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-solar-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-solar-gray-700 mb-2">No leads yet</h3>
              <p className="text-solar-gray-500 max-w-sm mx-auto mb-4">
                Share your landing page to start capturing solar leads.
              </p>
              <Button variant="solar" asChild>
                <Link href="/templates/simple">Get Started</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-solar-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-solar-primary/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-solar-primary-dark" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-solar-gray-900">You have {newLeads} new lead{newLeads !== 1 ? 's' : ''} to follow up with</p>
                  <p className="text-sm text-solar-gray-500">Don't let opportunities slip away!</p>
                </div>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/dashboard/leads">View Leads</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
