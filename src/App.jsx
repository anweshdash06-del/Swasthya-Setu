import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { RequirePatient, RequireWorker } from './components/ProtectedRoute'

import Home from './pages/Home'
import About from './pages/About'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'

import PatientLogin from './pages/patient/PatientLogin'
import PatientDashboard from './pages/patient/PatientDashboard'
import NewEntry from './pages/patient/NewEntry'
import UploadReport from './pages/patient/UploadReport'
import ReviewSubmit from './pages/patient/ReviewSubmit'
import Timeline from './pages/patient/Timeline'
import PatientReport from './pages/patient/PatientReport'

import WorkerLogin from './pages/worker/WorkerLogin'
import WorkerDashboard from './pages/worker/WorkerDashboard'
import PatientDetail from './pages/worker/PatientDetail'
import ReferralNote from './pages/worker/ReferralNote'
import Analytics from './pages/worker/Analytics'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/dashboard" element={<RequirePatient><PatientDashboard /></RequirePatient>} />
          <Route path="/patient/new-entry" element={<RequirePatient><NewEntry /></RequirePatient>} />
          <Route path="/patient/upload-report/:id" element={<RequirePatient><UploadReport /></RequirePatient>} />
          <Route path="/patient/review/:id" element={<RequirePatient><ReviewSubmit /></RequirePatient>} />
          <Route path="/patient/timeline" element={<RequirePatient><Timeline /></RequirePatient>} />
          <Route path="/patient/report/:id" element={<RequirePatient><PatientReport /></RequirePatient>} />

          <Route path="/worker/login" element={<WorkerLogin />} />
          <Route path="/worker/dashboard" element={<RequireWorker><WorkerDashboard /></RequireWorker>} />
          <Route path="/worker/patient/:id" element={<RequireWorker><PatientDetail /></RequireWorker>} />
          <Route path="/worker/referral/:id" element={<RequireWorker><ReferralNote /></RequireWorker>} />
          <Route path="/worker/analytics" element={<RequireWorker><Analytics /></RequireWorker>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}