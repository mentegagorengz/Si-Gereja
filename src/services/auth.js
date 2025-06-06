import { db } from './firebase'
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore'
import CryptoJS from 'crypto-js'

const COLLECTION_NAME = 'jemaat'

/**
 * Mendapatkan semua nama jemaat untuk fitur autocomplete
 * @returns {Promise<Array>} Array berisi data nama jemaat
 */
export async function getAllJemaatNames() {
  try {
    const jemaatRef = collection(db, COLLECTION_NAME)
    const querySnapshot = await getDocs(jemaatRef)
    
    const namesList = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.nama) {
        namesList.push({
          id: doc.id,
          nama: data.nama,
          sektor: data.sektor || null,
          status: data.status || null,
          isRegistered: data.isRegistered || false
        })
      }
    })
    
    // Sort alphabetically
    namesList.sort((a, b) => a.nama.localeCompare(b.nama))
    
    return namesList
  } catch (error) {
    console.error('Error getting jemaat names:', error)
    throw error
  }
}

/**
 * Mengecek apakah nama jemaat ada di database
 * @param {string} nama - Nama yang akan dicek
 * @returns {Promise<boolean>} True jika nama ditemukan
 */
export async function checkJemaatExists(nama) {
  try {
    if (!nama || typeof nama !== 'string') {
      return false
    }

    const cleanNama = nama.trim()
    const jemaatRef = collection(db, COLLECTION_NAME)
    
    // Coba exact match dulu
    const exactQuery = query(jemaatRef, where('nama', '==', cleanNama))
    const exactSnapshot = await getDocs(exactQuery)
    
    if (!exactSnapshot.empty) {
      return true
    }
    
    // Fallback: case-insensitive search
    const allSnapshot = await getDocs(jemaatRef)
    const foundMatch = findCaseInsensitiveMatch(allSnapshot, cleanNama)
    
    return !!foundMatch
  } catch (error) {
    console.error('Error checking jemaat exists:', error)
    throw error
  }
}

/**
 * Mendapatkan document ID berdasarkan nama jemaat
 * @param {string} nama - Nama jemaat
 * @returns {Promise<string>} Document ID
 */
export async function getJemaatDocId(nama) {
  try {
    if (!nama || typeof nama !== 'string') {
      throw new Error('Nama parameter tidak valid')
    }

    const cleanNama = nama.trim()
    const jemaatRef = collection(db, COLLECTION_NAME)
    
    // Coba exact match dulu
    const exactQuery = query(jemaatRef, where('nama', '==', cleanNama))
    const exactSnapshot = await getDocs(exactQuery)
    
    if (!exactSnapshot.empty) {
      return exactSnapshot.docs[0].id
    }
    
    // Fallback: case-insensitive search
    const allSnapshot = await getDocs(jemaatRef)
    const foundDoc = findCaseInsensitiveMatch(allSnapshot, cleanNama)
    
    if (foundDoc) {
      return foundDoc.id
    }
    
    throw new Error(`Nama "${nama}" tidak ditemukan di database`)
  } catch (error) {
    console.error('Error getting jemaat doc ID:', error)
    throw error
  }
}

/**
 * Registrasi jemaat baru
 * @param {string} nama - Nama jemaat
 * @param {string} password - Password
 * @param {Object} userData - Data tambahan user
 * @returns {Promise<boolean>} Success status
 */
export async function registerJemaat(nama, password, userData) {
  try {
    if (!nama || !password) {
      throw new Error('Nama dan password harus diisi')
    }

    if (!userData || typeof userData !== 'object') {
      throw new Error('Data user tidak valid')
    }
    
    // Cek apakah nama exists
    const nameExists = await checkJemaatExists(nama)
    if (!nameExists) {
      throw new Error('Nama anda belum terdaftar, segera hubungi gembala/admin')
    }
    
    const docId = await getJemaatDocId(nama)
    const jemaatRef = doc(db, COLLECTION_NAME, docId)
    const jemaatDoc = await getDoc(jemaatRef)
    
    if (!jemaatDoc.exists()) {
      throw new Error('Data jemaat tidak ditemukan')
    }
    
    const jemaatData = jemaatDoc.data()
    
    // Cek apakah sudah terdaftar
    if (jemaatData.isRegistered === true) {
      throw new Error('Akun dengan nama ini sudah terdaftar')
    }
    
    const encryptedPassword = CryptoJS.SHA256(password).toString()
    
    // Update data jemaat
    await updateDoc(jemaatRef, {
      password: encryptedPassword,
      isRegistered: true,
      tanggalLahir: userData.tanggalLahir,
      status: userData.status,
      sektor: userData.sektor,
      registeredAt: new Date()
    })
    
    return true
  } catch (error) {
    console.error('Error registering jemaat:', error)
    throw error
  }
}

/**
 * Login jemaat
 * @param {string} nama - Nama jemaat
 * @param {string} password - Password
 * @returns {Promise<Object>} Data user yang login
 */
export async function loginJemaat(nama, password) {
  try {
    // Validasi input
    if (!nama || typeof nama !== 'string') {
      throw new Error('Nama harus diisi dengan benar')
    }
    
    if (!password || typeof password !== 'string') {
      throw new Error('Password harus diisi dengan benar')
    }

    const jemaatRef = collection(db, COLLECTION_NAME)
    const cleanNama = nama.trim()
    
    // Coba exact match dulu
    const exactQuery = query(jemaatRef, where('nama', '==', cleanNama))
    const exactSnapshot = await getDocs(exactQuery)
    
    let jemaatDoc = null
    let jemaatData = null
    
    if (!exactSnapshot.empty) {
      jemaatDoc = exactSnapshot.docs[0]
      jemaatData = jemaatDoc.data()
    } else {
      // Fallback: case-insensitive search
      const allSnapshot = await getDocs(jemaatRef)
      const foundDoc = findCaseInsensitiveMatch(allSnapshot, cleanNama)
      
      if (foundDoc) {
        jemaatDoc = foundDoc
        jemaatData = foundDoc.data()
      }
      
      if (!jemaatDoc) {
        throw new Error(`Nama "${nama}" tidak ditemukan di database`)
      }
    }
    
    return await verifyAndLogin(jemaatDoc, jemaatData, password)
  } catch (error) {
    console.error('Error logging in jemaat:', error)
    throw error
  }
}

/**
 * Logout jemaat
 * @returns {Promise<boolean>} Success status
 */
export async function logoutJemaat() {
  try {
    localStorage.removeItem('user')
    return true
  } catch (error) {
    console.error('Error logging out:', error)
    return false
  }
}

/**
 * Mendapatkan data jemaat yang sedang login
 * @returns {Promise<Object|null>} Data user atau null
 */
export async function getCurrentJemaat() {
  try {
    const userDataString = localStorage.getItem('user')
    
    if (!userDataString) {
      return null
    }
    
    const userData = JSON.parse(userDataString)
    
    // Validasi data
    if (!userData.nama) {
      localStorage.removeItem('user') // Clear invalid data
      return null
    }
    
    return userData
  } catch (error) {
    console.error('Error getting current jemaat:', error)
    localStorage.removeItem('user') // Clear corrupted data
    return null
  }
}

// ===== HELPER FUNCTIONS =====

/**
 * Mencari match case-insensitive dari snapshot
 * @param {Object} snapshot - Firestore snapshot
 * @param {string} nama - Nama yang dicari
 * @returns {Object|null} Document yang ditemukan atau null
 */
function findCaseInsensitiveMatch(snapshot, nama) {
  let foundDoc = null
  
  snapshot.forEach((doc) => {
    const data = doc.data()
    if (data.nama && data.nama.toLowerCase().trim() === nama.toLowerCase()) {
      foundDoc = doc
    }
  })
  
  return foundDoc
}

/**
 * Verifikasi dan proses login
 * @param {Object} jemaatDoc - Document jemaat
 * @param {Object} jemaatData - Data jemaat
 * @param {string} password - Password
 * @returns {Promise<Object>} Data user yang login
 */
async function verifyAndLogin(jemaatDoc, jemaatData, password) {
  // Cek apakah sudah terdaftar
  if (!jemaatData.isRegistered) {
    throw new Error('Akun belum terdaftar. Silakan registrasi terlebih dahulu.')
  }
  
  // Verifikasi password
  const encryptedPassword = CryptoJS.SHA256(password).toString()
  
  if (jemaatData.password !== encryptedPassword) {
    throw new Error('Password tidak sesuai')
  }
  
  // Return data jemaat (hapus password untuk keamanan)
  const userData = {
    id: jemaatDoc.id,
    ...jemaatData
  }
  
  delete userData.password
  
  return userData
}