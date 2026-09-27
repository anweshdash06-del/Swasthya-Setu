import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, User, Phone, MapPin, ListChecks, HelpCircle, FileText, ShieldAlert,
  CheckCircle2, Pencil, ClipboardList, History, Send,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import UrgencyBadge from '../../components/UrgencyBadge'
import { runTriagePipeline } from '../../utils/triageEngine'

export default function PatientDetail() {
  const { id } = useParams()
  const { cases, updateCase, auth } = useApp()
  const navigate = useNavigate()
  const c = cases.find((x) => x.id === id)
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(c?.reviewNotes || '')
  const [editedText, setEditedText] = useState(c?.rawText || '')

  if (!c) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Case not found.</div>

  const saveEdit = () => {
    const reportTexts = (c.reportFiles || []).map((f) => ({ fileName: f.fileName, text: f.text }))
    const result = runTriagePipeline({ patient: c.patient, rawText: editedText, reportTexts })
    updateCase(id, () => ({
      rawText: editedText,
      entities: result.entities,
      missingInfo: result.missingInfo,
      urgency: result.urgency,
      triageNote: result.triageNote,
      status: 'in-review',
      auditLog: [...(c.auditLog || []), { action: `Triage note edited by reviewer`, by: auth.worker?.name, at: new Date().toISOString() }],
    }))
    setEditing(false)
  }

  const approve = () => {
    updateCase(id, () => ({
      status: 'approved',
      reviewedBy: `${auth.worker?.name} (${auth.worker?.role})`,
      reviewNotes: notes,
      reviewedAt: new Date().toISOString(),
      auditLog: [...(c.auditLog || []), { action: 'Case approved by reviewer', by: auth.worker?.name, at: new Date().toISOString() }],
    }))
  }

  const { triageNote, urgency, missingInfo, entities } = c

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/worker/dashboard')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to queue
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{c.patient.name}</h1>
            <UrgencyBadge category={urgency.category} />
          </div>
          <p className="text-slate-500 text-sm mt-1">{c.id} &middot; Status: <span className="capitalize font-medium">{c.status}</span></p>
        </div>
        <div className="flex gap-2">
          {c.status !== 'approved' && (
            <button onClick={approve} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" /> Approve
            </button>
          )}
          <Link to={`/worker/referral/${c.id}`} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
            <Send className="w-4 h-4" /> Prepare Referral
          </Link>
        </div>
      </div>

      {urgency.category === 'Emergency' && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-800 rounded-xl px-4 py-3 mb-6 font-medium text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" /> Red-flag indicators detected — recommend immediate escalation to a doctor/nurse.
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card title="Patient-reported narrative" icon={FileText}>
            {editing ? (
              <div>
                <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} rows={4} className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-brand-400" />
                <div className="flex gap-2 mt-2">
                  <button onClick={saveEdit} className="text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg font-medium">Save & re-analyze</button>
                  <button onClick={() => setEditing(false)} className="text-xs border border-slate-300 px-3 py-1.5 rounded-lg font-medium">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3">{c.rawText}</p>
                <button onClick={() => setEditing(true)} className="text-xs text-brand-600 font-medium flex items-center gap-1 mt-2 hover:underline">
                  <Pencil className="w-3 h-3" /> Edit summary
                </button>
              </div>
            )}
          </Card>

          <Card title="Extracted symptoms" icon={ListChecks}>
            {entities.symptoms.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No specific symptoms auto-detected.</p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-3">
                {entities.symptoms.map((s) => (
                  <span key={s.key} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.redFlag ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                    {s.label} <span className="opacity-50">&middot; {s.category}</span>
                  </span>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-lg p-2.5"><span className="text-slate-400">Duration: </span><span className="font-medium text-slate-700">{entities.duration || 'Not specified'}</span></div>
              <div className="bg-slate-50 rounded-lg p-2.5"><span className="text-slate-400">Severity: </span><span className="font-medium text-slate-700">{entities.severity || 'Not specified'}</span></div>
            </div>
          </Card>

          {c.reportFiles?.length > 0 && (
            <Card title="Uploaded report (OCR extract)" icon={FileText}>
              {c.reportFiles.map((f, i) => (
                <div key={i} className="text-sm mb-2 last:mb-0">
                  <p className="font-medium text-slate-700 text-xs mb-1">{f.fileName}</p>
                  <p className="text-slate-500 text-xs bg-slate-50 rounded-lg p-2.5 whitespace-pre-wrap max-h-32 overflow-y-auto scrollbar-thin">
                    {f.text?.trim() || 'No text extracted.'}
                  </p>
                </div>
              ))}
            </Card>
          )}

          {missingInfo.questions.length > 0 && (
            <Card title="AI-generated follow-up questions" icon={HelpCircle} tone="amber">
              <ul className="text-sm text-amber-800 space-y-1.5 list-disc list-inside">
                {missingInfo.questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </Card>
          )}

          <Card title="Reviewer notes" icon={ClipboardList}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add clinical notes before approving (optional)…"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-brand-400"
            />
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Patient info" icon={User}>
            <div className="text-sm space-y-2 text-slate-600">
              <p className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-slate-400" /> {c.patient.age} yrs, {c.patient.gender}{c.patient.pregnant ? ', pregnant' : ''}</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.patient.phone}</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.patient.facility}</p>
            </div>
          </Card>

          <Card title="Urgency reasoning" icon={ShieldAlert} tone={urgency.category === 'Emergency' ? 'red' : 'slate'}>
            <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside">
              {urgency.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
            <p className="text-xs text-slate-400 mt-3">Score: {urgency.score} &middot; Category is advisory only, not a diagnosis.</p>
          </Card>

          <Card title="Structured triage note" icon={ClipboardList}>
            <dl className="text-xs space-y-2">
              <div><dt className="text-slate-400">Chief complaint</dt><dd className="font-medium text-slate-700">{triageNote.chiefComplaint}</dd></div>
              <div><dt className="text-slate-400">Recommended action</dt><dd className="font-medium text-slate-700">{triageNote.recommendedAction}</dd></div>
              <div><dt className="text-slate-400">Red flags</dt><dd className="font-medium text-slate-700">{triageNote.redFlags.length ? triageNote.redFlags.join(', ') : 'None detected'}</dd></div>
            </dl>
          </Card>

          <Card title="Audit trail" icon={History}>
            <ul className="text-xs text-slate-500 space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {(c.auditLog || []).slice().reverse().map((a, i) => (
                <li key={i} className="border-l-2 border-slate-200 pl-2">
                  <p className="text-slate-600">{a.action}</p>
                  <p className="text-slate-400">{a.by} &middot; {new Date(a.at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Card({ title, icon: Icon, children, tone = 'default' }) {
  const toneClasses = {
    default: 'bg-white border-slate-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200',
    slate: 'bg-white border-slate-200',
  }
  return (
    <div className={`border rounded-2xl p-5 ${toneClasses[tone]}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      {children}
    </div>
  )
}
