<!-- src/views/PrayerRequestPage.vue - SIMPLE WIREFRAME -->
<template>
  <div class="prayer-request-container">
    <div class="prayer-wrapper">
      <!-- Header dengan tombol back -->
      <HeaderWithBack title="Prayer Request" />

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Memuat daftar doa...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">😞</div>
        <h3>Terjadi Kesalahan</h3>
        <p class="error-text">{{ error }}</p>
        <ButtonPrimary @click="fetchMyPrayerRequests">Coba Lagi</ButtonPrimary>
      </div>

      <!-- Content ketika ada doa user -->
      <div v-else-if="myPrayerRequests.length > 0" class="prayers-content">  
        <!-- Daftar Prayer Cards SIMPLE sesuai wireframe -->
        <div class="prayers-list">
          <div 
            v-for="prayer in myPrayerRequests" 
            :key="prayer.id"
            class="prayer-card"
            @click="goToPrayerDetail(prayer)"
          >
            <!-- Header: Category Badge dan Date sejajar -->
            <div class="card-header">
              <div class="category-badge" :class="getCategoryClass(prayer.category)">
                {{ getCategoryLabel(prayer.category) }}
              </div>
              
              <div class="prayer-date">
                {{ formatDate(prayer.createdAt) }}
              </div>
            </div>

            <!-- Prayer Content -->
            <div class="prayer-content">
              {{ prayer.description }}
            </div>

            <!-- Tambah Testimoni Button -->
            <button 
              class="testimony-btn" 
              @click.stop="openTestimonyModal(prayer)"
            >
              Tambah Testimoni
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state sesuai wireframe -->
      <div v-else class="empty-container">
        <div class="empty-content">
          <div class="empty-icon">🙏</div>
          <h3>Belum Ada Permintaan Doa</h3>
          <p>Anda belum memiliki permintaan doa. Mulai berbagi pergumulan Anda dengan jemaat!</p>
        </div>
      </div>

      <!-- ⭐ FLOATING ACTION BUTTON - sesuai wireframe -->
      <button class="floating-add-btn" @click="goToAddPrayer" aria-label="Tambah Permintaan Doa">
        <Plus class="fab-icon" />
      </button>
    </div>

    <!-- ⭐ TESTIMONY MODAL -->
    <div v-if="showTestimonyModal" class="modal-overlay" @click="closeTestimonyModal">
      <div class="modal-content" @click.stop>
        <h3>Tambah Testimoni</h3>
        <p class="modal-subtitle">Ceritakan bagaimana Tuhan menjawab doa Anda</p>
        
        <textarea 
          v-model="testimonyText"
          placeholder="Tulis testimoni Anda di sini..."
          class="testimony-textarea"
          rows="4"
          maxlength="500"
        ></textarea>
        
        <div class="char-counter">
          {{ testimonyText.length }}/500 karakter
        </div>
        
        <div class="modal-actions">
          <button class="cancel-btn" @click="closeTestimonyModal">Batal</button>
          <ButtonPrimary 
            @click="submitTestimony" 
            :loading="isSubmittingTestimony"
            :disabled="!testimonyText.trim() || isSubmittingTestimony"
          >
            {{ isSubmittingTestimony ? 'Mengirim...' : 'Kirim Testimoni' }}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { Plus } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore.js'

// ⭐ IMPORT PERSONAL FUNCTIONS - hanya untuk user sendiri
import { getPrayerRequestsByUser, addTestimony, getPrayerCategories } from '@/services/prayerRequests.js'

export default {
  name: 'PrayerRequestPage',
  components: {
    HeaderWithBack,
    ButtonPrimary,
    Plus
  },

  computed: {
    userStore() {
      return useUserStore()
    },
    
    currentUserId() {
      return this.userStore.userId || this.userStore.user?.id || this.userStore.user?.nama || 'anonymous'
    }
  },
  
  data() {
    return {
      myPrayerRequests: [], // ⭐ PERSONAL: Hanya doa milik user
      loading: true,
      error: null,
      
      // Testimony Modal
      showTestimonyModal: false,
      selectedPrayer: null,
      testimonyText: '',
      isSubmittingTestimony: false,
      
      // Categories
      categories: getPrayerCategories()
    }
  },
  
  async created() {
    await this.fetchMyPrayerRequests() // ⭐ FETCH PERSONAL PRAYERS
  },
  
  methods: {
    // ⭐ FETCH PERSONAL PRAYERS - hanya milik user yang login
    async fetchMyPrayerRequests() {
      try {
        this.loading = true
        this.error = null
        
        if (!this.currentUserId || this.currentUserId === 'anonymous') {
          throw new Error('User tidak terdeteksi. Silakan login ulang.')
        }
        
        console.log('🔍 [PrayerRequest] Fetching personal prayers for user:', this.currentUserId)
        
        // ⭐ PERSONAL: Ambil hanya doa milik user yang login
        const userPrayersData = await getPrayerRequestsByUser(this.currentUserId, 50) // Max 50 doa user
        
        console.log('✅ [PrayerRequest] Personal prayers loaded:', userPrayersData.length)
        
        this.myPrayerRequests = userPrayersData
        
      } catch (error) {
        console.error('❌ [PrayerRequest] Error loading personal prayers:', error)
        this.error = 'Gagal memuat daftar doa Anda. Pastikan koneksi internet stabil.'
      } finally {
        this.loading = false
      }
    },
    
    // ⭐ GO TO ADD PRAYER - floating button action
    goToAddPrayer() {
      this.$router.push('/prayer-request/add')
    },

    // ⭐ GO TO PRAYER DETAIL - card click action
    goToPrayerDetail(prayer) {
      console.log('🔍 [PrayerRequest] Opening prayer detail:', prayer.id)
      // TODO: Implement detail page route
      // this.$router.push(`/prayer-request/${prayer.id}`)
      
      // Sementara show modal dengan detail lengkap
      alert(`Detail Doa:\n\nKategori: ${this.getCategoryLabel(prayer.category)}\nTanggal: ${this.formatDate(prayer.createdAt)}\n\nIsi Doa:\n${prayer.description}\n\n(Halaman detail akan segera tersedia!)`)
    },

    // ⭐ TESTIMONY FUNCTIONS
    openTestimonyModal(prayer) {
      this.selectedPrayer = prayer
      this.testimonyText = ''
      this.showTestimonyModal = true
    },

    closeTestimonyModal() {
      this.showTestimonyModal = false
      this.selectedPrayer = null
      this.testimonyText = ''
    },

    async submitTestimony() {
      try {
        if (!this.testimonyText.trim()) {
          alert('Testimoni tidak boleh kosong!')
          return
        }

        this.isSubmittingTestimony = true

        await addTestimony(
          this.selectedPrayer.id, 
          this.testimonyText.trim(), 
          this.currentUserId
        )

        // Refresh data
        await this.fetchMyPrayerRequests()
        
        this.closeTestimonyModal()
        alert('✅ Testimoni berhasil ditambahkan!')

      } catch (error) {
        console.error('Error submitting testimony:', error)
        alert('❌ Gagal menambahkan testimoni: ' + error.message)
      } finally {
        this.isSubmittingTestimony = false
      }
    },

    // ⭐ HELPER FUNCTIONS
    formatDate(dateString) {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      } catch {
        return 'Tanggal tidak valid'
      }
    },

    getCategoryLabel(category) {
      const category_obj = this.categories.find(cat => cat.value === category)
      return category_obj ? category_obj.label : 'Lainnya'
    },

    getCategoryClass(category) {
      return `category-${category || 'other'}`
    }
  }
}
</script>

<style scoped>
.prayer-request-container {
  background: #fcfcf7;
  min-height: 100vh;
  position: relative;
  padding-bottom: 100px; /* Space for floating button */
}

.prayer-wrapper {
  padding: 16px;
  max-width: 360px;
  margin: 0 auto;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 16px;
  text-align: center;
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
  font-family: 'Inter';
  color: #666;
  margin: 0;
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 16px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
}

.error-container h3 {
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
  margin: 0;
}

/* Prayer Cards - SIMPLE sesuai wireframe */
.prayers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prayer-card {
  background: #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.prayer-card:hover {
  background: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.prayer-card:active {
  transform: translateY(0);
}

/* Card Header - Category dan Date sejajar */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* Category Badge - SIMPLE */
.category-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'Inter';
  text-transform: uppercase;
}

.category-health { background: #fecaca; color: #991b1b; }
.category-work { background: #fed7aa; color: #9a3412; }
.category-family { background: #bbf7d0; color: #14532d; }
.category-finances { background: #a7f3d0; color: #064e3b; }
.category-education { background: #bfdbfe; color: #1e3a8a; }
.category-spiritual { background: #ddd6fe; color: #5b21b6; }
.category-relationship { background: #fce7f3; color: #be185d; }
.category-other { background: #e2e8f0; color: #475569; }

/* Date - SIMPLE */
.prayer-date {
  font-family: 'Inter';
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* Prayer Content - SIMPLE */
.prayer-content {
  font-family: 'Inter';
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  margin-bottom: 16px;
}

/* Tambah Testimoni Button - SIMPLE */
.testimony-btn {
  width: 100%;
  padding: 10px;
  background: #d1d5db;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-family: 'Inter';
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.testimony-btn:hover {
  background: #9ca3af;
  color: #111827;
}

/* Prevent button from triggering card click */
.testimony-btn:active {
  transform: scale(0.98);
}

/* Empty State - SIMPLE */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 32px 16px;
}

.empty-content {
  text-align: center;
  max-width: 280px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-content h3 {
  font-family: 'Inter';
  font-size: 18px;
  font-weight: 600;
  color: #41442A;
  margin: 0 0 12px 0;
}

.empty-content p {
  font-family: 'Inter';
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

/* ⭐ FLOATING ACTION BUTTON - sesuai wireframe */
.floating-add-btn {
  position: fixed;
  bottom: 80px; /* Above bottom navbar */
  right: 20px;
  width: 56px;
  height: 56px;
  background: #41442A;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(65, 68, 42, 0.3);
  transition: all 0.2s ease;
  z-index: 100;
}

.floating-add-btn:hover {
  background: #2d2f1c;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(65, 68, 42, 0.4);
}

.floating-add-btn:active {
  transform: scale(0.95);
}

.fab-icon {
  width: 24px;
  height: 24px;
  color: white;
}

/* Modal Styles */
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  width: 100%;
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
  margin: 0 0 8px 0;
}

.modal-subtitle {
  font-family: 'Inter';
  font-size: 14px;
  color: #666;
  margin: 0 0 16px 0;
}

.testimony-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  font-family: 'Inter';
  font-size: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  resize: vertical;
  box-sizing: border-box;
}

.testimony-textarea:focus {
  outline: none;
  border-color: #41442A;
}

.char-counter {
  text-align: right;
  font-family: 'Inter';
  font-size: 12px;
  color: #666;
  margin: 6px 0 16px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #666;
  font-family: 'Inter';
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #f9fafb;
}

/* Responsive */
@media (max-width: 360px) {
  .prayer-wrapper {
    padding: 12px;
  }
  
  .prayer-card {
    padding: 12px;
  }
  
  .floating-add-btn {
    width: 48px;
    height: 48px;
    bottom: 70px;
    right: 16px;
  }
  
  .fab-icon {
    width: 20px;
    height: 20px;
  }
}
</style>