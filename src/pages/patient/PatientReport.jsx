import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, ShieldCheck, Activity, Building2, FileText, HelpCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import UrgencyBadge from '../../components/UrgencyBadge'

export default function PatientReport() {
  const { id } = useParams()
  const { cases, auth } = useApp()
  const navigate = useNavigate()
  const c = cases.find((x) => x.id === id)

  if (!c) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Report not found.</div>

  // Safety: a patient should only be able to open their own report.
  if (auth.patient && c.patient.phone !== auth.patient.phone) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">You don't have access to this report.</div>
  }

  const { triageNote, urgency, entities, patient, missingInfo, reportFiles } = c

  const statusLabel = {
    draft: 'Draft — not yet submitted',
    pending: 'Submitted — waiting for healthcare-worker review',
    approved: 'Reviewed & approved by a healthcare worker',
    referred: 'Reviewed and referred to another facility',
  }[c.status] || c.status

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/patient/timeline')} className="no-print flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to my timeline
      </button>

      {/* Printable / shareable report */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 print:border-0 print:shadow-none">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-glow flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800">SwasthyaSetu</p>
              <p className="text-xs text-slate-400">Triage Report — Case {c.id}</p>
            </div>
          </div>
          <UrgencyBadge category={urgency.category} />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 mb-5 text-sm text-slate-700">
          <span className="font-medium">Status: </span>{statusLabel}
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-5 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Patient</p>
            <p className="font-medium text-slate-800">{patient.name}</p>
            <p className="text-slate-500">{patient.age} yrs &middot; {patient.gender}{patient.pregnant ? ' · pregnant' : ''}</p>
            <p className="text-slate-500">{patient.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Facility</p>
            <p className="font-medium text-slate-800 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {patient.facility}</p>
            <p className="text-slate-500 mt-2 text-xs">Submitted: {new Date(c.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Your description</p>
          <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-3">{c.rawText}</p>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Chief complaint (AI-organized summary)</p>
          <p className="text-sm text-slate-700">{triageNote.chiefComplaint}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Duration / Severity</p>
            <p className="text-sm text-slate-700">{entities.duration || 'Not specified'} &middot; {entities.severity || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Red flags identified</p>
            <p className="text-sm text-slate-700">{triageNote.redFlags?.length ? triageNote.redFlags.join(', ') : 'None detected'}</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Extracted symptoms</p>
          {entities.symptoms.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No specific symptoms auto-detected.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {entities.symptoms.map((s) => (
                <span key={s.key} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.redFlag ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {s.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {reportFiles?.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Attached reports</p>
            <ul className="text-sm text-slate-600 space-y-1">
              {reportFiles.map((f, i) => <li key={i}>{f.fileName}</li>)}
            </ul>
          </div>
        )}

        {missingInfo?.questions?.length > 0 && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase text-amber-700 mb-2 flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> The health worker may still ask you</p>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              {missingInfo.questions.slice(0, 4).map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        )}

        {c.reviewedBy && (
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Healthcare-worker review</p>
            <p className="text-sm text-slate-700">
              Reviewed by <span className="font-medium">{c.reviewedBy}</span> on {new Date(c.reviewedAt).toLocaleString()}
            </p>
            {c.reviewNotes && <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mt-2">"{c.reviewNotes}"</p>}
          </div>
        )}

        {c.referral && (
          <>
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Referred to</p>
              <p className="text-sm text-slate-700">{c.referral.referredTo || 'Not specified'}</p>
            </div>
            {c.referral.reason && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Reason for referral</p>
                <p className="text-sm text-slate-700">{c.referral.reason}</p>
              </div>
            )}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Prepared by</p>
              <p className="text-sm text-slate-700">{c.referral.preparedBy} on {new Date(c.referral.at).toLocaleString()}</p>
            </div>
          </>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2 text-xs text-amber-800">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          This is an AI-organized summary of what you reported — <strong>it is not a diagnosis</strong>. A qualified
          healthcare worker reviews every case before any action is taken.
        </div>
      </div>

      <button onClick={() => window.print()} className="no-print w-full mt-6 border border-slate-300 text-slate-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50">
        <Printer className="w-4 h-4" /> Print / Save as PDF
      </button>
    </div>
  )
}