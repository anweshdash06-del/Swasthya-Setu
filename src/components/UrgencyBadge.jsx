import { AlertTriangle, Clock, ArrowUpCircle, CheckCircle2 } from 'lucide-react'
import { URGENCY_STYLES } from '../utils/triageEngine'

const ICONS = {
  Emergency: AlertTriangle,
  Urgent: ArrowUpCircle,
  Priority: Clock,
  Routine: CheckCircle2,
}

export default function UrgencyBadge({ category, size = 'md' }) {
  const style = URGENCY_STYLES[category] || URGENCY_STYLES.Routine
  const Icon = ICONS[category] || CheckCircle2
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-3 py-1 gap-1.5'
  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${style.badge} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      {category}
    </span>
  )
}
