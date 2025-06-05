// src/utils/imageUtils.js - UPDATED VERSION dengan Logic yang Benar!
// ✨ Sesuai struktur folder: news, jadwal, devotionals

console.log('🚀 [imageUtils] Loading NEW optimized version dengan folder structure...')

// ⭐ NEWS THUMBNAILS - dari assets/thumbnails/news/
export const getNewsThumbnail = (news, size = 'large') => {
  console.log('🔍 [getNewsThumbnail] Getting thumbnail for:', news?.title)
  console.log('🔍 [getNewsThumbnail] Category:', news?.category)
  console.log('🔍 [getNewsThumbnail] Thumbnail field:', news?.thumbnail)
  console.log('🔍 [getNewsThumbnail] Size requested:', size)
  
  const extensions = ['png', 'jpg', 'jpeg', 'webp']
  const sizeFolder = size === 'small' ? 'small' : 'large'
  
  // ⭐ STEP 1: PRIORITAS - Coba berdasarkan thumbnail field dulu (jika ADA)
  if (news?.thumbnail && news.thumbnail.trim() !== '') {
    console.log('🔍 [getNewsThumbnail] STEP 1: Trying thumbnail field from database...')
    console.log('🔍 [getNewsThumbnail] Looking for:', `assets/thumbnails/news/${sizeFolder}/${news.thumbnail}.*`)
    
    for (const ext of extensions) {
      try {
        const thumbnailPath = require(`@/assets/thumbnails/news/${sizeFolder}/${news.thumbnail}.${ext}`)
        console.log(`✅ [getNewsThumbnail] SUCCESS! Found thumbnail field-based: news/${sizeFolder}/${news.thumbnail}.${ext}`)
        return thumbnailPath
      } catch (error) {
        console.log(`⚠️ [getNewsThumbnail] ${news.thumbnail}.${ext} not found in news/${sizeFolder}/`)
        continue
      }
    }
    
    console.log('❌ [getNewsThumbnail] Thumbnail field provided but file not found, trying category fallback...')
  }
  
  // ⭐ STEP 2: FALLBACK - Coba berdasarkan CATEGORY (kalau thumbnail kosong atau tidak ditemukan)
  if (news?.category && news.category.trim() !== '') {
    console.log('🔍 [getNewsThumbnail] STEP 2: Trying category-based thumbnail...')
    console.log('🔍 [getNewsThumbnail] Looking for:', `assets/thumbnails/news/${sizeFolder}/${news.category}.*`)
    
    for (const ext of extensions) {
      try {
        const categoryPath = require(`@/assets/thumbnails/news/${sizeFolder}/${news.category}.${ext}`)
        console.log(`✅ [getNewsThumbnail] SUCCESS! Found category-based: news/${sizeFolder}/${news.category}.${ext}`)
        return categoryPath
      } catch (error) {
        console.log(`⚠️ [getNewsThumbnail] ${news.category}.${ext} not found in news/${sizeFolder}/`)
        continue
      }
    }
  }
  
  console.log('❌ [getNewsThumbnail] No thumbnail file found, creating placeholder')
  
  // ⭐ STEP 3: PLACEHOLDER berdasarkan category
  const category = news?.category || 'news'
  const width = size === 'small' ? 80 : 200
  const height = size === 'small' ? 80 : 200
  
  console.log('🎨 [getNewsThumbnail] Creating placeholder for category:', category)
  
  return createPlaceholderDataUrl(
    getCategoryText(category, 'NEWS'), 
    width, 
    height, 
    getCategoryColor(category, '#2563eb')
  )
}

// ⭐ SCHEDULE/JADWAL THUMBNAILS - dari assets/thumbnails/jadwal/
export const getScheduleThumbnail = (schedule, size = 'large') => {
  console.log('🔍 [getScheduleThumbnail] Getting thumbnail for:', schedule?.title)
  console.log('🔍 [getScheduleThumbnail] Category:', schedule?.category)
  console.log('🔍 [getScheduleThumbnail] Thumbnail field:', schedule?.thumbnail)
  console.log('🔍 [getScheduleThumbnail] Size requested:', size)
  
  const extensions = ['png', 'jpg', 'jpeg', 'webp']
  const sizeFolder = size === 'small' ? 'small' : 'large'
  
  // ⭐ STEP 1: PRIORITAS - Coba berdasarkan CATEGORY dulu
  if (schedule?.category) {
    console.log('🔍 [getScheduleThumbnail] STEP 1: Trying category-based thumbnail...')
    console.log('🔍 [getScheduleThumbnail] Looking for:', `assets/thumbnails/jadwal/${sizeFolder}/${schedule.category}.*`)
    
    for (const ext of extensions) {
      try {
        const categoryPath = require(`@/assets/thumbnails/jadwal/${sizeFolder}/${schedule.category}.${ext}`)
        console.log(`✅ [getScheduleThumbnail] SUCCESS! Found category-based: jadwal/${sizeFolder}/${schedule.category}.${ext}`)
        return categoryPath
      } catch (error) {
        console.log(`⚠️ [getScheduleThumbnail] ${schedule.category}.${ext} not found in jadwal/${sizeFolder}/`)
        continue
      }
    }
  }
  
  // ⭐ STEP 2: FALLBACK - Coba berdasarkan thumbnail field dari database
  if (schedule?.thumbnail) {
    console.log('🔍 [getScheduleThumbnail] STEP 2: Trying thumbnail field from database...')
    console.log('🔍 [getScheduleThumbnail] Looking for:', `assets/thumbnails/jadwal/${sizeFolder}/${schedule.thumbnail}.*`)
    
    for (const ext of extensions) {
      try {
        const thumbnailPath = require(`@/assets/thumbnails/jadwal/${sizeFolder}/${schedule.thumbnail}.${ext}`)
        console.log(`✅ [getScheduleThumbnail] SUCCESS! Found thumbnail field-based: jadwal/${sizeFolder}/${schedule.thumbnail}.${ext}`)
        return thumbnailPath
      } catch (error) {
        console.log(`⚠️ [getScheduleThumbnail] ${schedule.thumbnail}.${ext} not found in jadwal/${sizeFolder}/`)
        continue
      }
    }
  }
  
  console.log('❌ [getScheduleThumbnail] No thumbnail file found, creating placeholder')
  
  // ⭐ STEP 3: PLACEHOLDER berdasarkan category
  const category = schedule?.category || 'jadwal'
  const width = size === 'small' ? 80 : 200
  const height = size === 'small' ? 80 : 200
  
  console.log('🎨 [getScheduleThumbnail] Creating placeholder for category:', category)
  
  return createPlaceholderDataUrl(
    getCategoryText(category, 'JADWAL'), 
    width, 
    height, 
    getCategoryColor(category, '#41442A')
  )
}

// ⭐ DEVOTIONAL/RENUNGAN THUMBNAILS - dari assets/thumbnails/devotionals/
export const getDevotionalThumbnail = (devotional, size = 'large') => {
  console.log('🔍 [getDevotionalThumbnail] Getting thumbnail for:', devotional?.title)
  console.log('🔍 [getDevotionalThumbnail] Category:', devotional?.category)
  console.log('🔍 [getDevotionalThumbnail] Thumbnail field:', devotional?.thumbnail)
  console.log('🔍 [getDevotionalThumbnail] Size requested:', size)
  
  const extensions = ['png', 'jpg', 'jpeg', 'webp']
  const sizeFolder = size === 'small' ? 'small' : 'large'
  
  // ⭐ STEP 1: PRIORITAS - Coba berdasarkan CATEGORY dulu
  if (devotional?.category) {
    console.log('🔍 [getDevotionalThumbnail] STEP 1: Trying category-based thumbnail...')
    console.log('🔍 [getDevotionalThumbnail] Looking for:', `assets/thumbnails/devotionals/${sizeFolder}/${devotional.category}.*`)
    
    for (const ext of extensions) {
      try {
        const categoryPath = require(`@/assets/thumbnails/devotionals/${sizeFolder}/${devotional.category}.${ext}`)
        console.log(`✅ [getDevotionalThumbnail] SUCCESS! Found category-based: devotionals/${sizeFolder}/${devotional.category}.${ext}`)
        return categoryPath
      } catch (error) {
        console.log(`⚠️ [getDevotionalThumbnail] ${devotional.category}.${ext} not found in devotionals/${sizeFolder}/`)
        continue
      }
    }
  }
  
  // ⭐ STEP 2: FALLBACK - Coba berdasarkan thumbnail field dari database
  if (devotional?.thumbnail) {
    console.log('🔍 [getDevotionalThumbnail] STEP 2: Trying thumbnail field from database...')
    console.log('🔍 [getDevotionalThumbnail] Looking for:', `assets/thumbnails/devotionals/${sizeFolder}/${devotional.thumbnail}.*`)
    
    for (const ext of extensions) {
      try {
        const thumbnailPath = require(`@/assets/thumbnails/devotionals/${sizeFolder}/${devotional.thumbnail}.${ext}`)
        console.log(`✅ [getDevotionalThumbnail] SUCCESS! Found thumbnail field-based: devotionals/${sizeFolder}/${devotional.thumbnail}.${ext}`)
        return thumbnailPath
      } catch (error) {
        console.log(`⚠️ [getDevotionalThumbnail] ${devotional.thumbnail}.${ext} not found in devotionals/${sizeFolder}/`)
        continue
      }
    }
  }
  
  console.log('❌ [getDevotionalThumbnail] No thumbnail file found, creating placeholder')
  
  // ⭐ STEP 3: PLACEHOLDER berdasarkan category
  const category = devotional?.category || 'renungan'
  const width = size === 'small' ? 80 : 200
  const height = size === 'small' ? 80 : 200
  
  console.log('🎨 [getDevotionalThumbnail] Creating placeholder for category:', category)
  
  return createPlaceholderDataUrl(
    getCategoryText(category, 'RENUNGAN'), 
    width, 
    height, 
    getCategoryColor(category, '#7c3aed')
  )
}

// ⭐ FEATURE ICONS - dari assets/icons/features/ (UNCHANGED)
export const getFeatureIconUrl = (iconName) => {
  console.log('🔍 [getFeatureIconUrl] Getting feature icon for:', iconName)
  
  const iconMapping = {
    'News': 'news',
    'Jadwal': 'jadwal', 
    'Giving': 'giving',
    'Alkitab Setahun': 'alkitab',
    'Renungan': 'renungan',
    'Prayer Request': 'prayer'
  }
  
  const iconFile = iconMapping[iconName] || iconName.toLowerCase().replace(/\s+/g, '')
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp']
  
  for (const ext of extensions) {
    try {
      const iconPath = require(`@/assets/icons/features/${iconFile}.${ext}`)
      console.log(`✅ [getFeatureIconUrl] SUCCESS! Found ${iconFile}.${ext}`)
      return iconPath
    } catch (error) {
      continue
    }
  }
  
  console.warn('⚠️ [getFeatureIconUrl] Icon not found, using emoji fallback')
  return createEmojiDataUrl(getEmojiForFeature(iconName), 40)
}

// ⭐ ANNOUNCEMENT ICONS - dari assets/icons/announcements/ (UNCHANGED)
export const getAnnouncementIconUrl = (category) => {
  console.log('🔍 [getAnnouncementIconUrl] Getting announcement icon for:', category)
  
  const getCategoryIconFile = (cat) => {
    const categoryMap = {
      'pengumuman': 'megaphone',
      'birthday': 'birthday',       
      'ibadah': 'ibadah',          
      'event': 'event',            
      'announcement': 'megaphone',
      'service': 'ibadah',
      'pelprap': 'ibadah', 
      'worship': 'ibadah',
      'ultah': 'birthday',
      'ulang_tahun': 'birthday',
      'acara': 'event',
      'pelatar': 'event',
      'default': 'megaphone'
    }
    return categoryMap[cat?.toLowerCase()] || categoryMap['default']
  }
  
  const iconFile = getCategoryIconFile(category)
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp']
  
  for (const ext of extensions) {
    try {
      const iconPath = require(`@/assets/icons/announcements/${iconFile}.${ext}`)
      console.log(`✅ [getAnnouncementIconUrl] SUCCESS! Found ${iconFile}.${ext}`)
      return iconPath
    } catch (error) {
      continue
    }
  }
  
  console.warn('⚠️ [getAnnouncementIconUrl] Icon not found, using emoji fallback')
  return createEmojiDataUrl(getEmojiForAnnouncement(category), 28)
}

// ⭐ DAILY VERSE (UNCHANGED)
export const getDailyVerseUrl = (ayatNumber = null) => {
  let ayatIndex = ayatNumber
  
  if (!ayatIndex) {
    const today = new Date()
    const dayOfMonth = today.getDate()
    const totalAyatFiles = 5
    ayatIndex = ((dayOfMonth - 1) % totalAyatFiles) + 1
  }
  
  try {
    const ayatPath = require(`@/assets/daily-verse/ayat${ayatIndex}.png`)
    console.log(`✅ [getDailyVerseUrl] Found ayat${ayatIndex}.png`)
    return ayatPath
  } catch (error) {
    for (let i = 1; i <= 5; i++) {
      if (i === ayatIndex) continue
      try {
        const fallbackPath = require(`@/assets/daily-verse/ayat${i}.png`)
        console.log(`✅ [getDailyVerseUrl] Using fallback ayat${i}.png`)
        return fallbackPath
      } catch (fallbackError) {
        continue
      }
    }
    throw new Error(`No daily verse files found! Please add ayat1.png to ayat5.png in assets/daily-verse/`)
  }
}

// ⭐ UNIVERSAL THUMBNAIL GETTER - UPDATED untuk routing yang benar
export const getThumbnail = (category, item, size = 'large') => {
  console.log('🔍 [getThumbnail] Getting thumbnail for category:', category)
  
  // Route berdasarkan kategori content
  if (category === 'news' || category === 'berita') {
    return getNewsThumbnail(item, size)
  } else if (category === 'schedule' || category === 'jadwal') {
    return getScheduleThumbnail(item, size)
  } else if (category === 'devotional' || category === 'renungan') {
    return getDevotionalThumbnail(item, size)
  } else {
    // Default fallback ke schedule
    console.log('⚠️ [getThumbnail] Unknown category, defaulting to schedule')
    return getScheduleThumbnail(item, size)
  }
}

// ⭐ HELPER FUNCTIONS (UNCHANGED)
const getEmojiForFeature = (iconName) => {
  const emojiMap = {
    'News': '📰', 'Jadwal': '📅', 'Giving': '💝',
    'Alkitab Setahun': '📖', 'Renungan': '🙏', 'Prayer Request': '🤲',
    'news': '📰', 'jadwal': '📅', 'giving': '💝', 
    'alkitab': '📖', 'renungan': '🙏', 'prayer': '🤲'
  }
  return emojiMap[iconName] || emojiMap[iconName?.toLowerCase()] || '❓'
}

const getEmojiForAnnouncement = (category) => {
  const emojiMap = {
    'pengumuman': '📢', 'birthday': '🎂', 'ibadah': '⛪', 'event': '✨',
    'announcement': '📢', 'service': '⛪', 'pelprap': '🙏', 'worship': '⛪',
    'ultah': '🎂', 'ulang_tahun': '🎂', 'acara': '🎉', 'pelatar': '🎓',
    'default': '📢'
  }
  return emojiMap[category?.toLowerCase()] || emojiMap['default']
}

const getCategoryText = (category, defaultText) => {
  const textMap = {
    'birthday': 'ULTAH', 'service': 'IBADAH', 'ibadah': 'IBADAH',
    'pelprap': 'PELPRAP', 'event': 'EVENT', 'pelatar': 'PELATAR',
    'pengumuman': 'INFO', 'kasih': 'KASIH', 'iman': 'IMAN',
    'pengharapan': 'HARAPAN', 'doa': 'DOA', 'news': 'NEWS',
    'jadwal': 'JADWAL', 'renungan': 'RENUNGAN', 'undangan': 'UNDANGAN'
  }
  return textMap[category?.toLowerCase()] || defaultText
}

const getCategoryColor = (category, defaultColor) => {
  const colorMap = {
    'birthday': '#ec4899', 'service': '#f59e0b', 'ibadah': '#f59e0b', 
    'pelprap': '#10b981', 'event': '#3b82f6', 'pelatar': '#8b5cf6',
    'pengumuman': '#6366f1', 'kasih': '#f43f5e', 'iman': '#06b6d4',
    'pengharapan': '#84cc16', 'doa': '#a855f7', 'news': '#2563eb',
    'jadwal': '#41442A', 'renungan': '#7c3aed', 'undangan': '#8b5cf6'
  }
  return colorMap[category?.toLowerCase()] || defaultColor
}

const createEmojiDataUrl = (emoji, size = 40) => {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#f8f9fa'
    ctx.fillRect(0, 0, size, size)
    
    ctx.font = `${size * 0.6}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, size / 2, size / 2)
    
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('❌ [createEmojiDataUrl] Error:', error)
    return createPlaceholderDataUrl('?', size, size)
  }
}

const createPlaceholderDataUrl = (text, width, height, bgColor = '#41442A', textColor = 'white') => {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)
    
    ctx.fillStyle = textColor
    const fontSize = Math.min(width, height) * 0.12
    ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
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

// ⭐ DEBUG FUNCTION - Update dengan folder baru
export const debugThumbnailAssets = () => {
  console.log('🧪 [DEBUG] Testing thumbnail folders...')
  
  // Test news thumbnails
  console.log('📁 Testing assets/thumbnails/news/')
  const newsTests = ['favoredcamp', 'event', 'pengumuman', 'undangan']
  const sizes = ['small', 'large']
  const extensions = ['png', 'jpg', 'jpeg', 'webp']
  
  newsTests.forEach(thumb => {
    sizes.forEach(size => {
      extensions.forEach(ext => {
        try {
          require(`@/assets/thumbnails/news/${size}/${thumb}.${ext}`)
          console.log(`✅ news/${size}/${thumb}.${ext} -> FOUND`)
        } catch (error) {
          console.log(`❌ news/${size}/${thumb}.${ext} -> NOT FOUND`)
        }
      })
    })
  })
  
  // Test jadwal thumbnails
  console.log('📁 Testing assets/thumbnails/jadwal/')
  const jadwalTests = ['ibadah', 'event', 'pelatar', 'pelprap']
  
  jadwalTests.forEach(thumb => {
    sizes.forEach(size => {
      extensions.forEach(ext => {
        try {
          require(`@/assets/thumbnails/jadwal/${size}/${thumb}.${ext}`)
          console.log(`✅ jadwal/${size}/${thumb}.${ext} -> FOUND`)
        } catch (error) {
          console.log(`❌ jadwal/${size}/${thumb}.${ext} -> NOT FOUND`)
        }
      })
    })
  })
  
  // Test devotionals thumbnails
  console.log('📁 Testing assets/thumbnails/devotionals/')
  const devotionalTests = ['kasih', 'iman', 'pengharapan', 'doa']
  
  devotionalTests.forEach(thumb => {
    sizes.forEach(size => {
      extensions.forEach(ext => {
        try {
          require(`@/assets/thumbnails/devotionals/${size}/${thumb}.${ext}`)
          console.log(`✅ devotionals/${size}/${thumb}.${ext} -> FOUND`)
        } catch (error) {
          console.log(`❌ devotionals/${size}/${thumb}.${ext} -> NOT FOUND`)
        }
      })
    })
  })
}

// Auto-run debug di development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [imageUtils] Development mode - running thumbnail debug')
  debugThumbnailAssets()
}

console.log('✅ [imageUtils] NEW version loaded dengan folder structure yang benar!')