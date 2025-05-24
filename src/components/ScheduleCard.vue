<template>
    <div class="schedule-card" @click="goToDetail">
      <!-- Thumbnail (gambar kecil di kiri) -->
      <div class="card-thumbnail">
        <img 
          v-if="schedule.thumbnail" 
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
        if (this.imageError) {
          return null;
        }
        
        try {
          // Coba load dari folder assets/thumbnails
          return require(`@/assets/thumbnails/${this.schedule.thumbnail}`)
        } catch (err) {
          console.warn(`❗ Gagal memuat thumbnail: ${this.schedule.thumbnail}`)
          return null
        }
      }
    },
    methods: {
      goToDetail() {
        // Navigasi ke halaman detail dengan ID jadwal
        this.$router.push(`/jadwal/${this.schedule.id}`)
      },
      
      formatDate(dateString) {
        // Format tanggal dari "2025-08-17" jadi "17 Agustus 2025"
        try {
          const date = new Date(dateString)
          const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }
          return date.toLocaleDateString('id-ID', options)
        } catch (error) {
          return dateString // Return original jika error
        }
      },
      
      onImageError() {
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
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid #f0f0f0;
  }
  
  .schedule-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }
  
  .schedule-card:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  /* Thumbnail di kiri */
  .card-thumbnail {
    width: 60px;
    height: 60px;
    min-width: 60px;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 16px;
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
  
  /* Konten text di tengah */
  .card-content {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #41442A;
    margin: 0;
    font-family: 'Inter';
    line-height: 1.2;
  }
  
  .card-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .detail-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .detail-icon {
    width: 14px;
    height: 14px;
    color: #777;
    flex-shrink: 0;
  }
  
  .detail-text {
    font-size: 12px;
    color: #666;
    font-family: 'Inter';
    line-height: 1.2;
  }
  
  /* Arrow di kanan */
  .card-arrow {
    margin-left: 8px;
    display: flex;
    align-items: center;
  }
  
  .arrow-icon {
    width: 16px;
    height: 16px;
    color: #999;
  }
  
  /* Responsive untuk layar kecil */
  @media (max-width: 360px) {
    .schedule-card {
      padding: 12px;
    }
    
    .card-thumbnail {
      width: 50px;
      height: 50px;
      min-width: 50px;
      margin-right: 12px;
    }
    
    .card-title {
      font-size: 14px;
    }
    
    .detail-text {
      font-size: 11px;
    }
  }
  </style>