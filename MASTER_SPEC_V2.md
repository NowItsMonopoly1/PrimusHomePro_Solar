# Primus Home Pro - Master Spec v2.0

**The Solar Agent's Commission Engine**

> **CRITICAL**: This is the ONE CANONICAL SPECIFICATION.  
> ALL AI agents (Claude, Copilot, Gemini, ChatGPT) MUST follow this spec exactly.  
> DO NOT invent features. DO NOT add hardcoded percentages. DO NOT hallucinate implementations.

---

## 🎯 Project Vision

Primus Home Pro is a **Commission-Focused** solar sales platform built for field agents. Every lead is a potential paycheck. Every milestone is a commission unlock.

### Core Principle
> "Leads are Paychecks. Milestones are Unlocks."

Agents don't think in tasks—they think in money. This platform surfaces commission potential at every step.

---

## 🏗️ Architecture: Modular Monorepo

```
PrimusHomePro/
├── apps/
│   └── web/                  # Next.js 14 (App Router)
├── packages/
│   ├── domain/               # Pure business logic (NO external dependencies)
│   │   ├── agents/
│   │   ├── leads/
│   │   ├── solar/
│   │   ├── proposals/
│   │   ├── projects/
│   │   ├── commissions/
│   │   └── automation/
│   ├── services/             # External integrations (APIs, DB, Auth)
│   │   ├── solar/            # Google Solar API
│   │   ├── twilio/           # SMS provider
│   │   ├── pdf/              # PDF generation
│   │   └── auth/             # Clerk/Auth0
│   ├── automation/           # Automation engine + scheduler
│   ├── config/               # Environment + compliance rules
│   └── ui/                   # Shared UI components
└── prisma/                   # Database schema
```

### Architectural Rules

1. **Domain Layer = Pure Functions**
   - NO external API calls
   - NO database queries
   - NO side effects
   - ONLY business logic

2. **Service Layer = External Integrations**
   - ALL API calls go here
   - ALL database queries go here
   - Thin wrappers around external systems

3. **Apps Layer = UI + Routing**
   - API routes are thin—call domain functions
   - Pages fetch data via domain/service layers

---

## 📊 Database Schema (Clean)

### Core Entities

#### Agent
- Sales agents, schedulers, installers
- NO commission rates in v1 (calculated per-project)

#### Lead
- Potential customers
- Status: NEW → QUALIFIED → CONTACTED → PROPOSAL_SENT → CLOSED → LOST

#### SolarQualification
- Roof viability assessment (satellite data + business logic)
- roofViable: boolean
- solarScore: 0-100
- confidence: high | medium | low

#### Proposal
- Solar system financial breakdown
- System size, cost, savings estimates
- Federal tax credit (30%)
- Break-even year

#### Project
- Created when lead is CLOSED
- Status: ENGINEERING → PERMITTING → SCHEDULED → INSTALLATION → INSPECTION → PTO

#### ProjectMilestone
- Standard milestones (site_survey, contract_signed, install_complete, pto_granted)
- isComplete: boolean
- NO hardcoded commission percentages

#### CommissionUnlock
- Tracks commission amounts tied to milestones
- status: PENDING → UNLOCKED → PAID
- amount: Float (calculated by business logic, NOT hardcoded)

### What's NOT in v1

❌ NO `commissionRate` field on Agent  
❌ NO `estimatedCommission` field on Lead  
❌ NO hardcoded commission percentages (10%/30%/40%/20%)  
❌ NO `CommissionLog` model (use CommissionUnlock)  
❌ NO `solarViability` enum on Lead (use SolarQualification.roofViable)

---

## 🔧 Domain Modules (Pure Business Logic)

### @domain/solar
- `qualifyLeadRoof(leadId)` - Determine if roof is viable
  - Business rules:
    - Minimum roof area: 20 m²
    - Minimum panels: 8
    - Minimum sunshine: 1000 hrs/year
    - Shading threshold: < 30%
  - Returns: { roofViable, solarScore, confidence }

- `computeSolarScore(input)` - Calculate 0-100 viability score
  - Factors: area (30%), sunshine (30%), shading (20%), orientation (20%)

### @domain/proposals
- `generateProposal(input)` - Calculate financial breakdown
  - Federal tax credit: 30%
  - Utility rate escalation: 3% annually
  - Solar degradation: 0.7% annually
  - Financing: 6.99% APR, 20-year term

### @domain/commissions
- `createCommissionUnlock(projectId, agentId, milestoneKey, amount)` - Create unlock record
  - amount is CALCULATED, not hardcoded
- `getAgentCommissionSummary(agentId)` - Aggregate pending/unlocked/paid

---

## 🌐 Service Modules (External Integrations)

### @services/solar
- `fetchSolarData(address)` - Call Google Solar API
  - Returns: roof area, sunshine hours, shading, pitch, azimuth

### @services/twilio
- `sendSms(to, body)` - Send SMS via Twilio

### @services/pdf
- `generateProposalPdf(proposalId)` - Generate PDF, upload to storage

### @services/auth
- `getSession()` - Get current user from Clerk

---

## 🤖 Automation Engine

### Triggers (per Master Spec v2.0)
- **No Reply 3 Days**: Send follow-up SMS if no response after 3 days
- **New Lead Flash**: Notify agent immediately on new lead
- **Proposal Viewed**: Track when customer opens proposal link
- **Contract Signed**: Trigger project initialization

### Implementation
- `evaluateLeadTriggers(leadId)` - Check which triggers fire
- `handleAutomationEvent(event)` - Execute actions (SMS, notifications, etc.)
- `runAutomationCron()` - Scheduled job (runs every 5 minutes)

---

## 🎨 UI/UX Guidelines

### Commission-First Language

**Before (Tasks):**
- "Active Projects"
- "Milestone Complete"
- "Task List"

**After (Money):**
- "Pending Commissions"
- "Commission Unlock"
- "Money Urgency List"

### Agent Dashboard Widgets

#### 💰 Pending Paychecks
- Sum of all QUALIFIED leads (potential commissions)
- Count of viable leads

#### 🎉 Unlocked
- Sum of UNLOCKED commission amounts (ready to pay)
- Count of active projects

#### ✅ Paid Out
- Sum of PAID commission amounts (lifetime earnings)

#### 🔔 Recent Unlocks
- Activity feed of recent commission unlocks
- Format: "John Smith • CONTRACT • +$3,600 • Dec 1, 2024"

---

## 🚫 Compliance Rules

### Forbidden Marketing Claims (FTC/State Regulations)

❌ "Free solar"  
❌ "No cost solar"  
❌ "100% guaranteed offset"  
❌ "You will never pay for power again"  
❌ "Eliminate your electric bill"  
❌ "Government pays for it"  
❌ "No money down"  
❌ "Zero out of pocket"

### Validation
- ALL customer-facing content MUST pass `containsForbiddenClaim()` check
- Applies to: proposals, emails, SMS, landing pages

---

## 🔐 Environment Variables

### Required
```bash
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
```

### Optional (Feature-Specific)
```bash
GOOGLE_SOLAR_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
ENABLE_AUTOMATIONS=true
ENABLE_COMMISSION_TRACKING=true
```

---

## 🚀 Development Workflow

### For AI Agents

1. **Read this spec FIRST** before writing code
2. Place business logic in `packages/domain/`
3. Place external API calls in `packages/services/`
4. Keep API routes thin—call domain functions
5. NO hardcoded commission percentages
6. NO inventing features not in this spec

### Git Commit Guidelines

**Good:**
```bash
feat(domain/solar): Implement qualifyLeadRoof business logic per Master Spec v2.0
```

**Bad (Hallucinated):**
```bash
feat: Add commission rate field and hardcoded 30/40/30 split
```

---

## 📝 Implementation Checklist

### Phase 1: Scaffold (CURRENT)
- [x] Create monorepo structure
- [x] Scaffold domain modules (stub implementations)
- [x] Scaffold service modules (stub implementations)
- [x] Scaffold automation engine (stub implementations)
- [x] Create clean Prisma schema (NO hallucinated fields)

### Phase 2: Domain Logic
- [ ] Implement `qualifyLeadRoof()` business logic
- [ ] Implement `computeSolarScore()` algorithm
- [ ] Implement `generateProposal()` calculations
- [ ] Implement commission unlock creation (NO hardcoded %)

### Phase 3: Service Integrations
- [ ] Implement Google Solar API client
- [ ] Implement Twilio SMS client
- [ ] Implement PDF generation
- [ ] Implement Clerk session management

### Phase 4: UI Components
- [ ] Commission Dashboard widget
- [ ] Lead qualification flow
- [ ] Proposal generation UI
- [ ] Project milestone tracker

### Phase 5: Automation
- [ ] Implement automation triggers
- [ ] Implement cron scheduler
- [ ] Test automation flows

---

## ⚠️ Critical Reminders for AI Agents

1. **DO NOT** invent commission percentages (10/30/40/20)
2. **DO NOT** add `commissionRate` to Agent model in v1
3. **DO NOT** add `estimatedCommission` to Lead model
4. **DO NOT** create `CommissionLog` model (use `CommissionUnlock`)
5. **DO NOT** hardcode solar qualification thresholds in DB
6. **DO** keep domain logic pure (no API calls, no DB queries)
7. **DO** use service layer for all external integrations
8. **DO** validate all content against forbidden claims list

---

## 📞 Support & Questions

If you're an AI agent and encounter ambiguity in this spec:
1. ASK the user for clarification
2. DO NOT assume or invent features
3. Refer back to this Master Spec v2.0 as source of truth

---

**Last Updated**: December 2, 2024  
**Version**: 2.0.0  
**Maintained By**: Primus Home Pro Development Team
