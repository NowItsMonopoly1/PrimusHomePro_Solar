// DOMAIN: Solar - Compute Solar Score
// Pure business logic - scoring algorithm

export interface SolarScoreInput {
  roofAreaSqM: number;
  sunshineHoursYear: number;
  shadingPercent: number;
  roofPitchDegrees: number;
  azimuthDegrees: number; // 180 = due south (optimal)
}

/**
 * Compute solar viability score (0-100)
 * 
 * Scoring factors:
 * - Roof area (30%)
 * - Sunshine hours (30%)
 * - Shading (20%)
 * - Roof orientation (20%)
 */
export function computeSolarScore(input: SolarScoreInput): number {
  // Area score: 20m² = 0, 100m² = 100
  const areaScore = Math.min(100, (input.roofAreaSqM / 100) * 100);
  
  // Sunshine score: 1000hrs = 0, 2000hrs = 100
  const sunshineScore = Math.min(100, ((input.sunshineHoursYear - 1000) / 1000) * 100);
  
  // Shading score: 0% = 100, 50% = 0
  const shadingScore = Math.max(0, 100 - (input.shadingPercent * 2));
  
  // Orientation score: 180° (south) = 100, 90°/270° = 50, 0°/360° (north) = 0
  const orientationDelta = Math.abs(input.azimuthDegrees - 180);
  const orientationScore = Math.max(0, 100 - (orientationDelta / 1.8));
  
  const totalScore = 
    areaScore * 0.3 +
    sunshineScore * 0.3 +
    shadingScore * 0.2 +
    orientationScore * 0.2;
  
  return Math.round(totalScore);
}
