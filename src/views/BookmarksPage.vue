<template>
  <div class="bookmarks-container">
    <div class="bookmarks-wrapper">
      <!-- Header -->
      <HeaderWithBack title="Bookmark" />

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <p>Memuat bookmark...</p>
      </div>

      <!-- Content dengan bookmark -->
      <div v-else-if="bookmarkedDevotionals.length > 0" class="bookmarks-content">  
        <!-- Daftar bookmark dengan swipe delete -->
        <div class="bookmarks-list">
          <div 
            v-for="devotional in bookmarkedDevotionals" 
            :key="devotional.id"
            class="bookmark-item-wrapper"
          >
            <!-- Swipeable Item -->
            <div 
              class="bookmark-item"
              @touchstart="onTouchStart"
              @touchmove="onTouchMove"
              @touchend="onTouchEnd"
              @click="goToDetail(devotional.id)"
              :style="swipeTransform"
              :data-id="devotional.id"
            >
              <!-- Thumbnail -->
              <div class="item-thumbnail">
                <img 
                  v-if="getThumbnailSrc(devotional)" 
                  :src="getThumbnailSrc(devotional)" 
                  :alt="devotional.title"
                  class="thumbnail-img"
                  @error="onImageError"
                />
                <div v-else class="thumbnail-placeholder">
                  <span>{{ devotional.title.charAt(0) }}</span>
                </div>
              </div>

              <!-- Content -->
              <div class="item-content">
                <h3 class="item-title">{{ devotional.title }}</h3>
                <p class="item-verse">{{ devotional.verse || 'Yohanes 3:16' }}</p>
              </div>

              <!-- Arrow -->
              <div class="item-arrow">
                <ChevronRight class="arrow-icon" />
              </div>
            </div>

            <!-- Delete Button (muncul saat swipe) -->
            <div class="delete-btn" @click="confirmDelete(devotional)">
              <Trash2 class="delete-icon" />
              <span>Hapus</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-container">
        <div class="empty-content">
          <BookmarkX class="empty-icon" />
          <h3>Belum Ada Bookmark</h3>
          <p>Kamu belum menyimpan renungan apapun. Mulai bookmark renungan favoritmu!</p>
          <ButtonPrimary @click="goToRenungan">Jelajahi Renungan</ButtonPrimary>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <h3>Hapus Bookmark?</h3>
        <p>Apakah kamu yakin ingin menghapus "{{ selectedDevotional?.title }}" dari bookmark?</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="closeDeleteModal">Batal</button>
          <button class="delete-confirm-btn" @click="deleteBookmark">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { ChevronRight, Trash2, BookmarkX } from 'lucide-vue-next'
import { getDevotional } from '@/services/devotionals'
import { getDevotionalThumbnail } from '@/utils/imageUtils'

export default {
  name: 'BookmarksPage',
  components: {
    HeaderWithBack,
    ButtonPrimary,
    ChevronRight,
    Trash2,
    BookmarkX
  },
  data() {
    return {
      bookmarkedDevotionals: [],
      loading: true,
      swipeOffset: 0,
      isSwipeActive: false,
      startX: 0,
      currentItem: null,
      showDeleteModal: false,
      selectedDevotional: null
    }
  },
  computed: {
    swipeTransform() {
      return { transform: `translateX(${this.swipeOffset}px)` }
    }
  },
  async created() {
    await this.loadBookmarkedDevotionals()
  },
  methods: {
    async loadBookmarkedDevotionals() {
      try {
        this.loading = true
        
        // Ambil ID bookmark dari localStorage
        const bookmarkIds = this.getBookmarkIds()
        
        if (bookmarkIds.length === 0) {
          this.bookmarkedDevotionals = []
          return
        }

        // Fetch detail setiap devotional
        const devotionals = await this.fetchDevotionalDetails(bookmarkIds)
        this.bookmarkedDevotionals = devotionals

      } catch (error) {
        console.error('Error loading bookmarks:', error)
        this.bookmarkedDevotionals = []
      } finally {
        this.loading = false
      }
    },

    getBookmarkIds() {
      try {
        return JSON.parse(localStorage.getItem('bookmarkedDevotionals')) || []
      } catch (error) {
        console.error('Error parsing bookmark IDs:', error)
        return []
      }
    },

    async fetchDevotionalDetails(bookmarkIds) {
      const devotionals = []
      
      for (const id of bookmarkIds) {
        try {
          const devotional = await getDevotional(id)
          devotionals.push(devotional)
        } catch (error) {
          console.warn(`Failed to load devotional ${id}:`, error.message)
          // Remove invalid ID from localStorage
          this.removeFromBookmarks(id)
        }
      }
      
      return devotionals
    },

    getThumbnailSrc(devotional) {
      try {
        return getDevotionalThumbnail(devotional, 'small')
      } catch (error) {
        console.warn('Error getting thumbnail:', error)
        return null
      }
    },

    onImageError(event) {
      // Hide broken image
      event.target.style.display = 'none'
    },

    goToDetail(devotionalId) {
      if (this.isSwipeActive) return
      this.$router.push(`/renungan/${devotionalId}`)
    },

    goToRenungan() {
      this.$router.push('/renungan')
    },

    // Swipe functionality
    onTouchStart(event) {
      this.startX = event.touches[0].clientX
      this.isSwipeActive = false
      this.currentItem = event.currentTarget
    },

    onTouchMove(event) {
      if (!this.currentItem) return
      
      const currentX = event.touches[0].clientX
      const diffX = this.startX - currentX
      
      // Only allow left swipe (positive diffX)
      if (diffX > 0) {
        this.swipeOffset = -Math.min(diffX, 100) // Max 100px
        this.isSwipeActive = true
      } else {
        this.swipeOffset = 0
      }
    },

    onTouchEnd() {
      if (!this.currentItem) return
      
      // Show delete button if swipe > 50px
      if (Math.abs(this.swipeOffset) > 50) {
        this.swipeOffset = -100 // Lock position
      } else {
        this.swipeOffset = 0 // Reset position
      }
      
      // Reset swipe state after delay
      setTimeout(() => {
        this.isSwipeActive = false
      }, 100)
    },

    confirmDelete(devotional) {
      this.selectedDevotional = devotional
      this.showDeleteModal = true
    },

    closeDeleteModal() {
      this.showDeleteModal = false
      this.selectedDevotional = null
      this.swipeOffset = 0
    },

    async deleteBookmark() {
      if (!this.selectedDevotional) return

      const devotionalId = this.selectedDevotional.id
      
      // Remove from localStorage
      this.removeFromBookmarks(devotionalId)
      
      // Remove from component data
      this.bookmarkedDevotionals = this.bookmarkedDevotionals.filter(
        item => item.id !== devotionalId
      )
      
      this.closeDeleteModal()
    },

    removeFromBookmarks(devotionalId) {
      try {
        let bookmarks = this.getBookmarkIds()
        bookmarks = bookmarks.filter(id => id !== devotionalId)
        localStorage.setItem('bookmarkedDevotionals', JSON.stringify(bookmarks))
      } catch (error) {
        console.error('Error removing bookmark:', error)
      }
    }
  }
}
</script>

<style scoped>
.bookmarks-container {
  background: #fcfcf7;
  min-height: 100vh;
}

.bookmarks-wrapper {
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

/* Content area */
.bookmarks-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Bookmark Item dengan Swipe */
.bookmark-item-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.bookmark-item {
  display: flex;
  align-items: center;
  background: white;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  height: 80px;
  position: relative;
  z-index: 2;
}

.bookmark-item:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.item-thumbnail {
  width: 80px;
  min-width: 80px;
  height: 80px;
  overflow: hidden;
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
  font-family: 'Inter';
}

.item-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #41442A;
  margin: 0;
  font-family: 'Inter';
  line-height: 1.3;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-verse {
  font-size: 12px;
  color: #666;
  margin: 0;
  font-family: 'Inter';
}

.item-arrow {
  padding: 16px;
  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #999;
}

/* Delete Button */
.delete-btn {
  position: absolute;
  top: 0;
  right: -100px;
  width: 100px;
  height: 100%;
  background: #dc3545;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  gap: 4px;
  transition: background-color 0.2s ease;
}

.delete-btn:hover {
  background: #c82333;
}

.delete-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.delete-btn span {
  font-size: 12px;
  color: white;
  font-family: 'Inter';
  font-weight: 600;
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

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin: 20px;
  max-width: 300px;
  text-align: center;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-content h3 {
  font-family: 'Inter';
  font-size: 18px;
  font-weight: 600;
  color: #41442A;
  margin: 0 0 12px 0;
}

.modal-content p {
  font-family: 'Inter';
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0 0 20px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn, 
.delete-confirm-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-family: 'Inter';
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.delete-confirm-btn {
  background: #dc3545;
  color: white;
}

.delete-confirm-btn:hover {
  background: #c82333;
}

/* Responsive */
@media (max-width: 360px) {
  .bookmarks-wrapper {
    padding: 12px;
  }
  
  .bookmark-item {
    height: 70px;
  }
  
  .item-thumbnail {
    width: 70px;
    min-width: 70px;
    height: 70px;
  }
  
  .item-content {
    padding: 12px;
  }
  
  .item-title {
    font-size: 14px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .bookmark-item,
  .modal-content {
    transition: none;
    animation: none;
  }
}
</style>