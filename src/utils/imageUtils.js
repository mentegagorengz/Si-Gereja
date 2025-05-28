// src/utils/imageUtils.js

/**
 * Helper function untuk mendapatkan thumbnail image
 * @param {string} category - Kategori dari item (renungan, jadwal, news)
 * @param {string} thumbnail - Nama file thumbnail spesifik
 * @returns {string} - URL thumbnail yang tepat
 */
export function getThumbnail(category, thumbnail) {
  try {
    // 1. Jika ada thumbnail spesifik, coba gunakan itu dulu
    if (thumbnail) {
      try {
        return require(`@/assets/thumbnails/${thumbnail}`)
      } catch (error) {
        console.warn(`⚠️ [getThumbnail] Thumbnail spesifik tidak ditemukan: ${thumbnail}`)
        // Lanjut ke fallback category
      }
    }

    // 2. Gunakan icon berdasarkan category
    if (category) {
      try {
        return require(`@/assets/icons/${category}.png`)
      } catch (error) {
        console.warn(`⚠️ [getThumbnail] Icon category tidak ditemukan: ${category}`)
        // Lanjut ke fallback default
      }
    }

    // 3. Fallback ke default icon
    return require(`@/assets/icons/default.png`)
    
  } catch (error) {
    console.error('❌ [getThumbnail] Error loading thumbnail:', error)
    
    // 4. Ultimate fallback - return null agar component bisa handle dengan placeholder
    return null
  }
}

/**
 * Helper function khusus untuk devotional/renungan
 * @param {Object} devotional - Object devotional dari Firebase
 * @returns {string} - URL thumbnail
 */
export function getDevotionalThumbnail(devotional) {
  if (!devotional) return null
  
  // Mapping category devotional ke icon yang tepat
  const categoryIconMap = {
    'kasih': 'heart.png',
    'iman': 'cross.png', 
    'pengharapan': 'star.png',
    'doa': 'pray.png',
    'sukacita': 'smile.png',
    'damai': 'dove.png'
  }
  
  const iconFile = categoryIconMap[devotional.category] || 'default.png'
  
  return getThumbnail(devotional.category, devotional.thumbnail || iconFile)
}

/**
 * Helper function khusus untuk schedule/jadwal  
 * @param {Object} schedule - Object schedule dari Firebase
 * @returns {string} - URL thumbnail
 */
export function getScheduleThumbnail(schedule) {
  if (!schedule) return null
  
  // Mapping category jadwal ke icon yang tepat
  const categoryIconMap = {
    'pelprap': 'pelprap.png',
    'ibadah': 'church.png',
    'doa': 'pray.png', 
    'event': 'calendar.png'
  }
  
  const iconFile = categoryIconMap[schedule.category] || 'default.png'
  
  return getThumbnail(schedule.category, schedule.thumbnail || iconFile)
}

/**
 * Helper function khusus untuk news
 * @param {Object} news - Object news dari Firebase  
 * @returns {string} - URL thumbnail
 */
export function getNewsThumbnail(news) {
  if (!news) return null
  
  // Mapping category news ke icon yang tepat
  const categoryIconMap = {
    'pengumuman': 'announcement.png',
    'event': 'event.png',
    'undangan': 'invitation.png'
  }
  
  const iconFile = categoryIconMap[news.category] || 'news.png'
  
  return getThumbnail(news.category, news.thumbnail || iconFile)
}