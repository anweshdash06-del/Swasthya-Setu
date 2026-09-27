import { runTriagePipeline } from './triageEngine'

const seedCases = [
  {
    patient: { name: 'Ramesh Kumar', age: 58, gender: 'male', phone: '98XXXXXX21', facility: 'PHC Balasore', pregnant: false },
    rawText: 'I have severe chest pain since 2 hours and difficulty breathing. It is very severe.',
    language: 'en',
  },
  {
    patient: { name: 'Sunita Devi', age: 29, gender: 'female', phone: '97XXXXXX10', facility: 'Public Health Camp - Cuttack', pregnant: true },
    rawText: 'Mujhe pregnancy me bleeding ho rahi hai aur pet me dard hai 1 din se.',
    language: 'hi',
  },
  {
    patient: { name: 'Ankit Sahoo', age: 24, gender: 'male', phone: '90XXXXXX45', facility: 'Campus Health Center, BPUT', pregnant: false },
    rawText: 'I have fever and headache since 2 days, mild body pain also.',
    language: 'en',
  },
  {
    patient: { name: 'Laxmi Pradhan', age: 45, gender: 'female', phone: '91XXXXXX88', facility: 'Industrial Estate Clinic, Rourkela', pregnant: false },
    rawText: 'ମୋର ହାତରେ ଆଘାତ ଲାଗିଛି ଓ ରକ୍ତସ୍ରାବ ହେଉଛି, ଦୁର୍ଘଟଣା ଫ୍ୟାକ୍ଟୋରୀରେ ହୋଇଛି',
    language: 'or',
  },
  {
    patient: { name: 'Deepak Nayak', age: 34, gender: 'male', phone: '99XXXXXX03', facility: 'Company Clinic, Bhubaneswar', pregnant: false },
    rawText: 'Mild cough and weakness since 3 days, no fever.',
    language: 'en',
  },
  {
    patient: { name: 'Meena Behera', age: 62, gender: 'female', phone: '96XXXXXX77', facility: 'PHC Balasore', pregnant: false },
    rawText: 'Sugar level high check karna hai, thoda chakkar bhi aata hai, 2 din se.',
    language: 'hi',
  },
]

export function buildSeedPatients() {
  return seedCases.map((c, i) => {
    const result = runTriagePipeline({ patient: c.patient, rawText: c.rawText, reportTexts: [] })
    const createdAt = new Date(Date.now() - (i + 1) * 1000 * 60 * 37).toISOString()
    return {
      id: `SEED-${1000 + i}`,
      patient: c.patient,
      language: c.language,
      inputMethod: 'text',
      rawText: c.rawText,
      reportFiles: [],
      entities: result.entities,
      missingInfo: result.missingInfo,
      urgency: result.urgency,
      triageNote: result.triageNote,
      status: i === 0 ? 'pending' : i === 1 ? 'pending' : 'pending',
      reviewedBy: null,
      reviewNotes: '',
      reviewedAt: null,
      consentGiven: true,
      createdAt,
      auditLog: [{ action: 'Case created by patient (demo seed data)', by: c.patient.name, at: createdAt }],
    }
  })
}
