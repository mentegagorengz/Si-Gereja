<template>
    <div v-if="loading" class="loading-container">
      <p>Memuat detail jadwal...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <HeaderWithBack title="Detail Jadwal" />
      <div class="error-content">
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
      :show-schedule-info="true"
      :date="schedule.date"
      :time="schedule.time"
      :location="schedule.location"
      :closing="schedule.closing"
    >
      <!-- Slot untuk konten tambahan jika diperlukan -->
      <template #extra-content>
        <!-- Bisa ditambahkan konten khusus untuk jadwal di sini -->
      </template>
    </DetailLayout>
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
          
          // Ambil ID dari route params
          const scheduleId = this.$route.params.id
          
          if (!scheduleId) {
            throw new Error('ID jadwal tidak ditemukan')
          }
          
          console.log('🔍 [DetailJadwal] Fetching schedule ID:', scheduleId)
          
          // Ambil data detail dari Firebase
          const scheduleData = await getSchedule(scheduleId)
          
          console.log('✅ [DetailJadwal] Schedule loaded:', scheduleData.title)
          
          this.schedule = scheduleData
        } catch (error) {
          console.error('❌ [DetailJadwal] Error loading schedule:', error)
          this.error = 'Gagal memuat detail jadwal. Pastikan koneksi internet Anda stabil.'
        } finally {
          this.loading = false
        }
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
  </style>