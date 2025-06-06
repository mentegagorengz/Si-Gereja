<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Memuat detail berita...</p>
  </div>
  
  <div v-else-if="error" class="error-container">
    <HeaderWithBack title="Detail News" />
    <div class="error-content">
      <div class="error-icon">📰</div>
      <h3>Berita Tidak Ditemukan</h3>
      <p class="error-text">{{ error }}</p>
      <ButtonPrimary @click="fetchNewsDetail">Coba Lagi</ButtonPrimary>
    </div>
  </div>
  
  <DetailLayout
    v-else-if="news"
    header-title="Detail News"
    :title="news.title"
    :description="news.content"
    :thumbnail="news.thumbnail"
    :category="news.category"
    :content-type="'news'"
    :show-schedule-info="hasScheduleInfo"
    :date="news.date"
    :time="news.time"
    :location="news.location"
    :closing="getClosingMessage()"
  />
</template>

<script>
import DetailLayout from '@/components/layout/DetailLayout.vue'
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { getNewsById } from '@/services/news'

export default {
  name: 'DetailNews',
  components: {
    DetailLayout,
    HeaderWithBack,
    ButtonPrimary
  },
  data() {
    return {
      news: null,
      loading: true,
      error: null
    }
  },
  computed: {
    hasScheduleInfo() {
      if (!this.news) return false
      
      // Show schedule info jika ada date/time/location atau kategori event/undangan
      return this.news.hasScheduleInfo || 
             this.news.date || 
             this.news.time || 
             this.news.location ||
             ['event', 'undangan', 'acara'].includes(this.news.category?.toLowerCase())
    }
  },
  async created() {
    await this.fetchNewsDetail()
  },
  methods: {
    async fetchNewsDetail() {
      try {
        this.loading = true
        this.error = null
        
        const newsId = this.$route.params.id
        
        if (!newsId) {
          throw new Error('ID berita tidak ditemukan')
        }
        
        const newsData = await getNewsById(newsId)
        this.news = newsData
        
      } catch (error) {
        console.error('Error loading news:', error)
        this.handleError(error)
      } finally {
        this.loading = false
      }
    },

    handleError(error) {
      if (error.message.includes('tidak ditemukan')) {
        this.error = 'Berita yang Anda cari tidak ditemukan. Mungkin sudah dihapus atau ID tidak valid.'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        this.error = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
      } else {
        this.error = 'Gagal memuat detail berita. Pastikan koneksi internet Anda stabil.'
      }
    },
    
    getClosingMessage() {
      if (!this.news) return ''
      
      const category = this.news.category?.toLowerCase()
      
      // Pesan penutup berdasarkan kategori berita
      switch (category) {
        case 'event':
        case 'acara':
          return 'Terima kasih atas perhatiannya. Mari berpartisipasi dalam acara ini. Tuhan Yesus memberkati!'
        case 'undangan':
          return 'Kami mengundang seluruh jemaat untuk berpartisipasi. Tuhan Yesus memberkati!'
        case 'pengumuman':
        case 'announcement':
          return 'Mohon untuk menyebarkan informasi ini kepada jemaat lainnya. Terima kasih!'
        case 'favoredcamp':
        case 'camp':
          return 'Mari bersama-sama bertumbuh dalam iman. Tuhan Yesus memberkati!'
        case 'ibadah':
        case 'worship':
          return 'Mari bersama-sama menyembah Tuhan. Tuhan Yesus memberkati!'
        default:
          return 'Terima kasih telah membaca. Tuhan Yesus memberkati!'
      }
    }
  }
}
</script>

<style scoped>
/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fcfcf7;
  font-family: 'Inter';
  color: #666;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #41442A ;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  margin: 0;
  font-size: 14px;
}

/* Error state */
.error-container {
  background: #fcfcf7;
  min-height: 100vh;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 16px;
  text-align: center;
  max-width: 360px;
  margin: 0 auto;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 8px;
  opacity: 0.7;
}

.error-content h3 {
  font-family: 'Inter';
  font-size: 18px;
  font-weight: 600;
  color: #41442A;
  margin: 0;
}

.error-text {
  color: #d32f2f;
  font-family: 'Inter';
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

/* Responsive */
@media (max-width: 360px) {
  .error-content {
    padding: 24px 12px;
  }
  
  .error-icon {
    font-size: 40px;
  }
  
  .error-content h3 {
    font-size: 16px;
  }
  
  .loading-spinner {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
    border: 4px solid #41442A ;
  }
}
</style>