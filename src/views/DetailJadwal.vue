<template>
  <div v-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Memuat detail jadwal...</p>
  </div>
  
  <div v-else-if="error" class="error-container">
    <HeaderWithBack title="Detail Jadwal" />
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h3>Terjadi Kesalahan</h3>
      <p class="error-text">{{ error }}</p>
      <ButtonPrimary @click="fetchScheduleDetail">Coba Lagi</ButtonPrimary>
    </div>
  </div>
  
  <DetailLayout
    v-else-if="schedule"
    header-title="Detail Jadwal"
    :title="schedule.title"
    :description="schedule.description"
    :thumbnail="schedule.thumbnail"
    :category="schedule.category"
    :content-type="'schedule'"
    :show-schedule-info="true"
    :date="schedule.date"
    :time="schedule.time"
    :location="schedule.location"
    :closing="getClosingMessage()"
  />
</template>

<script>
import DetailLayout from '@/components/layout/DetailLayout.vue'
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { getSchedule } from '@/services/schedules'

export default {
  name: 'DetailJadwal',
  components: {
    DetailLayout,
    HeaderWithBack,
    ButtonPrimary
  },
  data() {
    return {
      schedule: null,
      loading: true,
      error: null
    }
  },
  async created() {
    await this.fetchScheduleDetail()
  },
  methods: {
    async fetchScheduleDetail() {
      try {
        this.loading = true
        this.error = null
        
        const scheduleId = this.$route.params.id
        
        if (!scheduleId) {
          throw new Error('ID jadwal tidak ditemukan')
        }
        
        const scheduleData = await getSchedule(scheduleId)
        this.schedule = scheduleData
        
      } catch (error) {
        console.error('Error loading schedule:', error)
        this.handleError(error)
      } finally {
        this.loading = false
      }
    },

    handleError(error) {
      if (error.message.includes('tidak ditemukan')) {
        this.error = 'Jadwal yang Anda cari tidak ditemukan. Mungkin sudah dihapus atau ID tidak valid.'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        this.error = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
      } else {
        this.error = 'Gagal memuat detail jadwal. Pastikan koneksi internet Anda stabil.'
      }
    },

    getClosingMessage() {
      if (!this.schedule) return ''
      
      // Pesan penutup berdasarkan kategori jadwal
      switch (this.schedule.category?.toLowerCase()) {
        case 'ibadah':
        case 'worship':
          return 'Mari bersama-sama memuji dan menyembah Tuhan. Tuhan Yesus memberkati!'
        case 'pelatar':
        case 'training':
          return 'Semoga pelatihan ini memberkati dan menguatkan iman kita. Tuhan Yesus memberkati!'
        case 'pelprap':
          return 'Mari berdoa bersama untuk kemajuan pelayanan gereja. Tuhan Yesus memberkati!'
        case 'event':
        case 'acara':
          return 'Terima kasih atas partisipasi Anda. Tuhan Yesus memberkati!'
        default:
          return 'Sampai jumpa di acara ini. Tuhan Yesus memberkati!'
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
    border: 4px solid #41442A;
  }
}
</style>