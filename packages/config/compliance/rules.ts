// CONFIG: Compliance Rules
// Forbidden claims and regulatory compliance

/**
 * Forbidden marketing claims per Master Spec v2.0
 * 
 * CRITICAL: These claims violate FTC/state regulations
 * Must be flagged in all customer-facing content
 */
export const FORBIDDEN_CLAIMS = [
  'free solar',
  'no cost solar',
  '100% guaranteed offset',
  'you will never pay for power again',
  'eliminate your electric bill',
  'government pays for it',
  'no money down',
  'zero out of pocket',
];

/**
 * Check if text contains forbidden claims
 * 
 * Used to validate:
 * - Proposal PDFs
 * - Marketing emails
 * - SMS messages
 * - Landing page content
 */
export function containsForbiddenClaim(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_CLAIMS.some((phrase) => lower.includes(phrase));
}

/**
 * Extract forbidden claims from text
 * 
 * Returns array of detected forbidden phrases
 */
export function extractForbiddenClaims(text: string): string[] {
  const lower = text.toLowerCase();
  return FORBIDDEN_CLAIMS.filter((phrase) => lower.includes(phrase));
}
