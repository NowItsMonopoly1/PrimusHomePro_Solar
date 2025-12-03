// DOMAIN: Commissions - Get Agent Commission Summary
// Pure business logic - NO DB, NO API, NO side effects

import { CommissionUnlock, CommissionStatus } from './create-commission-unlock';

export interface AgentCommissionSummary {
  agentId: string;
  pending: number;
  confirmed: number;
  paid: number;
  totalLifetime: number;
}

/**
 * Aggregate commission records by status
 * Pure function - receives records, returns summary
 * Contract v1.0: lowercase status values
 */
export function getAgentCommissionSummary(
  agentId: string,
  records: CommissionUnlock[]
): AgentCommissionSummary {
  // Filter to only this agent's records
  const agentRecords = records.filter(r => r.agentId === agentId);

  // Aggregate by status
  let pending = 0;
  let confirmed = 0;
  let paid = 0;

  for (const record of agentRecords) {
    switch (record.status) {
      case 'pending':
        pending += record.amount;
        break;
      case 'confirmed':
        confirmed += record.amount;
        break;
      case 'paid':
        paid += record.amount;
        break;
    }
  }

  return {
    agentId,
    pending,
    confirmed,
    paid,
    totalLifetime: pending + confirmed + paid,
  };
}
