import { ShieldAlert } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { t } from '../i18n/translations'

export default function DisclaimerBanner({ compact = false }) {
  const { language } = useApp()
  if (compact) {
    return (
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg px-3 py-2">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <p>{t(language, 'disclaimerShort')}</p>
      </div>
    )
  }
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 text-amber-900">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">
          <span className="font-bold">AI-Assisted Triage — Not AI Diagnosis.</span>{' '}
          {t(language, 'disclaimerShort')}
        </p>
      </div>
    </div>
  )
}
