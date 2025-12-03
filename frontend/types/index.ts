// =============================================================================
// PRIMUS HOME PRO — TYPE DEFINITIONS (Contract v1.0 Aligned)
// =============================================================================
// These types mirror the canonical Prisma schema exactly.
// Do NOT add fields without contract revision.
// =============================================================================

// =============================================================================
// CORE MODELS (from Contract v1.0)
// =============================================================================

export interface Agent {
  id: string
  clerkId: string
  email: string
  name: string
  phone: string | null
  role: string // "admin", "sales", "scheduler", "installer"
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  agentId: string | null
  name: string | null
  email: string | null
  phone: string | null
  address: string | null
  status: string // "new", "qualified", "disqualified", "proposed", "sold"
  source: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SolarQualification {
  id: string
  leadId: string
  roofAreaSqM: number
  sunshineHoursYear: number
  shadingPercent: number
  roofViable: boolean
  solarScore: number // 0-100
  confidence: string // "high", "medium", "low"
  rawApiData: unknown
  createdAt: Date
}

export interface Proposal {
  id: string
  leadId: string
  totalSystemCost: number
  netCostAfterIncentives: number
  estMonthlyPayment: number
  estMonthlySavings: number
  pricingMode: string // "cash", "loan", "ppa"
  pdfUrl: string | null
  createdAt: Date
}

export interface Project {
  id: string
  leadId: string
  status: string // "active", "on_hold", "completed", "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface ProjectMilestone {
  id: string
  projectId: string
  name: string // e.g., "Site Survey", "Contract Signed"
  unlockKey: string // "site_survey", "contract_signed" — links to commission
  description: string | null
  sortOrder: number
  status: string // "pending", "completed"
  completedAt: Date | null
  completedBy: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CommissionUnlock {
  id: string
  milestoneId: string
  agentId: string
  unlockKey: string
  status: string // "pending", "confirmed", "paid"
  amountEstimated: number
  amountConfirmed: number
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  leadId: string
  direction: string // "inbound", "outbound"
  channel: string // "sms", "email"
  body: string
  providerMessageId: string | null
  sentAt: Date
}

export interface AutomationEvent {
  id: string
  leadId: string
  eventType: string
  triggeredAt: Date
  handled: boolean
  handledAt: Date | null
  metadata: unknown
}

// =============================================================================
// EXTENDED TYPES (with relations)
// =============================================================================

export type LeadWithAgent = Lead & {
  agent: Agent | null
}

export type LeadWithQualification = Lead & {
  solarQualification: SolarQualification | null
}

export type LeadWithProposals = Lead & {
  proposals: Proposal[]
}

export type LeadWithProject = Lead & {
  project: Project | null
}

export type LeadWithMessages = Lead & {
  messages: Message[]
}

// Message with Lead relation (for inbox)
export type MessageWithLead = Message & {
  lead: Lead
}

export type LeadFull = Lead & {
  agent: Agent | null
  solarQualification: SolarQualification | null
  proposals: Proposal[]
  project: Project | null
  messages: Message[]
}

export type ProjectWithMilestones = Project & {
  milestones: ProjectMilestone[]
}

export type ProjectWithLead = Project & {
  lead: Lead
}

export type ProjectFull = Project & {
  lead: Lead
  milestones: ProjectMilestone[]
}

export type AgentWithLeads = Agent & {
  leads: Lead[]
}

export type AgentWithCommissions = Agent & {
  commissionUnlocks: CommissionUnlock[]
}

// =============================================================================
// CRM / UI TYPES
// =============================================================================

export type LeadWithMeta = Lead & {
  lastEventAt?: Date
  lastIntent?: string
  lastScore?: number
  lastSentiment?: string
  project?: { id: string } | null
  messages?: Message[]
}

// AI Types
export type AIProvider = 'claude' | 'gemini'
export type AIChannel = 'email' | 'sms'
export type AITone = 'default' | 'friendly' | 'professional' | 'casual' | 'shorter' | 'formal'
export type AIIntent = 'Booking' | 'Info' | 'Pricing' | 'Support' | 'Spam'
export type AISentiment = 'Positive' | 'Neutral' | 'Negative'

export interface AIReplyDraft {
  channel: AIChannel
  body: string
  tone?: AITone
  suggestedSubject?: string
}

export interface AIAnalysis {
  intent: AIIntent
  sentiment: AISentiment
  score: number // 0-100 lead quality score
  summary: string
  suggestedResponse?: string
}

// Lead Status (Contract v1.0 - lowercase strings)
export type LeadStatus = 'new' | 'qualified' | 'disqualified' | 'proposed' | 'sold'

// Automation Triggers
export type AutomationTrigger =
  | 'lead.created'
  | 'lead.qualified'
  | 'lead.no_reply_3d'
  | 'proposal.sent'
  | 'proposal.viewed'
  | 'milestone.completed'

// Automation Actions
export type AutomationAction = 'send_email' | 'send_sms' | 'create_task' | 'webhook'

// Server Action Return Types
export type ActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

// Lead Capture Form Types
export interface LeadCaptureInput {
  name?: string
  email?: string
  phone?: string
  address?: string
  source: string
  message?: string
  metadata?: Record<string, unknown>
}

// Automation Config
export interface AutomationConfig {
  delay?: number
  template?: string
  channel?: AIChannel
  conditions?: {
    minScore?: number
    maxScore?: number
    intentIn?: string[]
    statusIn?: string[] // Contract v1.0: status not stage
  }
  [key: string]: unknown
}

// Automation stub type (Contract v1.0: No Automation model yet)
// TODO: Add Automation model in future schema revision
export interface AutomationWithConfig {
  id: string
  name: string
  trigger: string
  action: string
  template: string
  enabled: boolean
  agentId: string
  config: AutomationConfig
  createdAt: Date
  updatedAt: Date
}

// Billing / Subscription Types
export interface PlanConfig {
  id: string
  name: string
  priceMonthly: number
  features: string[]
  stripePriceId?: string
}

// RBAC Types (Contract v1.0 uses lowercase string roles)
export type AgentRole = 'admin' | 'sales' | 'scheduler' | 'installer'

// Legacy type alias for backward compatibility during migration
export type UserRole = 'ADMIN' | 'SCHEDULER' | 'SALES' | 'INSTALLER'
