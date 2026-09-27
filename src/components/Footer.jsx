import { Link } from 'react-router-dom'
import { Activity, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-teal-glow flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">SwasthyaSetu</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            A human-in-the-loop triage assistant prototype built for Smart India Hackathon — helping
            government hospitals, PHCs, health camps, and campus clinics organize patient information faster.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white mb-3 text-sm">Quick Links</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/about" className="hover:text-white">How it works</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy & Consent</Link></li>
            <li><Link to="/patient/login" className="hover:text-white">Patient Portal</Link></li>
            <li><Link to="/worker/login" className="hover:text-white">Health Worker Portal</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-3 text-sm">Responsible AI</p>
          <div className="flex items-start gap-2 text-sm text-slate-400">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-teal-glow" />
            <span>Non-diagnostic by design. All AI output is advisory and reviewer-facing only — every case requires sign-off by a qualified healthcare worker.</span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        Built for Smart India Hackathon — Prototype uses synthetic demo data only. Not for real clinical use.
      </div>
    </footer>
  )
}
