// src/utils/imageUtils.js

/**
 * Helper function untuk mendapatkan thumbnail image - WEBPACK SAFE
 * @param {string} category - Kategori dari item (renungan, jadwal, news)
 * @param {string} thumbnail - Nama file thumbnail spesifik
 * @returns {string} - URL thumbnail yang tepat
 */
export function getThumbnail(category, thumbnail) {
  try {
    // ⭐ WEBPACK-SAFE: Pre-loaded context untuk semua icons
    const iconContext = require.context('@/assets/icons', false, /\.(png|jpe?g|svg)$/)
    
    // 1. Jika ada thumbnail spesifik, coba gunakan itu dulu
    if (thumbnail) {
      try {
        return iconContext(`./${thumbnail}`)
      } catch (error) {
        console.warn(`⚠️ [getThumbnail] Thumbnail spesifik tidak ditemukan: ${thumbnail}`)
        // Lanjut ke fallback category
      }
    }

    // 2. Gunakan icon berdasarkan category
    if (category) {
      try {
        return iconContext(`./${category}.png`)
      } catch (error) {
        console.warn(`⚠️ [getThumbnail] Icon category tidak ditemukan: ${category}`)
        // Lanjut ke fallback default
      }
    }

    // 3. Fallback ke default icon
    return iconContext('./default.png')
    
  } catch (error) {
    console.error('❌ [getThumbnail] Error loading thumbnail:', error)
    
    // 4. Ultimate fallback - return null agar component bisa handle dengan placeholder
    return null
  }
}

/**
 * Helper function khusus untuk devotional/renungan - WEBPACK SAFE
 * @param {Object} devotional - Object devotional dari Firebase
 * @returns {string} - URL thumbnail
 */
export function getDevotionalThumbnail(devotional) {
  if (!devotional) return null
  
  // ⭐ WEBPACK-SAFE: Static mapping dengan direct require
  const thumbnailMap = {
    'kasih': require('@/assets/icons/heart.png'),
    'iman': require('@/assets/icons/cross.png'), 
    'pengharapan': require('@/assets/icons/star.png'),
    'doa': require('@/assets/icons/pray.png'),
    'sukacita': require('@/assets/icons/smile.png'),
    'damai': require('@/assets/icons/dove.png'),
    'pelprap': require('@/assets/icons/pelprap.png'),
    'default': require('@/assets/icons/default.png')
  }
  
  // Return mapped thumbnail atau default
  return thumbnailMap[devotional.category] || thumbnailMap['default']
}

/**
 * Helper function khusus untuk schedule/jadwal - WEBPACK SAFE
 * @param {Object} schedule - Object schedule dari Firebase
 * @returns {string} - URL thumbnail
 */
export function getScheduleThumbnail(schedule) {
  if (!schedule) return null
  
  // ⭐ WEBPACK-SAFE: Static mapping dengan direct require
  const thumbnailMap = {
    'pelprap': require('@/assets/icons/pelprap.png'),
    'ibadah': require('@/assets/icons/church.png'),
    'doa': require('@/assets/icons/pray.png'), 
    'event': require('@/assets/icons/calendar.png'),
    'default': require('@/assets/icons/default.png')
  }
  
  return thumbnailMap[schedule.category] || thumbnailMap['default']
}

/**
 * Helper function khusus untuk news - WEBPACK SAFE
 * @param {Object} news - Object news dari Firebase  
 * @returns {string} - URL thumbnail
 */
export function getNewsThumbnail(news) {
  if (!news) return null
  
  // ⭐ WEBPACK-SAFE: Static mapping dengan direct require
  const thumbnailMap = {
    'pengumuman': require('@/assets/icons/announcement.png'),
    'event': require('@/assets/icons/event.png'),
    'undangan': require('@/assets/icons/invitation.png'),
    'default': require('@/assets/icons/news.png')
  }
  
  return thumbnailMap[news.category] || thumbnailMap['default']
}