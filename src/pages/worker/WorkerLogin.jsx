import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stethoscope, ShieldCheck, Loader2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const ROLES = ['Nurse', 'Doctor', 'Medical Officer', 'Health Worker']

export default function WorkerLogin() {
  const { signUpWorker, signInWorker } = useApp()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [form, setForm] = useState({ name: '', role: 'Nurse', facility: '', staffId: '', email: '', password: '' })
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
        await signInWorker(form.email.trim(), form.password)
        navigate('/worker/dashboard')
      } catch (err) {
        setError(err.message?.replace('Firebase: ', '') || 'Could not log in. Please check your details.')
      } finally {
        setLoading(false)
      }
      return
    }

    if (!form.name || !form.staffId) {
      setError('Please enter your name and staff ID.')
      return
    }
    setLoading(true)
    try {
      await signUpWorker(form.email.trim(), form.password, {
        name: form.name, role: form.role, facility: form.facility || 'Not specified', staffId: form.staffId,
      })
      navigate('/worker/dashboard')
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'Could not create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Health Worker Portal</h1>
        <p className="text-slate-500 text-sm mt-1">Role-based access. Your queue syncs across every device you log in from.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`py-2.5 rounded-xl text-sm font-semibold border transition ${mode === 'signup' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600'}`}
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`py-2.5 rounded-xl text-sm font-semibold border transition ${mode === 'login' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600'}`}
        >
          Log in
        </button>
      </div>

      <form onSubmit={submit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <Field label="Email">
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input" placeholder="you@facility.gov.in" />
        </Field>
        <Field label="Password">
          <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} className="input" placeholder="Min. 6 characters" />
        </Field>

        {mode === 'signup' && (
          <>
            <Field label="Full name">
              <input value={form.name} onChange={(e) => update('name', e.target.value)} className="input" placeholder="e.g. Dr. Priya Mohanty" />
            </Field>
            <Field label="Role">
              <select value={form.role} onChange={(e) => update('role', e.target.value)} className="input">
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Staff ID">
              <input value={form.staffId} onChange={(e) => update('staffId', e.target.value)} className="input" placeholder="e.g. OD-STF-0245" />
            </Field>
            <Field label="Facility">
              <input value={form.facility} onChange={(e) => update('facility', e.target.value)} className="input" placeholder="e.g. PHC Balasore" />
            </Field>
          </>
        )}

        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          {mode === 'signup' ? 'Create account & enter dashboard' : 'Log in'}
        </button>
      </form>

      <p className="text-xs text-slate-400 text-center mt-5">
        In a production deployment this would be backed by hospital-issued credentials and full RBAC.
        For this prototype, any staff ID can self-register.
      </p>

      <style>{`.input { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.65rem; padding: 0.6rem 0.75rem; font-size: 0.9rem; outline: none; } .input:focus { border-color: #1e293b; box-shadow: 0 0 0 3px rgba(30,41,59,0.12); }`}</style>
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
