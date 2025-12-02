// DOMAIN: Proposals - Generate Proposal
// Pure business logic - proposal calculations

export interface ProposalInput {
  leadId: string;
  systemSizeKw: number;
  annualProductionKwh: number;
  currentElectricBill: number; // Monthly bill
  utilityRatePerKwh: number;
  installCostPerWatt: number;
}

export interface Proposal {
  id: string;
  leadId: string;
  systemSizeKw: number;
  totalCost: number;
  federalTaxCredit: number; // 30%
  netCost: number;
  monthlyPayment: number; // If financed
  estimatedSavingsYear1: number;
  estimatedSavings25Year: number;
  breakEvenYear: number;
  createdAt: Date;
}

/**
 * Generate a solar proposal with financial calculations
 * 
 * Business Rules (per Master Spec v2.0):
 * - Federal ITC: 30% of system cost
 * - Utility rate escalation: 3% annually
 * - Solar degradation: 0.7% annually
 * - Financing: 6.99% APR, 20-year term (if applicable)
 */
export async function generateProposal(input: ProposalInput): Promise<Proposal> {
  const systemSizeWatts = input.systemSizeKw * 1000;
  const totalCost = systemSizeWatts * input.installCostPerWatt;
  const federalTaxCredit = totalCost * 0.30; // 30% ITC
  const netCost = totalCost - federalTaxCredit;
  
  // Assume 20-year financing at 6.99% APR
  const monthlyRate = 0.0699 / 12;
  const numPayments = 20 * 12;
  const monthlyPayment = 
    (netCost * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  // Year 1 savings
  const currentAnnualCost = input.currentElectricBill * 12;
  const estimatedSavingsYear1 = currentAnnualCost - (monthlyPayment * 12);
  
  // 25-year savings (simplified)
  const estimatedSavings25Year = estimatedSavingsYear1 * 25 * 0.8; // Rough estimate
  
  // Break-even year (simplified)
  const breakEvenYear = Math.ceil(netCost / estimatedSavingsYear1);
  
  return {
    id: `proposal_${Date.now()}`,
    leadId: input.leadId,
    systemSizeKw: input.systemSizeKw,
    totalCost,
    federalTaxCredit,
    netCost,
    monthlyPayment: Math.round(monthlyPayment),
    estimatedSavingsYear1: Math.round(estimatedSavingsYear1),
    estimatedSavings25Year: Math.round(estimatedSavings25Year),
    breakEvenYear,
    createdAt: new Date(),
  };
}
