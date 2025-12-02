#!/bin/bash

# ============================================
# Primus Home Pro - Production Deployment Script
# ============================================
# 
# This script handles the complete deployment process:
# 1. Run database migrations
# 2. Generate Prisma client
# 3. Clean up temporary files
# 4. Verify environment
#
# Usage:
#   chmod +x scripts/deploy.sh
#   ./scripts/deploy.sh
#
# Prerequisites:
#   - DATABASE_URL must be set
#   - All API keys must be configured
# ============================================

set -e

echo "🚀 Primus Home Pro - Production Deployment"
echo "==========================================="
echo ""

# Check for required environment variables
check_env() {
    local var_name=$1
    local var_value=$(printenv "$var_name")
    
    if [ -z "$var_value" ]; then
        echo "❌ Missing required environment variable: $var_name"
        return 1
    else
        echo "✅ $var_name is set"
        return 0
    fi
}

echo "📋 Step 1: Verifying Environment Variables"
echo "-------------------------------------------"

MISSING_VARS=0

check_env "DATABASE_URL" || MISSING_VARS=$((MISSING_VARS + 1))
check_env "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" || MISSING_VARS=$((MISSING_VARS + 1))
check_env "CLERK_SECRET_KEY" || MISSING_VARS=$((MISSING_VARS + 1))
check_env "STRIPE_SECRET_KEY" || MISSING_VARS=$((MISSING_VARS + 1))

# Optional but recommended
check_env "GOOGLE_SOLAR_API_KEY" || echo "   ⚠️  Solar API features will be disabled"
check_env "CLAUDE_API_KEY" || echo "   ⚠️  AI features will be disabled"

if [ $MISSING_VARS -gt 0 ]; then
    echo ""
    echo "❌ $MISSING_VARS required environment variable(s) missing."
    echo "   Please configure them before deploying."
    exit 1
fi

echo ""
echo "📦 Step 2: Running Database Migrations"
echo "---------------------------------------"

cd frontend

# Check if there are pending migrations
echo "Checking migration status..."
npx prisma migrate status

echo ""
echo "Applying migrations..."
npx prisma migrate deploy

echo "✅ Database migrations complete"

echo ""
echo "🔧 Step 3: Generating Prisma Client"
echo "------------------------------------"

npx prisma generate
echo "✅ Prisma client generated"

echo ""
echo "🧹 Step 4: Cleaning Up Temporary Files"
echo "---------------------------------------"

# Remove temporary RBAC types (now using Prisma-generated types)
if [ -f "types/rbac.ts" ]; then
    rm types/rbac.ts
    echo "✅ Removed temporary types/rbac.ts"
else
    echo "ℹ️  types/rbac.ts already removed"
fi

echo ""
echo "🔍 Step 5: TypeScript Verification"
echo "-----------------------------------"

echo "Running type check..."
npx tsc --noEmit
echo "✅ TypeScript compilation successful"

echo ""
echo "==========================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "==========================================="
echo ""
echo "Next Steps:"
echo "  1. Deploy to Vercel: git push origin master"
echo "  2. After first sign-up, run admin seeding:"
echo "     npx ts-node prisma/seed-admin.ts <clerk_user_id> \"Company Name\""
echo "  3. Verify all features in production"
echo ""
echo "🚀 Primus Home Pro is ready for launch!"
