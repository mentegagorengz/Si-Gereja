<template>
  <div class="schedule-card" @click="goToDetail">
    <!-- DEBUG: Tampilkan data di template -->
    <div style="position: absolute; top: -20px; left: 0; font-size: 10px; background: yellow; padding: 2px; z-index: 1000;">
      Category: {{ schedule?.category || 'NO_CATEGORY' }}
    </div>
    
    <!-- Thumbnail (gambar kecil di kiri) -->
    <div class="card-thumbnail">
      <img 
        v-if="thumbnailSrc && !imageError" 
        :src="thumbnailSrc" 
        :alt="schedule.title"
        class="thumbnail-img"
        @error="onImageError"
      />
      <!-- Fallback jika gambar tidak ada -->
      <div v-else class="thumbnail-placeholder">
        <span>{{ schedule.title.charAt(0) }}</span>
      </div>
    </div>

    <!-- Konten text di kanan - HANYA TITLE -->
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
import pelprapIcon from '@/assets/icons/pelprap.png'
import defaultIcon from '@/assets/icons/default.png'

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
      imageError: false
    }
  },
  computed: {
    thumbnailSrc() {
      console.log('🔍 [ScheduleCard] DIRECT - Schedule data:', this.schedule)
      console.log('🔍 [ScheduleCard] DIRECT - Category:', this.schedule?.category)
      
      const category = this.schedule?.category || 'default'
      
      let selectedIcon = defaultIcon // fallback
      
      if (category === 'pelprap') {
        selectedIcon = pelprapIcon
        console.log('✅ [ScheduleCard] DIRECT - Using pelprap icon')
      } else {
        console.log('⚠️ [ScheduleCard] DIRECT - Using default icon for:', category)
      }
      
      console.log('🔍 [ScheduleCard] DIRECT - Final icon:', selectedIcon)
      return selectedIcon
    }
  },
  methods: {
    goToDetail() {
      const currentPath = this.$route.path
      
      console.log('🔍 [ScheduleCard] Current path:', currentPath)
      console.log('🔍 [ScheduleCard] Schedule ID:', this.schedule.id)
      
      if (currentPath.startsWith('/news')) {
        console.log('✅ [ScheduleCard] Navigating to news detail')
        this.$router.push(`/news/${this.schedule.id}`)
      } else if (currentPath.startsWith('/renungan')) {
        console.log('✅ [ScheduleCard] Navigating to renungan detail')
        this.$router.push(`/renungan/${this.schedule.id}`)
      } else {
        console.log('✅ [ScheduleCard] Navigating to jadwal detail')
        this.$router.push(`/jadwal/${this.schedule.id}`)
      }
    },
    
    onImageError() {
      console.log('🖼️ Image failed to load, showing placeholder')
      this.imageError = true
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
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.schedule-card:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #41442A;
  margin: 0;
  font-family: 'Inter';
  line-height: 1.3;
}

.card-arrow {
  padding: 16px;
  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #999;
}

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
  }
  
  .card-arrow {
    padding: 12px;
  }
  
  .card-title {
    font-size: 14px;
  }
}
</style>