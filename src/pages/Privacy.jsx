import { Lock, Eye, Database, UserCheck, ClipboardList, Trash2 } from 'lucide-react'

const points = [
  { icon: UserCheck, title: 'Informed Consent', desc: 'Before any symptom or report data is processed, the patient explicitly consents on-screen. Consent status is stored with every case record and is visible to reviewers.' },
  { icon: Database, title: 'Minimal Data Retention', desc: 'Only fields required for triage (symptoms, demographics, contact, uploaded report text) are stored. No unrelated personal data is collected.' },
  { icon: Eye, title: 'Role-Based Access (mock)', desc: 'Patients can only view their own case history. Health workers access the shared queue via a separate authenticated portal. In production this would be backed by proper RBAC and encrypted storage.' },
  { icon: ClipboardList, title: 'Auditability', desc: 'Every case carries an audit trail — creation, AI processing, worker review, edits, and approval are all timestamped and logged for accountability.' },
  { icon: Lock, title: 'Anonymization-ready', desc: 'Patient identifiers are kept separate from clinical narrative fields so records can be pseudonymized for analytics/export in a production deployment.' },
  { icon: Trash2, title: 'Data Deletion', desc: 'Demo data can be cleared at any time from this browser. In production, patients would be able to request deletion of their records per applicable regulations.' },
]

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Privacy & Consent</h1>
        <p className="text-slate-500 mt-3">
          This prototype is built for evaluation with synthetic/demo data. Here is how it approaches
          consent, data minimization, and responsible handling of health information.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-12">
        {points.map((p, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
              <p.icon className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="font-semibold text-slate-800">{p.title}</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="font-bold text-red-800 mb-2">Important — synthetic data only</h2>
        <p className="text-sm text-red-700 leading-relaxed">
          This is an educational hackathon prototype. Do not enter real patient names, phone numbers, or medical
          records. All demo/seed data in this app is fictional and generated for demonstration purposes only.
          The system must not be used for real clinical decision-making.
        </p>
      </div>
    </div>
  )
}
