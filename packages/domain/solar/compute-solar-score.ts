// DOMAIN: Solar - Compute Solar Score
// Pure business logic - NO DB, NO API, NO side effects

export interface RawSolarData {
  roofAreaM2: number;
  irradianceKwhM2: number;
  shadingPercent: number;
}

export interface SolarScoreResult {
  solarScore: number;       // 0-100
  shadingScore: number;     // 0-100
  roofViable: boolean;
  viabilityReason: string;
}

/**
 * Compute solar viability score (0-100)
 * Pure function - deterministic business logic only
 */
export function computeSolarScore(data: RawSolarData): SolarScoreResult {
  // Rule: Minimum roof area is 20 m²
  if (data.roofAreaM2 < 20) {
    return {
      solarScore: 0,
      shadingScore: 100 - data.shadingPercent,
      roofViable: false,
      viabilityReason: 'Insufficient roof area (minimum 20 m²)',
    };
  }

  // Calculate shading score (inverse of shading percent)
  const shadingScore = Math.max(0, Math.min(100, 100 - data.shadingPercent));

  // Weighted solar score formula
  // Area (40%) + Irradiance (40%) + Shading (20%)
  const normalizedArea = Math.min(100, (data.roofAreaM2 / 100) * 100);
  const normalizedIrradiance = Math.min(100, (data.irradianceKwhM2 / 2000) * 100);
  
  const rawScore = 
    normalizedArea * 0.4 +
    normalizedIrradiance * 0.4 +
    shadingScore * 0.2;

  const solarScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  // Viability rules: area >= 20, score >= 30, shading <= 50%
  const roofViable = 
    data.roofAreaM2 >= 20 &&
    solarScore >= 30 &&
    data.shadingPercent <= 50;

  const viabilityReason = !roofViable
    ? data.shadingPercent > 50
      ? 'Excessive shading (maximum 50%)'
      : solarScore < 30
        ? 'Solar score too low (minimum 30)'
        : 'Insufficient roof area'
    : 'Roof meets all viability criteria';

  return { solarScore, shadingScore, roofViable, viabilityReason };
}
