// SERVICE: Auth Session Management
// External integration - Clerk/Auth0/NextAuth

export interface Session {
  userId: string;
  agentId: string;
  email: string;
  role: 'admin' | 'sales_agent' | 'scheduler' | 'installer';
}

/**
 * Get current user session
 * 
 * EXTERNAL INTEGRATION - This calls auth provider (Clerk)
 * Domain logic should NOT be in this file
 */
export async function getSession(): Promise<Session | null> {
  // TODO: Implement Clerk session retrieval
  // TODO: Map Clerk user to our Agent model
  
  // STUB implementation
  return null;
}
