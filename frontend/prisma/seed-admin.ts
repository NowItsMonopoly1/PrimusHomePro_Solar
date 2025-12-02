/**
 * Admin Seeding Script
 * 
 * This script creates the initial Company and assigns the first user as ADMIN.
 * Run this AFTER:
 *   1. Database migration: npx prisma migrate deploy
 *   2. Prisma generate: npx prisma generate
 *   3. First sign-up via Clerk
 * 
 * Usage:
 *   npx ts-node prisma/seed-admin.ts <clerk_user_id> <company_name>
 * 
 * Example:
 *   npx ts-node prisma/seed-admin.ts user_2abc123 "SunRun Solar"
 * 
 * NOTE: This script uses raw SQL to avoid TypeScript errors before 
 * Prisma client is regenerated with new schema types.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Usage: npx ts-node prisma/seed-admin.ts <clerk_user_id> <company_name>');
    console.error('   Example: npx ts-node prisma/seed-admin.ts user_2abc123 "SunRun Solar"');
    process.exit(1);
  }

  const [clerkId, companyName] = args;

  console.log('🚀 Primus Home Pro - Admin Seeding Script');
  console.log('=========================================\n');

  try {
    // Step 1: Check if user exists using raw query to avoid type issues
    console.log(`📋 Looking for user with Clerk ID: ${clerkId}`);
    
    const users = await prisma.$queryRaw<Array<{
      id: string;
      email: string;
      companyId: string | null;
      role: string | null;
    }>>`SELECT id, email, "companyId", role FROM "User" WHERE "clerkId" = ${clerkId}`;

    if (users.length === 0) {
      console.error(`❌ User not found with Clerk ID: ${clerkId}`);
      console.error('   Make sure the user has signed up via Clerk first.');
      process.exit(1);
    }

    const user = users[0];
    console.log(`✅ Found user: ${user.email}`);

    // Step 2: Check if user already has a company
    if (user.companyId) {
      console.log(`⚠️  User already belongs to a company (ID: ${user.companyId})`);
      
      const companies = await prisma.$queryRaw<Array<{ name: string }>>`
        SELECT name FROM "Company" WHERE id = ${user.companyId}
      `;
      
      if (companies.length > 0) {
        console.log(`   Company Name: ${companies[0].name}`);
      }
      console.log(`   User Role: ${user.role}`);
      console.log('\n✅ No changes made. User is already configured.');
      return;
    }

    // Step 3: Create the Company using raw SQL
    console.log(`\n🏢 Creating company: "${companyName}"`);
    
    const companyId = `cmp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    await prisma.$executeRaw`
      INSERT INTO "Company" (id, name, "subscriptionPlan", "maxUsers", "isActive", "createdAt", "updatedAt")
      VALUES (${companyId}, ${companyName}, 'AGENCY', 10, true, NOW(), NOW())
    `;

    console.log(`✅ Company created with ID: ${companyId}`);

    // Step 4: Assign user to company as ADMIN
    console.log(`\n👤 Assigning ${user.email} as ADMIN...`);
    
    await prisma.$executeRaw`
      UPDATE "User" 
      SET "companyId" = ${companyId}, role = 'ADMIN', "updatedAt" = NOW()
      WHERE id = ${user.id}
    `;

    console.log(`✅ User role set to: ADMIN`);

    // Summary
    console.log('\n=========================================');
    console.log('🎉 SUCCESS! Admin setup complete.\n');
    console.log('📊 Summary:');
    console.log(`   Company: ${companyName}`);
    console.log(`   Company ID: ${companyId}`);
    console.log(`   Admin User: ${user.email}`);
    console.log(`   User Role: ADMIN`);
    console.log(`   Subscription Plan: AGENCY`);
    console.log(`   Max Users: 10`);
    console.log('\n🚀 You can now log in and invite team members!');

  } catch (error) {
    console.error('❌ Error during admin seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
