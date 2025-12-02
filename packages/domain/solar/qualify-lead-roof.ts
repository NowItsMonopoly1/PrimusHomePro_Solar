// DOMAIN: Solar - Qualify Lead Roof
// Pure business logic - determines if a roof is viable for solar

export interface SolarQualification {
  leadId: string;
  roofViable: boolean;
  solarScore: number; // 0-100
  shadingScore: number; // 0-100 (lower is better)
  recommendedSystemSizeKw: number | null;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Qualify a lead's roof for solar viability
 * 
 * This function receives pre-fetched satellite data from @services/solar
 * and applies business logic to determine viability
 * 
 * Business Rules (per Master Spec v2.0):
 * - Minimum roof area: 20 m²
 * - Minimum panel count: 8 panels
 * - Minimum sunshine: 1000 hrs/year
 * - Shading threshold: < 30% shading
 */
export async function qualifyLeadRoof(leadId: string): Promise<SolarQualification> {
  // TODO: Fetch satellite data via @services/solar
  // TODO: Apply business rules
  // TODO: Return qualification result
  
  // STUB implementation
  return {
    leadId,
    roofViable: true,
    solarScore: 80,
    shadingScore: 15,
    recommendedSystemSizeKw: 8.5,
    confidence: 'medium',
  };
}
