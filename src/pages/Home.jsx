import { Link } from 'react-router-dom'
import {
  Mic, FileText, ScanText, Languages, ListChecks, Brain, HelpCircle, Gauge,
  ClipboardList, Users, ShieldCheck, ArrowRight, Stethoscope, Building2, Factory,
  GraduationCap, HeartPulse, Siren,
} from 'lucide-react'
import DisclaimerBanner from '../components/DisclaimerBanner'
import { useApp } from '../context/AppContext'
import { t } from '../i18n/translations'

const patientFeatures = [
  { icon: Mic, title: 'Voice → Text', desc: 'Speak symptoms naturally in your own language using the microphone.' },
  { icon: FileText, title: 'Text Symptom Entry', desc: 'Prefer typing? Describe symptoms freely in a simple text box.' },
  { icon: ScanText, title: 'Report Upload + OCR', desc: 'Upload lab reports or prescriptions — text is extracted automatically.' },
  { icon: Languages, title: 'English / Hindi / Odia', desc: 'Full interface and voice recognition support across three languages.' },
  { icon: ListChecks, title: 'Timeline Summary', desc: 'An automatic, readable summary of your symptoms and history.' },
]

const aiFeatures = [
  { icon: Brain, title: 'Extract Key Information', desc: 'Identifies symptoms, duration, severity, and relevant vitals from the report.' },
  { icon: HelpCircle, title: 'Detect Missing Information', desc: 'Flags what wasn\u2019t mentioned — duration, severity, associated symptoms.' },
  { icon: ClipboardList, title: 'Follow-up Questions', desc: 'Generates targeted questions for the health worker to ask the patient.' },
  { icon: Gauge, title: 'Non-Diagnostic Urgency Tag', desc: 'Categorizes cases as Routine, Priority, Urgent or Emergency — never a diagnosis.' },
]

const workerFeatures = [
  { icon: Users, title: 'Patient Queue', desc: 'Live queue automatically sorted by urgency, not just arrival time.' },
  { icon: Gauge, title: 'Priority Indicators', desc: 'Color-coded, at-a-glance urgency badges for rapid scanning.' },
  { icon: Brain, title: 'AI Summary + Extracted Symptoms', desc: 'A structured triage note ready in seconds, with source report excerpts.' },
  { icon: ShieldCheck, title: 'Reviewer Approval & Editing', desc: 'Every AI output is editable and must be approved by a qualified worker.' },
  { icon: ClipboardList, title: 'Referral Note Preparation', desc: 'One click to prepare a printable referral note for higher facilities.' },
]

const scenarios = [
  { icon: Building2, label: 'Government Hospitals & PHCs' },
  { icon: Siren, label: 'Public Health Camps' },
  { icon: Factory, label: 'Industrial-Estate Health Units' },
  { icon: GraduationCap, label: 'Campus Health Centers' },
  { icon: HeartPulse, label: 'Maternal-Health Follow-ups' },
  { icon: Stethoscope, label: 'Chronic Disease Check-ins' },
]

export default function Home() {
  const { language } = useApp()
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-24 w-80 h-80 bg-teal-glow/20 rounded-full blur-3xl float-slow" />
        <div className="max-w-6xl mx-auto px-4 pt-14 pb-16 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="fade-up">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-100 px-3 py-1 rounded-full mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Human-in-the-loop &bull; Non-diagnostic &bull; SIH Prototype
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {t(language, 'heroTitle')}
              </h1>
              <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                {t(language, 'heroSubtitle')}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link to="/patient/login" className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-brand-600/20 transition">
                  {t(language, 'patientPortal')} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/worker/login" className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold px-6 py-3 rounded-xl transition">
                  <Stethoscope className="w-4 h-4" /> {t(language, 'workerPortal')}
                </Link>
              </div>
              <div className="mt-6">
                <DisclaimerBanner compact />
              </div>
            </div>

            <div className="relative fade-up">
              <div className="rounded-3xl border border-slate-200 shadow-2xl bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-slate-700 text-sm">Live Patient Queue (demo)</p>
                  <span className="text-xs text-slate-400">Auto-refreshing</span>
                </div>
                {[
                  { name: 'Ramesh Kumar', tag: 'Emergency', color: 'bg-red-500', sub: 'Chest pain, breathlessness · 2h ago' },
                  { name: 'Sunita Devi', tag: 'Urgent', color: 'bg-orange-500', sub: 'Pregnancy bleeding · 40m ago' },
                  { name: 'Ankit Sahoo', tag: 'Priority', color: 'bg-amber-500', sub: 'Fever, headache · 1h ago' },
                  { name: 'Deepak Nayak', tag: 'Routine', color: 'bg-emerald-500', sub: 'Mild cough · 3h ago' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0 border-slate-100">
                    <span className={`w-2.5 h-2.5 rounded-full ${p.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                      <p className="text-xs text-slate-400 truncate">{p.sub}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{p.tag}</span>
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-slate-200 px-4 py-3 hidden sm:block">
                <p className="text-xs text-slate-400">Avg. triage time</p>
                <p className="text-xl font-bold text-brand-700">42 sec</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        title="Patient Side"
        subtitle="Simple, multilingual symptom reporting — voice-first, mobile-friendly"
        items={patientFeatures}
        accent="brand"
      />

      <Section
        title="AI Processing"
        subtitle="What the assistant does behind the scenes before a health worker ever sees the case"
        items={aiFeatures}
        accent="teal"
        dark
      />

      <Section
        title="Healthcare-Worker Dashboard"
        subtitle="Everything a nurse, doctor, or medical officer needs to review and act quickly"
        items={workerFeatures}
        accent="slate"
      />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Built for India-wide facility contexts</h2>
        <p className="text-slate-500 text-center mt-2 max-w-2xl mx-auto">
          One lightweight system that adapts to varying patient load, connectivity, and language across facility types.
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {scenarios.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition">
              <s.icon className="w-7 h-7 text-brand-600" />
              <p className="text-sm font-medium text-slate-700">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-14 text-center">
          <ShieldCheck className="w-10 h-10 mx-auto text-teal-glow mb-4" />
          <h2 className="text-2xl font-bold">AI-Assisted Triage — Not AI Diagnosis</h2>
          <p className="mt-3 text-slate-300 leading-relaxed">
            Every summary, urgency tag, and question generated by this system is advisory. It organizes information
            and highlights urgency signals so trained health workers can act faster — it never prescribes treatment,
            confirms a disease, or replaces professional clinical judgement.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 mt-6 text-teal-glow font-semibold hover:underline">
            Read our full responsible-AI approach <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function Section({ title, subtitle, items, dark }) {
  return (
    <section className={dark ? 'bg-slate-50 border-y border-slate-100' : ''}>
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500 mt-2">{subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((f, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                <f.icon className="w-5.5 h-5.5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
