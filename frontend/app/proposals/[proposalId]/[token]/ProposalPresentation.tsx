'use client'

// PRIMUS HOME PRO - Proposal Presentation Component
// Full-page sales presentation with acceptance flow
// Contract v1.0: Simplified proposal model

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { acceptProposal } from '@/lib/actions/accept-proposal'
import { 
  Sun, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calendar,
  MapPin,
  User,
  Mail,
  Shield,
  DollarSign
} from 'lucide-react'

// Contract v1.0: Simplified proposal type
interface ProposalPresentationProps {
  proposalId: string
  accessToken: string
  proposal: {
    id: string
    totalSystemCost: number
    netCostAfterIncentives: number
    estMonthlyPayment: number
    estMonthlySavings: number
    pricingMode: string
    pdfUrl: string | null
    createdAt: Date
  }
  lead: {
    name: string | null
    address: string | null
  }
}

export function ProposalPresentation({
  proposalId,
  accessToken,
  proposal,
  lead,
}: ProposalPresentationProps) {
  const router = useRouter()
  const [customerName, setCustomerName] = useState(lead.name || '')
  const [customerEmail, setCustomerEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAccepted, setIsAccepted] = useState(false)

  const handleAccept = async () => {
    setError(null)

    if (!customerName.trim()) {
      setError('Please enter your name')
      return
    }

    if (!customerEmail.trim()) {
      setError('Please enter your email address')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await acceptProposal({
        proposalId,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
      })

      if (result.success) {
        setIsAccepted(true)
      } else {
        setError(result.error || 'Failed to accept proposal')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isAccepted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <Card className="w-full max-w-lg border-green-200 text-center shadow-xl">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Congratulations!</CardTitle>
            <CardDescription className="text-base">
              Your solar proposal has been accepted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-green-50 p-4 text-left">
              <h4 className="font-semibold text-green-800">What happens next?</h4>
              <ul className="mt-2 space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>You'll receive a confirmation email</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Our team will contact you within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Installation typically begins within 2-4 weeks</span>
                </li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Thank you for choosing solar! You're making a positive impact on both your wallet
                and the environment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                <Sun className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Primus Home Pro</h1>
                <p className="text-xs text-muted-foreground">Your Solar Proposal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure & Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Contract v1.0 Simplified */}
      <main className="mx-auto max-w-5xl space-y-8 p-6">
        {/* Welcome Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {lead.name ? `Hello, ${lead.name}!` : 'Your Solar Proposal'}
          </h2>
          <p className="mt-2 text-muted-foreground">
            Here's your personalized solar system proposal
          </p>
          {lead.address && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
              <MapPin className="h-4 w-4" />
              {lead.address}
            </div>
          )}
        </section>

        {/* Monthly Savings Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-center text-white shadow-2xl">
          <p className="text-lg font-medium opacity-90 mb-2">Estimated Monthly Savings</p>
          <p className="text-5xl md:text-6xl font-extrabold tracking-tight">
            ${Math.round(proposal.estMonthlySavings).toLocaleString()}
          </p>
          <p className="mt-3 text-emerald-100">
            That's ${Math.round(proposal.estMonthlySavings * 12).toLocaleString()} saved per year
          </p>
        </div>

        {/* Cost Summary - Contract v1.0 Fields */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Investment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-sm text-muted-foreground">Total System Cost</div>
                <div className="text-2xl font-bold">${Math.round(proposal.totalSystemCost).toLocaleString()}</div>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <div className="text-sm text-green-700">After Incentives</div>
                <div className="text-2xl font-bold text-green-600">${Math.round(proposal.netCostAfterIncentives).toLocaleString()}</div>
              </div>
              <div className="rounded-lg bg-primary/5 border-primary/20 border p-4 text-center">
                <div className="text-sm text-primary">Est. Monthly Payment</div>
                <div className="text-2xl font-bold text-primary">${Math.round(proposal.estMonthlyPayment).toLocaleString()}</div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Pricing Mode: <span className="font-medium">{proposal.pricingMode}</span>
            </p>
          </CardContent>
        </Card>

        {/* Acceptance Section */}
        <div className="space-y-6 rounded-xl border-2 border-primary/20 bg-white p-6 shadow-lg">
          <div className="text-center">
            <h3 className="text-xl font-bold">Accept Your Proposal</h3>
            <p className="mt-1 text-muted-foreground">
              Complete the form below to get started
            </p>
          </div>

          {/* Customer Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full legal name"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </label>
              <Input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            size="lg"
            className="w-full h-14 text-lg"
            onClick={handleAccept}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Accept Proposal
              </>
            )}
          </Button>

          {/* Legal Disclaimer */}
          <p className="text-center text-xs text-muted-foreground">
            By clicking "Accept Proposal", you express interest in proceeding with your solar installation.
            Our team will contact you to finalize details.
          </p>
        </div>

        {/* Proposal Info Footer */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Generated: {new Date(proposal.createdAt).toLocaleDateString()}
          </span>
          <span>Proposal ID: {proposalId.slice(-8)}</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Primus Home Pro. All rights reserved.</p>
        <p className="mt-1">Questions? Call us at 1-800-SOLAR-PRO</p>
      </footer>
    </div>
  )
}
