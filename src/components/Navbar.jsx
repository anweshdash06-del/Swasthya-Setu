import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Activity, Globe2, Menu, X, LogOut, UserRound, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { LANGUAGES, t } from '../i18n/translations'

export default function Navbar() {
  const { language, setLanguage, auth, logoutPatient, logoutWorker } = useApp()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const navItem = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-brand-100 text-brand-700' : 'text-slate-600 hover:bg-slate-100'}`

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-teal-glow flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-slate-800 text-sm sm:text-base">{t(language, 'appName')}</p>
            <p className="text-[10px] sm:text-xs text-slate-500 -mt-0.5">{t(language, 'tagline')}</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <NavLink to="/" end className={navItem}>{t(language, 'home')}</NavLink>
          <NavLink to="/about" className={navItem}>{t(language, 'about')}</NavLink>
          <NavLink to="/privacy" className={navItem}>{t(language, 'privacy')}</NavLink>
          {auth.patient && <NavLink to="/patient/dashboard" className={navItem}>{t(language, 'patientPortal')}</NavLink>}
          {auth.worker && <NavLink to="/worker/dashboard" className={navItem}>{t(language, 'workerPortal')}</NavLink>}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5 bg-white">
            <Globe2 className="w-4 h-4 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm bg-transparent outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.native}</option>
              ))}
            </select>
          </div>

          {auth.patient ? (
            <button onClick={() => { logoutPatient(); navigate('/') }} className="hidden md:flex items-center gap-1 text-sm text-slate-600 hover:text-red-600 px-2">
              <LogOut className="w-4 h-4" /> {auth.patient.name.split(' ')[0]}
            </button>
          ) : auth.worker ? (
            <button onClick={() => { logoutWorker(); navigate('/') }} className="hidden md:flex items-center gap-1 text-sm text-slate-600 hover:text-red-600 px-2">
              <LogOut className="w-4 h-4" /> {auth.worker.name.split(' ')[0]}
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/patient/login" className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg text-brand-700 hover:bg-brand-50">
                <UserRound className="w-4 h-4" /> {t(language, 'patientPortal')}
              </Link>
              <Link to="/worker/login" className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900">
                <Stethoscope className="w-4 h-4" /> {t(language, 'workerPortal')}
              </Link>
            </div>
          )}

          <button className="lg:hidden p-2" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          <NavLink to="/" end onClick={() => setOpen(false)} className={navItem}>{t(language, 'home')}</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)} className={navItem}>{t(language, 'about')}</NavLink>
          <NavLink to="/privacy" onClick={() => setOpen(false)} className={navItem}>{t(language, 'privacy')}</NavLink>
          {auth.patient && <NavLink to="/patient/dashboard" onClick={() => setOpen(false)} className={navItem}>{t(language, 'patientPortal')}</NavLink>}
          {auth.worker && <NavLink to="/worker/dashboard" onClick={() => setOpen(false)} className={navItem}>{t(language, 'workerPortal')}</NavLink>}
          {!auth.patient && !auth.worker && (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/patient/login" onClick={() => setOpen(false)} className="text-center py-2 rounded-lg bg-brand-50 text-brand-700 font-medium">{t(language, 'patientPortal')}</Link>
              <Link to="/worker/login" onClick={() => setOpen(false)} className="text-center py-2 rounded-lg bg-slate-800 text-white font-medium">{t(language, 'workerPortal')}</Link>
            </div>
          )}
          {(auth.patient || auth.worker) && (
            <button
              onClick={() => { auth.patient ? logoutPatient() : logoutWorker(); setOpen(false); navigate('/') }}
              className="w-full text-center py-2 rounded-lg bg-red-50 text-red-600 font-medium flex items-center justify-center gap-1"
            >
              <LogOut className="w-4 h-4" /> {t(language, 'logout')}
            </button>
          )}
          <div className="pt-2 flex items-center gap-1">
            <Globe2 className="w-4 h-4 text-slate-400" />
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.native}</option>)}
            </select>
          </div>
        </div>
      )}
    </header>
  )
}
