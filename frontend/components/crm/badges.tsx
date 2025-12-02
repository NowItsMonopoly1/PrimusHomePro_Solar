// PRIMUS HOME PRO - CRM Badge Components
// M.P.A. (Modern Professional Aesthetic) status indicators

import React from 'react'
import { cn } from '@/lib/utils/cn'

export function ScoreBadge({ score }: { score: number }) {
  const getScoreConfig = (score: number) => {
    if (score >= 80) return { 
      color: 'bg-solar-success text-white', 
      label: 'Hot' 
    }
    if (score >= 60) return { 
      color: 'bg-solar-primary text-white', 
      label: 'Warm' 
    }
    if (score >= 40) return { 
      color: 'bg-solar-primary-light/20 text-solar-primary-dark', 
      label: 'Cool' 
    }
    return { 
      color: 'bg-solar-gray-100 text-solar-gray-600', 
      label: 'Cold' 
    }
  }

  const config = getScoreConfig(score)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200',
        config.color
      )}
    >
      <span className="text-base font-bold">{score}</span>
      <span className="text-xs font-medium opacity-90">{config.label}</span>
    </span>
  )
}

export function IntentBadge({ intent }: { intent: string }) {
  const isHot = ['Booking', 'Buying', 'Urgent'].includes(intent)

  return (
    <span
      className={cn(
        'text-sm font-semibold transition-colors',
        isHot ? 'text-solar-primary font-bold' : 'text-solar-gray-600'
      )}
    >
      {isHot && '🔥 '}{intent}
    </span>
  )
}

export function StageBadge({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    New: 'bg-solar-secondary text-white',
    Contacted: 'bg-solar-primary-light/20 text-solar-primary-dark',
    Qualified: 'bg-solar-primary text-white',
    Proposal: 'bg-purple-600 text-white',
    Negotiation: 'bg-indigo-600 text-white',
    Closed: 'bg-solar-success text-white',
    Won: 'bg-solar-success text-white',
    Lost: 'bg-solar-danger text-white',
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
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md',
        colors[stage] || 'bg-solar-gray-100 text-solar-gray-700'
      )}
    >
      <span>{icons[stage] || '📌'}</span>
      <span>{stage}</span>
    </span>
  )
}

export function SentimentBadge({ sentiment }: { sentiment: string }) {
  const colors: Record<string, string> = {
    Positive: 'text-solar-success font-semibold',
    Neutral: 'text-solar-gray-500',
    Negative: 'text-solar-danger font-semibold',
  }

  const icons: Record<string, string> = {
    Positive: '😊',
    Neutral: '😐',
    Negative: '😟',
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', colors[sentiment] || 'text-solar-gray-500')}>
      <span>{icons[sentiment] || '😐'}</span>
      <span>{sentiment}</span>
    </span>
  )
}

// Traffic Light Solar Suitability Badge - "God View"
export function SolarBadge({ suitability, showSystemSize, systemSizeKW }: { 
  suitability: string
  showSystemSize?: boolean
  systemSizeKW?: number 
}) {
  const config: Record<string, { bgColor: string; textColor: string; label: string; icon: React.ReactNode }> = {
    VIABLE: {
      bgColor: 'bg-solar-success',
      textColor: 'text-white',
      label: 'GO',
      icon: <span className="text-lg">✓</span>,
    },
    CHALLENGING: {
      bgColor: 'bg-solar-primary',
      textColor: 'text-white',
      label: 'REVIEW',
      icon: <span className="text-lg">⚠</span>,
    },
    NOT_VIABLE: {
      bgColor: 'bg-solar-danger',
      textColor: 'text-white',
      label: 'NO GO',
      icon: <span className="text-lg">✕</span>,
    },
  }

  const { bgColor, textColor, label, icon } = config[suitability] || config.NOT_VIABLE

  return (
    <div className="flex items-center gap-2">
      {/* Traffic Light Icon */}
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full font-bold shadow-md',
          bgColor,
          textColor
        )}
        title={label}
      >
        {icon}
      </div>
      {/* System Size Display */}
      {showSystemSize && systemSizeKW && (
        <span className="text-sm font-semibold text-solar-gray-700">
          {systemSizeKW.toFixed(1)} kW
        </span>
      )}
    </div>
  )
}

// Priority badge for high-value leads
export function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const config: Record<string, { color: string; label: string; icon: string }> = {
    high: {
      color: 'bg-solar-danger text-white animate-pulse',
      label: 'High Priority',
      icon: '🚨',
    },
    medium: {
      color: 'bg-solar-primary text-white',
      label: 'Medium',
      icon: '⚡',
    },
    low: {
      color: 'bg-solar-gray-100 text-solar-gray-600',
      label: 'Low',
      icon: '📋',
    },
  }

  const { color, label, icon } = config[priority] || config.medium

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold',
        color
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}
