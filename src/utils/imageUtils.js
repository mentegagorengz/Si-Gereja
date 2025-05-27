// src/utils/imageUtils.js

// ⭐ IMPORT YANG ADA DULU - SISANYA PAKAI DEFAULT
// Icons (untuk card)
import pelprapIcon from '@/assets/icons/pelprap.png'
import defaultIcon from '@/assets/icons/default.png'

// Thumbnails (untuk detail)  
import pelprapThumb from '@/assets/thumbnails/pelprap.png'
import defaultThumb from '@/assets/thumbnails/default.png'

// ⭐ MAPPING OBJECT - YANG BELUM ADA PAKAI DEFAULT
export const ICON_MAP = {
  'pelprap': pelprapIcon,
  'pelnap': defaultIcon,      // ⭐ SEMENTARA PAKAI DEFAULT
  'doa': defaultIcon,         // ⭐ SEMENTARA PAKAI DEFAULT
  'sektor': defaultIcon,      // ⭐ SEMENTARA PAKAI DEFAULT
  'ibadah': defaultIcon,      // ⭐ SEMENTARA PAKAI DEFAULT
  'default': defaultIcon
}

export const THUMBNAIL_MAP = {
  'pelprap': pelprapThumb,
  'pelnap': defaultThumb,     // ⭐ SEMENTARA PAKAI DEFAULT
  'doa': defaultThumb,        // ⭐ SEMENTARA PAKAI DEFAULT
  'sektor': defaultThumb,     // ⭐ SEMENTARA PAKAI DEFAULT
  'ibadah': defaultThumb,     // ⭐ SEMENTARA PAKAI DEFAULT
  'default': defaultThumb
}

// ⭐ HELPER FUNCTIONS (SAMA SEPERTI SEBELUMNYA)
export function getIcon(category, customIcon = null) {
  console.log('🖼️ [getIcon] Getting icon for:', { category, customIcon })
  
  // 1. Jika ada custom icon, cari di map
  if (customIcon) {
    const customKey = customIcon.replace('.png', '')
    if (ICON_MAP[customKey]) {
      console.log('✅ [getIcon] Found custom icon:', customKey)
      return ICON_MAP[customKey]
    }
  }
  
  // 2. Jika tidak, pakai category
  if (category && ICON_MAP[category]) {
    console.log('✅ [getIcon] Found category icon:', category)
    return ICON_MAP[category]
  }
  
  // 3. Fallback ke default
  console.log('⚠️ [getIcon] Using default icon for category:', category)
  return ICON_MAP.default
}

export function getThumbnail(category, customThumbnail = null) {
  console.log('🖼️ [getThumbnail] Getting thumbnail for:', { category, customThumbnail })
  
  // 1. Jika ada custom thumbnail, cari di map
  if (customThumbnail) {
    const customKey = customThumbnail.replace('.png', '')
    if (THUMBNAIL_MAP[customKey]) {
      console.log('✅ [getThumbnail] Found custom thumbnail:', customKey)
      return THUMBNAIL_MAP[customKey]
    }
  }
  
  // 2. Jika tidak, pakai category
  if (category && THUMBNAIL_MAP[category]) {
    console.log('✅ [getThumbnail] Found category thumbnail:', category)
    return THUMBNAIL_MAP[category]
  }
  
  // 3. Fallback ke default
  console.log('⚠️ [getThumbnail] Using default thumbnail for category:', category)
  return THUMBNAIL_MAP.default
}