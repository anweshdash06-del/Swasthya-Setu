import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Keyboard, ArrowRight, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import VoiceInput from '../../components/VoiceInput'
import DisclaimerBanner from '../../components/DisclaimerBanner'
import { runTriagePipeline } from '../../utils/triageEngine'
import { LANGUAGES, t } from '../../i18n/translations'

export default function NewEntry() {
  const { auth, language, setLanguage, addCase } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('voice')
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const appendVoice = (chunk) => setText((prev) => (prev ? prev + ' ' + chunk : chunk).trim())

  const [saving, setSaving] = useState(false)

  const handleNext = async () => {
    if (text.trim().length < 4) {
      setError('Please describe at least one symptom before continuing.')
      return
    }
    setError('')
    const id = `CASE-${Date.now()}`
    const result = runTriagePipeline({ patient: auth.patient, rawText: text, reportTexts: [] })
    const newCase = {
      id,
      patient: auth.patient,
      language,
      inputMethod: mode,
      rawText: text,
      reportFiles: [],
      entities: result.entities,
      missingInfo: result.missingInfo,
      urgency: result.urgency,
      triageNote: result.triageNote,
      status: 'draft',
      reviewedBy: null,
      reviewNotes: '',
      reviewedAt: null,
      consentGiven: true,
      createdAt: new Date().toISOString(),
      auditLog: [{ action: `Symptom entry created via ${mode}`, by: auth.patient?.name, at: new Date().toISOString() }],
    }
    setSaving(true)
    try {
      await addCase(newCase)
      navigate(`/patient/upload-report/${id}`)
    } catch (e) {
      setError('Could not save your entry. Please check your internet connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-brand-600" />
        <h1 className="text-2xl font-bold text-slate-900">{t(language, 'startEntry')}</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">Step 1 of 3 — Describe your symptoms</p>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            <TabBtn active={mode === 'voice'} onClick={() => setMode('voice')} icon={Mic} label="Voice" />
            <TabBtn active={mode === 'text'} onClick={() => setMode('text')} icon={Keyboard} label="Text" />
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-2 py-1.5">
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
          </select>
        </div>

        {mode === 'voice' && (
          <div className="flex flex-col items-center py-6 border border-dashed border-slate-200 rounded-xl mb-4">
            <VoiceInput onResult={appendVoice} />
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={t(language, 'typeSymptoms')}
          className="w-full border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 resize-none"
        />
        <p className="text-xs text-slate-400 mt-2">
          Tip: mention how long you've had the symptom and how severe it feels — this helps generate a more accurate summary.
        </p>

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">{error}</p>}

        <button onClick={handleNext} disabled={saving} className="w-full mt-5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
          {saving ? 'Saving…' : <>{t(language, 'next')} <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>

      <div className="mt-6"><DisclaimerBanner compact /></div>
    </div>
  )
}

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${
        active ? 'bg-white shadow text-brand-700' : 'text-slate-500'
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  )
}
