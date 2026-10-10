import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Loader2, FileText } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import UrgencyBadge from '../../components/UrgencyBadge'

export default function ReviewSubmit() {
  const { id } = useParams()
  const { cases, auth, updateCase, casesLoading } = useApp()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const c = cases.find((item) => item.id === id)

  if (!c && casesLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Loading report…</div>
  }
  if (!c) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Report not found.</div>
  }
  if (c.patient.uid !== auth.patient?.uid) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">You don't have access to this report.</div>
  }

  const submitCase = async () => {
    setSubmitting(true)
    setError('')
    try {
      await updateCase(id, () => ({
        status: 'pending',
        auditLog: [...(c.auditLog || []), {
          action: 'Report submitted for healthcare-worker review',
          by: auth.patient?.name,
          at: new Date().toISOString(),
        }],
      }))
      navigate('/patient/timeline')
    } catch (e) {
      console.error('Could not submit patient report:', e)
      setError('Could not submit your report. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/patient/upload-report/${id}`)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to report upload
      </button>

      <h1 className="text-2xl font-bold text-slate-900">Review and submit</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">
        Check your information before sending it to the healthcare-worker queue.
      </p>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Patient</p>
            <p className="font-medium text-slate-800">{c.patient.name}</p>
            <p className="text-sm text-slate-500">{c.patient.age} yrs · {c.patient.gender}</p>
          </div>
          <UrgencyBadge category={c.urgency.category} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Your symptoms</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.rawText}</p>
          <p className="text-sm text-slate-500 mt-2">{c.triageNote.chiefComplaint}</p>
        </div>

        {c.reportFiles?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Attached reports</p>
            <ul className="space-y-1">
              {c.reportFiles.map((file, index) => (
                <li key={`${file.fileName}-${index}`} className="flex items-center gap-2 text-sm text-slate-600">
                  <FileText className="w-4 h-4" /> {file.fileName}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
          Submitting sends this triage report to the healthcare-worker queue for review. It is not a diagnosis.
        </p>

        {error && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <button
          onClick={submitCase}
          disabled={submitting || c.status !== 'draft'}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
        >
          {submitting
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Send className="w-4 h-4" />}
          {c.status === 'draft' ? 'Submit for healthcare-worker review' : 'Already submitted'}
        </button>
      </div>
    </div>
  )
}
