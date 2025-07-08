<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Memuat detail berita...</p>
  </div>
  
  <div v-else-if="error" class="error-container">
    <HeaderWithBack 
      title="Detail Berita" 
      :customBackAction="handleBackNavigation"
    />
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h3>Terjadi Kesalahan</h3>
      <p class="error-text">{{ error }}</p>
      <ButtonPrimary @click="fetchNewsDetail">Coba Lagi</ButtonPrimary>
    </div>
  </div>
  
  <DetailLayout
    v-else-if="news"
    header-title="Detail Berita"
    :title="news.title || 'Berita Tanpa Judul'"
    :description="news.summary || news.content || 'Tidak ada deskripsi'"
    :thumbnail="news.thumbnail || news.image"
    :category="news.category"
    content-type="news"
    :publish-date="news.publishDate"
    :author="news.author"
    :closing="getClosingMessage()"
    :custom-back-action="handleBackNavigation"
    :breadcrumb-items="breadcrumbItems"
    :hide-back-button="true"
    :hide-content-badge="true"
  >
    <!-- News-specific Content -->
    <template #additional-info>
      <!-- Meta Information Section -->
      <div class="news-meta-section">
        <div class="meta-grid">
          <div v-if="news.date || news.eventDate || news.publishDate || news.activityDate" class="meta-item">
            <span class="meta-label">📅 Tanggal:</span>
            <span class="meta-value">{{ formatDate(news.date || news.eventDate || news.publishDate || news.activityDate) }}</span>
          </div>
          
          <div v-if="news.time" class="meta-item">
            <span class="meta-label">🕐 Waktu:</span>
            <span class="meta-value">{{ news.time }}</span>
          </div>
          
          <div v-if="news.location" class="meta-item">
            <span class="meta-label">📍 Lokasi:</span>
            <span class="meta-value">{{ news.location }}</span>
          </div>
          
          <div v-if="news.author" class="meta-item">
            <span class="meta-label">✍️ Penulis:</span>
            <span class="meta-value">{{ news.author }}</span>
          </div>
        </div>
      </div>

      <!-- Tags Section -->
      <div v-if="news.tags && news.tags.length > 0" class="tags-section">
        <h3>Tags</h3>
        <div class="tags-list">
          <span 
            v-for="tag in news.tags" 
            :key="tag"
            class="tag-item"
            @click="searchByTag(tag)"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </template>

    <!-- Related Content Slot -->
    <template #related-content>
      <div v-if="relatedNews.length > 0" class="related-news">
        <h3>Berita Terkait</h3>
        <div class="related-list">
          <div 
            v-for="related in relatedNews" 
            :key="related.id"
            class="related-item"
            @click="navigateToNews(related.id)"
          >
            <div class="related-thumbnail" v-if="related.thumbnail">
              <img :src="related.thumbnail" :alt="related.title" />
            </div>
            <div class="related-content">
              <h4>{{ related.title }}</h4>
              <p>{{ formatDate(related.publishDate) }}</p>
              <p class="related-summary">{{ truncateText(related.summary, 60) }}</p>
            </div>
            <div class="related-arrow">→</div>
          </div>
        </div>
      </div>
    </template>
  </DetailLayout>
</template>

<script>
import DetailLayout from '@/components/layout/DetailLayout.vue'
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { db } from '@/services/firebase'
import { doc, getDoc, collection, query, where, limit, getDocs, updateDoc } from 'firebase/firestore'

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
      error: null,
      relatedNews: []
    }
  },
  computed: {
    newsId() {
      return this.$route.params.id
    },
    navigationSource() {
      return this.$route.query.from || 'direct'
    },
    breadcrumbItems() {
      if (!this.news || !this.news.title) {
        return [
          { text: 'Berita', to: '/news' },
          { text: 'Loading...' }
        ]
      }
      
      return [
        { text: 'Berita', to: '/news' },
        { text: this.news.title }
      ]
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
        
        const newsId = this.newsId
        
        if (!newsId) {
          throw new Error('ID berita tidak ditemukan')
        }
        
        const newsDoc = await getDoc(doc(db, 'news', newsId))
        
        if (!newsDoc.exists()) {
          throw new Error('Berita tidak ditemukan')
        }
        
        const newsData = { id: newsDoc.id, ...newsDoc.data() }
        this.news = newsData
        
        await this.incrementViewCount(newsId)
        
        if (newsData.category) {
          await this.fetchRelatedNews(newsData.category, newsData.id)
        }
        
      } catch (error) {
        this.handleError(error)
      } finally {
        this.loading = false
      }
    },

    async fetchRelatedNews(category, excludeId) {
      try {
        const newsRef = collection(db, 'news')
        const q = query(
          newsRef,
          where('category', '==', category),
          limit(6)
        )
        
        const querySnapshot = await getDocs(q)
        const related = []
        
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (doc.id !== excludeId && data.isPublished !== false) {
            related.push({
              id: doc.id,
              ...data
            })
          }
        })
        
        related.sort((a, b) => {
          const dateA = new Date(a.publishDate?.seconds ? a.publishDate.seconds * 1000 : a.publishDate || 0)
          const dateB = new Date(b.publishDate?.seconds ? b.publishDate.seconds * 1000 : b.publishDate || 0)
          return dateB - dateA
        })
        
        this.relatedNews = related.slice(0, 3)
        
      } catch (err) {
        try {
          const newsRef = collection(db, 'news')
          const q = query(newsRef, limit(6))
          
          const querySnapshot = await getDocs(q)
          const related = []
          
          querySnapshot.forEach((doc) => {
            const data = doc.data()
            if (doc.id !== excludeId && data.isPublished !== false) {
              related.push({
                id: doc.id,
                ...data
              })
            }
          })
          
          this.relatedNews = related.slice(0, 3)
          
        } catch (fallbackError) {
          this.relatedNews = []
        }
      }
    },

    async incrementViewCount(newsId) {
      try {
        const newsRef = doc(db, 'news', newsId)
        const currentViews = this.news?.views || 0
        
        await updateDoc(newsRef, {
          views: currentViews + 1,
          lastViewed: new Date()
        })
        
        if (this.news) {
          this.news.views = currentViews + 1
        }
        
      } catch (err) {
        // Non-critical error, continue
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

    handleBackNavigation() {
      const source = this.navigationSource
      
      switch (source) {
        case 'announcement':
        case 'homepage': {
          this.$router.push('/home')
          break
        }
        case 'news':
        case 'berita': {
          this.$router.push('/news')
          break
        }
        default: {
          if (window.history.length > 1) {
            this.$router.back()
          } else {
            this.$router.push('/home')
          }
          break
        }
      }
    },

    navigateToNews(id) {
      this.$router.push({
        path: `/news/${id}`,
        query: { from: 'related' }
      })
    },

    searchByTag(tag) {
      this.$router.push({
        path: '/news',
        query: { tag: tag }
      })
    },

    getClosingMessage() {
      if (!this.news) return ''
      
      switch (this.news.category?.toLowerCase()) {
        case 'pengumuman':
        case 'announcement': {
          return 'Terima kasih atas perhatian Anda. Tuhan Yesus memberkati!'
        }
        case 'event':
        case 'acara': {
          return 'Jangan lewatkan acara menarik ini. Sampai jumpa!'
        }
        case 'kegiatan':
        case 'activity': {
          return 'Mari berpartisipasi dalam kegiatan gereja. Tuhan Yesus memberkati!'
        }
        case 'info':
        case 'informasi': {
          return 'Semoga informasi ini bermanfaat bagi Anda.'
        }
        default: {
          return 'Terima kasih telah membaca. Tuhan Yesus memberkati!'
        }
      }
    },

    formatDate(date) {
      if (!date) return ''
      
      const dateObj = new Date(date.seconds ? date.seconds * 1000 : date)
      
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(dateObj)
    },

    truncateText(text, maxLength) {
      if (!text) return ''
      
      if (text.length <= maxLength) return text
      
      return text.substring(0, maxLength).trim() + '...'
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
  border-top: 4px solid #41442A;
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

/* Meta information */
.news-meta-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.meta-grid {
  display: grid;
  gap: 8px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-label {
  color: #6b7280;
  font-weight: 500;
  font-size: 16px;
}

.meta-value {
  color: #374151;
  font-weight: 600;
  font-size: 16px;
  text-align: right;
}

/* ⭐ TAMBAHAN: RESPONSIVE UNTUK MOBILE */
@media (max-width: 768px) {
  .meta-label {
    font-size: 14px;
  }
  
  .meta-value {
    font-size: 14px; /* ⭐ UBAH JADI 14px UNTUK MOBILE */
  }
}

/* Tags */
.tags-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.tags-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-item:hover {
  background: #e5e7eb;
  color: #1f2937;
}

/* Related news */
.related-news {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
}

.related-news h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.related-item:hover {
  background: #f9fafb;
  border-color: #3b82f6;
}

.related-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.related-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-content {
  flex: 1;
  min-width: 0;
}

.related-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.related-content p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
}

.related-summary {
  margin-top: 4px !important;
  color: #9ca3af !important;
}

.related-arrow {
  color: #9ca3af;
  font-weight: bold;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.related-item:hover .related-arrow {
  transform: translateX(4px);
  color: #3b82f6;
}

/* Responsive */
@media (max-width: 640px) {
  .news-meta-section,
  .tags-section,
  .related-news {
    padding: 16px;
  }
  
  .related-item {
    gap: 8px;
    padding: 8px;
  }
  
  .related-thumbnail {
    width: 50px;
    height: 50px;
  }
  
  .tags-list {
    gap: 6px;
  }
  
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
</style>