// PRIMUS HOME PRO - Google Solar API Service
// Fetches solar site suitability data from Google Maps Platform Solar API
// Documentation: https://developers.google.com/maps/documentation/solar

import { prisma } from '@/lib/db/prisma'

// ============================================================================
// TYPES
// ============================================================================

export interface SolarBuildingInsights {
  name: string
  center: {
    latitude: number
    longitude: number
  }
  imageryDate: {
    year: number
    month: number
    day: number
  }
  imageryQuality: 'HIGH' | 'MEDIUM' | 'LOW'
  regionCode: string
  solarPotential: {
    maxArrayPanelsCount: number
    maxArrayAreaMeters2: number
    maxSunshineHoursPerYear: number
    carbonOffsetFactorKgPerMwh: number
    wholeRoofStats: {
      areaMeters2: number
      sunshineQuantiles: number[]
      groundAreaMeters2: number
    }
    roofSegmentStats: RoofSegment[]
    solarPanelConfigs: SolarPanelConfig[]
    financialAnalyses: FinancialAnalysis[]
  }
}

export interface RoofSegment {
  pitchDegrees: number
  azimuthDegrees: number
  stats: {
    areaMeters2: number
    sunshineQuantiles: number[]
    groundAreaMeters2: number
  }
  center: {
    latitude: number
    longitude: number
  }
  boundingBox: {
    sw: { latitude: number; longitude: number }
    ne: { latitude: number; longitude: number }
  }
  planeHeightAtCenterMeters: number
}

export interface SolarPanelConfig {
  panelsCount: number
  yearlyEnergyDcKwh: number
  roofSegmentSummaries: {
    pitchDegrees: number
    azimuthDegrees: number
    panelsCount: number
    yearlyEnergyDcKwh: number
    segmentIndex: number
  }[]
}

export interface FinancialAnalysis {
  monthlyBill: {
    currencyCode: string
    units: string
  }
  panelConfigIndex: number
  financialDetails: {
    initialAcKwhPerYear: number
    remainingLifetimeUtilityBill: {
      currencyCode: string
      units: string
    }
    federalIncentive: {
      currencyCode: string
      units: string
    }
    stateIncentive: {
      currencyCode: string
      units: string
    }
    utilityIncentive: {
      currencyCode: string
      units: string
    }
    lifetimeSrecTotal: {
      currencyCode: string
      units: string
    }
    costOfElectricityWithoutSolar: {
      currencyCode: string
      units: string
    }
    netMeteringAllowed: boolean
    solarPercentage: number
    percentageExportedToGrid: number
  }
  leasingSavings?: {
    leasesAllowed: boolean
    leasesSupported: boolean
    annualLeasingCost: {
      currencyCode: string
      units: string
    }
    savings: {
      savingsYear1: { currencyCode: string; units: string }
      savingsYear20: { currencyCode: string; units: string }
      savingsLifetime: { currencyCode: string; units: string }
    }
  }
  cashPurchaseSavings?: {
    outOfPocketCost: {
      currencyCode: string
      units: string
    }
    upfrontCost: {
      currencyCode: string
      units: string
    }
    rebateValue: {
      currencyCode: string
      units: string
    }
    paybackYears: number
    savings: {
      savingsYear1: { currencyCode: string; units: string }
      savingsYear20: { currencyCode: string; units: string }
      savingsLifetime: { currencyCode: string; units: string }
    }
  }
  financedPurchaseSavings?: {
    annualLoanPayment: {
      currencyCode: string
      units: string
    }
    rebateValue: {
      currencyCode: string
      units: string
    }
    loanInterestRate: number
    savings: {
      savingsYear1: { currencyCode: string; units: string }
      savingsYear20: { currencyCode: string; units: string }
      savingsLifetime: { currencyCode: string; units: string }
    }
  }
}

export interface SolarEnrichmentResult {
  success: boolean
  leadId: string
  siteSuitability: 'VIABLE' | 'CHALLENGING' | 'NOT_VIABLE'
  maxPanelsCount?: number
  maxSunshineHoursYear?: number
  annualKwhProduction?: number
  systemSizeKW?: number
  estimatedSavingsYear?: number
  error?: string
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const GOOGLE_SOLAR_API_BASE = 'https://solar.googleapis.com/v1'

// Panel configuration defaults (can be customized per region/installer)
const DEFAULT_PANEL_CAPACITY_W = 400 // 400W panels (industry standard 2024)
const DEFAULT_PANEL_HEIGHT_M = 1.65
const DEFAULT_PANEL_WIDTH_M = 0.99

// Suitability thresholds
const VIABLE_MIN_PANELS = 10
const VIABLE_MIN_SUNSHINE_HOURS = 1200
const CHALLENGING_MIN_PANELS = 5
const CHALLENGING_MIN_SUNSHINE_HOURS = 800

// ============================================================================
// MAIN API FUNCTIONS
// ============================================================================

/**
 * Fetch solar building insights from Google Solar API
 * @param address - Full street address for geocoding
 * @returns SolarBuildingInsights or null if request fails
 */
export async function fetchSolarInsights(
  address: string
): Promise<SolarBuildingInsights | null> {
  const apiKey = process.env.GOOGLE_SOLAR_API_KEY

  if (!apiKey) {
    console.error('[SolarAPI] GOOGLE_SOLAR_API_KEY not configured')
    return null
  }

  if (!address || address.trim().length < 5) {
    console.error('[SolarAPI] Invalid address provided')
    return null
  }

  try {
    // First, geocode the address to get coordinates
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()

    if (geocodeData.status !== 'OK' || !geocodeData.results?.[0]?.geometry?.location) {
      console.error('[SolarAPI] Geocoding failed:', geocodeData.status)
      return null
    }

    const { lat, lng } = geocodeData.results[0].geometry.location

    // Now fetch building insights using coordinates
    const buildingInsightsUrl = `${GOOGLE_SOLAR_API_BASE}/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`

    const response = await fetch(buildingInsightsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[SolarAPI] API request failed:', response.status, errorText)
      
      // If HIGH quality not available, try MEDIUM
      if (response.status === 404) {
        console.log('[SolarAPI] Retrying with MEDIUM quality...')
        const mediumUrl = `${GOOGLE_SOLAR_API_BASE}/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=MEDIUM&key=${apiKey}`
        
        const retryResponse = await fetch(mediumUrl)
        if (retryResponse.ok) {
          return await retryResponse.json()
        }
      }
      
      return null
    }

    const data: SolarBuildingInsights = await response.json()
    
    console.log('[SolarAPI] Successfully fetched insights for:', address)
    console.log('[SolarAPI] Max panels:', data.solarPotential?.maxArrayPanelsCount)
    console.log('[SolarAPI] Sunshine hours/year:', data.solarPotential?.maxSunshineHoursPerYear)

    return data
  } catch (error) {
    console.error('[SolarAPI] Error fetching solar insights:', error)
    return null
  }
}

/**
 * Determine site suitability based on solar potential data
 */
export function calculateSiteSuitability(
  insights: SolarBuildingInsights
): 'VIABLE' | 'CHALLENGING' | 'NOT_VIABLE' {
  const maxPanels = insights.solarPotential?.maxArrayPanelsCount || 0
  const sunshineHours = insights.solarPotential?.maxSunshineHoursPerYear || 0

  if (maxPanels >= VIABLE_MIN_PANELS && sunshineHours >= VIABLE_MIN_SUNSHINE_HOURS) {
    return 'VIABLE'
  }

  if (maxPanels >= CHALLENGING_MIN_PANELS && sunshineHours >= CHALLENGING_MIN_SUNSHINE_HOURS) {
    return 'CHALLENGING'
  }

  return 'NOT_VIABLE'
}

/**
 * Extract the best solar panel configuration for a given monthly bill
 */
export function getBestPanelConfig(
  insights: SolarBuildingInsights,
  targetMonthlyBill: number = 150
): SolarPanelConfig | null {
  const configs = insights.solarPotential?.solarPanelConfigs
  if (!configs || configs.length === 0) return null

  // Find config that best matches the target bill offset
  // For now, return the max config (most panels)
  return configs[configs.length - 1] || null
}

/**
 * Calculate system size in kW from panel count
 */
export function calculateSystemSizeKW(
  panelCount: number,
  panelCapacityW: number = DEFAULT_PANEL_CAPACITY_W
): number {
  return (panelCount * panelCapacityW) / 1000
}

// ============================================================================
// LEAD ENRICHMENT FUNCTION
// ============================================================================

/**
 * Enrich a lead with solar site suitability data
 * Called automatically when a new lead is created with an address
 * Contract v1.0: Uses SolarQualification model
 */
export async function enrichLeadWithSolarData(
  leadId: string,
  address: string
): Promise<SolarEnrichmentResult> {
  console.log(`[SolarEnrichment] Starting enrichment for lead ${leadId}`)

  try {
    // Fetch solar insights from Google API
    const insights = await fetchSolarInsights(address)

    if (!insights) {
      return {
        success: false,
        leadId,
        siteSuitability: 'NOT_VIABLE',
        error: 'Failed to fetch solar insights from API',
      }
    }

    // Calculate suitability
    const siteSuitability = calculateSiteSuitability(insights)
    const bestConfig = getBestPanelConfig(insights)
    
    // Extract key metrics
    const maxPanelsCount = insights.solarPotential?.maxArrayPanelsCount || 0
    const maxSunshineHoursYear = insights.solarPotential?.maxSunshineHoursPerYear || 0
    const annualKwhProduction = bestConfig?.yearlyEnergyDcKwh || 0
    const systemSizeKW = calculateSystemSizeKW(bestConfig?.panelsCount || maxPanelsCount)
    
    // Get roof area and shading info
    const roofAreaSqM = insights.solarPotential?.wholeRoofStats?.areaMeters2 || 0
    const usableArea = insights.solarPotential?.maxArrayAreaMeters2 || 0
    const shadingPercent = roofAreaSqM > 0 ? ((roofAreaSqM - usableArea) / roofAreaSqM) * 100 : 100

    // Calculate solar score (0-100)
    const roofViable = siteSuitability === 'VIABLE'
    const solarScore = calculateSolarScore(insights, siteSuitability)
    
    // Determine confidence level
    const confidence = insights.imageryQuality === 'HIGH' ? 'high' : 
                       insights.imageryQuality === 'MEDIUM' ? 'medium' : 'low'

    // Contract v1.0: Create SolarQualification record (upsert to handle re-runs)
    await prisma.solarQualification.upsert({
      where: { leadId },
      create: {
        leadId,
        roofAreaSqM,
        sunshineHoursYear: maxSunshineHoursYear,
        shadingPercent,
        roofViable,
        solarScore,
        confidence,
        rawApiData: insights as unknown as object,
      },
      update: {
        roofAreaSqM,
        sunshineHoursYear: maxSunshineHoursYear,
        shadingPercent,
        roofViable,
        solarScore,
        confidence,
        rawApiData: insights as unknown as object,
      },
    })

    // Contract v1.0: Log automation event (no LeadEvent model)
    await prisma.automationEvent.create({
      data: {
        leadId,
        eventType: 'solar_analysis_complete',
        triggeredAt: new Date(),
        handled: false,
        metadata: {
          siteSuitability,
          maxPanelsCount,
          systemSizeKW,
          solarScore,
          roofViable,
        },
      },
    })

    console.log(`[SolarEnrichment] Successfully enriched lead ${leadId}: ${siteSuitability}`)

    return {
      success: true,
      leadId,
      siteSuitability,
      maxPanelsCount,
      maxSunshineHoursYear,
      annualKwhProduction,
      systemSizeKW,
    }
  } catch (error) {
    console.error(`[SolarEnrichment] Error enriching lead ${leadId}:`, error)
    
    // Log failed attempt
    await prisma.automationEvent.create({
      data: {
        leadId,
        eventType: 'solar_analysis_failed',
        triggeredAt: new Date(),
        handled: false,
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      },
    }).catch(() => {})

    return {
      success: false,
      leadId,
      siteSuitability: 'NOT_VIABLE',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Calculate a 0-100 solar score from insights
 */
type SiteSuitability = 'VIABLE' | 'CHALLENGING' | 'NOT_VIABLE'

function calculateSolarScore(
  insights: SolarBuildingInsights,
  siteSuitability: SiteSuitability
): number {
  // Base score from suitability
  const baseScores: Record<SiteSuitability, number> = {
    'VIABLE': 85,
    'CHALLENGING': 50,
    'NOT_VIABLE': 20,
  }
  let score = baseScores[siteSuitability]

  // Adjust based on sunshine hours
  const sunshineHours = insights.solarPotential?.maxSunshineHoursPerYear || 0
  if (sunshineHours > 1500) score = Math.min(100, score + 5)
  if (sunshineHours < 1200) score = Math.max(0, score - 5)

  // Adjust based on imagery quality
  if (insights.imageryQuality === 'HIGH') score = Math.min(100, score + 3)
  if (insights.imageryQuality === 'LOW') score = Math.max(0, score - 10)

  return Math.round(score)
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if Solar API is properly configured
 */
export function isSolarApiConfigured(): boolean {
  return !!process.env.GOOGLE_SOLAR_API_KEY
}

/**
 * Get a summary of solar potential for display
 */
export function getSolarPotentialSummary(
  siteSuitability: string,
  maxPanels: number,
  systemSizeKW: number
): string {
  switch (siteSuitability) {
    case 'VIABLE':
      return `Excellent solar potential! Up to ${maxPanels} panels (${systemSizeKW.toFixed(1)}kW system) recommended.`
    case 'CHALLENGING':
      return `Moderate solar potential. ${maxPanels} panels possible, may require optimization.`
    case 'NOT_VIABLE':
      return `Limited solar potential at this location. Consider alternative options.`
    default:
      return 'Solar analysis pending.'
  }
}
