import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Printer, Send, ShieldCheck, Stethoscope, Building2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import UrgencyBadge from '../../components/UrgencyBadge'

export default function ReferralNote() {
  const { id } = useParams()
  const { cases, updateCase, auth } = useApp()
  const navigate = useNavigate()
  const c = cases.find((x) => x.id === id)
  const [referredTo, setReferredTo] = useState('')
  const [reason, setReason] = useState('')
  const [marked, setMarked] = useState(false)

  if (!c) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Case not found.</div>

  const { triageNote, urgency, entities, patient } = c

  const markReferred = () => {
    updateCase(id, () => ({
      status: 'referred',
      referral: { referredTo, reason, preparedBy: `${auth.worker?.name} (${auth.worker?.role})`, at: new Date().toISOString() },
      auditLog: [...(c.auditLog || []), {
        action: `Referral note prepared${referredTo ? ` → ${referredTo}` : ''}`,
        by: auth.worker?.name, at: new Date().toISOString(),
      }],
    }))
    setMarked(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(`/worker/patient/${id}`)} className="no-print flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to case
      </button>

      <div className="no-print bg-white border border-slate-200 rounded-2xl p-5 mb-6 grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Refer to (facility / specialist)</label>
          <input value={referredTo} onChange={(e) => setReferredTo(e.target.value)} placeholder="e.g. District Hospital, Cardiology" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Reason for referral</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Needs ECG & cardiology evaluation" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400" />
        </div>
      </div>

      {/* Printable referral note */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 print:border-0 print:shadow-none">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-glow flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800">SwasthyaSetu</p>
              <p className="text-xs text-slate-400">Referral Note — Case {c.id}</p>
            </div>
          </div>
          <UrgencyBadge category={urgency.category} />
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-5 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Patient</p>
            <p className="font-medium text-slate-800">{patient.name}</p>
            <p className="text-slate-500">{patient.age} yrs &middot; {patient.gender}{patient.pregnant ? ' · pregnant' : ''}</p>
            <p className="text-slate-500">{patient.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Originating facility</p>
            <p className="font-medium text-slate-800 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {patient.facility}</p>
            <p className="text-slate-500 mt-2 text-xs">Prepared by: {auth.worker?.name} ({auth.worker?.role})</p>
            <p className="text-slate-500 text-xs">Date: {new Date().toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Chief complaint</p>
          <p className="text-sm text-slate-700">{triageNote.chiefComplaint}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Duration / Severity</p>
            <p className="text-sm text-slate-700">{entities.duration || 'Not specified'} &middot; {entities.severity || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Red flags identified</p>
            <p className="text-sm text-slate-700">{triageNote.redFlags.length ? triageNote.redFlags.join(', ') : 'None detected'}</p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Extracted symptoms</p>
          <p className="text-sm text-slate-700">{entities.symptoms.map((s) => s.label).join(', ') || 'Not auto-detected'}</p>
        </div>

        {reason && (
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Reason for referral</p>
            <p className="text-sm text-slate-700">{reason}</p>
          </div>
        )}

        {referredTo && (
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Referred to</p>
            <p className="text-sm text-slate-700">{referredTo}</p>
          </div>
        )}

        <div className="mb-5">
          <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Reviewer notes</p>
          <p className="text-sm text-slate-700">{c.reviewNotes || '—'}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2 text-xs text-amber-800">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          This referral note was organized with AI assistance and reviewed/approved by a qualified healthcare
          worker named above. It summarizes patient-reported information only and does not constitute a diagnosis.
          The receiving facility should conduct its own independent clinical assessment.
        </div>
      </div>

      <div className="no-print flex flex-col sm:flex-row gap-3 mt-6">
        <button onClick={() => window.print()} className="flex-1 border border-slate-300 text-slate-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50">
          <Printer className="w-4 h-4" /> Print / Save as PDF
        </button>
        <button
          onClick={markReferred}
          disabled={marked}
          className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> {marked ? 'Marked as Referred' : 'Mark Case as Referred'}
        </button>
      </div>
      {marked && <p className="no-print text-center text-sm text-emerald-600 mt-3">Referral recorded in audit trail. <Link to="/worker/dashboard" className="underline">Back to queue</Link></p>}
    </div>
  )
}
