// src/services/prayerRequests.js
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
  where,
  serverTimestamp
} from 'firebase/firestore'

const COLLECTION_NAME = 'prayer_requests'

/**
 * Mendapatkan semua prayer requests, diurutkan dari yang terbaru
 * @param {number} limitCount - Jumlah maksimal prayer requests yang diambil
 * @returns {Promise<Array>} Array prayer requests
 */
export async function getPrayerRequests(limitCount = 10) {
  try {
    console.log('🔍 [PrayerService] Fetching prayer requests...')
    
    const prayerRequestsRef = collection(db, COLLECTION_NAME)
    const q = query(
      prayerRequestsRef, 
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const prayerRequests = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      
      // Convert Firestore Timestamp to JavaScript Date
      const createdAt = data.createdAt?.toDate?.() || new Date()
      
      prayerRequests.push({
        id: doc.id,
        ...data,
        createdAt: createdAt.toISOString() // Convert to ISO string
      })
    })
    
    console.log('✅ [PrayerService] Prayer requests loaded:', prayerRequests.length)
    return prayerRequests
    
  } catch (error) {
    console.error('❌ [PrayerService] Error getting prayer requests:', error)
    throw error
  }
}

/**
 * Mendapatkan prayer requests berdasarkan user ID
 * @param {string} userId - ID user
 * @param {number} limitCount - Jumlah maksimal prayer requests
 * @returns {Promise<Array>} Array prayer requests
 */
export async function getPrayerRequestsByUser(userId, limitCount = 10) {
  try {
    if (!userId) {
      throw new Error('User ID harus diisi')
    }
    
    console.log('🔍 [PrayerService] Fetching prayer requests for user:', userId)
    
    const prayerRequestsRef = collection(db, COLLECTION_NAME)
    const q = query(
      prayerRequestsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const prayerRequests = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const createdAt = data.createdAt?.toDate?.() || new Date()
      
      prayerRequests.push({
        id: doc.id,
        ...data,
        createdAt: createdAt.toISOString()
      })
    })
    
    console.log('✅ [PrayerService] User prayer requests loaded:', prayerRequests.length)
    return prayerRequests
    
  } catch (error) {
    console.error('❌ [PrayerService] Error getting user prayer requests:', error)
    throw error
  }
}

/**
 * Mendapatkan kategori-kategori prayer request
 * @returns {Array} Array kategori prayer request
 */
export function getPrayerCategories() {
  // ⭐ FIXED: Struktur yang sesuai dengan AddPrayerReq.vue
  return [
    {
      value: 'health',
      label: 'Kesehatan',
      icon: '🏥'
    },
    {
      value: 'work',
      label: 'Pekerjaan',
      icon: '💼'
    },
    {
      value: 'family',
      label: 'Keluarga',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      value: 'finances',
      label: 'Keuangan',
      icon: '💰'
    },
    {
      value: 'education',
      label: 'Pendidikan',
      icon: '🎓'
    },
    {
      value: 'spiritual',
      label: 'Spiritual',
      icon: '🙏'
    },
    {
      value: 'relationship',
      label: 'Hubungan',
      icon: '💕'
    },
    {
      value: 'guidance',
      label: 'Bimbingan',
      icon: '🧭'
    },
    {
      value: 'other',
      label: 'Lainnya',
      icon: '📝'
    }
  ]
}

/**
 * Mendapatkan satu prayer request berdasarkan ID
 * @param {string} id - ID prayer request
 * @returns {Promise<Object>} Data prayer request
 */
export async function getPrayerRequest(id) {
  try {
    if (!id) {
      throw new Error('ID prayer request harus diisi')
    }
    
    console.log('🔍 [PrayerService] Fetching prayer request ID:', id)
    
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error('Prayer request tidak ditemukan')
    }
    
    const data = docSnap.data()
    const createdAt = data.createdAt?.toDate?.() || new Date()

    const prayerRequest = {
      id: docSnap.id,
      ...data,
      createdAt: createdAt.toISOString()
    }
    
    console.log('✅ [PrayerService] Prayer request loaded:', prayerRequest.title)
    return prayerRequest
    
  } catch (error) {
    console.error('❌ [PrayerService] Error getting prayer request:', error)
    throw error
  }
}

/**
 * Menambahkan prayer request baru
 * @param {Object} prayerData - Data prayer request baru
 * @param {string} userId - ID user yang membuat prayer request
 * @returns {Promise<string>} ID prayer request yang baru dibuat
 */
export async function addPrayerRequest(prayerData, userId) {
  try {
    if (!prayerData || typeof prayerData !== 'object') {
      throw new Error('Data prayer request tidak valid')
    }

    if (!prayerData.title || !prayerData.title.trim()) {
      throw new Error('Judul prayer request harus diisi')
    }

    if (!prayerData.description || !prayerData.description.trim()) {
      throw new Error('Deskripsi prayer request harus diisi')
    }

    if (!userId) {
      throw new Error('User ID harus diisi')
    }
    
    console.log('➕ [PrayerService] Adding new prayer request...')
    
    const prayerRequestsRef = collection(db, COLLECTION_NAME)
    
    // ⭐ AUTOMATIC: Collection akan otomatis dibuat kalau belum ada!
    const newDoc = await addDoc(prayerRequestsRef, {
      title: prayerData.title.trim(),
      description: prayerData.description.trim(),
      userId: userId,
      status: 'active',
      isPrayed: false,
      prayedBy: [], // Array user yang sudah mendoakan
      createdAt: serverTimestamp(), // Timestamp dari server Firebase
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ [PrayerService] Prayer request added with ID:', newDoc.id)
    return newDoc.id
    
  } catch (error) {
    console.error('❌ [PrayerService] Error adding prayer request:', error)
    throw error
  }
}

/**
 * Update prayer request (toggle prayer status, edit content, dll)
 * @param {string} id - ID prayer request
 * @param {Object} updateData - Data yang akan diupdate
 * @returns {Promise<boolean>} Success status
 */
export async function updatePrayerRequest(id, updateData) {
  try {
    if (!id) {
      throw new Error('ID prayer request harus diisi')
    }

    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Data update tidak valid')
    }
    
    console.log('🔄 [PrayerService] Updating prayer request:', id)
    
    const prayerRequestRef = doc(db, COLLECTION_NAME, id)
    
    await updateDoc(prayerRequestRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    })
    
    console.log('✅ [PrayerService] Prayer request updated successfully')
    return true
    
  } catch (error) {
    console.error('❌ [PrayerService] Error updating prayer request:', error)
    throw error
  }
}

/**
 * Toggle status "sudah didoakan" untuk prayer request
 * @param {string} prayerRequestId - ID prayer request
 * @param {string} userId - ID user yang mendoakan
 * @returns {Promise<boolean>} Success status
 */
export async function togglePrayerStatus(prayerRequestId, userId) {
  try {
    if (!prayerRequestId || !userId) {
      throw new Error('Prayer request ID dan user ID harus diisi')
    }
    
    console.log('🙏 [PrayerService] Toggling prayer status...')
    
    // Ambil data prayer request saat ini
    const prayerRequest = await getPrayerRequest(prayerRequestId)
    
    let prayedBy = prayerRequest.prayedBy || []
    let isPrayed = false
    
    // Check apakah user sudah pernah mendoakan
    if (prayedBy.includes(userId)) {
      // User sudah pernah mendoakan, remove dari list
      prayedBy = prayedBy.filter(id => id !== userId)
      console.log('❌ [PrayerService] User removed from prayer list')
    } else {
      // User belum pernah mendoakan, add ke list
      prayedBy.push(userId)
      console.log('✅ [PrayerService] User added to prayer list')
    }
    
    // Update status isPrayed berdasarkan apakah ada yang mendoakan
    isPrayed = prayedBy.length > 0
    
    // Update di Firebase
    await updatePrayerRequest(prayerRequestId, {
      prayedBy: prayedBy,
      isPrayed: isPrayed
    })
    
    return true
    
  } catch (error) {
    console.error('❌ [PrayerService] Error toggling prayer status:', error)
    throw error
  }
}

/**
 * Hapus prayer request (hanya untuk pembuat atau admin)
 * @param {string} id - ID prayer request yang akan dihapus
 * @returns {Promise<boolean>} Success status
 */
export async function deletePrayerRequest(id) {
  try {
    if (!id) {
      throw new Error('ID prayer request harus diisi')
    }
    
    console.log('🗑️ [PrayerService] Deleting prayer request:', id)
    
    const prayerRequestRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(prayerRequestRef)
    
    console.log('✅ [PrayerService] Prayer request deleted successfully')
    return true
    
  } catch (error) {
    console.error('❌ [PrayerService] Error deleting prayer request:', error)
    throw error
  }
}

/**
 * Get statistics untuk dashboard admin
 * @returns {Promise<Object>} Stats prayer requests
 */
export async function getPrayerRequestStats() {
  try {
    console.log('📊 [PrayerService] Getting prayer request statistics...')
    
    const prayerRequestsRef = collection(db, COLLECTION_NAME)
    
    // Get all prayer requests (might want to limit this in production)
    const querySnapshot = await getDocs(prayerRequestsRef)
    
    let totalRequests = 0
    let activeRequests = 0
    let prayedRequests = 0
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      totalRequests++
      
      if (data.status === 'active') {
        activeRequests++
      }
      
      if (data.isPrayed) {
        prayedRequests++
      }
    })
    
    const stats = {
      totalRequests,
      activeRequests,
      prayedRequests,
      prayerRate: totalRequests > 0 ? Math.round((prayedRequests / totalRequests) * 100) : 0
    }
    
    console.log('✅ [PrayerService] Stats loaded:', stats)
    return stats
    
  } catch (error) {
    console.error('❌ [PrayerService] Error getting stats:', error)
    throw error
  }
}