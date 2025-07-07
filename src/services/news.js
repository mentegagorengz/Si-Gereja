// services/news.js - Updated dengan field baru untuk announcement system
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
 * ⭐ NEW - Mendapatkan news berdasarkan tanggal (untuk announcement system)
 * @param {string} date - Tanggal dalam format YYYY-MM-DD
 * @returns {Promise<Array>} Array news yang eventDate = date dan isEvent = true
 */
export async function getNewsByDate(date) {
  try {
    if (!date) {
      throw new Error('Tanggal harus diisi')
    }
    
    const newsRef = collection(db, COLLECTION_NAME)
    const q = query(
      newsRef, 
      where('date', '==', date),
      where('isEvent', '==', true),
      where('showInAnnouncement', '==', true),
      orderBy('priority', 'asc'),
      orderBy('createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const news = []
    
    querySnapshot.forEach((doc) => {
      news.push({
        id: doc.id,
        source: 'news', // ⭐ Tambah source identifier
        ...doc.data()
      })
    })
    
    console.log(`📰 [News Service] Found ${news.length} news events for date: ${date}`)
    return news
  } catch (error) {
    console.error('Error getting news by date:', error)
    throw error
  }
}

/**
 * ⭐ NEW - Mendapatkan upcoming news events (untuk fallback jika hari ini kosong)
 * @param {string} fromDate - Tanggal mulai pencarian (YYYY-MM-DD)
 * @param {number} limitCount - Limit hasil
 * @returns {Promise<Array>} Array news events yang akan datang
 */
export async function getUpcomingNewsEvents(fromDate, limitCount = 5) {
  try {
    if (!fromDate) {
      throw new Error('From date harus diisi')
    }
    
    const newsRef = collection(db, COLLECTION_NAME)
    const q = query(
      newsRef, 
      where('date', '>=', fromDate),
      where('isEvent', '==', true),
      where('showInAnnouncement', '==', true),
      orderBy('date', 'asc'),
      orderBy('priority', 'asc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const news = []
    
    querySnapshot.forEach((doc) => {
      news.push({
        id: doc.id,
        source: 'news',
        ...doc.data()
      })
    })
    
    console.log(`📰 [News Service] Found ${news.length} upcoming news events from: ${fromDate}`)
    return news
  } catch (error) {
    console.error('Error getting upcoming news events:', error)
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
 * ⭐ UPDATED - Menambahkan news baru dengan auto-detection dan default values
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

    if (!newsData.category) {
      throw new Error('Category news harus diisi')
    }
    
    // ⭐ AUTO-DETECTION dan DEFAULT VALUES
    const autoDetectedFields = autoDetectNewsFields(newsData)
    
    // ⭐ ENRICHED DATA dengan field baru
    const enrichedData = {
      ...newsData,
      
      // Field baru dengan priority: manual input > auto-detection > default
      isEvent: newsData.isEvent ?? autoDetectedFields.isEvent,
      showInAnnouncement: newsData.showInAnnouncement ?? autoDetectedFields.showInAnnouncement,
      priority: newsData.priority ?? autoDetectedFields.priority,
      eventEndDate: newsData.eventEndDate || autoDetectedFields.eventEndDate,
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: newsData.createdBy || 'system'
    }
    
    const newsRef = collection(db, COLLECTION_NAME)
    const newDoc = await addDoc(newsRef, enrichedData)
    
    console.log('✅ [News Service] News added with ID:', newDoc.id)
    console.log('   Auto-detected fields:', autoDetectedFields)
    
    return newDoc.id
  } catch (error) {
    console.error('Error adding news:', error)
    throw error
  }
}

/**
 * ⭐ NEW - Auto-detection logic untuk field baru berdasarkan content
 * @param {Object} newsData - Data news input
 * @returns {Object} Auto-detected field values
 */
function autoDetectNewsFields(newsData) {
  const category = newsData.category?.toLowerCase() || ''
  const title = newsData.title?.toLowerCase() || ''
  const content = newsData.content?.toLowerCase() || ''
  
  // Default values
  let isEvent = false
  let showInAnnouncement = false
  let priority = 3
  let eventEndDate = null
  
  // ⭐ EVENT CATEGORIES - otomatis jadi event
  const eventCategories = [
    'event', 'ibadah', 'pelprap', 'pelatar', 'birthday', 
    'ulang_tahun', 'camping', 'retreat', 'seminar', 'workshop'
  ]
  
  // ⭐ EVENT KEYWORDS - deteksi dari title/content
  const eventKeywords = [
    'ibadah', 'pelprap', 'pelatar', 'birthday', 'ulang tahun',
    'camp', 'camping', 'retreat', 'seminar', 'workshop', 'acara',
    'kegiatan', 'event', 'pertemuan', 'gathering'
  ]
  
  // ⭐ ANNOUNCEMENT CATEGORIES - news biasa
  const announcementCategories = ['announcement', 'pengumuman', 'info', 'berita']
  
  // Logic detection
  const isEventCategory = eventCategories.some(cat => category.includes(cat))
  const hasEventKeyword = eventKeywords.some(keyword => 
    title.includes(keyword) || content.includes(keyword)
  )
  const isAnnouncementCategory = announcementCategories.some(cat => category.includes(cat))
  const hasScheduleInfo = newsData.hasScheduleInfo === true
  const hasDateAndTime = newsData.date && newsData.time
  
  if (isEventCategory || hasEventKeyword || hasScheduleInfo || hasDateAndTime) {
    isEvent = true
    showInAnnouncement = true
    priority = 1
    
    // ⭐ DETECT MULTI-DAY EVENTS
    if (title.includes('camp') || title.includes('retreat') || title.includes('perkemahan')) {
      if (newsData.date) {
        const startDate = new Date(newsData.date)
        startDate.setDate(startDate.getDate() + 2) // Default 2 hari
        eventEndDate = startDate.toISOString().split('T')[0]
      }
    }
  } else if (isAnnouncementCategory) {
    isEvent = false
    showInAnnouncement = false
    priority = 2
  }
  
  // ⭐ BIRTHDAY SPECIAL HANDLING
  if (category.includes('birthday') || title.includes('birthday') || title.includes('ulang tahun')) {
    isEvent = true
    showInAnnouncement = true
    priority = 1
  }
  
  return {
    isEvent,
    showInAnnouncement,
    priority,
    eventEndDate
  }
}

/**
 * ⭐ UPDATED - Mengupdate news dengan support field baru
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
    
    // ⭐ Re-run auto-detection jika ada perubahan signifikan
    let enrichedUpdateData = { ...updateData }
    
    if (updateData.title || updateData.content || updateData.category) {
      // Get existing data untuk merge
      const existingNews = await getNewsById(id)
      const mergedData = { ...existingNews, ...updateData }
      
      // Re-detect fields jika belum ada manual input
      const autoDetected = autoDetectNewsFields(mergedData)
      
      // Update dengan auto-detection jika field belum di-set manual
      if (updateData.isEvent === undefined && existingNews.isEvent === undefined) {
        enrichedUpdateData.isEvent = autoDetected.isEvent
      }
      if (updateData.showInAnnouncement === undefined && existingNews.showInAnnouncement === undefined) {
        enrichedUpdateData.showInAnnouncement = autoDetected.showInAnnouncement
      }
      if (updateData.priority === undefined && existingNews.priority === undefined) {
        enrichedUpdateData.priority = autoDetected.priority
      }
    }
    
    const newsRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(newsRef, {
      ...enrichedUpdateData,
      updatedAt: new Date(),
      updatedBy: updateData.updatedBy || 'system'
    })
    
    console.log('✅ [News Service] News updated:', id)
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
    
    console.log('✅ [News Service] News deleted:', id)
    return true
  } catch (error) {
    console.error('Error deleting news:', error)
    throw error
  }
}