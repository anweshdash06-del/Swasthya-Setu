import { Mic, ScanText, Brain, Users, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import DisclaimerBanner from '../components/DisclaimerBanner'

const steps = [
  { icon: Mic, title: '1. Patient reports symptoms', desc: 'By voice or text, in English, Hindi, or Odia. An optional medical report/prescription image can be uploaded and read via OCR.' },
  { icon: Brain, title: '2. AI organizes the information', desc: 'The system extracts symptoms, duration, and severity; detects what\u2019s missing; drafts follow-up questions; and assigns a non-diagnostic urgency category.' },
  { icon: Users, title: '3. Health worker reviews', desc: 'A structured, editable triage note appears in the worker dashboard queue, sorted by urgency. The worker verifies, edits, and approves — always with final authority.' },
  { icon: ShieldCheck, title: '4. Action & referral', desc: 'Approved cases can be queued for consultation or converted into a printable referral note for a higher-level facility.' },
]

const safeguards = [
  'Every AI-generated note is clearly labeled "AI-assisted" and requires human sign-off before any action.',
  'The system never outputs a disease name, medication, or treatment plan — only organized information and urgency signals.',
  'Urgency categories (Routine / Priority / Urgent / Emergency) are deliberately non-diagnostic labels, not medical verdicts.',
  'Low-confidence or incomplete cases surface explicit follow-up questions rather than guessing.',
  'All extraction logic is rule-based and fully auditable — no hidden model decisions.',
  'Demo data is synthetic. No real patient records are used in this prototype.',
]

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">How SwasthyaSetu works</h1>
        <p className="text-slate-500 mt-3">A simple four-step, human-in-the-loop workflow designed for real-world facility constraints.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {steps.map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
              <s.icon className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="font-bold text-slate-800">{s.title}</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 mb-16">
        <h2 className="text-xl font-bold text-amber-900 mb-2">AI-Assisted Triage — Not AI Diagnosis</h2>
        <p className="text-amber-800 text-sm leading-relaxed">
          This prototype is explicitly non-diagnostic. It organizes patient-reported information, highlights
          urgency signals from a transparent rule-based engine, and helps a qualified health worker review cases
          faster. It does not identify diseases, does not recommend medication or treatment, and does not replace
          a doctor, nurse, or medical officer's judgement at any point in the workflow.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">Safety & responsible-AI safeguards</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-16">
        {safeguards.map((s, i) => (
          <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">{s}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold">Want the technical & privacy details?</h2>
        <p className="text-slate-300 mt-2 max-w-xl mx-auto text-sm">
          See how consent, data retention, and role-based access are handled in this prototype.
        </p>
        <Link to="/privacy" className="inline-flex items-center gap-2 mt-5 bg-white text-slate-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100">
          Privacy & Consent <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-10">
        <DisclaimerBanner />
      </div>
    </div>
  )
}
