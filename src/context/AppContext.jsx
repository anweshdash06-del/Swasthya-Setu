import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import {
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
} from 'firebase/auth'
import {
  doc, setDoc, getDoc, deleteDoc, getDocs, updateDoc,
  collection, onSnapshot, query, orderBy, where,
} from 'firebase/firestore'
import { auth as firebaseAuth, db } from '../firebase'
import { buildSeedPatients } from '../utils/sampleData'

const AppContext = createContext(null)
const LANG_KEY = 'swasthyasetu_lang_v1'

// Only these emails are allowed to register/sign in as a healthcare worker.
// Add more entries here (comma-separated) if other staff need access.
export const ALLOWED_WORKER_EMAILS = ['worker@swasthyasetu.app']

export function AppProvider({ children }) {
  // ---- Cases: live-synced from Firestore (shared across every device) ----
  const [cases, setCases] = useState([])
  const [casesLoading, setCasesLoading] = useState(true)
  const casesRef = useRef([])
  casesRef.current = cases
  const seededRef = useRef(false)

  const addCase = useCallback(async (newCase) => {
    await setDoc(doc(db, 'cases', newCase.id), newCase)
    return newCase
  }, [])

  const updateCase = useCallback(async (id, updater) => {
    const current = casesRef.current.find((c) => c.id === id) || { id }
    const patch = updater(current)
    await updateDoc(doc(db, 'cases', id), patch)
  }, [])

  const appendAudit = useCallback(async (id, action, by) => {
    const current = casesRef.current.find((c) => c.id === id)
    if (!current) return
    await updateDoc(doc(db, 'cases', id), {
      auditLog: [...(current.auditLog || []), { action, by, at: new Date().toISOString() }],
    })
  }, [])

  const resetDemoData = useCallback(async () => {
    const snap = await getDocs(collection(db, 'cases'))
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
    const seeds = buildSeedPatients()
    await Promise.all(seeds.map((s) => setDoc(doc(db, 'cases', s.id), s)))
  }, [])

  // ---- Auth: real Firebase accounts, one role signed in at a time ----
  const [auth, setAuth] = useState({ patient: null, worker: null })
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) { setAuth({ patient: null, worker: null }); setAuthLoading(false); return }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (!snap.exists()) { setAuth({ patient: null, worker: null }); setAuthLoading(false); return }
        const data = snap.data()
        if (data.role === 'patient') setAuth({ patient: { uid: user.uid, email: user.email, ...data.profile }, worker: null })
        else if (data.role === 'worker') setAuth({ patient: null, worker: { uid: user.uid, email: user.email, ...data.profile } })
        else setAuth({ patient: null, worker: null })
      } catch (e) {
        setAuth({ patient: null, worker: null })
      }
      setAuthLoading(false)
    })
    return unsub
  }, [])

  // ---- Cases subscription: scoped by role ----
  // Firestore security rules are NOT filters: a patient may only read their own
  // cases, so a patient's query must be restricted to their own uid. Workers
  // read the whole shared queue. Nobody signed in -> nothing to subscribe to.
  const patientUid = auth.patient?.uid
  const workerUid = auth.worker?.uid
  useEffect(() => {
    if (authLoading) return
    if (!patientUid && !workerUid) {
      setCases([])
      setCasesLoading(false)
      return
    }
    setCasesLoading(true)
    const q = workerUid
      ? query(collection(db, 'cases'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'cases'), where('patient.uid', '==', patientUid))
    const unsub = onSnapshot(
      q,
      async (snap) => {
        if (workerUid && snap.empty && !seededRef.current) {
          // Brand-new project: a worker's first visit seeds the demo data once.
          seededRef.current = true
          try {
            await Promise.all(buildSeedPatients().map((s) => setDoc(doc(db, 'cases', s.id), s)))
          } catch (e) { /* ignore seed errors */ }
          return
        }
        const list = snap.docs.map((d) => d.data())
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setCases(list)
        setCasesLoading(false)
      },
      (err) => {
        console.error('Could not load cases:', err)
        setCasesLoading(false)
      }
    )
    return unsub
  }, [authLoading, patientUid, workerUid])

  const signUpPatient = useCallback(async (email, password, profile) => {
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password)
    await setDoc(doc(db, 'users', cred.user.uid), { role: 'patient', profile, createdAt: new Date().toISOString() })
    setAuth({ patient: { uid: cred.user.uid, email, ...profile }, worker: null })
  }, [])

  const signInPatient = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(firebaseAuth, email, password)
    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    if (!snap.exists() || snap.data().role !== 'patient') {
      await signOut(firebaseAuth)
      throw new Error('No patient account found for these credentials. Please sign up first.')
    }
    const data = snap.data()
    setAuth({ patient: { uid: cred.user.uid, email, ...data.profile }, worker: null })
  }, [])

  const signUpWorker = useCallback(async (email, password, profile) => {
    if (!ALLOWED_WORKER_EMAILS.includes(email.trim().toLowerCase())) {
      throw new Error('This email is not authorized to register as a healthcare worker.')
    }
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password)
    await setDoc(doc(db, 'users', cred.user.uid), { role: 'worker', profile, createdAt: new Date().toISOString() })
    setAuth({ worker: { uid: cred.user.uid, email, ...profile }, patient: null })
  }, [])

  const signInWorker = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(firebaseAuth, email, password)
    const snap = await getDoc(doc(db, 'users', cred.user.uid))
    if (!snap.exists() || snap.data().role !== 'worker') {
      await signOut(firebaseAuth)
      throw new Error('No healthcare-worker account found for these credentials. Please sign up first.')
    }
    const data = snap.data()
    setAuth({ worker: { uid: cred.user.uid, email, ...data.profile }, patient: null })
  }, [])

  const logout = useCallback(async () => {
    await signOut(firebaseAuth)
    setAuth({ patient: null, worker: null })
  }, [])
  // Kept as two names so existing screens (Navbar etc.) don't need to change.
  const logoutPatient = logout
  const logoutWorker = logout

  // ---- Language preference (local, non-sensitive UI setting) ----
  const [language, setLanguage] = useState(() => localStorage.getItem(LANG_KEY) || 'en')
  useEffect(() => { localStorage.setItem(LANG_KEY, language) }, [language])

  const value = {
    cases, casesLoading, addCase, updateCase, appendAudit, resetDemoData,
    auth, authLoading,
    signUpPatient, signInPatient, signUpWorker, signInWorker,
    logoutPatient, logoutWorker,
    language, setLanguage,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}