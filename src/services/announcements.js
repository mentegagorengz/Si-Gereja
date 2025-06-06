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
  limit 
} from 'firebase/firestore'

const COLLECTION_NAME = 'announcements'

/**
 * Mendapatkan semua pengumuman, diurutkan dari yang terbaru
 * @param {number} limitCount - Jumlah maksimal pengumuman yang diambil
 * @returns {Promise<Array>} Array pengumuman
 */
export async function getAnnouncements(limitCount = 10) {
  try {
    const announcementsRef = collection(db, COLLECTION_NAME)
    const q = query(
      announcementsRef, 
      orderBy('date', 'desc'), 
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const announcements = []
    
    querySnapshot.forEach((doc) => {
      announcements.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return announcements
  } catch (error) {
    console.error('Error getting announcements:', error)
    throw error
  }
}

/**
 * Mendapatkan satu pengumuman berdasarkan ID
 * @param {string} id - ID pengumuman
 * @returns {Promise<Object>} Data pengumuman
 */
export async function getAnnouncement(id) {
  try {
    if (!id) {
      throw new Error('ID pengumuman harus diisi')
    }

    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error('Pengumuman tidak ditemukan')
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    }
  } catch (error) {
    console.error('Error getting announcement:', error)
    throw error
  }
}

/**
 * Menambahkan pengumuman baru
 * @param {Object} announcementData - Data pengumuman baru
 * @returns {Promise<string>} ID pengumuman yang baru dibuat
 */
export async function addAnnouncement(announcementData) {
  try {
    if (!announcementData || typeof announcementData !== 'object') {
      throw new Error('Data pengumuman tidak valid')
    }

    const announcementsRef = collection(db, COLLECTION_NAME)
    const newDoc = await addDoc(announcementsRef, {
      ...announcementData,
      date: new Date(),
      createdAt: new Date()
    })
    
    return newDoc.id
  } catch (error) {
    console.error('Error adding announcement:', error)
    throw error
  }
}

/**
 * Mengupdate pengumuman
 * @param {string} id - ID pengumuman
 * @param {Object} updateData - Data yang akan diupdate
 * @returns {Promise<boolean>} Success status
 */
export async function updateAnnouncement(id, updateData) {
  try {
    if (!id) {
      throw new Error('ID pengumuman harus diisi')
    }

    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Data update tidak valid')
    }

    const announcementRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(announcementRef, {
      ...updateData,
      updatedAt: new Date()
    })
    
    return true
  } catch (error) {
    console.error('Error updating announcement:', error)
    throw error
  }
}

/**
 * Menghapus pengumuman
 * @param {string} id - ID pengumuman yang akan dihapus
 * @returns {Promise<boolean>} Success status
 */
export async function deleteAnnouncement(id) {
  try {
    if (!id) {
      throw new Error('ID pengumuman harus diisi')
    }

    const announcementRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(announcementRef)
    
    return true
  } catch (error) {
    console.error('Error deleting announcement:', error)
    throw error
  }
}