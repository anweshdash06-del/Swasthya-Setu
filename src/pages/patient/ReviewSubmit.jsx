import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, CheckCircle2, HelpCircle, ListChecks, Send, PartyPopper } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import UrgencyBadge from '../../components/UrgencyBadge'
import DisclaimerBanner from '../../components/DisclaimerBanner'
import { runTriagePipeline } from '../../utils/triageEngine'
import { t } from '../../i18n/translations'

export default function ReviewSubmit() {
  const { id } = useParams()
  const { cases, updateCase, auth, language } = useApp()
  const navigate = useNavigate()
  const caseData = cases.find((c) => c.id === id)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(caseData?.rawText || '')
  const [submitted, setSubmitted] = useState(false)

  if (!caseData) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-500">Case not found.</div>
  }

  const saveEdit = () => {
    const reportTexts = (caseData.reportFiles || []).map((f) => ({ fileName: f.fileName, text: f.text }))
    const result = runTriagePipeline({ patient: caseData.patient, rawText: text, reportTexts })
    updateCase(id, () => ({
      rawText: text,
      entities: result.entities,
      missingInfo: result.missingInfo,
      urgency: result.urgency,
      triageNote: result.triageNote,
      auditLog: [...(caseData.auditLog || []), { action: 'Patient edited symptom description', by: auth.patient?.name, at: new Date().toISOString() }],
    }))
    setEditing(false)
  }

  const confirmSubmit = () => {
    updateCase(id, () => ({
      status: 'pending',
      auditLog: [...(caseData.auditLog || []), { action: 'Case submitted to health worker queue', by: auth.patient?.name, at: new Date().toISOString() }],
    }))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <PartyPopper className="w-14 h-14 text-brand-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">{t(language, 'submitted')}</h1>
        <p className="text-slate-500 mt-2 text-sm">Case ID: <span className="font-mono">{caseData.id}</span></p>
        <div className="mt-5 flex justify-center"><UrgencyBadge category={caseData.urgency.category} /></div>
        <button onClick={() => navigate('/patient/dashboard')} className="mt-8 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const { triageNote, urgency, missingInfo, entities } = caseData

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{t(language, 'reviewTitle')}</h1>
      <p className="text-slate-500 text-sm mb-6">Step 3 of 3 — {t(language, 'reviewHelp')}</p>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Urgency (non-diagnostic)</span>
          <UrgencyBadge category={urgency.category} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your description</span>
            <button onClick={() => setEditing((e) => !e)} className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:underline">
              <Pencil className="w-3 h-3" /> {t(language, 'editText')}
            </button>
          </div>
          {editing ? (
            <div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-brand-400" />
              <button onClick={saveEdit} className="mt-2 text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg font-medium">Save changes</button>
            </div>
          ) : (
            <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3">{caseData.rawText}</p>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1.5 mb-2">
            <ListChecks className="w-3.5 h-3.5" /> Extracted symptoms
          </span>
          {entities.symptoms.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No specific symptoms auto-detected — a health worker will follow up.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {entities.symptoms.map((s) => (
                <span key={s.key} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.redFlag ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {s.label}
                </span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
            <div className="bg-slate-50 rounded-lg p-2.5"><span className="text-slate-400">Duration: </span><span className="font-medium text-slate-700">{entities.duration || 'Not specified'}</span></div>
            <div className="bg-slate-50 rounded-lg p-2.5"><span className="text-slate-400">Severity: </span><span className="font-medium text-slate-700">{entities.severity || 'Not specified'}</span></div>
          </div>
        </div>

        {missingInfo.questions.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-3.5 h-3.5" /> The health worker may ask you
            </span>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              {missingInfo.questions.slice(0, 4).map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        )}

        {caseData.reportFiles?.length > 0 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2 block">Attached reports</span>
            <ul className="text-sm text-slate-600 space-y-1">
              {caseData.reportFiles.map((f, i) => <li key={i} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {f.fileName}</li>)}
            </ul>
          </div>
        )}
      </div>

      <button onClick={confirmSubmit} className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20">
        <Send className="w-4 h-4" /> {t(language, 'confirmSubmit')}
      </button>

      <div className="mt-6"><DisclaimerBanner compact /></div>
    </div>
  )
}
