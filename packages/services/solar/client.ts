// SERVICE: Solar API Client
// External integration - Google Solar API

export interface SolarApiInput {
  address: string;
}

export interface SolarApiResult {
  roofAreaSqM: number;
  sunshineHoursYear: number;
  shadingPercent: number;
  roofPitchDegrees: number;
  azimuthDegrees: number;
  maxPanelCount: number;
  rawApiResponse: unknown;
}

/**
 * Fetch solar data from Google Solar API
 * 
 * EXTERNAL INTEGRATION - This calls Google Maps Platform Solar API
 * Domain logic should NOT be in this file
 */
export async function fetchSolarData(input: SolarApiInput): Promise<SolarApiResult> {
  // TODO: Implement Google Solar API call
  // API Key: process.env.GOOGLE_SOLAR_API_KEY
  
  // STUB implementation
  return {
    roofAreaSqM: 50,
    sunshineHoursYear: 1500,
    shadingPercent: 15,
    roofPitchDegrees: 25,
    azimuthDegrees: 180,
    maxPanelCount: 12,
    rawApiResponse: {},
  };
}
