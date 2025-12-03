// SERVICE: Auth Session Management
// External integration - Token parsing

export interface CurrentAgent {
  agentId: string;
  agencyId: string;
  role: 'agent' | 'manager' | 'admin';
}

/**
 * Get current agent from session token
 * Pure service - decodes token, NO DB calls
 */
export function getCurrentAgent(sessionToken: string): CurrentAgent {
  if (!sessionToken) {
    return { agentId: 'guest', agencyId: 'default', role: 'agent' };
  }

  try {
    // Simple JWT payload extraction (Base64 decode)
    // In production, use a library like 'jsonwebtoken' or 'jose' to verify signature
    const parts = sessionToken.split('.');
    if (parts.length !== 3) {
      // Handle non-JWT tokens (e.g. session IDs) if necessary, or just fail
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    // Map claims to CurrentAgent
    // Assuming standard claims or custom namespaced claims
    return {
      agentId: payload.sub || payload.agentId || 'guest',
      agencyId: payload.agencyId || 'default',
      role: (payload.role as CurrentAgent['role']) || 'agent',
    };
  } catch (error) {
    console.warn('Failed to parse session token:', error);
    // Return safe fallback
    return {
      agentId: 'guest',
      agencyId: 'default',
      role: 'agent',
    };
  }
}
