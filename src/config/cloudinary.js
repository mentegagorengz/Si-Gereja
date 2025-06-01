// src/config/cloudinary.js
// Konfigurasi Cloudinary untuk MyRajawali App

const CLOUDINARY_CONFIG = {
  cloudName: 'dw9sqn5kq', // ⭐ Cloud name dari screenshot
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

export const getDailyVerseUrl = (preset = 'large', ayatNumber = null) => {
  let filename = 'ayat1.jpg' // fallback
  
  if (ayatNumber) {
    // Manual selection
    filename = `ayat${ayatNumber}.jpg`
  } else {
    // ⭐ DAILY MODE - Ganti berdasarkan tanggal hari ini  
    const today = new Date()
    const dayOfMonth = today.getDate() // 1-31
    const totalAyat = 3 // Manual count untuk sekarang
    const ayatIndex = (dayOfMonth % totalAyat) + 1 // Rotasi 1, 2, 3
    
    filename = `ayat${ayatIndex}.jpg`
  }
  
  console.log('🔍 [getDailyVerseUrl] Selected daily ayat:', filename)
  return buildCloudinaryUrl('daily-verse', filename, preset)
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
  getAssetUrl
}

// ⭐ EXPORT buildCloudinaryUrl untuk fallback
export { buildCloudinaryUrl }