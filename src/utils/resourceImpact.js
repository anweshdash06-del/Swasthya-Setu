// ============================================================================
// Resource & Sustainability Impact ("Connecting the Planet")
// ----------------------------------------------------------------------------
// Turns data the app already has (urgency category + referral status) into a
// visible estimate of travel/fuel avoided when a case is safely resolved at
// the local facility instead of requiring a trip to a larger hospital.
//
// This is intentionally a transparent, editable estimate — not a precise
// measurement — and is labelled as such everywhere it's shown. The point is
// to make an already-true benefit of smart local triage (fewer unnecessary
// trips) visible and demo-able, not to fabricate a new capability.
// ============================================================================

// Approximate one-way road distance (km) from each known facility to the
// nearest higher-level referral hospital. Add more facilities here as needed;
// unlisted facilities fall back to AVERAGE_DISTANCE_KM.
export const FACILITY_DISTANCE_KM = {
  'PHC Balasore': 22,
  'Public Health Camp - Cuttack': 12,
  'Campus Health Center, BPUT': 15,
  'Industrial Estate Clinic, Rourkela': 28,
  'Company Clinic, Bhubaneswar': 9,
}
export const AVERAGE_DISTANCE_KM = 18

// Rough, widely-cited planning figures for a two-wheeler/shared-auto trip —
// intentionally simple so the estimate stays easy to explain in a demo.
const FUEL_LITRES_PER_KM = 0.035 // ~28 km/l two-wheeler
const CO2_KG_PER_LITRE_PETROL = 2.31

/**
 * Computes the estimated travel avoided by resolving cases locally instead
 * of referring every case to a larger facility "just in case".
 * `resolvedLocally` = cases that completed review without needing a referral
 * (i.e. the local health worker + AI triage judged it safe to handle on-site).
 */
export function computeResourceImpact(cases) {
  const active = cases.filter((c) => c.status !== 'draft')
  const resolvedLocally = active.filter((c) => c.status === 'approved')
  const referred = active.filter((c) => c.status === 'referred')

  let kmAvoided = 0
  resolvedLocally.forEach((c) => {
    const dist = FACILITY_DISTANCE_KM[c.patient?.facility] ?? AVERAGE_DISTANCE_KM
    kmAvoided += dist * 2 // round trip
  })

  const fuelLitresSaved = kmAvoided * FUEL_LITRES_PER_KM
  const co2KgAvoided = fuelLitresSaved * CO2_KG_PER_LITRE_PETROL

  return {
    resolvedLocallyCount: resolvedLocally.length,
    referredCount: referred.length,
    kmAvoided: Math.round(kmAvoided),
    fuelLitresSaved: Math.round(fuelLitresSaved * 10) / 10,
    co2KgAvoided: Math.round(co2KgAvoided * 10) / 10,
    paperlessRecords: active.length,
  }
}