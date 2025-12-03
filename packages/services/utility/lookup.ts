// SERVICE: Utility Rate Lookup
// External integration - Utility API or Database

export interface UtilityRateResult {
  rate: number;
  source: string;
}

// Simple static lookup for common regions (Example)
const RATE_TABLE: Record<string, number> = {
  '85001': 0.14, // Phoenix
  '90210': 0.24, // Beverly Hills
  '10001': 0.22, // NYC
  '33101': 0.12, // Miami
  '75001': 0.11, // Dallas
};

const DEFAULT_RATE = 0.16; // National average approx

/**
 * Get utility rate for a zip code
 * Pure service - lookup or fetch
 */
export function getUtilityRate(zipCode: string): UtilityRateResult {
  // In production: Fetch from NREL OpenEI API or internal DB
  // const url = `https://api.openei.org/utility_rates?zip=${zipCode}`;
  
  const rate = RATE_TABLE[zipCode] || DEFAULT_RATE;
  
  return {
    rate,
    source: RATE_TABLE[zipCode] ? 'Regional Table' : 'National Average',
  };
}
