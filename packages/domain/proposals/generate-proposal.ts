// DOMAIN: Proposals - Generate Proposal
// Pure business logic - NO DB, NO API, NO side effects

import { SavingsModel, PricingConfig, calculateSavingsModel } from './calculate-savings-model';
import { SolarQualification } from '../solar';

export interface ProposalRequest {
  leadId: string;
  qualification: SolarQualification;
  pricingConfig: PricingConfig;
  currentMonthlyBill: number;
}

export interface Proposal {
  leadId: string;
  savings: SavingsModel;
  systemSizeKw: number;
  grossCost: number;
  netCostAfterIncentives: number;
  breakEvenYears: number;
  estimatedAnnualSavings: number;
}

/**
 * Generate a solar proposal with financial calculations
 * Pure function - all inputs provided, deterministic output
 */
export function generateProposal(request: ProposalRequest): Proposal {
  const { leadId, qualification, pricingConfig, currentMonthlyBill } = request;

  // Calculate savings model using pure function
  const savings = calculateSavingsModel(
    { estAnnualProductionKwh: qualification.estAnnualProductionKwh },
    pricingConfig
  );

  // Annual savings = (current bill × 12) offset by solar, minus loan payments
  const estimatedAnnualSavings = savings.estMonthlySavings * 12;

  // Break-even calculation (years to recoup net cost via savings)
  const breakEvenYears = estimatedAnnualSavings > 0
    ? Math.ceil(savings.netCostAfterIncentives / (currentMonthlyBill * 12 * 0.8))
    : 99;

  return {
    leadId,
    savings,
    systemSizeKw: savings.estSystemSizeKw,
    grossCost: savings.grossCost,
    netCostAfterIncentives: savings.netCostAfterIncentives,
    breakEvenYears: Math.min(breakEvenYears, 25),
    estimatedAnnualSavings: Math.round(estimatedAnnualSavings),
  };
}
