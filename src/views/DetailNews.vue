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
    :title="news.title"
    :description="news.summary || news.content"
    :thumbnail="news.thumbnail || news.image"
    :category="news.category"
    :content-type="'news'"
    :show-schedule-info="false"
    :publishDate="news.publishDate"
    :author="news.author"
    :closing="getClosingMessage()"
    :customBackAction="handleBackNavigation"
  >
    <!-- News-specific Content -->
    <template #additional-info>
      <!-- Full Content Section -->
      <div v-if="news.content" class="news-content-section">
        <h3>Isi Berita</h3>
        <div class="news-content" v-html="formatContent(news.content)"></div>
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

      <!-- News Meta Info -->
      <div class="news-meta-section">
        <h3>Informasi Berita</h3>
        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">📅 Dipublikasi:</span>
            <span class="meta-value">{{ formatDate(news.publishDate) }}</span>
          </div>
          
          <div v-if="news.author" class="meta-item">
            <span class="meta-label">✍️ Penulis:</span>
            <span class="meta-value">{{ news.author }}</span>
          </div>
          
          <div v-if="news.source" class="meta-item">
            <span class="meta-label">📰 Sumber:</span>
            <span class="meta-value">{{ news.source }}</span>
          </div>
          
          <div class="meta-item">
            <span class="meta-label">🏷️ Kategori:</span>
            <span class="meta-value">{{ news.category || 'Berita' }}</span>
          </div>
          
          <div v-if="news.views" class="meta-item">
            <span class="meta-label">👁️ Dibaca:</span>
            <span class="meta-value">{{ news.views }} kali</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Action Buttons Slot -->
    <template #action-buttons>
      <div class="news-actions">
        <ButtonPrimary @click="shareNews" class="share-btn">
          📤 Bagikan Berita
        </ButtonPrimary>
        
        <ButtonPrimary @click="bookmarkNews" class="bookmark-btn secondary">
          {{ isBookmarked ? '❤️ Tersimpan' : '🤍 Simpan' }}
        </ButtonPrimary>
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

  <!-- Debug info (development only) -->
  <div v-if="isDevelopment && navigationSource" class="debug-info">
    <p><strong>Navigated from:</strong> {{ navigationSource }}</p>
    <p><strong>News ID:</strong> {{ newsId }}</p>
    <p><strong>Category:</strong> {{ news?.category }}</p>
  </div>
</template>

<script>
import DetailLayout from '@/components/layout/DetailLayout.vue'
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
// import ButtonSecondary from '@/components/common/ButtonSecondary.vue' // Commented out - tidak ada
import { db } from '@/services/firebase'
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, updateDoc } from 'firebase/firestore'

export default {
  name: 'DetailNews',
  components: {
    DetailLayout,
    HeaderWithBack,
    ButtonPrimary
    // ButtonSecondary // Commented out - tidak ada
  },
  data() {
    return {
      news: null,
      loading: true,
      error: null,
      relatedNews: [],
      isBookmarked: false
    }
  },
  computed: {
    newsId() {
      return this.$route.params.id
    },
    navigationSource() {
      return this.$route.query.from || 'direct'
    },
    isDevelopment() {
      return process.env.NODE_ENV === 'development'
    }
  },
  async created() {
    console.log(`📰 [DetailNews] Component created for ID: ${this.newsId}`)
    console.log(`🧭 [DetailNews] Navigation source: ${this.navigationSource}`)
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
        
        console.log(`📰 [DetailNews] Fetching news: ${newsId}`)
        
        // Ambil detail berita dari Firestore
        const newsDoc = await getDoc(doc(db, 'news', newsId))
        
        if (!newsDoc.exists()) {
          throw new Error('Berita tidak ditemukan')
        }
        
        const newsData = { id: newsDoc.id, ...newsDoc.data() }
        this.news = newsData
        
        console.log(`✅ [DetailNews] News loaded:`, newsData)
        
        // Increment view count
        await this.incrementViewCount(newsId)
        
        // Fetch related news
        if (newsData.category) {
          await this.fetchRelatedNews(newsData.category, newsData.id)
        }
        
        // Check bookmark status
        this.checkBookmarkStatus(newsId)
        
      } catch (error) {
        console.error('❌ [DetailNews] Error loading news:', error)
        this.handleError(error)
      } finally {
        this.loading = false
      }
    },

    async fetchRelatedNews(category, excludeId) {
      try {
        console.log(`🔗 [DetailNews] Fetching related news for category: ${category}`)
        
        const newsRef = collection(db, 'news')
        const q = query(
          newsRef,
          where('category', '==', category),
          where('isPublished', '==', true),
          orderBy('publishDate', 'desc'),
          limit(4)
        )
        
        const querySnapshot = await getDocs(q)
        const related = []
        
        querySnapshot.forEach((doc) => {
          if (doc.id !== excludeId) {
            related.push({
              id: doc.id,
              ...doc.data()
            })
          }
        })
        
        this.relatedNews = related.slice(0, 3) // Limit 3
        
        console.log(`✅ [DetailNews] Found ${this.relatedNews.length} related news`)
        
      } catch (err) {
        console.error('❌ [DetailNews] Error fetching related news:', err)
        
        // Fallback: try without category filter
        try {
          const newsRef = collection(db, 'news')
          const q = query(
            newsRef,
            orderBy('publishDate', 'desc'),
            limit(4)
          )
          
          const querySnapshot = await getDocs(q)
          const related = []
          
          querySnapshot.forEach((doc) => {
            if (doc.id !== excludeId) {
              related.push({
                id: doc.id,
                ...doc.data()
              })
            }
          })
          
          this.relatedNews = related.slice(0, 3)
          console.log('✅ [DetailNews] Fallback: got related news without category filter')
          
        } catch (fallbackError) {
          console.error('❌ [DetailNews] Fallback failed:', fallbackError)
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
        
        // Update local data
        if (this.news) {
          this.news.views = currentViews + 1
        }
        
        console.log(`📊 [DetailNews] View count incremented to ${currentViews + 1}`)
        
      } catch (err) {
        console.error('❌ [DetailNews] Error incrementing view count:', err)
        // Non-critical error, continue
      }
    },

    checkBookmarkStatus(newsId) {
      // Check localStorage for bookmarks
      const bookmarks = JSON.parse(localStorage.getItem('newsBookmarks') || '[]')
      this.isBookmarked = bookmarks.includes(newsId)
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

    /**
     * ⭐ Handle smart back navigation
     */
     handleBackNavigation() {
      const source = this.navigationSource
      
      console.log(`🔙 [DetailNews] Back navigation from: ${source}`)
      
      // Smart back navigation berdasarkan source
      switch (source) {
        case 'announcement':
        case 'homepage': {
          this.$router.push('/home')  // ← FIX: ke /home
          break
        }
        case 'news':
        case 'berita': {
          this.$router.push('/news')
          break
        }
        default: {
          // Fallback: check if can go back in history
          if (window.history.length > 1) {
            this.$router.back()
          } else {
            this.$router.push('/home')  // ← FIX: ke /home  
          }
          break
        }
      }
    },

    /**
     * Navigate to another news
     */
    navigateToNews(id) {
      this.$router.push({
        path: `/news/${id}`,
        query: { from: 'related' }
      })
    },

    /**
     * ⭐ Share news
     */
    shareNews() {
      if (!this.news) return
      
      try {
        const shareText = `${this.news.title}\n\n${this.news.summary || this.truncateText(this.news.content, 100)}\n\nBaca selengkapnya: ${window.location.href}`
        
        if (navigator.share) {
          // Native sharing (mobile)
          navigator.share({
            title: this.news.title,
            text: shareText,
            url: window.location.href
          })
        } else {
          // Fallback: copy to clipboard
          navigator.clipboard.writeText(shareText).then(() => {
            alert('Berita berhasil disalin ke clipboard!')
          })
        }
        
        console.log('📤 [DetailNews] News shared')
        
      } catch (err) {
        console.error('❌ [DetailNews] Error sharing news:', err)
        alert('Gagal membagikan berita')
      }
    },

    /**
     * ⭐ Bookmark/unbookmark news
     */
    bookmarkNews() {
      if (!this.news) return
      
      try {
        const bookmarks = JSON.parse(localStorage.getItem('newsBookmarks') || '[]')
        
        if (this.isBookmarked) {
          // Remove bookmark
          const index = bookmarks.indexOf(this.newsId)
          if (index > -1) {
            bookmarks.splice(index, 1)
          }
          this.isBookmarked = false
          console.log('🤍 [DetailNews] Bookmark removed')
        } else {
          // Add bookmark
          bookmarks.push(this.newsId)
          this.isBookmarked = true
          console.log('❤️ [DetailNews] Bookmark added')
        }
        
        localStorage.setItem('newsBookmarks', JSON.stringify(bookmarks))
        
      } catch (err) {
        console.error('❌ [DetailNews] Error bookmarking news:', err)
        alert('Gagal menyimpan bookmark')
      }
    },

    /**
     * Search by tag
     */
    searchByTag(tag) {
      this.$router.push({
        path: '/news',
        query: { tag: tag }
      })
    },

    getClosingMessage() {
      if (!this.news) return ''
      
      // Pesan penutup berdasarkan kategori berita
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

    // ===== UTILITY FUNCTIONS =====

    /**
     * Format date untuk display
     */
    formatDate(date) {
      if (!date) return ''
      
      const dateObj = new Date(date.seconds ? date.seconds * 1000 : date)
      
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj)
    },

    /**
     * Format content dengan styling
     */
    formatContent(content) {
      if (!content) return ''
      
      return content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>')
    },

    /**
     * Truncate text
     */
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

/* ===== NEWS-SPECIFIC STYLES ===== */
.news-content-section,
.tags-section,
.news-meta-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.news-content-section h3,
.tags-section h3,
.news-meta-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.news-content {
  font-size: 14px;
  line-height: 1.7;
  color: #374151;
}

.news-content p {
  margin: 0 0 16px 0;
}

.news-content p:last-child {
  margin: 0;
}

/* ===== TAGS ===== */
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

/* ===== NEWS META ===== */
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
}

.meta-value {
  color: #374151;
  font-weight: 600;
  text-align: right;
}

/* ===== ACTION BUTTONS ===== */
.news-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.share-btn,
.bookmark-btn {
  flex: 1;
  min-width: 140px;
}

/* Secondary button style */
.bookmark-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.bookmark-btn.secondary:hover {
  background: #e5e7eb;
  color: #111827;
}

/* ===== RELATED NEWS ===== */
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

/* ===== DEBUG INFO ===== */
.debug-info {
  background: #1f2937;
  color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin: 16px;
  font-size: 12px;
  font-family: monospace;
}

.debug-info p {
  margin: 0 0 4px 0;
}

/* Responsive */
@media (max-width: 640px) {
  .news-actions {
    flex-direction: column;
  }
  
  .share-btn,
  .bookmark-btn {
    flex: none;
  }
  
  .news-content-section,
  .tags-section,
  .news-meta-section,
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

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
    border: 4px solid #41442A;
  }
  
  .related-item:hover .related-arrow {
    transform: none;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .news-content-section,
  .tags-section,
  .news-meta-section,
  .related-news {
    background: #1f2937;
    border-color: #374151;
  }
  
  .news-content-section h3,
  .tags-section h3,
  .news-meta-section h3,
  .related-news h3 {
    color: #f9fafb;
  }
  
  .news-content {
    color: #e5e7eb;
  }
  
  .tag-item {
    background: #374151;
    color: #d1d5db;
  }
  
  .tag-item:hover {
    background: #4b5563;
    color: #f3f4f6;
  }
  
  .meta-item {
    border-color: #374151;
  }
  
  .meta-label {
    color: #9ca3af;
  }
  
  .meta-value {
    color: #e5e7eb;
  }
  
  .related-item {
    border-color: #374151;
  }
  
  .related-item:hover {
    background: #374151;
    border-color: #60a5fa;
  }
  
  .related-content h4 {
    color: #f9fafb;
  }
  
  .related-content p {
    color: #d1d5db;
  }
  
  .related-summary {
    color: #9ca3af !important;
  }
  
  .related-arrow {
    color: #6b7280;
  }
  
  .related-item:hover .related-arrow {
    color: #60a5fa;
  }
}
</style>