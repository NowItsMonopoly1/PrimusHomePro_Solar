// PRIMUS HOME PRO - CRM Badge Components
// Solar-branded status indicators with consistent styling

import { cn } from '@/lib/utils/cn'

export function ScoreBadge({ score }: { score: number }) {
  const getScoreConfig = (score: number) => {
    if (score >= 80) return { color: 'bg-solar-success/15 text-solar-success border-solar-success/30', label: 'Hot' }
    if (score >= 60) return { color: 'bg-solar-primary/15 text-solar-primary-dark border-solar-primary/30', label: 'Warm' }
    if (score >= 40) return { color: 'bg-amber-500/15 text-amber-600 border-amber-500/30', label: 'Cool' }
    return { color: 'bg-solar-gray-200 text-solar-gray-600 border-solar-gray-300', label: 'Cold' }
  }

  const config = getScoreConfig(score)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-bold transition-all duration-200',
        config.color
      )}
    >
      <span className="text-base">{score}</span>
      <span className="text-xs font-medium opacity-75">{config.label}</span>
    </span>
  )
}

export function IntentBadge({ intent }: { intent: string }) {
  const isHot = ['Booking', 'Buying', 'Urgent'].includes(intent)

  return (
    <span
      className={cn(
        'text-sm font-semibold transition-colors',
        isHot ? 'text-solar-primary-dark' : 'text-solar-gray-600'
      )}
    >
      {isHot && '🔥 '}{intent}
    </span>
  )
}

export function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    New: 'bg-solar-secondary/15 text-solar-secondary border-solar-secondary/30',
    Contacted: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
    Qualified: 'bg-solar-primary/15 text-solar-primary-dark border-solar-primary/30',
    Proposal: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
    Negotiation: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/30',
    Closed: 'bg-solar-success/15 text-solar-success-dark border-solar-success/30',
    Won: 'bg-solar-success/15 text-solar-success-dark border-solar-success/30',
    Lost: 'bg-solar-danger/15 text-solar-danger border-solar-danger/30',
  }

  const icons: Record<string, string> = {
    New: '✨',
    Contacted: '📞',
    Qualified: '⭐',
    Proposal: '📋',
    Negotiation: '🤝',
    Closed: '🎉',
    Won: '🏆',
    Lost: '❌',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-sm font-bold shadow-sm transition-all duration-200 hover:shadow-md',
        colors[stage] || 'bg-solar-gray-100 text-solar-gray-700 border-solar-gray-200'
      )}
    >
      <span>{icons[stage] || '📌'}</span>
      <span>{stage}</span>
    </span>
  )
}

export function SentimentBadge({ sentiment }: { sentiment: string }) {
  const colors: Record<string, string> = {
    Positive: 'text-solar-success font-bold',
    Neutral: 'text-solar-gray-500',
    Negative: 'text-solar-danger font-bold',
  }

  const icons: Record<string, string> = {
    Positive: '😊',
    Neutral: '😐',
    Negative: '😟',
  }

  return (
    <span className={cn('inline-flex items-center gap-1 text-sm', colors[sentiment] || 'text-solar-gray-500')}>
      <span>{icons[sentiment] || '😐'}</span>
      <span>{sentiment}</span>
    </span>
  )
}

export function SolarBadge({ suitability }: { suitability: string }) {
  const config: Record<string, { color: string; label: string; icon: string }> = {
    VIABLE: {
      color: 'bg-solar-success/15 text-solar-success-dark border-solar-success/30 shadow-sm',
      label: 'Solar Ready',
      icon: '☀️',
    },
    CHALLENGING: {
      color: 'bg-solar-primary/15 text-solar-primary-dark border-solar-primary/30 shadow-sm',
      label: 'Needs Review',
      icon: '🌤️',
    },
    NOT_VIABLE: {
      color: 'bg-solar-danger/15 text-solar-danger border-solar-danger/30',
      label: 'Not Suitable',
      icon: '☁️',
    },
  }

  const { color, label, icon } = config[suitability] || config.NOT_VIABLE

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-sm font-bold transition-all duration-200',
        color
      )}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </span>
  )
}

// New priority badge for high-value leads
export function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const config: Record<string, { color: string; label: string; icon: string }> = {
    high: {
      color: 'bg-solar-danger/15 text-solar-danger border-solar-danger/30 animate-pulse',
      label: 'High Priority',
      icon: '🚨',
    },
    medium: {
      color: 'bg-solar-primary/15 text-solar-primary-dark border-solar-primary/30',
      label: 'Medium',
      icon: '⚡',
    },
    low: {
      color: 'bg-solar-gray-100 text-solar-gray-600 border-solar-gray-200',
      label: 'Low',
      icon: '📋',
    },
  }

  const { color, label, icon } = config[priority] || config.medium

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1 text-sm font-bold',
        color
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}
