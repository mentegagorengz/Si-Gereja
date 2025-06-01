// src/utils/imageUtils.js
// Utility functions untuk handle semua gambar dari Cloudinary

import { getIconUrl, getThumbnailUrl } from '@/config/cloudinary'

// ⭐ ICON HELPERS - untuk icon-icon kecil
export const getFeatureIconUrl = (iconName) => {
  console.log('🔍 [getFeatureIconUrl] Getting icon for:', iconName)
  
  // Mapping nama feature ke nama file icon
  const iconMapping = {
    'News': 'news',
    'Jadwal': 'jadwal', 
    'Giving': 'giving',
    'Alkitab Setahun': 'alkitab',
    'Renungan': 'renungan',
    'Prayer Request': 'prayer'
  }
  
  const iconFile = iconMapping[iconName] || iconName.toLowerCase()
  const url = getIconUrl(iconFile, 'small')
  console.log('✅ [getFeatureIconUrl] URL for', iconName, ':', url)
  return url
}

export const getAnnouncementIconUrl = (iconName) => {
  console.log('🔍 [getAnnouncementIconUrl] Getting icon for:', iconName)
  
  // Mapping category ke icon
  const iconMapping = {
    'birthday': 'cake',
    'service': 'ibadah', 
    'event': 'cross',
    'pengumuman': 'default',
    'pelprap': 'pelprap',
    // Tambahan berdasarkan data yang terlihat
    'pelatar': 'ibadah', // Pembekalan Pelatar
    'ibadah': 'ibadah'
  }
  
  const iconFile = iconMapping[iconName] || 'default'
  const url = getIconUrl(iconFile, 'small')
  console.log('✅ [getAnnouncementIconUrl] URL for', iconName, ':', url)
  return url
}

// ⭐ THUMBNAIL HELPERS - untuk gambar besar dan kecil
export const getScheduleThumbnail = (schedule, size = 'large') => {
  console.log('🔍 [getScheduleThumbnail] Getting thumbnail for schedule:', schedule?.category, 'size:', size)
  
  if (schedule?.thumbnail) {
    return getThumbnailUrl('jadwal', schedule.thumbnail, size)
  }
  
  const category = schedule?.category || 'default'
  const preset = size === 'small' ? 'small' : 'large'
  return getIconUrl(`${category}.png`, preset)
}

export const getNewsThumbnail = (news, size = 'large') => {
  console.log('🔍 [getNewsThumbnail] Getting thumbnail for news:', news?.category, 'size:', size)
  
  if (news?.thumbnail) {
    return getThumbnailUrl('news', news.thumbnail, size)
  }
  
  const category = news?.category || 'news'
  const preset = size === 'small' ? 'small' : 'large'
  return getIconUrl(`${category}.png`, preset)
}

export const getDevotionalThumbnail = (devotional, size = 'large') => {
  console.log('🔍 [getDevotionalThumbnail] Getting thumbnail for devotional:', devotional?.title, 'size:', size)
  
  if (devotional?.thumbnail) {
    let filename = devotional.thumbnail
    if (!filename.includes('.')) {
      filename = `${filename}.jpg`
    }
    return getThumbnailUrl('devotionals', filename, size)
  }
  
  const titleMapping = {
    'THE SOUR WINE': 'THE SOUR WINE.jpg',
    'HE HUMBLED HIMSELF': 'HE HUMBLED HIMSELF.jpg'
  }
  
  const mappedFile = titleMapping[devotional?.title]
  if (mappedFile) {
    return getThumbnailUrl('devotionals', mappedFile, size)
  }
  
  const preset = size === 'small' ? 'small' : 'large'
  return getIconUrl('renungan.png', preset)
}

// ⭐ GENERIC HELPERS
export const getThumbnail = (category, item, size = 'large') => {
  console.log('🔍 [getThumbnail] Getting thumbnail for category:', category, 'size:', size)
  
  const preset = size === 'small' ? 'small' : 'large'
  
  switch (category) {
    case 'schedule':
    case 'jadwal': {
      return getScheduleThumbnail(item, size)
    }
      
    case 'news': {
      return getNewsThumbnail(item, size)
    }
      
    case 'devotional':
    case 'renungan': {
      return getDevotionalThumbnail(item, size)
    }
      
    default: {
      return getIconUrl('default.png', preset)
    }
  }
}

// ⭐ FALLBACK HANDLER
export const handleImageError = (event, fallbackCategory = 'default') => {
  console.warn('❗ Image failed to load, using fallback')
  event.target.src = getIconUrl(`${fallbackCategory}.png`, 'small')
}