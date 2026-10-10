import { useState } from 'react'
import { Cpu, Activity, Heart, Thermometer, Gauge, RefreshCcw, CheckCircle2, X } from 'lucide-react'
import { generateVitalsReading } from '../utils/vitalsSimulator'
import { scanVitals } from '../utils/triageEngine'

/**
 * Lets a patient (or the worker at intake) simulate connecting a vitals
 * device — pulse oximeter / BP cuff / thermometer — so the system can show
 * it accepting data directly FROM A MACHINE, not just from typed text.
 * Calls onCapture(vitalsObject | null) whenever the attached reading changes.
 */
export default function VitalsDeviceSimulator({ onCapture, vitals, setVitals }) {
  const [reading, setReading] = useState(false)

  const connect = () => {
    setReading(true)
    setTimeout(() => {
      const v = generateVitalsReading()
      setVitals(v)
      onCapture(v)
      setReading(false)
    }, 1800)
  }

  const clear = () => {
    setVitals(null)
    onCapture(null)
  }

  const flags = vitals ? scanVitals(vitals) : []

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <Cpu className="w-4 h-4 text-teal-600" />
        <h3 className="text-sm font-semibold text-slate-700">Connect a vitals device (demo)</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Simulates a pulse oximeter / BP cuff / thermometer sending a reading straight into this case —
        no typing required. Demonstrates machine-to-system data flow.
      </p>

      {!vitals && !reading && (
        <button
          onClick={connect}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-teal-300 text-teal-700 font-medium text-sm py-3 rounded-xl hover:bg-teal-50 transition"
        >
          <Activity className="w-4 h-4" /> Connect Vitals Device
        </button>
      )}

      {reading && (
        <div className="flex items-center justify-center gap-2 py-5 text-teal-600 text-sm font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse-dot" />
          Reading vitals…
        </div>
      )}

      {vitals && !reading && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <VitalChip icon={Heart} label="Heart rate" value={`${vitals.heartRate} bpm`} bad={vitals.heartRate >= 130 || vitals.heartRate <= 40} />
            <VitalChip icon={Activity} label="SpO2" value={`${vitals.spo2}%`} bad={vitals.spo2 < 92} />
            <VitalChip icon={Thermometer} label="Temp" value={`${vitals.tempF}°F`} bad={vitals.tempF >= 103} />
            <VitalChip icon={Gauge} label="BP" value={`${vitals.systolic}/${vitals.diastolic}`} bad={vitals.systolic >= 180} />
          </div>

          {flags.length > 0 ? (
            <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
              ⚠ {flags.length} abnormal reading{flags.length > 1 ? 's' : ''} detected — will be factored into urgency.
            </p>
          ) : (
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> All readings within normal range.
            </p>
          )}

          <div className="flex gap-2">
            <button onClick={connect} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium border border-slate-300 text-slate-600 py-2 rounded-lg hover:bg-slate-50">
              <RefreshCcw className="w-3.5 h-3.5" /> Re-scan
            </button>
            <button onClick={clear} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium border border-slate-300 text-slate-500 py-2 rounded-lg hover:bg-slate-50">
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function VitalChip({ icon: Icon, label, value, bad }) {
  return (
    <div className={`rounded-xl p-2.5 border text-center ${bad ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
      <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${bad ? 'text-red-500' : 'text-slate-400'}`} />
      <p className={`text-sm font-bold ${bad ? 'text-red-700' : 'text-slate-700'}`}>{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  )
}