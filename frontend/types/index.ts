// PRIMUS HOME PRO - Type Definitions
// Centralized TypeScript types and interfaces
// NOTE: Types are defined explicitly to avoid Prisma import issues on Vercel

// Base Types (defined explicitly, not imported from Prisma)
export interface Lead {
  id: string
  userId: string
  companyId: string | null
  assignedUserId: string | null
  name: string | null
  email: string | null
  phone: string | null
  address: string | null
  source: string | null
  score: number
  stage: string
  intent: string | null
  sentiment: string | null
  notes: string | null
  metadata: unknown
  roofPitch: number | null
  maxPanelsCount: number | null
  maxSunshineHoursYear: number | null
  annualKwhProduction: number | null
  carbonOffsetKg: number | null
  siteSuitability: string | null
  solarEnriched: boolean
  solarEnrichedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface LeadEvent {
  id: string
  leadId: string
  type: string
  content: string | null
  metadata: unknown
  payload: unknown
  createdAt: Date
}

export interface User {
  id: string
  clerkId: string
  email: string
  name: string | null
  stripeCustomer: string | null
  subscriptionPlan: string | null
  subscriptionStatus: string | null
  subscriptionCurrentEnd: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Automation {
  id: string
  userId: string
  companyId: string | null
  name: string
  trigger: string
  action: string
  template: string
  enabled: boolean
  config: unknown
  createdAt: Date
  updatedAt: Date
}

export interface SiteSurvey {
  id: string
  leadId: string
  systemSizeKW: number | null
  annualKwhProduction: number | null
  panelCount: number | null
  roofAreaSqFt: number | null
  sunshineHours: number | null
  carbonOffset: number | null
  rawApiResponse: unknown
  createdAt: Date
  updatedAt: Date
}

// Extended types with relations
export type LeadWithEvents = Lead & {
  events: LeadEvent[]
}

export type LeadWithUser = Lead & {
  user: User
}

export type LeadWithSolar = Lead & {
  siteSurvey: SiteSurvey | null
}

export type LeadFull = Lead & {
  events: LeadEvent[]
  user: User
  siteSurvey: SiteSurvey | null
}

// AI Types
export type AIProvider = 'claude' | 'gemini'

export type AIIntent = 'Booking' | 'Info' | 'Pricing' | 'Support' | 'Spam'

export type AISentiment = 'Positive' | 'Neutral' | 'Negative'

export interface AIAnalysis {
  intent: AIIntent
  sentiment: AISentiment
  score: number // 0-100 lead quality score
  summary: string
  suggestedResponse?: string
}

// Lead Event Types
export type LeadEventType =
  | 'EMAIL_SENT'
  | 'EMAIL_RECEIVED'
  | 'SMS_SENT'
  | 'SMS_RECEIVED'
  | 'NOTE_ADDED'
  | 'STAGE_CHANGE'
  | 'AI_ANALYSIS'
  | 'AI_DRAFT'
  | 'FORM_SUBMIT'
  | 'SOLAR_ANALYSIS'
  | 'PROPOSAL_GENERATED'
  | 'PROPOSAL_SENT'
  | 'PROPOSAL_VIEWED'
  | 'PROPOSAL_ACCEPTED'

// Lead Stages
export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Closed' | 'Lost'

// Automation Triggers
export type AutomationTrigger =
  | 'NEW_LEAD'
  | 'NO_REPLY_3D'
  | 'INTENT_BOOKING'
  | 'STAGE_CHANGE'
  | 'SOLAR_ANALYZED'
  | 'SOLAR_VIABLE'
  | 'SOLAR_NOT_VIABLE'

// Automation Actions
export type AutomationAction = 'SEND_EMAIL' | 'SEND_SMS' | 'AI_FOLLOWUP' | 'WEBHOOK' | 'SOLAR_ENRICH'

// Solar Site Suitability Types
export type SiteSuitability = 'VIABLE' | 'CHALLENGING' | 'NOT_VIABLE'

export interface SolarPotential {
  maxPanelsCount: number
  maxSunshineHoursYear: number
  annualKwhProduction: number
  systemSizeKW: number
  carbonOffsetKg: number
  estimatedSavingsYear?: number
  paybackYears?: number
}

export interface SolarEnrichmentResult {
  success: boolean
  leadId: string
  siteSuitability: SiteSuitability
  maxPanelsCount?: number
  maxSunshineHoursYear?: number
  annualKwhProduction?: number
  systemSizeKW?: number
  estimatedSavingsYear?: number
  error?: string
}

// Server Action Return Types
export type ActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

// Lead Capture Form Types
export interface LeadCaptureInput {
  name?: string
  email?: string
  phone?: string
  source: string
  message?: string
  metadata?: Record<string, unknown>
}

// CRM Types - Define explicitly to avoid Prisma type issues on Vercel
export interface LeadWithMeta {
  id: string
  userId: string
  name: string | null
  email: string | null
  phone: string | null
  address: string | null
  source: string | null
  stage: string
  score: number | null
  intent: string | null
  sentiment: string | null
  metadata: unknown
  createdAt: Date
  updatedAt: Date
  // Extended fields
  lastEventAt: Date | null
  lastIntent: string | null
  lastScore: number | null
  lastSentiment: string | null
  events: Array<{
    id: string
    type: string
    content: string | null
    createdAt: Date
    metadata: unknown
    payload: unknown
    leadId: string
  }>
  project?: { id: string } | null
  // Solar fields
  solarEnriched?: boolean | null
  siteSuitability?: string | null
  estimatedSavings?: number | null
  solarEnrichedAt?: Date | null
}

// AI Reply Types
export type AITone = 'default' | 'shorter' | 'formal' | 'casual'
export type AIChannel = 'email' | 'sms'

export interface AIReplyDraft {
  channel: AIChannel
  body: string
  tone: AITone
}

// Automation Config Types
export interface AutomationConditions {
  minScore?: number
  maxScore?: number
  intentIn?: AIIntent[]
  stageIn?: LeadStage[]
  siteSuitabilityIn?: SiteSuitability[]
  solarEnriched?: boolean
}

export interface AutomationActions {
  enrichSolar?: boolean
  notifyOnViable?: boolean
}

export interface AutomationConfig {
  channel?: AIChannel
  delayMinutes?: number
  conditions?: AutomationConditions
  actions?: AutomationActions
}

export interface AutomationWithConfig extends Omit<Automation, 'config'> {
  config: AutomationConfig
}
