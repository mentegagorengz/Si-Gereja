<template>
  <div class="news-container">
    <!-- Desktop Layout -->
    <div class="desktop-layout">
      <!-- Desktop Header - Same as HomePage -->
      <nav class="top-navbar">
        <div class="navbar-content">
          <div class="navbar-brand">
            <img src="@/assets/logos/logo-MyRajawali.png" alt="MyRajawali" class="navbar-logo"/>
            <span class="brand-text">MyRajawali</span>
          </div>
          
          <div class="navbar-menu">
            <router-link to="/home" class="nav-link">Home</router-link>
            <router-link to="/jadwal" class="nav-link">Kalender</router-link>
            <router-link to="/news" class="nav-link" exact>News</router-link>
            <router-link to="/notifikasi" class="nav-link">Notifikasi</router-link>
            <router-link to="/account" class="nav-link">Profile</router-link>
          </div>
        </div>
      </nav>

      <!-- Desktop Content -->
      <main class="desktop-content">
        <div class="page-header">
          <h1 class="page-title">Berita & Pengumuman</h1>
          <button @click="fetchNews" class="refresh-button" :disabled="loading">
            <RefreshCw :class="{ 'rotating': loading }" />
            <span>Refresh</span>
          </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-container desktop-loading">
          <div class="loading-spinner"></div>
          <p>Memuat berita terbaru...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-container desktop-error">
          <div class="error-card">
            <AlertCircle class="error-icon" />
            <h3>Terjadi Kesalahan</h3>
            <p class="error-text">{{ error }}</p>
            <button @click="fetchNews" class="retry-button">
              <RefreshCw /> Coba Lagi
            </button>
          </div>
        </div>

        <!-- News Grid -->
        <div v-else-if="news.length > 0" class="news-grid">
          <article 
            v-for="newsItem in news" 
            :key="newsItem.id"
            @click="goToDetail(newsItem)"
            class="news-card"
          >
            <!-- News Thumbnail -->
            <div class="news-thumbnail">
              <img 
                :src="getThumbnailUrl(newsItem)" 
                :alt="newsItem.title"
                @error="handleImageError"
              />
              <span class="news-category" :class="`category-${newsItem.category || 'general'}`">
                {{ getCategoryLabel(newsItem.category) }}
              </span>
            </div>

            <!-- News Content -->
            <div class="news-body">
              <h3 class="news-title">{{ newsItem.title }}</h3>
              <p class="news-preview">{{ getPreviewText(newsItem.content || newsItem.desc) }}</p>
              
              <!-- News Meta -->
              <div class="news-meta">
                <span class="news-date">
                  <Calendar class="meta-icon" />
                  {{ formatDate(newsItem.createdAt || newsItem.date) }}
                </span>
                <button class="read-more">
                  Baca Selengkapnya <ArrowRight />
                </button>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty state -->
        <div v-else class="empty-container desktop-empty">
          <div class="empty-card">
            <Newspaper class="empty-icon" />
            <h3>Belum Ada Berita</h3>
            <p>Saat ini belum ada berita atau pengumuman yang tersedia.</p>
            <button @click="fetchNews" class="refresh-button-primary">
              <RefreshCw /> Refresh
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile Layout (existing) -->
    <div class="mobile-layout">
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
  </div>
</template>

<script>
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ScheduleCard from '@/components/ScheduleCard.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { 
  Newspaper,
  RefreshCw, 
  AlertCircle, 
  Calendar,
  ArrowRight 
} from 'lucide-vue-next'
import { getNews } from '@/services/news'
import { getNewsThumbnail } from '@/utils/imageUtils'

export default {
  name: 'NewsPage',
  components: {
    HeaderWithBack,
    ScheduleCard,
    ButtonPrimary,
    Newspaper,
    RefreshCw,
    AlertCircle,
    Calendar,
    ArrowRight
  },
  data() {
    return {
      news: [],
      loading: true,
      error: null
    }
  },
  async created() {
    await this.fetchNews()
  },
  methods: {
    async fetchNews() {
      try {
        this.loading = true
        this.error = null
        
        console.log('🔍 [NewsPage] Fetching news...')
        
        const newsData = await getNews(20)
        
        console.log('✅ [NewsPage] News loaded:', newsData.length)
        
        this.news = newsData
      } catch (error) {
        console.error('❌ [NewsPage] Error loading news:', error)
        this.error = 'Gagal memuat berita. Pastikan koneksi internet Anda stabil.'
      } finally {
        this.loading = false
      }
    },

    goToDetail(newsItem) {
      this.$router.push(`/news/${newsItem.id}`)
    },

    getThumbnailUrl(newsItem) {
      // Use the utility function to get proper thumbnail URL
      return getNewsThumbnail(newsItem.thumbnail)
    },

    handleImageError(e) {
      // Fallback to default image on error
      e.target.src = getNewsThumbnail()
    },

    getCategoryLabel(category) {
      const labels = {
        'general': 'Umum',
        'event': 'Acara',
        'undangan': 'Undangan',
        'penting': 'Penting',
        'info': 'Info'
      }
      return labels[category?.toLowerCase()] || 'Info'
    },

    getPreviewText(content) {
      if (!content) return 'Klik untuk membaca selengkapnya...'
      // Remove HTML tags
      const plainText = content.replace(/<[^>]*>/g, '')
      return plainText.length > 120 
        ? plainText.substring(0, 120) + '...' 
        : plainText
    },

    formatDate(dateValue) {
      if (!dateValue) return 'Tanggal tidak tersedia'
      
      try {
        let date
        
        // Handle Firebase Timestamp
        if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
          date = new Date(dateValue.seconds * 1000)
        } 
        // Handle ISO string or regular date string
        else if (typeof dateValue === 'string') {
          date = new Date(dateValue)
        }
        // Handle Date object
        else if (dateValue instanceof Date) {
          date = dateValue
        }
        else {
          return 'Tanggal tidak tersedia'
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
          return 'Tanggal tidak tersedia'
        }

        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
          'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
        ]
        
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Tanggal tidak tersedia'
      }
    }
  }
}
</script>

<style scoped>
/* Container */
.news-container {
  background: #fcfcf7;
  min-height: 100vh;
}

/* === DESKTOP STYLES === */
.desktop-layout {
  display: none;
}

@media (min-width: 769px) {
  .desktop-layout {
    display: block;
    min-height: 100vh;
    background: #fcfcf7;
  }

  .mobile-layout {
    display: none;
  }

  /* === TOP NAVIGATION (Same as HomePage) === */
  .top-navbar {
    background: white;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .navbar-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .navbar-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .brand-text {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #41442A;
  }

  .navbar-menu {
    display: flex;
    gap: 32px;
  }

  .nav-link {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #666;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    color: #41442A;
    background: rgba(65, 68, 42, 0.05);
  }

  .nav-link.router-link-active {
    color: #41442A;
    background: rgba(65, 68, 42, 0.1);
    font-weight: 600;
  }

  /* Desktop Content */
  .desktop-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px;
  }

  /* Page Header */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  .page-title {
    font-family: 'Inter', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #41442A;
    margin: 0;
  }

  .refresh-button {
    background: #8B7355;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .refresh-button:hover:not(:disabled) {
    background: #6d5a44;
    transform: translateY(-1px);
  }

  .refresh-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .refresh-button svg {
    width: 16px;
    height: 16px;
  }

  .rotating {
    animation: rotate 1s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* News Grid */
  .news-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }

  .news-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .news-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }

  .news-thumbnail {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f0f0f0;
  }

  .news-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .news-card:hover .news-thumbnail img {
    transform: scale(1.05);
  }

  .news-category {
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .category-general,
  .category-info {
    background: rgba(33, 150, 243, 0.9);
    color: white;
  }

  .category-event,
  .category-acara {
    background: rgba(76, 175, 80, 0.9);
    color: white;
  }

  .category-undangan {
    background: rgba(255, 193, 7, 0.9);
    color: #333;
  }

  .category-penting {
    background: rgba(244, 67, 54, 0.9);
    color: white;
  }

  .news-body {
    padding: 24px;
  }

  .news-title {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #41442A;
    margin: 0 0 12px 0;
    line-height: 1.4;
  }

  .news-preview {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0 0 20px 0;
  }

  .news-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }

  .news-date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #999;
  }

  .meta-icon {
    width: 14px;
    height: 14px;
  }

  .read-more {
    background: none;
    border: none;
    color: #8B7355;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .read-more:hover {
    color: #41442A;
    gap: 10px;
  }

  .read-more svg {
    width: 16px;
    height: 16px;
  }

  /* Desktop Loading */
  .desktop-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 16px;
  }

  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 3px solid #f0f0f0;
    border-top-color: #8B7355;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Desktop Error */
  .desktop-error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .error-card {
    background: white;
    padding: 48px;
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }

  .error-icon {
    width: 64px;
    height: 64px;
    color: #f44336;
    margin-bottom: 16px;
  }

  .error-card h3 {
    font-size: 20px;
    color: #333;
    margin: 0 0 8px 0;
  }

  .error-card .error-text {
    color: #666;
    margin: 0 0 24px 0;
  }

  .retry-button {
    background: #8B7355;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .retry-button:hover {
    background: #6d5a44;
    transform: translateY(-1px);
  }

  .retry-button svg {
    width: 16px;
    height: 16px;
  }

  /* Desktop Empty */
  .desktop-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .empty-card {
    background: white;
    padding: 64px;
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }

  .empty-card .empty-icon {
    width: 80px;
    height: 80px;
    color: #ddd;
    margin-bottom: 24px;
  }

  .empty-card h3 {
    font-size: 20px;
    color: #41442A;
    margin: 0 0 8px 0;
  }

  .empty-card p {
    color: #666;
    margin: 0 0 24px 0;
  }

  .refresh-button-primary {
    background: #8B7355;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .refresh-button-primary:hover {
    background: #6d5a44;
    transform: translateY(-1px);
  }

  .refresh-button-primary svg {
    width: 16px;
    height: 16px;
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) and (min-width: 769px) {
    .navbar-content {
      padding: 0 24px;
    }

    .desktop-content {
      padding: 24px;
    }

    .page-title {
      font-size: 28px;
    }

    .news-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
  }
}

/* === MOBILE STYLES (existing) === */
.mobile-layout {
  display: block;
}

@media (min-width: 769px) {
  .mobile-layout {
    display: none;
  }
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