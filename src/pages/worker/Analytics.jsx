import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Users, ShieldAlert, Clock3, CheckCircle2 } from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import { useApp } from '../../context/AppContext'

const URGENCY_COLORS = { Emergency: '#ef4444', Urgent: '#f97316', Priority: '#f59e0b', Routine: '#10b981' }

export default function Analytics() {
  const { cases } = useApp()
  const active = useMemo(() => cases.filter((c) => c.status !== 'draft'), [cases])

  const urgencyData = useMemo(() => {
    const counts = { Emergency: 0, Urgent: 0, Priority: 0, Routine: 0 }
    active.forEach((c) => { counts[c.urgency.category] = (counts[c.urgency.category] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [active])

  const facilityData = useMemo(() => {
    const map = {}
    active.forEach((c) => {
      const f = c.patient.facility || 'Unknown'
      map[f] = (map[f] || 0) + 1
    })
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6)
  }, [active])

  const categoryBreakdown = useMemo(() => {
    const map = {}
    active.forEach((c) => {
      c.entities.symptoms.forEach((s) => { map[s.category] = (map[s.category] || 0) + 1 })
    })
    return Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8)
  }, [active])

  const timelineData = useMemo(() => {
    const map = {}
    active.forEach((c) => {
      const day = new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      map[day] = (map[day] || 0) + 1
    })
    return Object.entries(map).map(([day, count]) => ({ day, count }))
  }, [active])

  const stats = {
    total: active.length,
    emergency: active.filter((c) => c.urgency.category === 'Emergency').length,
    approved: active.filter((c) => c.status === 'approved' || c.status === 'referred').length,
    avgScore: active.length ? Math.round(active.reduce((s, c) => s + c.urgency.score, 0) / active.length) : 0,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/worker/dashboard" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to queue
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Triage Analytics</h1>
      <p className="text-slate-500 text-sm mb-6">Facility-level insight into caseload and urgency distribution — for operational planning only.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} label="Total cases" value={stats.total} color="text-brand-600 bg-brand-50" />
        <StatCard icon={ShieldAlert} label="Emergency cases" value={stats.emergency} color="text-red-600 bg-red-50" />
        <StatCard icon={CheckCircle2} label="Reviewed / referred" value={stats.approved} color="text-emerald-600 bg-emerald-50" />
        <StatCard icon={TrendingUp} label="Avg. attention score" value={`${stats.avgScore}/100`} color="text-slate-700 bg-slate-100" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Cases by urgency category">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={urgencyData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {urgencyData.map((d) => <Cell key={d.name} fill={URGENCY_COLORS[d.name]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cases received over time">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top facilities by case volume">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={facilityData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Symptom category frequency">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <Clock3 className="w-3.5 h-3.5 shrink-0" />
        Analytics are computed locally from on-device triage data for this demo session and are never sent to an external server.
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

function ChartCard({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
      {children}
    </div>
  )
}
