// Import fungsi yang diperlukan dari Firebase SDK
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Konfigurasi Firebase - ganti dengan config proyekmu sendiri!
const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_KAMU",
  authDomain: "myrajawali.firebaseapp.com",
  projectId: "myrajawali",
  storageBucket: "myrajawali.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
const auth = getAuth(app)
const db = getFirestore(app)

// Export semua layanan yang akan digunakan
export { app, auth, db }