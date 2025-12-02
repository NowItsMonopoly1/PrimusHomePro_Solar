// DOMAIN: Commissions - Get Agent Commission Summary
// Pure business logic

export interface AgentCommissionSummary {
  agentId: string;
  pending: number; // Total $ in pending unlocks
  unlocked: number; // Total $ unlocked but not yet paid
  paid: number; // Total $ actually paid out
  totalLifetime: number; // All-time earnings
}

/**
 * Get commission summary for an agent
 * 
 * Aggregates all commission unlocks by status
 */
export async function getAgentCommissionSummary(
  agentId: string
): Promise<AgentCommissionSummary> {
  // TODO: Query commission_unlocks table via service layer
  // TODO: Aggregate by status
  
  // STUB implementation
  return {
    agentId,
    pending: 0,
    unlocked: 0,
    paid: 0,
    totalLifetime: 0,
  };
}
