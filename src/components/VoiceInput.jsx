import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { LANGUAGES, t } from '../i18n/translations'

export default function VoiceInput({ onResult }) {
  const { language } = useApp()
  const [recording, setRecording] = useState(false)
  const [supported, setSupported] = useState(true)
  const [interim, setInterim] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }
    const recog = new SpeechRecognition()
    recog.continuous = true
    recog.interimResults = true
    recog.lang = LANGUAGES.find((l) => l.code === language)?.speechLocale || 'en-IN'

    recog.onresult = (event) => {
      let finalText = ''
      let interimText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) finalText += transcript + ' '
        else interimText += transcript
      }
      if (finalText) onResult(finalText)
      setInterim(interimText)
    }
    recog.onerror = () => setRecording(false)
    recog.onend = () => setRecording(false)

    recognitionRef.current = recog
    return () => recog.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  const toggle = () => {
    if (!recognitionRef.current) return
    if (recording) {
      recognitionRef.current.stop()
      setRecording(false)
    } else {
      try {
        recognitionRef.current.start()
        setRecording(true)
      } catch (e) { /* already started */ }
    }
  }

  if (!supported) {
    return (
      <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <AlertCircle className="w-4 h-4 shrink-0" />
        Voice input isn't supported in this browser. Please use Chrome, or type your symptoms instead.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        className={`mic-btn ${recording ? 'recording' : ''} w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          recording ? 'bg-red-500' : 'bg-brand-600 hover:bg-brand-700'
        }`}
      >
        {recording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
      </button>
      <p className="text-sm font-medium text-slate-600">
        {recording ? t(language, 'listening') : t(language, 'speak')}
      </p>
      {interim && <p className="text-xs text-slate-400 italic max-w-xs text-center">{interim}</p>}
    </div>
  )
}
