// src/utils/imageUtils.js - OPTIMIZED VERSION
// ✨ Fixed path handling untuk folder structure yang benar

console.log('🚀 [imageUtils] Loading optimized version...')

// ⭐ FEATURE ICONS - dari assets/icons/features/
export const getFeatureIconUrl = (iconName) => {
  console.log('🔍 [getFeatureIconUrl] Getting feature icon for:', iconName)
  
  // Mapping nama feature ke nama file yang tepat
  const iconMapping = {
    'News': 'news',
    'Jadwal': 'jadwal', 
    'Giving': 'giving',
    'Alkitab Setahun': 'alkitab',
    'Renungan': 'renungan',
    'Prayer Request': 'prayer'
  }
  
  const iconFile = iconMapping[iconName] || iconName.toLowerCase().replace(/\s+/g, '')
  console.log('🔍 [getFeatureIconUrl] Mapped to file:', iconFile)
  
  // Coba berbagai ekstensi file
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp']
  
  for (const ext of extensions) {
    try {
      // ⭐ PATH YANG BENAR: assets/icons/features/
      const iconPath = require(`@/assets/icons/features/${iconFile}.${ext}`)
      console.log(`✅ [getFeatureIconUrl] SUCCESS! Found ${iconFile}.${ext}:`, iconPath)
      return iconPath
      
    } catch (error) {
      console.log(`⚠️ [getFeatureIconUrl] ${iconFile}.${ext} not found`)
      continue
    }
  }
  
  // Jika semua gagal, coba nama asli
  if (iconFile !== iconName.toLowerCase()) {
    for (const ext of extensions) {
      try {
        const iconPath = require(`@/assets/icons/features/${iconName.toLowerCase()}.${ext}`)
        console.log(`✅ [getFeatureIconUrl] Found with original name: ${iconName.toLowerCase()}.${ext}`)
        return iconPath
      } catch (error) {
        continue
      }
    }
  }
  
  // Final fallback ke emoji
  console.warn('⚠️ [getFeatureIconUrl] All attempts failed, using emoji fallback')
  return createEmojiDataUrl(getEmojiForFeature(iconName), 40)
}

// ⭐ ANNOUNCEMENT ICONS - dari assets/icons/announcements/
export const getAnnouncementIconUrl = (category) => {
  console.log('🔍 [getAnnouncementIconUrl] Getting announcement icon for category:', category)
  
  // ⭐ MAPPING CATEGORY KE NAMA FILE - 4 kategori utama
  const getCategoryIconFile = (cat) => {
    const categoryMap = {
      // 4 kategori utama
      'pengumuman': 'megaphone',    // megaphone.png
      'birthday': 'birthday',       // birthday.png  
      'ibadah': 'ibadah',          // ibadah.png
      'event': 'event',            // event.png
      
      // Alias untuk compatibility
      'announcement': 'megaphone',
      'service': 'ibadah',
      'pelprap': 'ibadah', 
      'worship': 'ibadah',
      'ultah': 'birthday',
      'ulang_tahun': 'birthday',
      'acara': 'event',
      'pelatar': 'event',
      
      // Default
      'default': 'megaphone'
    }
    
    return categoryMap[cat?.toLowerCase()] || categoryMap['default']
  }
  
  const iconFile = getCategoryIconFile(category)
  console.log('🔍 [getAnnouncementIconUrl] Mapped', category, 'to', iconFile)
  
  // Coba berbagai ekstensi
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp']
  
  for (const ext of extensions) {
    try {
      // ⭐ PATH YANG BENAR: assets/icons/announcements/
      const iconPath = require(`@/assets/icons/announcements/${iconFile}.${ext}`)
      console.log(`✅ [getAnnouncementIconUrl] SUCCESS! Found ${iconFile}.${ext}:`, iconPath)
      return iconPath
      
    } catch (error) {
      console.log(`⚠️ [getAnnouncementIconUrl] ${iconFile}.${ext} not found`)
      continue
    }
  }
  
  // Coba fallback icons dalam urutan prioritas
  const fallbacks = ['megaphone', 'event', 'ibadah', 'birthday']
  for (const fallback of fallbacks) {
    if (fallback === iconFile) continue // Skip jika sudah dicoba
    
    for (const ext of extensions) {
      try {
        const fallbackPath = require(`@/assets/icons/announcements/${fallback}.${ext}`)
        console.log(`✅ [getAnnouncementIconUrl] Using fallback ${fallback}.${ext}`)
        return fallbackPath
      } catch (error) {
        continue
      }
    }
  }
  
  // Final fallback ke emoji
  console.warn('⚠️ [getAnnouncementIconUrl] All attempts failed, using emoji fallback')
  return createEmojiDataUrl(getEmojiForAnnouncement(category), 28)
}

// ⭐ DAILY VERSE - Simplified, hanya dari assets/daily-verse/ format ayat1.png
export const getDailyVerseUrl = (ayatNumber = null) => {
  let ayatIndex = ayatNumber
  
  if (!ayatIndex) {
    const today = new Date()
    const dayOfMonth = today.getDate()
    
    // ⭐ CYCLE dengan 5 ayat: tanggal 1-5 → ayat 1-5, tanggal 6-10 → ayat 1-5, dst
    const totalAyatFiles = 5 // Jumlah file ayat yang tersedia
    ayatIndex = ((dayOfMonth - 1) % totalAyatFiles) + 1 // Hasil: 1-5 terus cycle
  }
  
  console.log('🔍 [getDailyVerseUrl] Looking for ayat index:', ayatIndex)
  
  try {
    // Coba load file ayat{index}.png dari folder daily-verse
    const ayatPath = require(`@/assets/daily-verse/ayat${ayatIndex}.png`)
    console.log(`✅ [getDailyVerseUrl] Found ayat${ayatIndex}.png:`, ayatPath)
    return ayatPath
  } catch (error) {
    console.error(`❌ [getDailyVerseUrl] ayat${ayatIndex}.png not found:`, error.message)
    
    // ⭐ FALLBACK: Coba ayat lain yang ada (1-5)
    console.log('🔄 [getDailyVerseUrl] Trying fallback files...')
    
    for (let i = 1; i <= 5; i++) {
      if (i === ayatIndex) continue // Skip yang sudah dicoba
      
      try {
        const fallbackPath = require(`@/assets/daily-verse/ayat${i}.png`)
        console.log(`✅ [getDailyVerseUrl] Using fallback ayat${i}.png:`, fallbackPath)
        return fallbackPath
      } catch (fallbackError) {
        console.log(`⚠️ [getDailyVerseUrl] ayat${i}.png also not found`)
        continue
      }
    }
    
    // Jika semua gagal, throw error supaya HomePage bisa handle
    throw new Error(`No daily verse files found! Please add ayat1.png to ayat5.png in assets/daily-verse/`)
  }
}

// ⭐ THUMBNAILS - Optimized untuk different content types
export const getScheduleThumbnail = (schedule, size = 'large') => {
  console.log('🔍 [getScheduleThumbnail] Getting thumbnail for:', schedule?.title)
  
  // Jika ada thumbnail URL langsung dari database
  if (schedule?.thumbnail) {
    console.log('✅ [getScheduleThumbnail] Using provided thumbnail:', schedule.thumbnail)
    return schedule.thumbnail
  }
  
  // Jika tidak, buat berdasarkan kategori
  const category = schedule?.category || 'default'
  const width = size === 'small' ? 80 : 200
  const height = size === 'small' ? 80 : 200
  
  return createPlaceholderDataUrl(
    getCategoryText(category, 'JADWAL'), 
    width, 
    height, 
    getCategoryColor(category, '#41442A')
  )
}

export const getNewsThumbnail = (news, size = 'large') => {
  console.log('🔍 [getNewsThumbnail] Getting thumbnail for:', news?.title)
  
  if (news?.thumbnail) {
    console.log('✅ [getNewsThumbnail] Using provided thumbnail:', news.thumbnail)
    return news.thumbnail
  }
  
  const category = news?.category || 'default'
  const width = size === 'small' ? 80 : 200
  const height = size === 'small' ? 80 : 200
  
  return createPlaceholderDataUrl(
    getCategoryText(category, 'NEWS'), 
    width, 
    height, 
    getCategoryColor(category, '#2563eb')
  )
}

export const getDevotionalThumbnail = (devotional, size = 'large') => {
  console.log('🔍 [getDevotionalThumbnail] Getting thumbnail for:', devotional?.title)
  
  if (devotional?.thumbnail) {
    console.log('✅ [getDevotionalThumbnail] Using provided thumbnail:', devotional.thumbnail)
    return devotional.thumbnail
  }
  
  const category = devotional?.category || 'default'
  const width = size === 'small' ? 80 : 200
  const height = size === 'small' ? 80 : 200
  
  return createPlaceholderDataUrl(
    getCategoryText(category, 'RENUNGAN'), 
    width, 
    height, 
    getCategoryColor(category, '#7c3aed')
  )
}

// ⭐ HELPER FUNCTIONS - Improved and more robust

const getEmojiForFeature = (iconName) => {
  const emojiMap = {
    'News': '📰',
    'Jadwal': '📅', 
    'Giving': '💝',
    'Alkitab Setahun': '📖',
    'Renungan': '🙏',
    'Prayer Request': '🤲',
    // Fallbacks
    'news': '📰',
    'jadwal': '📅',
    'giving': '💝', 
    'alkitab': '📖',
    'renungan': '🙏',
    'prayer': '🤲'
  }
  return emojiMap[iconName] || emojiMap[iconName?.toLowerCase()] || '❓'
}

const getEmojiForAnnouncement = (category) => {
  const emojiMap = {
    // 4 kategori utama
    'pengumuman': '📢',
    'birthday': '🎂',
    'ibadah': '⛪',
    'event': '✨',
    
    // Alias untuk compatibility
    'announcement': '📢',
    'service': '⛪',
    'pelprap': '🙏',
    'worship': '⛪',
    'ultah': '🎂',
    'ulang_tahun': '🎂',
    'acara': '🎉',
    'pelatar': '🎓',
    
    'default': '📢'
  }
  return emojiMap[category?.toLowerCase()] || emojiMap['default']
}

const getCategoryText = (category, defaultText) => {
  const textMap = {
    'birthday': 'ULTAH',
    'service': 'IBADAH', 
    'ibadah': 'IBADAH',
    'pelprap': 'PELPRAP',
    'event': 'EVENT',
    'pelatar': 'PELATAR',
    'pengumuman': 'INFO',
    'kasih': 'KASIH',
    'iman': 'IMAN',
    'pengharapan': 'HARAPAN',
    'doa': 'DOA'
  }
  return textMap[category?.toLowerCase()] || defaultText
}

const getCategoryColor = (category, defaultColor) => {
  const colorMap = {
    'birthday': '#ec4899',
    'service': '#f59e0b',
    'ibadah': '#f59e0b', 
    'pelprap': '#10b981',
    'event': '#3b82f6',
    'pelatar': '#8b5cf6',
    'pengumuman': '#6366f1',
    'kasih': '#f43f5e',
    'iman': '#06b6d4',
    'pengharapan': '#84cc16',
    'doa': '#a855f7'
  }
  return colorMap[category?.toLowerCase()] || defaultColor
}

const createEmojiDataUrl = (emoji, size = 40) => {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    
    // Background
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, size, size)
    
    // Emoji
    ctx.font = `${size * 0.6}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, size / 2, size / 2)
    
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('❌ [createEmojiDataUrl] Error:', error)
    // Fallback ke solid color
    return createPlaceholderDataUrl('?', size, size)
  }
}

const createPlaceholderDataUrl = (text, width, height, bgColor = '#41442A', textColor = 'white') => {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    // Background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)
    
    // Text
    ctx.fillStyle = textColor
    const fontSize = Math.min(width, height) * 0.12
    ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Multi-line text handling
    const maxWidth = width * 0.8
    const lines = wrapText(ctx, text, maxWidth)
    const lineHeight = fontSize * 1.2
    const totalHeight = lines.length * lineHeight
    const startY = (height - totalHeight) / 2 + lineHeight / 2
    
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + index * lineHeight)
    })
    
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('❌ [createPlaceholderDataUrl] Error:', error)
    // Return minimal fallback
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  }
}

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(' ')
  const lines = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

// ⭐ DEBUG FUNCTION - Test semua assets yang ada
export const debugIconAssets = () => {
  console.log('🧪 [DEBUG] Testing asset folders...')
  
  // Test feature icons
  console.log('📁 Testing assets/icons/features/')
  const featureTests = ['news', 'jadwal', 'giving', 'alkitab', 'renungan', 'prayer']
  const featureExtensions = ['png', 'jpg', 'jpeg', 'svg']
  
  featureTests.forEach(icon => {
    featureExtensions.forEach(ext => {
      try {
        require(`@/assets/icons/features/${icon}.${ext}`)
        console.log(`✅ features/${icon}.${ext} -> FOUND`)
      } catch (error) {
        console.log(`❌ features/${icon}.${ext} -> NOT FOUND`)
      }
    })
  })
  
  // Test announcement icons
  console.log('📁 Testing assets/icons/announcements/')
  const announcementTests = ['megaphone', 'birthday', 'ibadah', 'event']
  
  announcementTests.forEach(icon => {
    featureExtensions.forEach(ext => {
      try {
        require(`@/assets/icons/announcements/${icon}.${ext}`)
        console.log(`✅ announcements/${icon}.${ext} -> FOUND`)
      } catch (error) {
        console.log(`❌ announcements/${icon}.${ext} -> NOT FOUND`)
      }
    })
  })
  
  // Test daily verse - hanya test ayat1.png sampai ayat5.png
  console.log('📁 Testing assets/daily-verse/')
  for (let i = 1; i <= 5; i++) {
    try {
      require(`@/assets/daily-verse/ayat${i}.png`)
      console.log(`✅ daily-verse/ayat${i}.png -> FOUND`)
    } catch (error) {
      console.log(`❌ daily-verse/ayat${i}.png -> NOT FOUND`)
    }
  }
}

// ⭐ UNIVERSAL THUMBNAIL GETTER (untuk ScheduleCard)
export const getThumbnail = (category, item, size = 'large') => {
  console.log('🔍 [getThumbnail] Getting thumbnail for category:', category)
  
  // Tentukan berdasarkan kategori atau context
  if (category === 'schedule' || category === 'jadwal') {
    return getScheduleThumbnail(item, size)
  } else if (category === 'news' || category === 'berita') {
    return getNewsThumbnail(item, size)
  } else if (category === 'devotional' || category === 'renungan') {
    return getDevotionalThumbnail(item, size)
  } else {
    // Default fallback
    return getScheduleThumbnail(item, size)
  }
}

// ⭐ ERROR HANDLER untuk gambar yang gagal load
export const handleImageError = (event, fallbackCategory = 'default') => {
  console.warn('🖼️ [handleImageError] Image failed to load:', event.target.src)
  
  const emoji = getEmojiForFeature(fallbackCategory)
  event.target.src = createEmojiDataUrl(emoji, 40)
  
  // Prevent infinite loop
  event.target.onerror = null
}

// ⭐ AUTO-RUN DEBUG saat development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [imageUtils] Development mode - running asset debug')
  debugIconAssets()
}

console.log('✅ [imageUtils] Optimized version loaded successfully!')