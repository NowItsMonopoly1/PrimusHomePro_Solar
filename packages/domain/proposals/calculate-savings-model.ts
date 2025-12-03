// DOMAIN: Proposals - Calculate Savings Model
// Pure business logic - NO DB, NO API, NO side effects

export interface QualificationInput {
  estAnnualProductionKwh: number;
}

export interface PricingConfig {
  systemCostPerKw: number;
  loanApr: number;
  loanTermYears: number;
  ppaRate: number;
  utilityRate: number;
}

export interface SavingsModel {
  estSystemSizeKw: number;
  grossCost: number;
  itcCredit: number;
  netCostAfterIncentives: number;
  estMonthlyPayment: number;
  estMonthlySavings: number;
}

/**
 * PMT formula for loan payment calculation
 * Pure math function
 */
function calculatePMT(rate: number, nper: number, pv: number): number {
  if (rate === 0) return pv / nper;
  return (rate * pv) / (1 - Math.pow(1 + rate, -nper));
}

/**
 * Calculate savings model for a solar system
 * Pure function - deterministic financial calculations
 */
export function calculateSavingsModel(
  qualification: QualificationInput,
  config: PricingConfig
): SavingsModel {
  // System size = annual production / 1500 (typical kWh per kW capacity)
  const estSystemSizeKw = qualification.estAnnualProductionKwh / 1500;

  // Gross cost based on system size
  const grossCost = estSystemSizeKw * config.systemCostPerKw;

  // Federal ITC credit (30%)
  const itcCredit = grossCost * 0.30;

  // Net cost after incentives
  const netCostAfterIncentives = grossCost - itcCredit;

  // Monthly payment using PMT formula
  const monthlyRate = config.loanApr / 12;
  const totalMonths = config.loanTermYears * 12;
  const estMonthlyPayment = Math.round(
    calculatePMT(monthlyRate, totalMonths, netCostAfterIncentives)
  );

  // Monthly savings estimate
  // (utility rate × system kW × 30 days avg production) - payment
  const monthlyProduction = estSystemSizeKw * 30 * 4; // ~4 kWh/day per kW
  const utilitySavings = config.utilityRate * monthlyProduction;
  const estMonthlySavings = Math.round(utilitySavings - estMonthlyPayment);

  return {
    estSystemSizeKw: Math.round(estSystemSizeKw * 10) / 10,
    grossCost: Math.round(grossCost),
    itcCredit: Math.round(itcCredit),
    netCostAfterIncentives: Math.round(netCostAfterIncentives),
    estMonthlyPayment,
    estMonthlySavings,
  };
}
