// Image utilities for handling thumbnails, icons, and media assets
// Supports news, schedules, devotionals, features, and announcements

// ⭐ NEWS THUMBNAILS - dari assets/thumbnails/news/
export const getNewsThumbnail = (news, size = 'large') => {
  const extensions = ['png', 'jpg', 'jpeg', 'webp']
  const sizeFolder = size === 'small' ? 'small' : 'large'
  
  // STEP 1: PRIORITAS - Coba berdasarkan thumbnail field dulu (jika ADA)
  if (news?.thumbnail && news.thumbnail.trim() !== '') {
    for (const ext of extensions) {
      try {
        const thumbnailPath = require(`@/assets/thumbnails/news/${sizeFolder}/${news.thumbnail}.${ext}`)
        return thumbnailPath
      } catch (error) {
        continue
      }
    }
  }
  
  // STEP 2: FALLBACK - Coba berdasarkan CATEGORY (kalau thumbnail kosong atau tidak ditemukan)
  if (news?.category && news.category.trim() !== '') {
    for (const ext of extensions) {
      try {
        const categoryPath = require(`@/assets/thumbnails/news/${sizeFolder}/${news.category}.${ext}`)
        return categoryPath
      } catch (error) {
        continue
      }
    }
  }
  
  // STEP 3: PLACEHOLDER berdasarkan category
  const category = news?.category || 'news'
  const width = size === 'small' ? 80 : 200
  const height = size === 'small' ? 80 : 200
  
  return createPlaceholderDataUrl(
    getCategoryText(category, 'NEWS'), 
    width, 
    height, 
    getCategoryColor(category, '#2563eb')
  )
}

// ⭐ SCHEDULE/JADWAL THUMBNAILS - dari assets/thumbnails/jadwal/
export const getScheduleThumbnail = (schedule, size = 'large') => {
  const extensions = ['png', 'jpg', 'jpeg', 'webp']
  const sizeFolder = size === 'small' ? 'small' : 'large'
  
  // STEP 1: PRIORITAS - Coba berdasarkan CATEGORY dulu
  if (schedule?.category) {
    for (const ext of extensions) {
      try {
        const categoryPath = require(`@/assets/thumbnails/jadwal/${sizeFolder}/${schedule.category}.${ext}`)
        return categoryPath
      } catch (error) {
        continue
      }
    }
  }
  
  // STEP 2: FALLBACK - Coba berdasarkan thumbnail field dari database
  if (schedule?.thumbnail) {
    for (const ext of extensions) {
      try {
        const thumbnailPath = require(`@/assets/thumbnails/jadwal/${sizeFolder}/${schedule.thumbnail}.${ext}`)
        return thumbnailPath
      } catch (error) {
        continue
      }
    }
  }
  
  // STEP 3: PLACEHOLDER berdasarkan category
  const category = schedule?.category || 'jadwal'
  const width = size === 'small' ? 80 : 200
  const height = size === 'small' ? 80 : 200
  
  return createPlaceholderDataUrl(
    getCategoryText(category, 'JADWAL'), 
    width, 
    height, 
    getCategoryColor(category, '#41442A')
  )
}

// ⭐ DEVOTIONAL/RENUNGAN THUMBNAILS - dari assets/thumbnails/devotionals/
export const getDevotionalThumbnail = (devotional, size = 'large') => {
  const extensions = ['png', 'jpg', 'jpeg', 'webp']
  const sizeFolder = size === 'small' ? 'small' : 'large'
  
  // STEP 1: PRIORITAS - Coba berdasarkan CATEGORY dulu
  if (devotional?.category) {
    for (const ext of extensions) {
      try {
        const categoryPath = require(`@/assets/thumbnails/devotionals/${sizeFolder}/${devotional.category}.${ext}`)
        return categoryPath
      } catch (error) {
        continue
      }
    }
  }
  
  // STEP 2: FALLBACK - Coba berdasarkan thumbnail field dari database
  if (devotional?.thumbnail) {
    for (const ext of extensions) {
      try {
        const thumbnailPath = require(`@/assets/thumbnails/devotionals/${sizeFolder}/${devotional.thumbnail}.${ext}`)
        return thumbnailPath
      } catch (error) {
        continue
      }
    }
  }
  
  // STEP 3: PLACEHOLDER berdasarkan category
  const category = devotional?.category || 'renungan'
  const width = size === 'small' ? 80 : 200
  const height = size === 'small' ? 80 : 200
  
  return createPlaceholderDataUrl(
    getCategoryText(category, 'RENUNGAN'), 
    width, 
    height, 
    getCategoryColor(category, '#7c3aed')
  )
}

// ⭐ FEATURE ICONS - dari assets/icons/features/
export const getFeatureIconUrl = (iconName) => {
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
      return iconPath
    } catch (error) {
      continue
    }
  }
  
  return createEmojiDataUrl(getEmojiForFeature(iconName), 40)
}

// ⭐ ANNOUNCEMENT ICONS - dari assets/icons/announcements/
export const getAnnouncementIconUrl = (category) => {
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
      return iconPath
    } catch (error) {
      continue
    }
  }
  
  return createEmojiDataUrl(getEmojiForAnnouncement(category), 28)
}

// ⭐ DAILY VERSE
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
    return ayatPath
  } catch (error) {
    for (let i = 1; i <= 5; i++) {
      if (i === ayatIndex) continue
      try {
        const fallbackPath = require(`@/assets/daily-verse/ayat${i}.png`)
        return fallbackPath
      } catch (fallbackError) {
        continue
      }
    }
    throw new Error(`No daily verse files found! Please add ayat1.png to ayat5.png in assets/daily-verse/`)
  }
}

// ⭐ UNIVERSAL THUMBNAIL GETTER
export const getThumbnail = (category, item, size = 'large') => {
  if (category === 'news' || category === 'berita') {
    return getNewsThumbnail(item, size)
  } else if (category === 'schedule' || category === 'jadwal') {
    return getScheduleThumbnail(item, size)
  } else if (category === 'devotional' || category === 'renungan') {
    return getDevotionalThumbnail(item, size)
  } else {
    return getScheduleThumbnail(item, size)
  }
}

// ⭐ HELPER FUNCTIONS
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
    'pengumuman': '6366f1', 'kasih': '#f43f5e', 'iman': '#06b6d4',
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
    console.error('Error creating emoji data URL:', error)
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
    console.error('Error creating placeholder data URL:', error)
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