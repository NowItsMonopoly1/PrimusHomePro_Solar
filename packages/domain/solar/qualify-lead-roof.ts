// DOMAIN: Solar - Qualify Lead Roof
// Pure business logic - NO DB, NO API, NO side effects

import { computeSolarScore, type RawSolarData } from './compute-solar-score';

export interface SolarQualification {
  leadId: string;
  roofViable: boolean;
  solarScore: number;
  shadingScore: number;
  viabilityReason: string;
  estAnnualProductionKwh: number;
}

/**
 * Qualify a lead's roof for solar viability
 * Pure function - receives data, applies business rules, returns result
 */
export function qualifyLeadRoof(
  leadId: string,
  rawSolarData: RawSolarData
): SolarQualification {
  const result = computeSolarScore(rawSolarData);
  const shadingMultiplier = 1 - Math.min(100, Math.max(0, rawSolarData.shadingPercent)) / 100;
  const productionFactor = Math.max(0, rawSolarData.irradianceKwhM2) * 0.18; // approx kWh per m² at 18% efficiency
  const estAnnualProductionKwh = Math.max(
    0,
    Math.round(rawSolarData.roofAreaM2 * productionFactor * Math.max(0, shadingMultiplier))
  );

  return {
    leadId,
    roofViable: result.roofViable,
    solarScore: result.solarScore,
    shadingScore: result.shadingScore,
    viabilityReason: result.viabilityReason,
    estAnnualProductionKwh,
  };
}
