// CONFIG: Environment Variables
// Centralized environment configuration

export const config = {
  // Google Solar API
  googleSolarApiKey: process.env.GOOGLE_SOLAR_API_KEY || '',
  
  // Twilio
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  
  // Clerk Auth
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // App URLs
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Feature Flags
  enableAutomations: process.env.ENABLE_AUTOMATIONS === 'true',
  enableCommissionTracking: process.env.ENABLE_COMMISSION_TRACKING === 'true',
};

/**
 * Validate required environment variables
 */
export function validateConfig(): void {
  const required = [
    'DATABASE_URL',
    'CLERK_SECRET_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
