import { Link, useNavigate } from 'react-router-dom'
import { Mic, ScanText, History, ArrowRight, Clock } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import UrgencyBadge from '../../components/UrgencyBadge'
import DisclaimerBanner from '../../components/DisclaimerBanner'
import { t } from '../../i18n/translations'

export default function PatientDashboard() {
  const { auth, cases, language } = useApp()
  const navigate = useNavigate()
  const myCases = cases.filter((c) => c.patient.phone === auth.patient?.phone).slice(0, 6)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {auth.patient?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">{auth.patient?.facility} &bull; {t(language, 'appName')}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <ActionCard
          icon={Mic}
          title={t(language, 'startEntry')}
          desc="Describe new symptoms by voice or text."
          onClick={() => navigate('/patient/new-entry')}
          color="bg-brand-600"
        />
        <ActionCard
          icon={ScanText}
          title={t(language, 'uploadReport')}
          desc="Have a lab report or prescription? Upload it directly."
          onClick={() => navigate('/patient/new-entry')}
          color="bg-teal-600"
        />
        <ActionCard
          icon={History}
          title={t(language, 'viewTimeline')}
          desc="See all your past submissions and their status."
          onClick={() => navigate('/patient/timeline')}
          color="bg-slate-700"
        />
      </div>

      <DisclaimerBanner compact />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800">Recent submissions</h2>
          <Link to="/patient/timeline" className="text-sm text-brand-600 font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myCases.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No submissions yet. Start by reporting your symptoms above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myCases.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.triageNote.chiefComplaint}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(c.createdAt).toLocaleString()} &bull; Status: {c.status}</p>
                </div>
                <UrgencyBadge category={c.urgency.category} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ActionCard({ icon: Icon, title, desc, onClick, color }) {
  return (
    <button onClick={onClick} className="text-left bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{desc}</p>
    </button>
  )
}
