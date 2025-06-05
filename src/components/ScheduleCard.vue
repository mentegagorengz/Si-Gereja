<template>
  <div class="schedule-card" @click="goToDetail">
    <!-- DEBUG INFO - hanya tampil di development -->
    <div v-if="showDebugInfo" class="debug-info">
      Path: {{ currentPath }} | Category: {{ schedule?.category || 'NO_CATEGORY' }}
    </div>
    
    <!-- Thumbnail (gambar kecil di kiri) -->
    <div class="card-thumbnail">
      <img 
        v-if="thumbnailSrc && !imageError" 
        :src="thumbnailSrc" 
        :alt="schedule.title"
        class="thumbnail-img"
        @error="onImageError"
        @load="onImageLoad"
      />
      <!-- Fallback jika gambar tidak ada -->
      <div v-else class="thumbnail-placeholder">
        <span>{{ schedule.title.charAt(0) }}</span>
      </div>
    </div>

    <!-- Konten text di kanan -->
    <div class="card-content">
      <h3 class="card-title">{{ schedule.title }}</h3>
    </div>

    <!-- Arrow untuk menunjukkan bisa diklik -->
    <div class="card-arrow">
      <ChevronRight class="arrow-icon" />
    </div>
  </div>
</template>

<script>
import { ChevronRight } from 'lucide-vue-next'
import { getScheduleThumbnail, getNewsThumbnail, getDevotionalThumbnail } from '@/utils/imageUtils'

export default {
  name: 'ScheduleCard',
  components: {
    ChevronRight
  },
  props: {
    schedule: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imageError: false,
      imageLoaded: false
    }
  },
  computed: {
    currentPath() {
      return this.$route.path
    },
    
    showDebugInfo() {
      // Hanya tampilkan di development mode
      return process.env.NODE_ENV === 'development'
    },
    
    thumbnailSrc() {
      const path = this.currentPath
      
      console.log('🔍 [ScheduleCard] Getting thumbnail...')
      console.log('   - Current path:', path)
      console.log('   - Schedule data:', {
        id: this.schedule?.id,
        title: this.schedule?.title,
        category: this.schedule?.category,
        thumbnail: this.schedule?.thumbnail
      })
      
      try {
        // ⭐ DETEKSI BERDASARKAN PATH DENGAN PRIORITAS YANG BENAR
        if (path.includes('/news')) {
          console.log('✅ [ScheduleCard] Using NEWS thumbnail')
          return getNewsThumbnail(this.schedule, 'small')
        } 
        else if (path.includes('/renungan')) {
          console.log('✅ [ScheduleCard] Using DEVOTIONAL thumbnail')
          return getDevotionalThumbnail(this.schedule, 'small')
        } 
        else if (path.includes('/jadwal')) {
          console.log('✅ [ScheduleCard] Using SCHEDULE thumbnail')
          return getScheduleThumbnail(this.schedule, 'small')
        }
        else {
          // Default untuk halaman lain (seperti home)
          console.log('⚠️ [ScheduleCard] Unknown path, using default SCHEDULE thumbnail')
          return getScheduleThumbnail(this.schedule, 'small')
        }
      } catch (error) {
        console.error('❌ [ScheduleCard] Error getting thumbnail:', error)
        return null
      }
    }
  },
  methods: {
    getContentType() {
      const path = this.currentPath
      if (path.includes('/news')) return 'NEWS'
      if (path.includes('/renungan')) return 'DEVOTIONAL'
      if (path.includes('/jadwal')) return 'SCHEDULE'
      return 'UNKNOWN'
    },
    
    goToDetail() {
      // Jangan navigate jika sedang loading
      if (!this.schedule?.id) {
        console.warn('⚠️ [ScheduleCard] No schedule ID available')
        return
      }
      
      const path = this.currentPath
      const scheduleId = this.schedule.id
      
      console.log('🔍 [ScheduleCard] Navigation triggered...')
      console.log('   - Current path:', path)
      console.log('   - Schedule ID:', scheduleId)
      
      // ⭐ ROUTING BERDASARKAN PATH YANG SEDANG AKTIF
      if (path.includes('/news')) {
        console.log('✅ [ScheduleCard] Navigating to NEWS detail')
        this.$router.push(`/news/${scheduleId}`)
      } 
      else if (path.includes('/renungan')) {
        console.log('✅ [ScheduleCard] Navigating to RENUNGAN detail')
        this.$router.push(`/renungan/${scheduleId}`)
      } 
      else if (path.includes('/jadwal')) {
        console.log('✅ [ScheduleCard] Navigating to JADWAL detail')
        this.$router.push(`/jadwal/${scheduleId}`)
      }
      else {
        // Default ke jadwal untuk safety
        console.log('⚠️ [ScheduleCard] Unknown path, defaulting to JADWAL detail')
        this.$router.push(`/jadwal/${scheduleId}`)
      }
    },
    
    onImageError(event) {
      console.warn('🖼️ [ScheduleCard] Image failed to load:', event.target?.src)
      this.imageError = true
      
      // Prevent infinite error loop
      event.target.onerror = null
    },
    
    onImageLoad() {
      console.log('✅ [ScheduleCard] Image loaded successfully')
      this.imageLoaded = true
      this.imageError = false
    }
  }
}
</script>

<style scoped>
.schedule-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 0;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
  overflow: hidden;
  height: 80px;
  position: relative; /* untuk debug info */
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.schedule-card:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Debug info - hanya untuk development */
.debug-info {
  position: absolute;
  top: -25px;
  left: 0;
  right: 0;
  font-size: 9px;
  background: rgba(255, 255, 0, 0.8);
  padding: 2px 4px;
  border-radius: 4px;
  z-index: 100;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-thumbnail {
  width: 80px;
  min-width: 80px;
  height: 80px;
  border-radius: 0;
  overflow: hidden;
  margin-right: 0;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.2s ease;
}

.thumbnail-img[src=""] {
  display: none;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #41442A, #5a5e3d);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 24px;
  font-family: 'Inter', sans-serif;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  min-height: 80px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #41442A;
  margin: 0;
  font-family: 'Inter';
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.debug-text {
  font-size: 10px;
  color: #666;
  margin: 4px 0 0 0;
  font-family: 'Courier New', monospace;
}

.card-arrow {
  padding: 16px;
  display: flex;
  align-items: center;
  align-self: stretch;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #999;
  transition: color 0.2s ease;
}

.schedule-card:hover .arrow-icon {
  color: #41442A;
}

/* Loading state */
.card-thumbnail.loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive */
@media (max-width: 360px) {
  .schedule-card {
    height: 70px;
  }
  
  .card-thumbnail {
    width: 70px;
    min-width: 70px;
    height: 70px;
  }
  
  .card-content {
    padding: 12px;
    min-height: 70px;
  }
}
</style>