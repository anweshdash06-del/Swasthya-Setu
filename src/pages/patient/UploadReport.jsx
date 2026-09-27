import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UploadCloud, FileText, X, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import DisclaimerBanner from '../../components/DisclaimerBanner'
import { runTriagePipeline } from '../../utils/triageEngine'
import { t } from '../../i18n/translations'

export default function UploadReport() {
  const { id } = useParams()
  const { cases, updateCase, language, auth } = useApp()
  const navigate = useNavigate()
  const caseData = cases.find((c) => c.id === id)
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  if (!caseData) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-slate-500">Case not found. Please start a new entry.</div>
  }

  const handleFiles = async (fileList) => {
    const arr = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (arr.length === 0) return
    setProcessing(true)
    const Tesseract = await import('tesseract.js')
    const results = []
    for (const file of arr) {
      try {
        const { data } = await Tesseract.recognize(file, 'eng')
        results.push({ fileName: file.name, text: data.text, preview: URL.createObjectURL(file) })
      } catch (e) {
        results.push({ fileName: file.name, text: '', preview: URL.createObjectURL(file), error: true })
      }
    }
    setFiles((prev) => [...prev, ...results])
    setProcessing(false)
  }

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx))

  const finalize = (skip = false) => {
    const reportTexts = skip ? [] : files.map((f) => ({ fileName: f.fileName, text: f.text }))
    const result = runTriagePipeline({ patient: caseData.patient, rawText: caseData.rawText, reportTexts })
    updateCase(id, () => ({
      reportFiles: files.map((f) => ({ fileName: f.fileName, text: f.text })),
      entities: result.entities,
      missingInfo: result.missingInfo,
      urgency: result.urgency,
      triageNote: result.triageNote,
      auditLog: [...(caseData.auditLog || []), {
        action: skip ? 'Report upload skipped' : `${files.length} report(s) processed via OCR`,
        by: auth.patient?.name, at: new Date().toISOString(),
      }],
    }))
    navigate(`/patient/review/${id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{t(language, 'uploadReport')}</h1>
      <p className="text-slate-500 text-sm mb-6">Step 2 of 3 — Optional: add a lab report or prescription image</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`bg-white border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-300'
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <UploadCloud className="w-10 h-10 text-brand-500 mx-auto mb-3" />
        <p className="text-slate-600 font-medium text-sm">{t(language, 'dragDropReport')}</p>
        <p className="text-xs text-slate-400 mt-1">JPG or PNG images of lab reports, prescriptions, or vitals charts</p>
      </div>

      {processing && (
        <div className="flex items-center justify-center gap-2 mt-5 text-brand-600 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin" /> {t(language, 'processingOcr')}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-5 space-y-3">
          {files.map((f, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3">
              {f.preview && <img src={f.preview} alt="" className="w-16 h-16 object-cover rounded-lg border border-slate-100 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-sm font-medium text-slate-700 truncate">{f.fileName}</p>
                  {!f.error && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                  {f.error ? 'Could not extract text — file will still be attached.' : (f.text?.trim().slice(0, 180) || 'No readable text detected.')}
                </p>
              </div>
              <button onClick={() => removeFile(i)} className="text-slate-300 hover:text-red-500 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-7">
        <button onClick={() => finalize(true)} className="flex-1 border border-slate-300 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50">
          {t(language, 'skipToReview')}
        </button>
        <button
          onClick={() => finalize(false)}
          disabled={processing}
          className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {t(language, 'next')} <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-6"><DisclaimerBanner compact /></div>
    </div>
  )
}
