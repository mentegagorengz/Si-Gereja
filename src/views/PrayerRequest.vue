<!-- src/views/PrayerRequestPage.vue -->
<template>
  <div class="prayer-request-container">
    <div class="prayer-wrapper">
      <!-- Header dengan tombol back -->
      <HeaderWithBack title="Prayer Request" />

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <p>Memuat daftar doa...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <p class="error-text">{{ error }}</p>
        <ButtonPrimary @click="fetchPrayerRequests">Coba Lagi</ButtonPrimary>
      </div>

      <!-- Content ketika ada data -->
      <div v-else class="prayer-content">  
        <!-- Tombol Tambah Doa Baru -->
        <div class="add-prayer-section">
          <ButtonPrimary @click="showAddModal = true">
            <Plus class="btn-icon" />
            Tambah Permintaan Doa
          </ButtonPrimary>
        </div>

        <!-- Daftar Prayer Request -->
        <div v-if="prayerRequests.length > 0" class="prayers-list">
          <div 
            v-for="prayer in prayerRequests" 
            :key="prayer.id"
            class="prayer-card"
          >
            <div class="prayer-header">
              <h3 class="prayer-title">{{ prayer.title }}</h3>
              <span class="prayer-status" :class="prayer.status">
                {{ getStatusText(prayer.status) }}
              </span>
            </div>
            
            <p class="prayer-description">{{ prayer.description }}</p>
            
            <div class="prayer-footer">
              <span class="prayer-date">{{ formatDate(prayer.createdAt) }}</span>
              <button @click="togglePrayerStatus(prayer)" class="pray-btn">
                <Heart :class="{ 'filled': prayer.isPrayed }" />
                {{ prayer.isPrayed ? 'Sudah Didoakan' : 'Doakan' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="empty-container">
          <div class="empty-content">
            <MessageCircle class="empty-icon" />
            <h3>Belum Ada Permintaan Doa</h3>
            <p>Belum ada permintaan doa yang dibagikan. Mulai berbagi permintaan doa Anda!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Tambah Doa -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content" @click.stop>
        <h3>Tambah Permintaan Doa</h3>
        
        <FormInput
          id="prayer-title"
          label="Judul Doa"
          v-model="newPrayer.title"
          placeholder="Contoh: Kesembuhan untuk keluarga"
        />
        
        <div class="form-group">
          <label for="prayer-description">Deskripsi</label>
          <textarea 
            id="prayer-description"
            v-model="newPrayer.description"
            placeholder="Jelaskan permintaan doa Anda..."
            class="prayer-textarea"
          ></textarea>
        </div>
        
        <div class="modal-actions">
          <button class="cancel-btn" @click="closeAddModal">Batal</button>
          <ButtonPrimary @click="submitPrayer" :loading="isSubmitting">
            <span v-if="isSubmitting">Mengirim...</span>
            <span v-else>Kirim Doa</span>
          </ButtonPrimary>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import FormInput from '@/components/common/FormInput.vue'
import { Plus, Heart, MessageCircle } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore.js'

// ⭐ REAL SERVICE: Import Firebase service
import { getPrayerRequests, addPrayerRequest, togglePrayerStatus } from '@/services/prayerRequests.js'

export default {
  name: 'PrayerRequestPage',
  components: {
    HeaderWithBack,
    ButtonPrimary,
    FormInput,
    Plus,
    Heart,
    MessageCircle
  },

  computed: {
    userStore() {
      return useUserStore()
    },
    
    currentUserId() {
      return this.userStore.userId || 'anonymous'
    }
  },
  
  data() {
    return {
      prayerRequests: [],
      loading: true,
      error: null,
      showAddModal: false,
      isSubmitting: false,
      newPrayer: {
        title: '',
        description: ''
      }
    }
  },
  
  async created() {
    await this.fetchPrayerRequests()
  },
  
  methods: {
    async fetchPrayerRequests() {
      try {
        this.loading = true
        this.error = null
        
        console.log('🔍 [PrayerRequest] Fetching prayer requests...')
        
        // ⭐ REAL: Ambil data dari Firebase
        const prayerRequestsData = await getPrayerRequests(20) // Ambil maksimal 20 prayer requests
        
        console.log('✅ [PrayerRequest] Prayer requests loaded:', prayerRequestsData.length)
        
        this.prayerRequests = prayerRequestsData
        
      } catch (error) {
        console.error('❌ [PrayerRequest] Error loading prayer requests:', error)
        this.error = 'Gagal memuat daftar doa. Pastikan koneksi internet Anda stabil.'
      } finally {
        this.loading = false
      }
    },
    
    async submitPrayer() {
      if (!this.newPrayer.title.trim() || !this.newPrayer.description.trim()) {
        alert('Judul dan deskripsi harus diisi!')
        return
      }
      
      try {
        this.isSubmitting = true
        
        console.log('➕ [PrayerRequest] Submitting new prayer...')
        
        // ⭐ REAL: Simpan ke Firebase
        const newPrayerId = await addPrayerRequest({
          title: this.newPrayer.title,
          description: this.newPrayer.description
        }, this.currentUserId)
        
        console.log('✅ [PrayerRequest] Prayer request submitted with ID:', newPrayerId)
        
        // Reset form
        this.newPrayer = { title: '', description: '' }
        this.closeAddModal()
        
        // Refresh data
        await this.fetchPrayerRequests()
        
        alert('✅ Permintaan doa berhasil ditambahkan!')
        
      } catch (error) {
        console.error('❌ Error submitting prayer:', error)
        
        if (error.message.includes('Judul')) {
          alert('❌ ' + error.message)
        } else if (error.message.includes('Deskripsi')) {
          alert('❌ ' + error.message)
        } else {
          alert('❌ Gagal menambahkan permintaan doa! Error: ' + error.message)
        }
      } finally {
        this.isSubmitting = false
      }
    },
    
    async togglePrayerStatus(prayer) {
      try {
        console.log('🙏 [PrayerRequest] Toggling prayer status for:', prayer.title)
        
        // ⭐ REAL: Update status di Firebase
        await togglePrayerStatus(prayer.id, this.currentUserId)
        
        // Refresh data untuk sinkronisasi
        await this.fetchPrayerRequests()
        
        console.log('✅ [PrayerRequest] Prayer status updated successfully')
        
      } catch (error) {
        console.error('❌ Error updating prayer status:', error)
        alert('❌ Gagal mengupdate status doa!')
      }
    },
    
    closeAddModal() {
      this.showAddModal = false
      this.newPrayer = { title: '', description: '' }
    },
    
    getStatusText(status) {
      const statusMap = {
        'active': 'Aktif',
        'answered': 'Terjawab',
        'closed': 'Ditutup'
      }
      return statusMap[status] || 'Aktif'
    },
    
    formatDate(dateString) {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      } catch {
        return 'Tanggal tidak valid'
      }
    }
  }
}
</script>

<style scoped>
.prayer-request-container {
  background: #fcfcf7;
  min-height: 100vh;
}

.prayer-wrapper {
  padding: 16px;
  max-width: 360px;
  margin: 0 auto;
}

/* Loading & Error States */
.loading-container, .error-container {
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
}

/* Add Prayer Section */
.add-prayer-section {
  margin-bottom: 24px;
}

.btn-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

/* Prayers List */
.prayers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prayer-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.prayer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.prayer-title {
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
  color: #41442A;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.prayer-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.prayer-status.active {
  background: #e3f2fd;
  color: #1976d2;
}

.prayer-description {
  font-family: 'Inter';
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.prayer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prayer-date {
  font-size: 12px;
  color: #999;
  font-family: 'Inter';
}

.pray-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: 1px solid #41442A;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #41442A;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter';
}

.pray-btn:hover {
  background: #41442A;
  color: white;
}

.pray-btn .filled {
  fill: currentColor;
}

/* Empty State */
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
  margin: 0 0 20px 0;
  text-align: center;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
  font-family: 'Inter';
  font-size: 14px;
}

.prayer-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  font-size: 14px;
  font-family: 'Inter';
  border: 2px solid #41442A;
  border-radius: 6px;
  background-color: #fcfcf7;
  box-sizing: border-box;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.cancel-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f5f5f5;
  color: #666;
  font-family: 'Inter';
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

/* Responsive */
@media (max-width: 360px) {
  .prayer-wrapper {
    padding: 12px;
  }
  
  .prayer-card {
    padding: 12px;
  }
  
  .modal-content {
    padding: 20px;
    margin: 10px;
  }
}
</style>