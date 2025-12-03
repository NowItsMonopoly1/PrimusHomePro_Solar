// PRIMUS HOME PRO - Public Proposal Presentation Page
// Secure, token-validated page for customers to view and sign proposals
// NOTE: Contract v1.0 simplified - token validation for future phase

import { notFound } from 'next/navigation'
import { getPublicProposalDetails } from '@/lib/actions/accept-proposal'
import { ProposalPresentation } from './ProposalPresentation'

interface ProposalPageProps {
  params: Promise<{
    proposalId: string
    token: string
  }>
}

export default async function PublicProposalPage({ params }: ProposalPageProps) {
  const { proposalId, token } = await params

  // Contract v1.0: Simplified - token validation deferred to future phase
  // For now, fetch proposal by ID only
  const result = await getPublicProposalDetails(proposalId)

  if (!result.success) {
    // Return not found for invalid proposals
    notFound()
  }

  const { proposal, lead } = result.data

  return (
    <ProposalPresentation
      proposalId={proposalId}
      accessToken={token}
      proposal={proposal}
      lead={lead}
    />
  )
}

// Metadata
export async function generateMetadata({ params }: ProposalPageProps) {
  const { proposalId } = await params
  const result = await getPublicProposalDetails(proposalId)

  if (!result.success) {
    return {
      title: 'Proposal Not Found | Primus Home Pro',
    }
  }

  const { lead, proposal } = result.data

  return {
    title: `Solar Proposal for ${lead.name || 'Your Home'} | Primus Home Pro`,
    description: `View your personalized solar system proposal with estimated monthly savings of $${Math.round(proposal.estMonthlySavings)}.`,
    robots: 'noindex, nofollow', // Don't index personal proposals
  }
}
