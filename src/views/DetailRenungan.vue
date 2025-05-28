<template>
  <div v-if="loading" class="loading-container">
    <p>Memuat detail renungan...</p>
  </div>
  
  <div v-else-if="error" class="error-container">
    <HeaderWithBack title="Detail Renungan" />
    <div class="error-content">
      <p class="error-text">{{ error }}</p>
      <ButtonPrimary @click="fetchDevotionalDetail">Coba Lagi</ButtonPrimary>
    </div>
  </div>
  
  <!-- CUSTOM LAYOUT - TIDAK PAKAI DetailLayout -->
  <div v-else-if="devotional" class="detail-container">
    <div class="detail-wrapper">
      <!-- Header dengan tombol back -->
      <HeaderWithBack title="Detail Renungan" />

      <!-- Thumbnail besar -->
      <div class="detail-thumbnail">
        <img 
          v-if="thumbnailSrc && !imageError" 
          :src="thumbnailSrc" 
          :alt="devotional.title"
          class="thumbnail-img"
          @error="onImageError"
        />
        <!-- Fallback jika gambar tidak ada -->
        <div v-else class="thumbnail-placeholder">
          <span>{{ devotional.title.charAt(0) }}</span>
        </div>
      </div>

      <!-- Content area -->
      <div class="detail-content">
        <!-- Title dengan Bookmark Button -->
        <div class="title-section">
          <h1 class="detail-title">{{ devotional.title }}</h1>
          <button class="bookmark-btn" @click="toggleBookmark" :class="{ 'bookmarked': isBookmarked }">
            <Bookmark class="bookmark-icon" :fill="isBookmarked ? '#41442A' : 'none'" />
          </button>
        </div>

        <!-- BACAAN ALKITAB HARI INI - DIPINDAH KE ATAS -->
        <div class="bible-reading-section">
          <p class="bible-reading-title">BACAAN ALKITAB HARI INI</p>
          <p class="bible-verse">{{ devotional.verse || 'Yohanes 3:16' }}</p>
        </div>

        <!-- Description/Content -->
        <div class="detail-description">
          <p>{{ devotional.content }}</p>
        </div>

        <!-- Closing message -->
        <div class="detail-closing">
          <p>{{ getClosingMessage() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { Bookmark } from 'lucide-vue-next'
import { getDevotional } from '@/services/devotionals'
import { getDevotionalThumbnail } from '@/utils/imageUtils'

export default {
  name: 'DetailRenungan',
  components: {
    HeaderWithBack,
    ButtonPrimary,
    Bookmark
  },
  data() {
    return {
      devotional: null,
      loading: true,
      error: null,
      imageError: false,
      isBookmarked: false
    }
  },
  computed: {
    thumbnailSrc() {
      if (!this.devotional) return null
      return getDevotionalThumbnail(this.devotional)
    }
  },
  async created() {
    await this.fetchDevotionalDetail()
    this.checkBookmarkStatus()
  },
  methods: {
    async fetchDevotionalDetail() {
      try {
        this.loading = true
        this.error = null
        
        // Ambil ID dari route params
        const devotionalId = this.$route.params.id
        
        if (!devotionalId) {
          throw new Error('ID renungan tidak ditemukan')
        }
        
        console.log('🔍 [DetailRenungan] Fetching devotional ID:', devotionalId)
        
        // Ambil data detail dari Firebase
        const devotionalData = await getDevotional(devotionalId)
        
        console.log('✅ [DetailRenungan] Devotional loaded:', devotionalData.title)
        
        this.devotional = devotionalData
      } catch (error) {
        console.error('❌ [DetailRenungan] Error loading devotional:', error)
        this.error = 'Gagal memuat detail renungan. Pastikan koneksi internet Anda stabil.'
      } finally {
        this.loading = false
      }
    },
    
    getClosingMessage() {
      if (!this.devotional) return ''
      
      // Pesan penutup untuk renungan
      switch (this.devotional.category) {
        case 'kasih':
          return 'Kiranya kasih Tuhan menyertai hidup kita setiap hari. Amin.'
        case 'pengharapan':
          return 'Tetaplah berharap dalam Tuhan, Dia tidak pernah mengecewakan. Amin.'
        case 'iman':
          return 'Teruslah beriman dan percaya pada rencana-Nya yang indah. Amin.'
        case 'doa':
          return 'Mari selalu mendekatkan diri kepada Tuhan melalui doa. Amin.'
        default:
          return 'Tuhan Yesus memberkati setiap langkah hidup kita. Amin.'
      }
    },

    onImageError() {
      console.log('🖼️ Image failed to load, showing placeholder')
      this.imageError = true
    },

    // ⭐ FITUR BOOKMARK BARU
    toggleBookmark() {
      const devotionalId = this.devotional.id
      let bookmarks = JSON.parse(localStorage.getItem('bookmarkedDevotionals')) || []
      
      if (this.isBookmarked) {
        // Remove bookmark
        bookmarks = bookmarks.filter(id => id !== devotionalId)
        this.isBookmarked = false
        console.log('❌ [DetailRenungan] Bookmark removed')
      } else {
        // Add bookmark
        bookmarks.push(devotionalId)
        this.isBookmarked = true
        console.log('✅ [DetailRenungan] Bookmark added')
      }
      
      localStorage.setItem('bookmarkedDevotionals', JSON.stringify(bookmarks))
    },

    checkBookmarkStatus() {
      if (!this.devotional) return
      
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedDevotionals')) || []
      this.isBookmarked = bookmarks.includes(this.devotional.id)
      
      console.log('🔍 [DetailRenungan] Bookmark status:', this.isBookmarked)
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

/* CUSTOM LAYOUT - MIRIP DetailLayout */
.detail-container {
  background: #fcfcf7;
  min-height: 100vh;
}

.detail-wrapper {
  padding: 16px;
  max-width: 360px;
  margin: 0 auto;
}

/* Thumbnail besar */
.detail-thumbnail {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
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
  font-size: 48px;
}

/* Content area */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Title Section dengan Bookmark */
.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center; /* ⭐ UBAH dari flex-start ke center */
  gap: 12px;
}

.detail-title {
  flex: 1;
  font-size: 24px;
  font-weight: 600;
  color: #41442A;
  margin: 0;
  font-family: 'Inter';
  line-height: 1.3;
}

/* Bookmark Button */
.bookmark-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.bookmark-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bookmark-btn:active {
  transform: scale(0.95);
}

.bookmark-btn.bookmarked {
  background: #f0f8ff;
  border: 2px solid #41442A;
}

.bookmark-icon {
  width: 20px;
  height: 20px;
  color: #41442A;
  transition: all 0.2s ease;
}

/* Bible Reading Section - REDESIGN SIMPLE */
.bible-reading-section {
  background: transparent;
  padding: 0;
  margin: 8px 0 16px 0;
  border: none;
  box-shadow: none;
}

.bible-reading-title {
  font-family: 'Inter';
  font-size: 14px;
  font-weight: 400;
  color: #666;
  margin: 0 0 6px 0;
  text-align: left;
  letter-spacing: 0.5px;
}

.bible-verse {
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 400;
  color: #41442A;
  line-height: 1.5;
  margin: 0 0 16px 0;
  text-align: left;
  font-style: normal;
}

.detail-description {
  font-family: 'Inter';
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.detail-description p {
  margin: 0 0 12px 0;
}

/* Closing message */
.detail-closing {
  font-family: 'Inter';
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  font-style: italic;
  text-align: center;
  margin-top: 20px;
}

.detail-closing p {
  margin: 0;
}

/* Responsive */
@media (max-width: 360px) {
  .detail-wrapper {
    padding: 12px;
  }
  
  .detail-thumbnail {
    height: 180px;
  }
  
  .detail-title {
    font-size: 20px;
  }

  .bookmark-btn {
    width: 36px;
    height: 36px;
  }

  .bookmark-icon {
    width: 18px;
    height: 18px;
  }
}
</style>