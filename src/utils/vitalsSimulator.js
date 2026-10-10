// ============================================================================
// Simulated IoT vitals-monitoring device
// ----------------------------------------------------------------------------
// Stands in for a real connected device (pulse oximeter / BP cuff / thermometer)
// at a health camp or PHC. It generates a plausible reading — mostly normal,
// occasionally abnormal, so the demo can show the urgency engine reacting to
// MACHINE data exactly the same way it reacts to patient-typed symptoms.
//
// PRODUCTION NOTE: to use a real device, replace generateVitalsReading() with
// whatever reads from Web Bluetooth / a vendor SDK, but keep the same return
// shape — everything downstream (scanVitals, the UI) stays unchanged.
// ============================================================================

function randomBetween(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10
}

/**
 * Generates one simulated reading.
 * `bias`: 'normal' | 'random' (default) — 'random' occasionally produces an
 * abnormal reading so the demo can show the urgency bump in action.
 */
export function generateVitalsReading(bias = 'random') {
  const abnormalRoll = bias === 'random' && Math.random() < 0.35

  const heartRate = abnormalRoll
    ? (Math.random() < 0.5 ? randomBetween(130, 150) : randomBetween(35, 45))
    : randomBetween(68, 96)

  const spo2 = abnormalRoll && Math.random() < 0.6
    ? randomBetween(84, 91)
    : randomBetween(95, 99)

  const tempF = abnormalRoll && Math.random() < 0.4
    ? randomBetween(103, 105)
    : randomBetween(97.4, 99.6)

  const systolic = abnormalRoll && Math.random() < 0.3 ? randomBetween(180, 195) : randomBetween(105, 128)
  const diastolic = systolic >= 180 ? randomBetween(120, 128) : randomBetween(68, 84)

  return {
    heartRate: Math.round(heartRate),
    spo2: Math.round(spo2),
    tempF: Math.round(tempF * 10) / 10,
    systolic: Math.round(systolic),
    diastolic: Math.round(diastolic),
    capturedAt: new Date().toISOString(),
    source: 'Simulated vitals-monitoring device (demo)',
  }
}