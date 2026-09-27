import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <Compass className="w-14 h-14 text-brand-500 mx-auto mb-4" />
      <h1 className="text-3xl font-extrabold text-slate-900">Page not found</h1>
      <p className="text-slate-500 mt-2">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="inline-block mt-6 bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700">
        Back to Home
      </Link>
    </div>
  )
}
