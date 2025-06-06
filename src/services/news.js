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

const COLLECTION_NAME = 'news'

/**
 * Mendapatkan semua news, diurutkan dari yang terbaru
 * @param {number} limitCount - Jumlah maksimal news yang diambil
 * @returns {Promise<Array>} Array news
 */
export async function getNews(limitCount = 10) {
  try {
    const newsRef = collection(db, COLLECTION_NAME)
    const q = query(
      newsRef, 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const news = []
    
    querySnapshot.forEach((doc) => {
      news.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return news
  } catch (error) {
    console.error('Error getting news:', error)
    throw error
  }
}

/**
 * Mendapatkan satu news berdasarkan ID
 * @param {string} id - ID news
 * @returns {Promise<Object>} Data news
 */
export async function getNewsById(id) {
  try {
    if (!id) {
      throw new Error('ID news harus diisi')
    }
    
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error('News tidak ditemukan')
    }

    return {
      id: docSnap.id,
      ...docSnap.data()
    }
  } catch (error) {
    console.error('Error getting news by ID:', error)
    throw error
  }
}

/**
 * Mendapatkan news berdasarkan kategori
 * @param {string} category - Kategori news
 * @returns {Promise<Array>} Array news
 */
export async function getNewsByCategory(category) {
  try {
    if (!category) {
      throw new Error('Kategori harus diisi')
    }
    
    const newsRef = collection(db, COLLECTION_NAME)
    const q = query(
      newsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const news = []
    
    querySnapshot.forEach((doc) => {
      news.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return news
  } catch (error) {
    console.error('Error getting news by category:', error)
    throw error
  }
}

/**
 * Menambahkan news baru (untuk admin)
 * @param {Object} newsData - Data news baru
 * @returns {Promise<string>} ID news yang baru dibuat
 */
export async function addNews(newsData) {
  try {
    if (!newsData || typeof newsData !== 'object') {
      throw new Error('Data news tidak valid')
    }

    if (!newsData.title) {
      throw new Error('Title news harus diisi')
    }

    if (!newsData.content) {
      throw new Error('Content news harus diisi')
    }
    
    const newsRef = collection(db, COLLECTION_NAME)
    const newDoc = await addDoc(newsRef, {
      ...newsData,
      createdAt: new Date()
    })
    
    return newDoc.id
  } catch (error) {
    console.error('Error adding news:', error)
    throw error
  }
}

/**
 * Mengupdate news (untuk admin)
 * @param {string} id - ID news
 * @param {Object} updateData - Data yang akan diupdate
 * @returns {Promise<boolean>} Success status
 */
export async function updateNews(id, updateData) {
  try {
    if (!id) {
      throw new Error('ID news harus diisi')
    }

    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Data update tidak valid')
    }
    
    const newsRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(newsRef, {
      ...updateData,
      updatedAt: new Date()
    })
    
    return true
  } catch (error) {
    console.error('Error updating news:', error)
    throw error
  }
}

/**
 * Menghapus news (untuk admin)
 * @param {string} id - ID news yang akan dihapus
 * @returns {Promise<boolean>} Success status
 */
export async function deleteNews(id) {
  try {
    if (!id) {
      throw new Error('ID news harus diisi')
    }
    
    const newsRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(newsRef)
    
    return true
  } catch (error) {
    console.error('Error deleting news:', error)
    throw error
  }
}