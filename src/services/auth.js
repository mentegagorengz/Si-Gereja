import { db } from './firebase'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'

// Cek apakah nama jemaat terdaftar di database
export const checkNamaExists = async (nama) => {
  try {
    const jemaatRef = collection(db, 'jemaat')
    const q = query(jemaatRef, where('nama', '==', nama))
    const querySnapshot = await getDocs(q)
    
    return !querySnapshot.empty
  } catch (error) {
    console.error('Error checking name:', error)
    throw error
  }
}

// Register jemaat dengan data lengkap
export const registerJemaat = async (userData) => {
  try {
    // Cek apakah nama sudah ada di database
    const jemaatRef = collection(db, 'jemaat')
    const q = query(jemaatRef, where('nama', '==', userData.nama))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      throw new Error('Nama anda belum terdaftar, segera hubungi gembala/admin')
    }

    // Update data jemaat yang sudah ada
    const jemaatDoc = querySnapshot.docs[0]
    const jemaatId = jemaatDoc.id
    
    await updateDoc(doc(db, 'jemaat', jemaatId), {
      password: userData.password,
      tanggalLahir: userData.tanggalLahir,
      status: userData.status,
      sektor: userData.sektor,
      isRegistered: true
    })

    return { ...userData, id: jemaatId }
  } catch (error) {
    console.error('Error registering:', error)
    throw error
  }
}

// Login jemaat dengan nama dan password
export const loginJemaat = async (nama, password) => {
  try {
    const jemaatRef = collection(db, 'jemaat')
    const q = query(jemaatRef, where('nama', '==', nama))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      throw new Error('Nama tidak ditemukan')
    }

    const jemaatData = querySnapshot.docs[0].data()
    const jemaatId = querySnapshot.docs[0].id
    
    if (!jemaatData.isRegistered) {
      throw new Error('Akun belum teregistrasi. Silakan register terlebih dahulu.')
    }
    
    if (jemaatData.password !== password) {
      throw new Error('Password tidak sesuai')
    }
    
    return { ...jemaatData, id: jemaatId }
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

// Simpan data login ke localStorage
export const saveUserToLocalStorage = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData))
}

// Ambil data user dari localStorage
export const getUserFromLocalStorage = () => {
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
}

// Logout
export const logoutUser = () => {
  localStorage.removeItem('user')
  return true
}