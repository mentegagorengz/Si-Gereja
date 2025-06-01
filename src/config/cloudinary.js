// src/config/cloudinary.js
// Konfigurasi Cloudinary untuk MyRajawali App

const CLOUDINARY_CONFIG = {
  cloudName: 'dw9sqn5kq', // ⭐ GANTI dengan cloud name kamu dari screenshot
  folder: 'myrajawali'
}

// Base URL builder - seperti membuat alamat rumah di internet
const buildCloudinaryUrl = (folder, filename, preset = null, customTransformation = null) => {
  let transformation = ''
  
  if (preset) {
    // ✅ PAKAI PRESET yang sudah dibuat
    transformation = `t_${preset}`
  } else if (customTransformation) {
    // Untuk kasus khusus yang butuh custom transformation
    transformation = customTransformation
  } else {
    // Fallback ke auto jika tidak ada preset
    transformation = 'q_auto,f_auto'
  }
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformation}/${CLOUDINARY_CONFIG.folder}/${folder}/${filename}`
}

// Helper functions - seperti perintah pintas untuk ambil gambar
export const getLogoUrl = (preset = 'small') => {
  return buildCloudinaryUrl('logos', 'logo-MyRajawali.png', preset)
}

// ⭐ DYNAMIC DAILY VERSE - Auto-detect jumlah ayat di Cloudinary
export const getDailyVerseUrl = async (preset = 'large', ayatNumber = null) => {
  let filename = 'ayat1.jpg' // fallback
  
  if (ayatNumber) {
    // Manual selection
    filename = `ayat${ayatNumber}.jpg`
  } else {
    // ⭐ AUTO-DETECT total ayat dari Cloudinary
    const totalAyat = await getTotalDailyVerseCount()
    
    const today = new Date()
    const dayOfMonth = today.getDate() // 1-31
    const ayatIndex = (dayOfMonth % totalAyat) + 1 // Rotasi dinamis
    
    filename = `ayat${ayatIndex}.jpg`
  }
  
  console.log('🔍 [getDailyVerseUrl] Selected daily ayat:', filename)
  return buildCloudinaryUrl('daily-verse', filename, preset)
}

// ⭐ FUNCTION UNTUK AUTO-COUNT AYAT DI CLOUDINARY
async function getTotalDailyVerseCount() {
  try {
    // Cek dari cache localStorage dulu (untuk performa)
    const cachedCount = localStorage.getItem('dailyVerseCount')
    const cacheTime = localStorage.getItem('dailyVerseCountTime')
    const now = Date.now()
    
    // Kalau cache masih fresh (kurang dari 1 jam), pakai cache
    if (cachedCount && cacheTime && (now - parseInt(cacheTime)) < 3600000) {
      console.log('✅ [getTotalDailyVerseCount] Using cached count:', cachedCount)
      return parseInt(cachedCount)
    }
    
    console.log('🔍 [getTotalDailyVerseCount] Fetching count from Cloudinary...')
    
    // ⭐ CLOUDINARY SEARCH API untuk count files
    const searchUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/list/daily-verse.json`
    
    const response = await fetch(searchUrl)
    
    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.status}`)
    }
    
    const data = await response.json()
    const resources = data.resources || []
    
    // Filter hanya file ayat yang sesuai pattern ayat{number}.jpg
    const ayatFiles = resources.filter(resource => {
      const filename = resource.public_id.split('/').pop()
      return /^ayat\d+\.(jpg|jpeg|png)$/i.test(filename)
    })
    
    const count = ayatFiles.length
    console.log('✅ [getTotalDailyVerseCount] Found', count, 'ayat files')
    
    // Cache hasil untuk 1 jam
    localStorage.setItem('dailyVerseCount', count.toString())
    localStorage.setItem('dailyVerseCountTime', now.toString())
    
    return count > 0 ? count : 3 // Fallback ke 3 kalau tidak ada
    
  } catch (error) {
    console.error('❌ [getTotalDailyVerseCount] Error:', error)
    
    // Fallback: coba ambil dari cache lama atau default ke 3
    const oldCache = localStorage.getItem('dailyVerseCount')
    return oldCache ? parseInt(oldCache) : 3
  }
}

// ⭐ FUNCTION UNTUK REFRESH COUNT (dipanggil setelah admin upload)
export const refreshDailyVerseCount = async () => {
  console.log('🔄 [refreshDailyVerseCount] Clearing cache and refetching...')
  
  // Clear cache
  localStorage.removeItem('dailyVerseCount')
  localStorage.removeItem('dailyVerseCountTime')
  
  // Fetch fresh count
  return await getTotalDailyVerseCount()
}

// ⭐ HELPER FUNCTIONS
function getWeekOfYear(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function getSessionBasedAyat(totalAyat) {
  // Ambil atau buat session seed
  let sessionSeed = localStorage.getItem('ayatSessionSeed')
  
  if (!sessionSeed) {
    // Buat seed baru berdasarkan waktu + random
    sessionSeed = Date.now() + Math.random()
    localStorage.setItem('ayatSessionSeed', sessionSeed.toString())
  }
  
  // Convert seed ke index ayat
  const numericSeed = parseInt(sessionSeed)
  return (numericSeed % totalAyat) + 1
}

export const getIconUrl = (iconName, preset = 'small') => {
  // Pastikan extensi .png ada
  const filename = iconName.endsWith('.png') ? iconName : `${iconName}.png`
  
  return buildCloudinaryUrl('icons', filename, preset)
}

export const getThumbnailUrl = (category, filename, size = 'large') => {
  // Untuk thumbnail schedule, news, devotional
  // size: 'small' untuk card/list, 'large' untuk detail page
  const folder = `thumbnails/${category}/${size}`
  
  // Pilih preset berdasarkan size
  const preset = size === 'small' ? 'small' : 'large'
  
  return buildCloudinaryUrl(folder, filename, preset)
}

// Generic function untuk custom asset
export const getAssetUrl = (folder, filename, preset = null, customTransformation = null) => {
  return buildCloudinaryUrl(folder, filename, preset, customTransformation)
}

export default {
  getLogoUrl,
  getDailyVerseUrl, 
  getIconUrl,
  getThumbnailUrl,
  getAssetUrl,
  refreshDailyVerseCount
}

// ⭐ EXPORT buildCloudinaryUrl untuk fallback
export { buildCloudinaryUrl }