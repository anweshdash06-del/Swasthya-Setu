// -----------------------------------------------------------------------
// Firebase initialization for SwasthyaSetu
// Firestore = shared cloud database (works across every device/phone)
// Auth      = patient / healthcare-worker accounts (email + password)
// -----------------------------------------------------------------------
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDqUxmZZpA_7lXdX9L_cwLVEQcBadH9QVk',
  authDomain: 'swasthyasetu-24b36.firebaseapp.com',
  projectId: 'swasthyasetu-24b36',
  storageBucket: 'swasthyasetu-24b36.appspot.com',
  messagingSenderId: '929349738687',
  appId: '1:929349738687:web:2bacbb9fe42d5f6fc9e60a',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
