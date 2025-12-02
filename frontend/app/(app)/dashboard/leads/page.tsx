// PRIMUS HOME PRO - Leads Dashboard Page
// Command Center for lead management with solar branding

export const dynamic = 'force-dynamic'

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getLeadsForUser } from '@/lib/data/leads'
import { LeadsTable } from '@/components/crm/leads-table'
import { prisma } from '@/lib/db/prisma'
import { Button } from '@/components/ui/button'
import { Users, Plus, Filter, Download, Sun } from 'lucide-react'

export default async function LeadsPage() {
  const { userId: clerkUserId } = await auth()

  if (!clerkUserId) {
    redirect('/sign-in')
  }

  // Find user by Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
  })

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-solar-bg">
        <div className="text-center">
          <div className="w-16 h-16 solar-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sun className="w-8 h-8 text-solar-gray-900" />
          </div>
          <h2 className="text-2xl font-bold text-solar-gray-900">Setting up your account...</h2>
          <p className="mt-2 text-solar-gray-600">
            Please refresh the page in a moment.
          </p>
        </div>
      </div>
    )
  }

  const leads = await getLeadsForUser(user.id)

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-6 md:p-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-solar-gray-900">
            Leads
          </h1>
          <p className="mt-1 text-lg text-solar-gray-600">
            Manage and track your solar opportunities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats Badge */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border-2 border-solar-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-solar-secondary/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-solar-secondary" />
            </div>
            <div>
              <p className="text-xs text-solar-gray-500 font-medium">Total Leads</p>
              <p className="text-xl font-black text-solar-gray-900">{leads.length}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <Button variant="outline" size="lg" className="hidden md:flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="lg" className="hidden md:flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="solar" size="lg" className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Lead
          </Button>
        </div>
      </header>

      {/* Table */}
      <LeadsTable initialLeads={leads} />
    </section>
  )
}
