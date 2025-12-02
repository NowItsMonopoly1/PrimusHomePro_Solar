# 🚀 Primus Home Pro - Production Deployment Guide

## Overview

This guide covers the complete deployment of **Primus Home Pro** to production, including the Multi-Tenancy & RBAC system (Module K). Follow these steps in order to ensure a successful launch.

---

## 📋 Pre-Deployment Checklist

### Environment Variables Required

Ensure ALL of the following are set in your Vercel dashboard:

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (public) | ✅ Yes |
| `CLERK_SECRET_KEY` | Clerk auth (server) | ✅ Yes |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook verification | ✅ Yes |
| `STRIPE_SECRET_KEY` | Stripe payments | ✅ Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | ✅ Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe (public) | ✅ Yes |
| `GOOGLE_SOLAR_API_KEY` | Google Solar API | ⚠️ Recommended |
| `CLAUDE_API_KEY` | Claude AI features | ⚠️ Recommended |
| `NEXT_PUBLIC_APP_URL` | Your production URL | ✅ Yes |

---

## 🔧 Step 1: Database Migration

Before deploying the frontend code, update your production database with the new schema.

### Option A: Using the Deploy Script (Recommended)

```bash
# Make the script executable
chmod +x scripts/deploy.sh

# Run the deployment script
./scripts/deploy.sh
```

### Option B: Manual Steps

```bash
cd frontend

# Check migration status
npx prisma migrate status

# Apply pending migrations (Multi-Tenancy & RBAC)
npx prisma migrate deploy

# Generate updated Prisma client
npx prisma generate
```

---

## 🧹 Step 2: Cleanup Temporary Files

After running `prisma generate`, remove the temporary type file:

```bash
# Remove temporary RBAC types (now using Prisma-generated types)
rm frontend/types/rbac.ts
```

---

## ✅ Step 3: Verify Build

Ensure the codebase compiles without errors:

```bash
cd frontend
npx tsc --noEmit
```

---

## 🚀 Step 4: Deploy to Vercel

```bash
# Commit all changes
git add .
git commit -m "Module K: Multi-Tenancy & RBAC - Production Ready"

# Push to trigger Vercel deployment
git push origin master
```

---

## 👤 Step 5: Admin Setup (Post-Deployment)

After your first sign-up via Clerk, you need to bootstrap the admin account.

### 5.1 Get Your Clerk User ID

1. Sign up on the production site using Clerk
2. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
3. Navigate to **Users** and find your user
4. Copy the **User ID** (starts with `user_`)

### 5.2 Run the Admin Seeding Script

```bash
cd frontend

# Set your production DATABASE_URL
export DATABASE_URL="your_production_database_url"

# Run the seeding script
npx ts-node prisma/seed-admin.ts user_2abc123xyz "SunRun Solar"
```

Replace:
- `user_2abc123xyz` with your actual Clerk User ID
- `"SunRun Solar"` with your company name

### Expected Output:

```
🚀 Primus Home Pro - Admin Seeding Script
=========================================

📋 Looking for user with Clerk ID: user_2abc123xyz
✅ Found user: donte@example.com

🏢 Creating company: "SunRun Solar"
✅ Company created with ID: cmp_xxxxx

👤 Assigning donte@example.com as ADMIN...
✅ User role set to: ADMIN

=========================================
🎉 SUCCESS! Admin setup complete.

📊 Summary:
   Company: SunRun Solar
   Admin User: donte@example.com
   User Role: ADMIN
   Subscription Plan: AGENCY
   Max Users: 10

🚀 You can now log in and invite team members!
```

---

## 🔒 Step 6: Configure Webhooks

### Clerk Webhook

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret to `CLERK_WEBHOOK_SECRET`

### Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.*`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Step 7: Verification Tests

After deployment, verify these critical paths:

### Authentication Flow
- [ ] Sign up with new email
- [ ] Sign in with existing account
- [ ] Sign out and back in

### Lead Management
- [ ] Create a new lead via landing page
- [ ] View leads in dashboard
- [ ] View lead details drawer

### Solar Features
- [ ] Enter address and see solar data (if API key set)
- [ ] Generate a proposal
- [ ] View proposal presentation

### Team Management (RBAC)
- [ ] Access Team page as ADMIN
- [ ] Invite a team member
- [ ] Change a team member's role

### Billing
- [ ] Access Billing page as ADMIN
- [ ] View subscription status

---

## 🎯 Soft Launch Demo Script

For your demo with SunRun (or first customer):

### "The 5-Minute Closing Demo"

1. **Lead Capture** (30 seconds)
   - Navigate to the landing page
   - Enter a property address
   - Show instant lead creation

2. **AI Qualification** (30 seconds)
   - Show the AI Site Suitability Badge
   - Explain automated qualification

3. **Proposal Generation** (1 minute)
   - Click "Generate Proposal"
   - Watch AI create professional proposal

4. **Financial Comparison** (1 minute)
   - Show the Solar Financing Widget
   - Compare cash, loan, lease options

5. **E-Signature** (1 minute)
   - Open proposal presentation
   - Capture signature on the signature pad
   - Show immediate contract creation

6. **Project Creation** (1 minute)
   - Demonstrate automatic project creation
   - Show milestone tracking

**Key Talking Point:** *"In 5 minutes, you completed what currently takes your team 3 days and 5 emails."*

---

## 💰 Pricing Strategy

Based on value-based pricing for solar industry:

### Recommended Model: Hybrid SaaS

| Component | Price | Justification |
|-----------|-------|---------------|
| **Base Seat Fee** | $150-250/user/month | Covers platform access, support |
| **Success Fee** | $25-50/signed project | Aligns pricing with agent success |

### Tier Examples

| Plan | Seats | Base Price | Success Fee |
|------|-------|------------|-------------|
| Starter | 1 | $150/mo | $50/project |
| Team | 5 | $500/mo | $35/project |
| Agency | 10+ | $1,000/mo | $25/project |

---

## 🆘 Troubleshooting

### Migration Fails
```bash
# Check database connection
npx prisma db pull

# Reset and re-run (⚠️ DESTROYS DATA)
npx prisma migrate reset
```

### Type Errors After Migration
```bash
# Regenerate Prisma client
npx prisma generate

# Clear Next.js cache
rm -rf .next
npm run build
```

### User Not Found in Seeding
- Ensure the user has signed up via Clerk first
- Double-check the Clerk User ID in the Clerk dashboard
- Verify `DATABASE_URL` points to the correct database

---

## 📞 Support

For issues during deployment:
1. Check Vercel deployment logs
2. Review Prisma migration status
3. Verify all environment variables are set

---

**Congratulations! 🎉 Primus Home Pro is now live and ready to transform solar sales.**
