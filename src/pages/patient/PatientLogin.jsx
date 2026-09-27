import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRound, ShieldCheck, Loader2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { LANGUAGES, t } from '../../i18n/translations'
import DisclaimerBanner from '../../components/DisclaimerBanner'

export default function PatientLogin() {
  const { language, setLanguage, signUpPatient, signInPatient } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [form, setForm] = useState({
    name: '', age: '', gender: 'male', phone: '', facility: '', pregnant: false, consent: false,
    email: '', password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please enter your email and a password (min. 6 characters).')
      return
    }

    if (mode === 'login') {
      setLoading(true)
      try {
        await signInPatient(form.email.trim(), form.password)
        navigate('/patient/dashboard')
      } catch (err) {
        setError(err.message?.replace('Firebase: ', '') || 'Could not log in. Please check your details.')
      } finally {
        setLoading(false)
      }
      return
    }

    // Sign up
    if (!form.name || !form.age || !form.phone) {
      setError('Please fill in your name, age, and phone number.')
      return
    }
    if (!form.consent) {
      setError('Please provide consent to continue — this is required before any information is processed.')
      return
    }
    setLoading(true)
    try {
      await signUpPatient(form.email.trim(), form.password, {
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        phone: form.phone,
        facility: form.facility || 'Not specified',
        pregnant: form.gender === 'female' ? form.pregnant : false,
      })
      navigate('/patient/dashboard')
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'Could not create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
          <UserRound className="w-7 h-7 text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{t(language, 'patientPortal')}</h1>
        <p className="text-slate-500 text-sm mt-1">
          Your account works from any phone or computer — your data is stored securely in the cloud.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`py-2.5 rounded-xl text-sm font-semibold border transition ${mode === 'signup' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-600'}`}
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`py-2.5 rounded-xl text-sm font-semibold border transition ${mode === 'login' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white border-slate-200 text-slate-600'}`}
        >
          Log in
        </button>
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs mb-1.5 font-medium text-slate-500">{t(language, 'selectLanguage')}</label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`py-2 rounded-lg text-sm font-medium border transition ${
                    language === l.code ? 'bg-brand-600 text-white border-brand-600' : 'border-slate-200 text-slate-600 hover:border-brand-300'
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        )}

        <Field label="Email">
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input" placeholder="you@example.com" />
        </Field>
        <Field label="Password">
          <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="input" placeholder="Min. 6 characters" />
        </Field>

        {mode === 'signup' && (
          <>
            <Field label={t(language, 'fullName')}>
              <input value={form.name} onChange={(e) => update('name', e.target.value)} className="input" placeholder="e.g. Ramesh Kumar" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label={t(language, 'age')}>
                <input type="number" min="0" max="120" value={form.age} onChange={(e) => update('age', e.target.value)} className="input" placeholder="35" />
              </Field>
              <Field label={t(language, 'gender')}>
                <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="input">
                  <option value="male">{t(language, 'male')}</option>
                  <option value="female">{t(language, 'female')}</option>
                  <option value="other">{t(language, 'other')}</option>
                </select>
              </Field>
            </div>

            {form.gender === 'female' && (
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.pregnant} onChange={(e) => update('pregnant', e.target.checked)} />
                Currently pregnant
              </label>
            )}

            <Field label={t(language, 'phone')}>
              <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input" placeholder="98XXXXXX21" />
            </Field>

            <Field label={t(language, 'facility')}>
              <input value={form.facility} onChange={(e) => update('facility', e.target.value)} className="input" placeholder="e.g. PHC Balasore" />
            </Field>

            <label className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <input type="checkbox" className="mt-0.5" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} />
              <span>
                I consent to my symptom information and uploaded reports being processed by this AI-assistance tool
                for triage support, and understand this is <strong>not a diagnosis</strong>. See{' '}
                <a href="/privacy" className="text-brand-600 underline">Privacy & Consent</a>.
              </span>
            </label>
          </>
        )}

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          {mode === 'signup' ? t(language, 'getStarted') : 'Log in'}
        </button>
      </form>

      <div className="mt-6"><DisclaimerBanner compact /></div>

      <style>{`.input { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.65rem; padding: 0.6rem 0.75rem; font-size: 0.9rem; outline: none; } .input:focus { border-color: #328eff; box-shadow: 0 0 0 3px rgba(50,142,255,0.15); }`}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs mb-1.5 font-medium text-slate-500">{label}</label>
      {children}
    </div>
  )
}
