<template>
  <div class="feature-box" @click="goToPage">
    <div class="icon-placeholder">
      <img 
        v-if="iconUrl && !iconError" 
        :src="iconUrl" 
        :alt="name" 
        class="feature-icon" 
        @error="onImageError" 
      />
      <span v-else class="fallback-letter">{{ firstLetter }}</span>
    </div>
    <p class="label">{{ name }}</p>
  </div>
</template>

<script>
// ⭐ IMPORT LOCAL ASSETS HELPER
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
      iconError: false
    }
  },
  computed: {
    firstLetter() {
      return this.name.charAt(0)
    },
    iconUrl() {
      if (this.iconError) return null
      
      try {
        const url = getFeatureIconUrl(this.name)
        console.log('🔍 [FeatureBox LOCAL] Final icon URL for', this.name, ':', url)
        return url
      } catch (err) {
        console.warn(`❗ Gagal load icon untuk ${this.name}:`, err)
        return null
      }
    }
  },
  methods: {
    goToPage() {
      let path = ''
      
      if (this.name === 'Renungan') {
        path = '/renungan'
      } else if (this.name === 'Jadwal') {
        path = '/jadwal'
      } else if (this.name === 'News') {
        path = '/news'
      } else {
        path = '/' + this.name.toLowerCase().replace(/ /g, '-')
      }
      
      console.log(`🔍 [FeatureBox] Navigating to: ${path}`)
      this.$router.push(path)
    },

    onImageError(event) {
      console.warn('❗ Feature icon failed to load for:', this.name)
      console.warn('❗ Failed URL:', event.target.src)
      this.iconError = true
      this.$forceUpdate()
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
}

.feature-box:hover {
  transform: scale(1.05);
}

.feature-box:active {
  transform: scale(0.95);
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
}  

.feature-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.fallback-letter {
  font-size: 24px;
  font-weight: bold;
  color: #41442A;
}

.label {
  font-size: 14px;
  margin-top: 8px;
  font-family: 'Inter';
  text-align: center;
}
</style>