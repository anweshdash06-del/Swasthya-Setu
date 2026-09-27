import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import UrgencyBadge from '../../components/UrgencyBadge'
import { t } from '../../i18n/translations'

export default function Timeline() {
  const { auth, cases, language } = useApp()
  const [openId, setOpenId] = useState(null)
  const myCases = cases
    .filter((c) => c.patient.phone === auth.patient?.phone)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">{t(language, 'viewTimeline')}</h1>
      <p className="text-slate-500 text-sm mb-8">All your symptom submissions, most recent first.</p>

      {myCases.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500 text-sm">
          No submissions yet.
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
          {myCases.map((c) => {
            const open = openId === c.id
            return (
              <div key={c.id} className="relative">
                <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand-500 border-4 border-white shadow" />
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <button onClick={() => setOpenId(open ? null : c.id)} className="w-full flex items-start justify-between gap-3 text-left">
                    <div>
                      <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{c.triageNote.chiefComplaint}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Status: <span className="capitalize font-medium">{c.status}</span></p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <UrgencyBadge category={c.urgency.category} size="sm" />
                      {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {open && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-sm">
                      <p className="text-slate-600 bg-slate-50 rounded-lg p-3">{c.rawText}</p>
                      <div className="flex flex-wrap gap-2">
                        {c.entities.symptoms.map((s) => (
                          <span key={s.key} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{s.label}</span>
                        ))}
                      </div>
                      {c.reportFiles?.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <FileText className="w-3.5 h-3.5" /> {c.reportFiles.length} report(s) attached
                        </div>
                      )}
                      {c.reviewedBy && (
                        <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                          Reviewed by {c.reviewedBy} on {new Date(c.reviewedAt).toLocaleString()}
                          {c.reviewNotes && <> — "{c.reviewNotes}"</>}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
