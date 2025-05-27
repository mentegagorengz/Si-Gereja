<template>
    <div class="news-container">
      <div class="news-wrapper">
        <!-- Header dengan tombol back -->
        <HeaderWithBack title="News" />
  
        <!-- Loading state -->
        <div v-if="loading" class="loading-container">
          <p>Memuat berita terbaru...</p>
        </div>
  
        <!-- Error state -->
        <div v-else-if="error" class="error-container">
          <p class="error-text">{{ error }}</p>
          <ButtonPrimary @click="fetchNews">Coba Lagi</ButtonPrimary>
        </div>
  
        <!-- Content ketika ada data -->
        <div v-else-if="news.length > 0" class="news-content">  
          <!-- Daftar news pakai ScheduleCard (REUSE!) -->
          <div class="news-list">
            <ScheduleCard 
              v-for="newsItem in news" 
              :key="newsItem.id"
              :schedule="newsItem"
            />
          </div>
        </div>
  
        <!-- Empty state ketika tidak ada data -->
        <div v-else class="empty-container">
          <div class="empty-content">
            <Newspaper class="empty-icon" />
            <h3>Belum Ada Berita</h3>
            <p>Saat ini belum ada berita atau pengumuman yang tersedia.</p>
            <ButtonPrimary @click="fetchNews">Refresh</ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
  import ScheduleCard from '@/components/ScheduleCard.vue'
  import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
  import { Newspaper } from 'lucide-vue-next'
  import { getNews } from '@/services/news'
  
  export default {
    name: 'NewsPage',
    components: {
      HeaderWithBack,
      ScheduleCard,
      ButtonPrimary,
      Newspaper
    },
    data() {
      return {
        news: [],
        loading: true,
        error: null
      }
    },
    async created() {
      // Load data news ketika komponen dibuat
      await this.fetchNews()
    },
    methods: {
      async fetchNews() {
        try {
          this.loading = true
          this.error = null
          
          console.log('🔍 [NewsPage] Fetching news...')
          
          // Ambil data dari Firebase
          const newsData = await getNews(20) // Ambil maksimal 20 news
          
          console.log('✅ [NewsPage] News loaded:', newsData.length)
          
          this.news = newsData
        } catch (error) {
          console.error('❌ [NewsPage] Error loading news:', error)
          this.error = 'Gagal memuat berita. Pastikan koneksi internet Anda stabil.'
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .news-container {
    background: #fcfcf7;
    min-height: 100vh;
  }
  
  .news-wrapper {
    padding: 16px;
    max-width: 360px;
    margin: 0 auto;
  }
  
  /* Loading state */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-family: 'Inter';
    color: #666;
  }
  
  /* Error state */
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px 16px;
    text-align: center;
  }
  
  .error-text {
    color: #d32f2f;
    font-family: 'Inter';
    font-size: 14px;
    margin: 0;
  }
  
  /* Content area */
  .news-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .news-list {
    display: flex;
    flex-direction: column;
  }
  
  /* Empty state */
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    padding: 32px 16px;
  }
  
  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
    max-width: 280px;
  }
  
  .empty-icon {
    width: 64px;
    height: 64px;
    color: #ccc;
    margin-bottom: 8px;
  }
  
  .empty-content h3 {
    font-family: 'Inter';
    font-size: 18px;
    font-weight: 600;
    color: #41442A;
    margin: 0;
  }
  
  .empty-content p {
    font-family: 'Inter';
    font-size: 14px;
    color: #666;
    line-height: 1.4;
    margin: 0;
  }
  
  /* Responsive */
  @media (max-width: 360px) {
    .news-wrapper {
      padding: 12px;
    }
  }
  </style>