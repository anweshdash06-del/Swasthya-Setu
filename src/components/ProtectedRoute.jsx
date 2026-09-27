import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  )
}

export function RequirePatient({ children }) {
  const { auth, authLoading } = useApp()
  if (authLoading) return <Spinner />
  if (!auth.patient) return <Navigate to="/patient/login" replace />
  return children
}

export function RequireWorker({ children }) {
  const { auth, authLoading } = useApp()
  if (authLoading) return <Spinner />
  if (!auth.worker) return <Navigate to="/worker/login" replace />
  return children
}
