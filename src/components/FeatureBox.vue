<template>
  <div class="feature-box" @click="goToPage" :class="{ 'loading': isLoading }">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-placeholder">
      <div class="loading-icon"></div>
    </div>
    
    <!-- Normal state -->
    <div v-else class="icon-placeholder" :class="{ 'error': iconError }">
      <img 
        v-if="iconUrl && !iconError" 
        :src="iconUrl" 
        :alt="name" 
        class="feature-icon" 
        @error="onImageError" 
        @load="onImageLoad"
      />
      <span v-else class="fallback-letter">{{ firstLetter }}</span>
    </div>
    
    <p class="label">{{ name }}</p>
  </div>
</template>

<script>
// ⭐ IMPORT OPTIMIZED HELPER
import { getFeatureIconUrl } from '@/utils/imageUtils'

export default {
  name: 'FeatureBox',
  props: {
    name: {
      type: String,
      required: true
    },
    iconName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iconError: false,
      iconLoaded: false,
      isLoading: true
    }
  },
  computed: {
    firstLetter() {
      return this.name.charAt(0).toUpperCase()
    },
    
    showDebugInfo() {
      return false // Matikan debug info
    },
    
    iconUrl() {
      if (this.iconError) return null
      
      try {
        const url = getFeatureIconUrl(this.name)
        console.log('🔍 [FeatureBox] Final icon URL for', this.name, ':', url)
        return url
      } catch (err) {
        console.warn(`❗ [FeatureBox] Gagal load icon untuk ${this.name}:`, err)
        // JANGAN ubah data di computed property - biarkan onImageError yang handle
        return null
      }
    }
  },
  mounted() {
    // Simulasi loading untuk UX yang lebih baik
    setTimeout(() => {
      this.isLoading = false
    }, 100)
  },
  methods: {
    goToPage() {
      // Jangan navigate jika masih loading
      if (this.isLoading) return
      
      let path = ''
      
      // ⭐ MAPPING NAMA KE PATH YANG BENAR
      switch(this.name) {
        case 'Renungan':
          path = '/renungan'
          break
        case 'Jadwal':
          path = '/jadwal'
          break
        case 'News':
          path = '/news'
          break
        case 'Giving':
          path = '/giving'
          break
        case 'Alkitab Setahun':
          path = '/alkitab-setahun'
          break
        case 'Prayer Request':
          path = '/prayer-request'
          break
        default:
          // Fallback: convert nama ke slug
          path = '/' + this.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
      }
      
      console.log(`🔍 [FeatureBox] Navigating ${this.name} to: ${path}`)
      
      // Cek apakah route ada
      const router = this.$router
      const route = router.resolve(path)
      
      if (route.name !== 'not-found' && route.matched.length > 0) {
        router.push(path)
      } else {
        console.warn(`⚠️ [FeatureBox] Route ${path} tidak ditemukan, redirecting ke home`)
        // Bisa redirect ke halaman "Coming Soon" atau tetap di home
        router.push('/home')
      }
    },

    onImageError(event) {
      console.warn('❗ [FeatureBox] Feature icon failed to load for:', this.name)
      console.warn('❗ [FeatureBox] Failed URL:', event.target?.src)
      
      this.iconError = true
      this.iconLoaded = false
      this.isLoading = false
      
      // Prevent infinite error loop
      event.target.onerror = null
    },
    
    onImageLoad() {
      console.log('✅ [FeatureBox] Icon loaded successfully for:', this.name)
      this.iconLoaded = true
      this.iconError = false
      this.isLoading = false
    }
  }
}
</script>

<style scoped>
.feature-box {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;
  position: relative;
  padding: 8px;
}

.feature-box:hover:not(.loading) {
  transform: scale(1.05);
}

.feature-box:active:not(.loading) {
  transform: scale(0.95);
}

.feature-box.loading {
  pointer-events: none;
  opacity: 0.7;
}

.loading-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.loading-icon {
  width: 24px;
  height: 24px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #41442A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.icon-placeholder {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  color: rgb(32, 32, 32);
  overflow: hidden;
  background: rgba(65, 68, 42, 0.1);
  transition: all 0.2s ease;
  position: relative;
}

.icon-placeholder.error {
  background: rgba(220, 38, 38, 0.1);
  border: 1px dashed #ef4444;
}

.feature-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  transition: all 0.2s ease;
}

.feature-box:hover .feature-icon {
  transform: scale(1.1);
}

.fallback-letter {
  font-size: 24px;
  font-weight: bold;
  color: #41442A;
  font-family: 'Inter', sans-serif;
}

.icon-placeholder.error .fallback-letter {
  color: #dc2626;
}

.label {
  font-size: 14px;
  margin-top: 8px;
  font-family: 'Inter';
  text-align: center;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
  max-width: 80px;
  word-wrap: break-word;
}

/* Responsive */
@media (max-width: 360px) {
  .feature-box {
    padding: 6px;
  }
  
  .icon-placeholder,
  .loading-placeholder {
    width: 56px;
    height: 56px;
  }
  
  .feature-icon {
    width: 32px;
    height: 32px;
  }
  
  .fallback-letter {
    font-size: 20px;
  }
  
  .label {
    font-size: 12px;
    max-width: 70px;
  }
  
  .loading-icon {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .feature-box,
  .feature-icon,
  .loading-icon {
    animation: none;
    transition: none;
  }
  
  .feature-box:hover {
    transform: none;
  }
}
</style>