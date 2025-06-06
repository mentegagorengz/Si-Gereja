import { db } from './firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  orderBy, 
  limit, 
  where 
} from 'firebase/firestore'

const COLLECTION_NAME = 'schedules'

/**
 * Mendapatkan semua jadwal, diurutkan dari tanggal terlama ke terbaru
 * @param {number} limitCount - Jumlah maksimal jadwal yang diambil
 * @returns {Promise<Array>} Array jadwal
 */
export async function getSchedules(limitCount = 10) {
  try {
    const schedulesRef = collection(db, COLLECTION_NAME)
    const q = query(
      schedulesRef, 
      orderBy('date', 'asc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const schedules = []
    
    querySnapshot.forEach((doc) => {
      schedules.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return schedules
  } catch (error) {
    console.error('Error getting schedules:', error)
    throw error
  }
}

/**
 * Mendapatkan satu jadwal berdasarkan ID
 * @param {string} id - ID jadwal
 * @returns {Promise<Object>} Data jadwal
 */
export async function getSchedule(id) {
  try {
    if (!id) {
      throw new Error('ID jadwal harus diisi')
    }
    
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error('Jadwal tidak ditemukan')
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    }
  } catch (error) {
    console.error('Error getting schedule:', error)
    throw error
  }
}

/**
 * Mendapatkan jadwal berdasarkan kategori
 * @param {string} category - Kategori jadwal
 * @returns {Promise<Array>} Array jadwal
 */
export async function getSchedulesByCategory(category) {
  try {
    if (!category) {
      throw new Error('Kategori harus diisi')
    }
    
    const schedulesRef = collection(db, COLLECTION_NAME)
    const q = query(
      schedulesRef, 
      where('category', '==', category),
      orderBy('date', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    const schedules = []
    
    querySnapshot.forEach((doc) => {
      schedules.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return schedules
  } catch (error) {
    console.error('Error getting schedules by category:', error)
    throw error
  }
}

/**
 * Mendapatkan jadwal untuk tanggal tertentu
 * @param {string|Date} date - Tanggal jadwal
 * @returns {Promise<Array>} Array jadwal diurutkan berdasarkan waktu
 */
export async function getSchedulesByDate(date) {
  try {
    if (!date) {
      throw new Error('Tanggal harus diisi')
    }
    
    const schedulesRef = collection(db, COLLECTION_NAME)
    const q = query(
      schedulesRef, 
      where('date', '==', date),
      orderBy('time', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    const schedules = []
    
    querySnapshot.forEach((doc) => {
      schedules.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return schedules
  } catch (error) {
    console.error('Error getting schedules by date:', error)
    throw error
  }
}

/**
 * Menambahkan jadwal baru (untuk admin)
 * @param {Object} scheduleData - Data jadwal baru
 * @returns {Promise<string>} ID jadwal yang baru dibuat
 */
export async function addSchedule(scheduleData) {
  try {
    if (!scheduleData || typeof scheduleData !== 'object') {
      throw new Error('Data jadwal tidak valid')
    }

    if (!scheduleData.title) {
      throw new Error('Title jadwal harus diisi')
    }

    if (!scheduleData.date) {
      throw new Error('Tanggal jadwal harus diisi')
    }

    if (!scheduleData.time) {
      throw new Error('Waktu jadwal harus diisi')
    }
    
    const schedulesRef = collection(db, COLLECTION_NAME)
    const newDoc = await addDoc(schedulesRef, {
      ...scheduleData,
      createdAt: new Date()
    })
    
    return newDoc.id
  } catch (error) {
    console.error('Error adding schedule:', error)
    throw error
  }
}

/**
 * Mengupdate jadwal (untuk admin)
 * @param {string} id - ID jadwal
 * @param {Object} updateData - Data yang akan diupdate
 * @returns {Promise<boolean>} Success status
 */
export async function updateSchedule(id, updateData) {
  try {
    if (!id) {
      throw new Error('ID jadwal harus diisi')
    }

    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Data update tidak valid')
    }
    
    const scheduleRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(scheduleRef, {
      ...updateData,
      updatedAt: new Date()
    })
    
    return true
  } catch (error) {
    console.error('Error updating schedule:', error)
    throw error
  }
}

/**
 * Menghapus jadwal (untuk admin)
 * @param {string} id - ID jadwal yang akan dihapus
 * @returns {Promise<boolean>} Success status
 */
export async function deleteSchedule(id) {
  try {
    if (!id) {
      throw new Error('ID jadwal harus diisi')
    }
    
    const scheduleRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(scheduleRef)
    
    return true
  } catch (error) {
    console.error('Error deleting schedule:', error)
    throw error
  }
}