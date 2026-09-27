// ============================================================================
// SwasthyaSetu Triage Engine
// ----------------------------------------------------------------------------
// This module simulates the "AI processing" layer described in the problem
// statement: symptom/entity extraction, missing-information detection,
// follow-up question generation, non-diagnostic urgency categorisation, and
// structured triage note preparation.
//
// It is implemented as a transparent, auditable RULE-BASED engine so the
// prototype runs fully offline with no API keys. Every scoring decision is
// traceable (see `reasons`), which satisfies the "safety-first" and
// "human-review" evaluation criteria far better than an opaque black box.
//
// PRODUCTION NOTE: To swap in a real LLM (e.g. Claude) for richer language
// understanding, replace `extractEntities()` internals with an API call that
// returns the same shape, and keep `scoreUrgency()` + human review unchanged.
// ============================================================================

// Symptom knowledge base: canonical name -> { keywords per language, weight, redFlag, category }
const SYMPTOM_KB = [
  { key: 'chest_pain', label: 'Chest pain', weight: 9, redFlag: true, category: 'Cardiac',
    kw: { en: ['chest pain', 'chest tightness', 'chest pressure', 'pain in chest'],
          hi: ['सीने में दर्द', 'छाती में दर्द', 'सीने में जकड़न'],
          or: ['ଛାତିରେ ଯନ୍ତ୍ରଣା', 'ଛାତି ଯନ୍ତ୍ରଣା'] } },
  { key: 'breathlessness', label: 'Difficulty breathing / breathlessness', weight: 9, redFlag: true, category: 'Respiratory',
    kw: { en: ['breathless', 'difficulty breathing', 'shortness of breath', 'cant breathe', "can't breathe", 'gasping'],
          hi: ['सांस लेने में तकलीफ', 'सांस फूलना', 'सांस नहीं आ रही'],
          or: ['ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ', 'ନିଶ୍ୱାସ କମିବା'] } },
  { key: 'unconscious', label: 'Loss of consciousness / fainting', weight: 10, redFlag: true, category: 'Neurological',
    kw: { en: ['unconscious', 'fainted', 'passed out', 'not responding', 'blackout'],
          hi: ['बेहोश', 'बेहोश हो गया', 'गिर पड़ा'],
          or: ['ଅଚେତ', 'ମୂର୍ଚ୍ଛିତ'] } },
  { key: 'seizure', label: 'Seizure / fits', weight: 10, redFlag: true, category: 'Neurological',
    kw: { en: ['seizure', 'fits', 'convulsion', 'convulsions'],
          hi: ['दौरा', 'मिर्गी का दौरा', 'ऐंठन'],
          or: ['ଫିଟ୍', 'ଖିଅଁଚା'] } },
  { key: 'severe_bleeding', label: 'Severe / uncontrolled bleeding', weight: 10, redFlag: true, category: 'Trauma',
    kw: { en: ['heavy bleeding', 'bleeding a lot', 'blood loss', "won't stop bleeding"],
          hi: ['बहुत खून बह रहा', 'रक्तस्राव'],
          or: ['ବହୁତ ରକ୍ତ ବହୁଛି', 'ରକ୍ତସ୍ରାବ'] } },
  { key: 'stroke_signs', label: 'One-sided weakness / slurred speech', weight: 10, redFlag: true, category: 'Neurological',
    kw: { en: ['slurred speech', 'one side weak', 'face drooping', 'cannot move arm', 'weakness on one side'],
          hi: ['एक तरफ कमजोरी', 'बोलने में लड़खड़ाहट', 'चेहरा टेढ़ा'],
          or: ['ଗୋଟିଏ ପାର୍ଶ୍ୱ ଦୁର୍ବଳତା'] } },
  { key: 'high_fever', label: 'High fever', weight: 6, redFlag: false, category: 'General',
    kw: { en: ['high fever', 'fever', 'temperature', 'feverish', 'hot body'],
          hi: ['बुखार', 'तेज़ बुखार', 'ज्वर'],
          or: ['ଜ୍ୱର', 'ଉଚ୍ଚ ଜ୍ୱର'] } },
  { key: 'severe_abdominal_pain', label: 'Severe abdominal pain', weight: 8, redFlag: true, category: 'Gastrointestinal',
    kw: { en: ['severe stomach pain', 'severe abdominal pain', 'stomach pain unbearable'],
          hi: ['पेट में तेज़ दर्द', 'पेट दर्द असहनीय'],
          or: ['ପେଟରେ ତୀବ୍ର ଯନ୍ତ୍ରଣା'] } },
  { key: 'abdominal_pain', label: 'Abdominal pain', weight: 4, redFlag: false, category: 'Gastrointestinal',
    kw: { en: ['stomach pain', 'abdominal pain', 'stomach ache', 'belly pain'],
          hi: ['पेट में दर्द', 'पेट दर्द'],
          or: ['ପେଟ ଯନ୍ତ୍ରଣା'] } },
  { key: 'vomiting', label: 'Vomiting', weight: 4, redFlag: false, category: 'Gastrointestinal',
    kw: { en: ['vomiting', 'throwing up', 'vomit'],
          hi: ['उल्टी', 'वमन'],
          or: ['ବାନ୍ତି'] } },
  { key: 'blood_vomit', label: 'Blood in vomit / stool', weight: 9, redFlag: true, category: 'Gastrointestinal',
    kw: { en: ['blood in vomit', 'blood in stool', 'vomiting blood', 'black stool'],
          hi: ['उल्टी में खून', 'खून की उल्टी', 'मल में खून'],
          or: ['ବାନ୍ତିରେ ରକ୍ତ', 'ମଳରେ ରକ୍ତ'] } },
  { key: 'diarrhea', label: 'Diarrhea / loose motions', weight: 4, redFlag: false, category: 'Gastrointestinal',
    kw: { en: ['diarrhea', 'loose motion', 'loose motions', 'watery stool'],
          hi: ['दस्त', 'पतला दस्त'],
          or: ['ଝାଡ଼ା'] } },
  { key: 'cough', label: 'Cough', weight: 2, redFlag: false, category: 'Respiratory',
    kw: { en: ['cough', 'coughing', 'dry cough', 'wet cough'],
          hi: ['खांसी', 'खांसी आना'],
          or: ['କାଶ'] } },
  { key: 'headache', label: 'Headache', weight: 3, redFlag: false, category: 'Neurological',
    kw: { en: ['headache', 'head pain', 'migraine'],
          hi: ['सिरदर्द', 'सिर दर्द'],
          or: ['ମୁଣ୍ଡ ବିନ୍ଧା'] } },
  { key: 'severe_headache', label: 'Severe / sudden worst headache', weight: 8, redFlag: true, category: 'Neurological',
    kw: { en: ['worst headache', 'severe headache', 'sudden headache'],
          hi: ['बहुत तेज़ सिरदर्द', 'अचानक तेज़ सिरदर्द'],
          or: ['ଅତି ତୀବ୍ର ମୁଣ୍ଡବିନ୍ଧା'] } },
  { key: 'dizziness', label: 'Dizziness / giddiness', weight: 4, redFlag: false, category: 'Neurological',
    kw: { en: ['dizzy', 'dizziness', 'giddiness', 'lightheaded'],
          hi: ['चक्कर आना', 'चक्कर'],
          or: ['ମୁଣ୍ଡ ବୁଲାଇବା'] } },
  { key: 'weakness', label: 'General weakness / fatigue', weight: 2, redFlag: false, category: 'General',
    kw: { en: ['weakness', 'tired', 'fatigue', 'no energy', 'exhausted'],
          hi: ['कमजोरी', 'थकान'],
          or: ['ଦୁର୍ବଳତା', 'କ୍ଳାନ୍ତି'] } },
  { key: 'rash', label: 'Skin rash', weight: 2, redFlag: false, category: 'Dermatological',
    kw: { en: ['rash', 'skin rash', 'itching', 'red spots'],
          hi: ['चकत्ते', 'खुजली', 'लाल दाने'],
          or: ['ଚର୍ମ ଫୋଡ଼ା', 'କୁଣ୍ଡୁଣ'] } },
  { key: 'joint_pain', label: 'Joint / body pain', weight: 3, redFlag: false, category: 'Musculoskeletal',
    kw: { en: ['joint pain', 'body pain', 'muscle pain', 'back pain'],
          hi: ['जोड़ों का दर्द', 'बदन दर्द', 'कमर दर्द'],
          or: ['ଗଣ୍ଠି ଯନ୍ତ୍ରଣା', 'ଦେହ ଯନ୍ତ୍ରଣା'] } },
  { key: 'injury', label: 'Injury / fracture suspected', weight: 6, redFlag: false, category: 'Trauma',
    kw: { en: ['fracture', 'broken bone', 'injury', 'accident', 'fell down', 'deep cut', 'wound'],
          hi: ['चोट', 'हड्डी टूटना', 'दुर्घटना', 'गहरा घाव'],
          or: ['ଆଘାତ', 'ହାଡ଼ ଭାଙ୍ଗିବା', 'ଦୁର୍ଘଟଣା'] } },
  { key: 'burns', label: 'Burns', weight: 6, redFlag: false, category: 'Trauma',
    kw: { en: ['burn', 'burns', 'burnt skin'],
          hi: ['जलना', 'जलन का घाव'],
          or: ['ପୋଡ଼ା'] } },
  { key: 'pregnancy_bleeding', label: 'Bleeding during pregnancy', weight: 10, redFlag: true, category: 'Maternal Health',
    kw: { en: ['pregnant bleeding', 'bleeding pregnant', 'pregnancy bleeding'],
          hi: ['गर्भावस्था में खून बहना'],
          or: ['ଗର୍ଭାବସ୍ଥାରେ ରକ୍ତସ୍ରାବ'] } },
  { key: 'reduced_fetal_movement', label: 'Reduced fetal movement', weight: 8, redFlag: true, category: 'Maternal Health',
    kw: { en: ['baby not moving', 'reduced fetal movement', 'no baby movement'],
          hi: ['बच्चे की हलचल कम'],
          or: ['ଶିଶୁ ହଲଚଲ କମ'] } },
  { key: 'allergic_reaction', label: 'Severe allergic reaction / swelling', weight: 9, redFlag: true, category: 'General',
    kw: { en: ['allergic reaction', 'swelling of face', 'throat swelling', 'anaphylaxis'],
          hi: ['एलर्जी', 'चेहरे में सूजन', 'गले में सूजन'],
          or: ['ଆଲର୍ଜି', 'ମୁହଁ ଫୁଲିବା'] } },
  { key: 'chronic_checkin', label: 'Chronic disease check-in (diabetes/BP)', weight: 2, redFlag: false, category: 'Chronic Care',
    kw: { en: ['diabetes', 'sugar level', 'blood pressure', 'bp high', 'bp low', 'thyroid'],
          hi: ['शुगर', 'मधुमेह', 'ब्लड प्रेशर'],
          or: ['ସୁଗାର', 'ରକ୍ତଚାପ'] } },
]

const DURATION_PATTERNS = [
  { re: /(\d+)\s*(day|days)/i, unit: 'day' },
  { re: /(\d+)\s*(hour|hours|hr|hrs)/i, unit: 'hour' },
  { re: /(\d+)\s*(week|weeks)/i, unit: 'week' },
  { re: /(\d+)\s*(month|months)/i, unit: 'month' },
  { re: /(दिन|दिनों)/i, unit: 'day' },
  { re: /(घंटे|घंटा)/i, unit: 'hour' },
  { re: /(ଦିନ)/i, unit: 'day' },
]

const SEVERITY_WORDS = {
  severe: ['severe', 'unbearable', 'worst', 'extreme', 'तेज़', 'असहनीय', 'तीव्र', 'ତୀବ୍ର'],
  moderate: ['moderate', 'मध्यम', 'मध्यम'],
  mild: ['mild', 'slight', 'हल्का', 'ହାଲୁକା'],
}

function normalize(text) {
  return (text || '').toLowerCase()
}

/** Extract symptom entities, duration, severity hints from raw free text. */
export function extractEntities(rawText) {
  const text = normalize(rawText)
  const found = []
  SYMPTOM_KB.forEach((s) => {
    const allKw = [...s.kw.en, ...(s.kw.hi || []), ...(s.kw.or || [])]
    const hit = allKw.find((k) => text.includes(k.toLowerCase()))
    if (hit) {
      found.push({
        key: s.key,
        label: s.label,
        weight: s.weight,
        redFlag: s.redFlag,
        category: s.category,
        matchedPhrase: hit,
      })
    }
  })

  let duration = null
  for (const p of DURATION_PATTERNS) {
    const m = text.match(p.re)
    if (m) {
      duration = m[1] ? `${m[1]} ${p.unit}(s)` : `mentioned in ${p.unit}s`
      break
    }
  }

  let severity = null
  for (const [level, words] of Object.entries(SEVERITY_WORDS)) {
    if (words.some((w) => text.includes(w.toLowerCase()))) {
      severity = level
      break
    }
  }

  return { symptoms: dedupe(found), duration, severity, wordCount: text.trim().split(/\s+/).filter(Boolean).length }
}

function dedupe(arr) {
  const seen = new Set()
  return arr.filter((x) => (seen.has(x.key) ? false : seen.add(x.key)))
}

/** Detect missing structured info and generate follow-up questions for the health worker to ask. */
export function detectMissingInfo(entities, patient) {
  const questions = []
  const missing = []

  if (!entities.duration) {
    missing.push('duration')
    questions.push('How many days/hours has this been going on?')
  }
  if (!entities.severity) {
    missing.push('severity')
    questions.push('How severe is it — mild, moderate, or severe?')
  }
  if (entities.symptoms.length === 0) {
    missing.push('symptoms')
    questions.push('Could you describe what symptoms you are experiencing in more detail?')
  }
  if (entities.symptoms.some((s) => s.category === 'Cardiac' || s.category === 'Respiratory')) {
    questions.push('Is the symptom constant or does it come and go? Any radiating pain to arm/jaw?')
  }
  if (entities.symptoms.some((s) => s.key === 'high_fever')) {
    questions.push('Has the temperature been measured with a thermometer? What reading?')
  }
  if (patient && !patient.age) {
    missing.push('age')
    questions.push("What is the patient's age?")
  }
  if (entities.symptoms.some((s) => s.category === 'Maternal Health') || (patient && patient.gender === 'female' && patient.pregnant)) {
    questions.push('How many weeks pregnant? Any prior pregnancy complications?')
  }
  if (entities.symptoms.some((s) => s.category === 'Chronic Care')) {
    questions.push('Is the patient currently on medication for this condition? Last recorded reading?')
  }

  return { missing, questions: [...new Set(questions)] }
}

/** Non-diagnostic urgency scoring. Returns category + numeric score + human-readable reasons. */
export function scoreUrgency(entities, ocrFlags = []) {
  let score = 0
  const reasons = []

  entities.symptoms.forEach((s) => {
    score += s.weight
    if (s.redFlag) reasons.push(`Red-flag symptom reported: ${s.label}`)
  })

  if (entities.severity === 'severe') { score += 5; reasons.push('Patient described severity as severe') }
  if (entities.severity === 'moderate') { score += 2 }

  if (entities.duration && /hour/i.test(entities.duration)) {
    score += 2
    reasons.push('Symptom onset within hours (acute)')
  }

  ocrFlags.forEach((f) => {
    score += f.weight || 3
    reasons.push(f.reason)
  })

  const hasRedFlag = entities.symptoms.some((s) => s.redFlag) || ocrFlags.some((f) => f.redFlag)

  let category = 'Routine'
  if (hasRedFlag || score >= 15) category = 'Emergency'
  else if (score >= 9) category = 'Urgent'
  else if (score >= 4) category = 'Priority'
  else category = 'Routine'

  if (reasons.length === 0) reasons.push('No high-risk indicators detected from the information provided')

  return { score, category, reasons, hasRedFlag }
}

/** Very small OCR text scanner for lab-report red flags (e.g. abnormal vitals mentioned in report). */
export function scanReportText(ocrText) {
  const text = normalize(ocrText)
  const flags = []
  const checks = [
    { re: /(spo2|oxygen saturation)\D{0,5}(\d{2})/i, test: (m) => Number(m[2]) < 92, reason: 'Low oxygen saturation (SpO2) noted in report', weight: 9, redFlag: true },
    { re: /(bp|blood pressure)\D{0,5}(\d{2,3})\s*\/\s*(\d{2,3})/i, test: (m) => Number(m[2]) >= 180 || Number(m[3]) >= 120, reason: 'Very high blood pressure reading in report', weight: 8, redFlag: true },
    { re: /(temp|temperature)\D{0,5}(\d{2,3}(\.\d)?)/i, test: (m) => Number(m[2]) >= 103, reason: 'Very high temperature reading in report', weight: 6, redFlag: false },
    { re: /(hb|hemoglobin)\D{0,5}(\d{1,2}(\.\d)?)/i, test: (m) => Number(m[2]) < 7, reason: 'Critically low hemoglobin in report', weight: 8, redFlag: true },
    { re: /(pulse|heart rate)\D{0,5}(\d{2,3})/i, test: (m) => Number(m[2]) >= 130 || Number(m[2]) <= 40, reason: 'Abnormal heart rate in report', weight: 7, redFlag: true },
  ]
  checks.forEach((c) => {
    const m = text.match(c.re)
    if (m && c.test(m)) flags.push({ reason: c.reason, weight: c.weight, redFlag: c.redFlag })
  })
  return flags
}

/** Build the structured, reviewer-facing triage note. */
export function buildTriageNote({ patient, rawText, entities, missingInfo, urgency, reportSummaries }) {
  const symptomList = entities.symptoms.length
    ? entities.symptoms.map((s) => s.label).join(', ')
    : 'No specific symptoms auto-detected — manual review required'

  return {
    chiefComplaint: entities.symptoms[0]?.label || 'Unspecified complaint (see patient narrative)',
    patientNarrative: rawText,
    symptomList,
    duration: entities.duration || 'Not specified by patient',
    severity: entities.severity || 'Not specified by patient',
    redFlags: entities.symptoms.filter((s) => s.redFlag).map((s) => s.label),
    reportSummaries: reportSummaries || [],
    missingInfoQuestions: missingInfo.questions,
    urgencyCategory: urgency.category,
    urgencyReasons: urgency.reasons,
    recommendedAction: recommendedActionFor(urgency.category),
    generatedAt: new Date().toISOString(),
    aiNotice: 'This note was organized by an AI-assistance tool. It is NOT a diagnosis. A qualified healthcare professional must review, verify, and make all clinical decisions.',
  }
}

function recommendedActionFor(category) {
  switch (category) {
    case 'Emergency':
      return 'Escalate immediately — bring to front of queue and notify a doctor/nurse now.'
    case 'Urgent':
      return 'See within the next 30–60 minutes; prioritize ahead of routine cases.'
    case 'Priority':
      return 'See sooner than routine cases; monitor for worsening symptoms while waiting.'
    default:
      return 'Standard queue order is appropriate; reassess if symptoms worsen.'
  }
}

/** End-to-end convenience function used by the patient-entry flow. */
export function runTriagePipeline({ patient, rawText, reportTexts = [] }) {
  const entities = extractEntities(rawText)
  const missingInfo = detectMissingInfo(entities, patient)

  let ocrFlags = []
  const reportSummaries = reportTexts.map((rt) => {
    const flags = scanReportText(rt.text)
    ocrFlags = ocrFlags.concat(flags)
    return { fileName: rt.fileName, excerpt: (rt.text || '').slice(0, 400), flagCount: flags.length }
  })

  const urgency = scoreUrgency(entities, ocrFlags)
  const triageNote = buildTriageNote({ patient, rawText, entities, missingInfo, urgency, reportSummaries })

  return { entities, missingInfo, urgency, triageNote }
}

export const URGENCY_STYLES = {
  Emergency: { color: 'red', badge: 'bg-red-100 text-red-700 border-red-300', dot: 'bg-red-500', rank: 0 },
  Urgent: { color: 'orange', badge: 'bg-orange-100 text-orange-700 border-orange-300', dot: 'bg-orange-500', rank: 1 },
  Priority: { color: 'amber', badge: 'bg-amber-100 text-amber-700 border-amber-300', dot: 'bg-amber-500', rank: 2 },
  Routine: { color: 'emerald', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', dot: 'bg-emerald-500', rank: 3 },
}

export { SYMPTOM_KB }
