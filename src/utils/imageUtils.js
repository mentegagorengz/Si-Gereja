// src/utils/imageUtils.js
// Updated untuk struktur folder baru dan logic announcement

// ⭐ FEATURE ICONS - dari assets/icons/features/
export const getFeatureIconUrl = (iconName) => {
  console.log('🔍 [getFeatureIconUrl] Getting feature icon for:', iconName)
  
  // Mapping nama feature ke nama file
  const iconMapping = {
    'News': 'news',
    'Jadwal': 'jadwal',
    'Giving': 'giving',
    'Alkitab Setahun': 'alkitab',
    'Renungan': 'renungan',
    'Prayer Request': 'prayer'
  }
  
  const iconFile = iconMapping[iconName] || iconName.toLowerCase()
  console.log('🔍 [getFeatureIconUrl] Mapped to file:', iconFile)
  
  try {
    // ⭐ PATH BARU: assets/icons/features/
    const iconPath = `@/assets/icons/features/${iconFile}.png`
    console.log('🔍 [getFeatureIconUrl] Trying path:', iconPath)
    
    const iconUrl = require(iconPath)
    console.log('✅ [getFeatureIconUrl] SUCCESS! Loaded:', iconUrl)
    return iconUrl
    
  } catch (error) {
    console.error('❌ [getFeatureIconUrl] Failed to load:', iconFile, 'Error:', error.message)
    
    // Try different extensions
    const extensions = ['.jpg', '.jpeg', '.svg']
    for (const ext of extensions) {
      try {
        const altUrl = require(`@/assets/icons/features/${iconFile}${ext}`)
        console.log(`✅ [getFeatureIconUrl] Found with ${ext}:`, altUrl)
        return altUrl
      } catch (altError) {
        console.warn(`⚠️ [getFeatureIconUrl] ${ext} not found for ${iconFile}`)
      }
    }
    
    // Final fallback
    console.warn('⚠️ [getFeatureIconUrl] All attempts failed, using emoji fallback')
    return createEmojiDataUrl(getEmojiForFeature(iconName))
  }
}

// ⭐ ANNOUNCEMENT ICONS - dari assets/icons/announcements/
export const getAnnouncementIconUrl = (iconName) => {
  console.log('🔍 [getAnnouncementIconUrl] Getting announcement icon for:', iconName)
  
  // ⭐ LOGIC MAPPING berdasarkan category
  const getIconFile = (category) => {
    console.log('🔍 [getAnnouncementIconUrl] Processing category:', category)
    
    switch(category) {
      case 'birthday':
        return 'birthday'
        
      case 'service':
      case 'pelprap': 
      case 'ibadah':
        return 'ibadah'
        
      case 'event':
      case 'pelatar':
      case 'pengumuman':
        return 'event'
        
      default:
        // Coba pakai nama asli dulu
        return category || 'event' // fallback ke event.png
    }
  }
  
  const iconFile = getIconFile(iconName)
  console.log('🔍 [getAnnouncementIconUrl] Mapped', iconName, 'to', iconFile)
  
  try {
    // ⭐ PATH BARU: assets/icons/announcements/
    const iconPath = `@/assets/icons/announcements/${iconFile}.png`
    console.log('🔍 [getAnnouncementIconUrl] Trying path:', iconPath)
    
    const iconUrl = require(iconPath)
    console.log('✅ [getAnnouncementIconUrl] SUCCESS! Loaded:', iconUrl)
    return iconUrl
    
  } catch (error) {
    console.error('❌ [getAnnouncementIconUrl] Failed to load:', iconFile, 'Error:', error.message)
    
    // Try different extensions
    const extensions = ['.jpg', '.jpeg', '.svg']
    for (const ext of extensions) {
      try {
        const altUrl = require(`@/assets/icons/announcements/${iconFile}${ext}`)
        console.log(`✅ [getAnnouncementIconUrl] Found with ${ext}:`, altUrl)
        return altUrl
      } catch (altError) {
        console.warn(`⚠️ [getAnnouncementIconUrl] ${ext} not found for ${iconFile}`)
      }
    }
    
    // Try fallback icons dalam folder announcements
    const fallbacks = ['event', 'ibadah', 'birthday']
    for (const fallback of fallbacks) {
      try {
        const fallbackUrl = require(`@/assets/icons/announcements/${fallback}.png`)
        console.log(`✅ [getAnnouncementIconUrl] Using fallback ${fallback}:`, fallbackUrl)
        return fallbackUrl
      } catch (fallbackError) {
        console.warn(`⚠️ [getAnnouncementIconUrl] Fallback ${fallback} not found`)
      }
    }
    
    // Final fallback ke emoji
    console.warn('⚠️ [getAnnouncementIconUrl] All attempts failed, using emoji fallback')
    return createEmojiDataUrl(getEmojiForAnnouncement(iconName))
  }
}

// ⭐ DEBUG FUNCTION - Test semua icon
export const debugIconAssets = () => {
  console.log('🧪 [DEBUG] Testing new folder structure...')
  
  // Test feature icons
  console.log('📁 Testing features/')
  const featureIcons = ['news', 'jadwal', 'giving', 'alkitab', 'renungan', 'prayer']
  featureIcons.forEach(icon => {
    try {
      const url = require(`@/assets/icons/features/${icon}.png`)
      console.log(`✅ features/${icon}.png ->`, url)
    } catch (error) {
      console.log(`❌ features/${icon}.png -> NOT FOUND`)
    }
  })
  
  // Test announcement icons
  console.log('📁 Testing announcements/')
  const announcementIcons = ['birthday', 'ibadah', 'event']
  announcementIcons.forEach(icon => {
    try {
      const url = require(`@/assets/icons/announcements/${icon}.png`)
      console.log(`✅ announcements/${icon}.png ->`, url)
    } catch (error) {
      console.log(`❌ announcements/${icon}.png -> NOT FOUND`)
    }
  })
}

// ⭐ DAILY VERSE (tidak berubah)
export const getDailyVerseUrl = (ayatNumber = null) => {
  let ayatIndex = ayatNumber
  
  if (!ayatIndex) {
    const today = new Date()
    const dayOfMonth = today.getDate()
    const totalAyat = 3
    ayatIndex = (dayOfMonth % totalAyat) + 1
  }
  
  console.log('🔍 [getDailyVerseUrl] Selected ayat:', ayatIndex)
  
  try {
    const ayatUrl = require(`@/assets/daily-verse/ayat${ayatIndex}.png`)
    console.log('✅ [getDailyVerseUrl] SUCCESS! Loaded ayat:', ayatUrl)
    return ayatUrl
  } catch (error) {
    console.error('❌ [getDailyVerseUrl] Failed to load ayat:', ayatIndex)
    return createPlaceholderDataUrl('AYAT HARI INI', 400, 200)
  }
}

// ⭐ THUMBNAILS (simplified untuk sekarang)
export const getScheduleThumbnail = (schedule, size = 'large') => {
  return createPlaceholderDataUrl('JADWAL', size === 'small' ? 80 : 200, size === 'small' ? 80 : 200)
}

export const getNewsThumbnail = (news, size = 'large') => {
  return createPlaceholderDataUrl('NEWS', size === 'small' ? 80 : 200, size === 'small' ? 80 : 200)
}

export const getDevotionalThumbnail = (devotional, size = 'large') => {
  return createPlaceholderDataUrl('RENUNGAN', size === 'small' ? 80 : 200, size === 'small' ? 80 : 200)
}

// ⭐ HELPER FUNCTIONS
const getEmojiForFeature = (iconName) => {
  const emojiMap = {
    'News': '📰',
    'Jadwal': '📅',
    'Giving': '💝',
    'Alkitab Setahun': '📖',
    'Renungan': '🙏',
    'Prayer Request': '🤲'
  }
  return emojiMap[iconName] || '❓'
}

const getEmojiForAnnouncement = (iconName) => {
  const emojiMap = {
    'birthday': '🎂',
    'service': '⛪',
    'ibadah': '⛪', 
    'pelprap': '🙏',
    'event': '✨',
    'pelatar': '🎓',
    'pengumuman': '📢',
    'default': 'ℹ️'
  }
  return emojiMap[iconName] || emojiMap['default']
}

const createEmojiDataUrl = (emoji, size = 40) => {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, size, size)
  
  ctx.font = `${size * 0.6}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, size / 2, size / 2)
  
  return canvas.toDataURL()
}

const createPlaceholderDataUrl = (text, width, height) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  ctx.fillStyle = '#41442A'
  ctx.fillRect(0, 0, width, height)
  
  ctx.fillStyle = 'white'
  ctx.font = `${Math.min(width, height) * 0.1}px Inter, Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
  
  return canvas.toDataURL()
}

export const handleImageError = (event, fallbackCategory = 'default') => {
  const emoji = getEmojiForFeature(fallbackCategory)
  event.target.src = createEmojiDataUrl(emoji)
}

// ⭐ AUTO-RUN DEBUG saat file di-load
debugIconAssets()