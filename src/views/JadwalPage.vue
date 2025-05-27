<template>
    <div class="jadwal-container">
      <div class="jadwal-wrapper">
        <!-- Header dengan tombol back -->
        <HeaderWithBack title="Jadwal" />
  
        <!-- Loading state -->
        <div v-if="loading" class="loading-container">
          <p>Memuat jadwal ibadah...</p>
        </div>
  
        <!-- Error state -->
        <div v-else-if="error" class="error-container">
          <p class="error-text">{{ error }}</p>
          <ButtonPrimary @click="fetchSchedules">Coba Lagi</ButtonPrimary>
        </div>
  
        <!-- Content ketika ada data -->
        <div v-else-if="schedules.length > 0" class="schedules-content">  
          <!-- Daftar jadwal dalam bentuk cards -->
          <div class="schedules-list">
            <ScheduleCard 
              v-for="schedule in schedules" 
              :key="schedule.id"
              :schedule="schedule"
            />
          </div>
        </div>
  
        <!-- Empty state ketika tidak ada data -->
        <div v-else class="empty-container">
          <div class="empty-content">
            <Calendar class="empty-icon" />
            <h3>Belum Ada Jadwal</h3>
            <p>Saat ini belum ada jadwal kegiatan yang tersedia.</p>
            <ButtonPrimary @click="fetchSchedules">Refresh</ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
  import ScheduleCard from '@/components/ScheduleCard.vue'
  import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
  import { Calendar } from 'lucide-vue-next'
  import { getSchedules } from '@/services/schedules'
  
  export default {
    name: 'JadwalPage',
    components: {
      HeaderWithBack,
      ScheduleCard,
      ButtonPrimary,
      Calendar
    },
    data() {
      return {
        schedules: [],
        loading: true,
        error: null
      }
    },
    async created() {
      // Load data jadwal ketika komponen dibuat
      await this.fetchSchedules()
    },
    methods: {
      async fetchSchedules() {
        try {
          this.loading = true
          this.error = null
          
          console.log('🔍 [JadwalPage] Fetching schedules...')
          
          // Ambil data dari Firebase
          const schedulesData = await getSchedules(20) // Ambil maksimal 20 jadwal
          
          console.log('✅ [JadwalPage] Schedules loaded:', schedulesData.length)
          
          this.schedules = schedulesData
        } catch (error) {
          console.error('❌ [JadwalPage] Error loading schedules:', error)
          this.error = 'Gagal memuat jadwal. Pastikan koneksi internet Anda stabil.'
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .jadwal-container {
    background: #fcfcf7;
    min-height: 100vh;
  }
  
  .jadwal-wrapper {
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
  .schedules-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .schedules-list {
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
    .jadwal-wrapper {
      padding: 12px;
    }
    
    .schedules-info {
      padding: 6px 0;
    }
    
    .info-text {
      font-size: 13px;
    }
  }
  </style>