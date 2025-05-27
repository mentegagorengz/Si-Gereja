<template>
    <div v-if="loading" class="loading-container">
      <p>Memuat detail berita...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <HeaderWithBack title="Detail News" />
      <div class="error-content">
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
      :show-schedule-info="news.hasScheduleInfo"
      :date="news.date"
      :time="news.time"
      :location="news.location"
      :closing="getClosingMessage()"
    >
      <!-- Slot untuk konten tambahan - KOSONG karena tidak diperlukan -->
    </DetailLayout>
  </template>
  
  <script>
  import DetailLayout from '@/components/layout/DetailLayout.vue'
  import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
  import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
  import { getNewsById } from '@/services/news' // ✅ PASTIKAN INI BENAR
  
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
    async created() {
      await this.fetchNewsDetail()
    },
    methods: {
      async fetchNewsDetail() {
        try {
          this.loading = true
          this.error = null
          
          // Ambil ID dari route params
          const newsId = this.$route.params.id
          
          if (!newsId) {
            throw new Error('ID berita tidak ditemukan')
          }
          
          console.log('🔍 [DetailNews] Fetching news ID:', newsId)
          
          // ✅ PASTIKAN PAKAI getNewsById, BUKAN getSchedule
          const newsData = await getNewsById(newsId)
          
          console.log('✅ [DetailNews] News loaded:', newsData.title)
          
          this.news = newsData
        } catch (error) {
          console.error('❌ [DetailNews] Error loading news:', error)
          this.error = 'Gagal memuat detail berita. Pastikan koneksi internet Anda stabil.'
        } finally {
          this.loading = false
        }
      },
      
      getClosingMessage() {
        if (!this.news) return ''
        
        // Pesan penutup berdasarkan kategori
        switch (this.news.category) {
          case 'event':
            return 'Terima kasih atas perhatiannya. Tuhan Yesus memberkati!'
          case 'undangan':
            return 'Mari bersama-sama berpartisipasi dalam kegiatan ini. Tuhan Yesus memberkati!'
          case 'pengumuman':
            return 'Mohon untuk menyebarkan informasi ini kepada jemaat lainnya. Terima kasih!'
          default:
            return 'Tuhan Yesus memberkati!'
        }
      },
      
      formatCreatedDate(dateString) {
        // Method ini sudah tidak diperlukan karena meta info dihapus
        if (!dateString) return ''
        
        try {
          const date = new Date(dateString)
          const options = { 
            weekday: 'long',
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }
          return date.toLocaleDateString('id-ID', options)
        } catch (error) {
          return dateString
        }
      }
    }
  }
  </script>
  
  <style scoped>
  /* Loading state */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #fcfcf7;
    font-family: 'Inter';
    color: #666;
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
  
  .error-text {
    color: #d32f2f;
    font-family: 'Inter';
    font-size: 14px;
    margin: 0;
  }
  </style>