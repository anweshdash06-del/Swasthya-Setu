import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, RefreshCcw, BarChart3, Users, ShieldAlert, Clock } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import UrgencyBadge from '../../components/UrgencyBadge'
import { URGENCY_STYLES } from '../../utils/triageEngine'

const URGENCY_ORDER = ['Emergency', 'Urgent', 'Priority', 'Routine']
const STATUS_FILTERS = ['all', 'pending', 'in-review', 'approved', 'referred']

export default function WorkerDashboard() {
  const { auth, cases, resetDemoData } = useApp()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')

  const filtered = useMemo(() => {
    return cases
      .filter((c) => c.status !== 'draft')
      .filter((c) => (statusFilter === 'all' ? true : c.status === statusFilter))
      .filter((c) => (urgencyFilter === 'all' ? true : c.urgency.category === urgencyFilter))
      .filter((c) => {
        if (!query) return true
        const q = query.toLowerCase()
        return c.patient.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.patient.phone.includes(q)
      })
      .sort((a, b) => {
        const rankDiff = URGENCY_ORDER.indexOf(a.urgency.category) - URGENCY_ORDER.indexOf(b.urgency.category)
        if (rankDiff !== 0) return rankDiff
        return new Date(a.createdAt) - new Date(b.createdAt)
      })
  }, [cases, statusFilter, urgencyFilter, query])

  const stats = useMemo(() => {
    const active = cases.filter((c) => c.status !== 'draft')
    return {
      total: active.length,
      emergency: active.filter((c) => c.urgency.category === 'Emergency').length,
      pending: active.filter((c) => c.status === 'pending').length,
      approved: active.filter((c) => c.status === 'approved').length,
    }
  }, [cases])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patient Queue</h1>
          <p className="text-slate-500 text-sm">{auth.worker?.role} &middot; {auth.worker?.facility}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/worker/analytics" className="flex items-center gap-1.5 text-sm font-medium border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50">
            <BarChart3 className="w-4 h-4" /> Analytics
          </Link>
          <button onClick={resetDemoData} className="flex items-center gap-1.5 text-sm font-medium border border-slate-300 px-3 py-2 rounded-lg hover:bg-slate-50">
            <RefreshCcw className="w-4 h-4" /> Reset demo data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Active cases" value={stats.total} color="text-brand-600 bg-brand-50" />
        <StatCard icon={ShieldAlert} label="Emergency" value={stats.emergency} color="text-red-600 bg-red-50" />
        <StatCard icon={Clock} label="Pending review" value={stats.pending} color="text-amber-600 bg-amber-50" />
        <StatCard icon={Users} label="Approved" value={stats.approved} color="text-emerald-600 bg-emerald-50" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, phone, or case ID" className="text-sm outline-none flex-1" />
        </div>
        <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
          <option value="all">All urgency levels</option>
          {URGENCY_ORDER.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
          {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 text-xs font-semibold uppercase text-slate-400 border-b border-slate-100">
          <div className="col-span-1"></div>
          <div className="col-span-3">Patient</div>
          <div className="col-span-3">Chief complaint</div>
          <div className="col-span-2">Urgency</div>
          <div className="col-span-2">Waiting since</div>
          <div className="col-span-1">Status</div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-slate-400 text-sm">No cases match your filters.</div>
        ) : (
          filtered.map((c) => {
            const style = URGENCY_STYLES[c.urgency.category]
            return (
              <Link
                key={c.id}
                to={`/worker/patient/${c.id}`}
                className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-3 items-center px-5 py-4 border-b last:border-0 border-slate-50 hover:bg-slate-50 transition"
              >
                <div className="col-span-2 sm:col-span-1">
                  <span className={`w-2.5 h-2.5 rounded-full inline-block ${style.dot} ${c.urgency.category === 'Emergency' ? 'pulse-ring' : ''}`} />
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-sm font-medium text-slate-800">{c.patient.name}</p>
                  <p className="text-xs text-slate-400">{c.patient.age}y &middot; {c.patient.gender} &middot; {c.id}</p>
                </div>
                <div className="col-span-2 sm:col-span-3 text-sm text-slate-600 truncate">{c.triageNote.chiefComplaint}</div>
                <div className="col-span-1 sm:col-span-2"><UrgencyBadge category={c.urgency.category} size="sm" /></div>
                <div className="col-span-1 sm:col-span-2 text-xs text-slate-500">{timeAgo(c.createdAt)}</div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">{c.status}</span>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  )
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
