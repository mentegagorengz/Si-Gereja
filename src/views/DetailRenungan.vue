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
  
  <DetailLayout
    v-else-if="devotional"
    header-title="Detail Renungan"
    :title="devotional.title"
    :description="devotional.content"
    :thumbnail="devotional.thumbnail"
    :category="devotional.category"
    :show-schedule-info="false"
    :closing="getClosingMessage()"
  >
    <!-- Slot untuk konten tambahan - BACAAN ALKITAB HARI INI -->
    <template #extra-content>
      <div class="bible-reading-section">
        <h4 class="bible-reading-title">BACAAN ALKITAB HARI INI</h4>
        <div class="bible-verse-container">
          <p class="bible-verse">{{ devotional.verse || 'Yohanes 3:16' }}</p>
        </div>
      </div>
    </template>
  </DetailLayout>
</template>

<script>
import DetailLayout from '@/components/layout/DetailLayout.vue'
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { getDevotional } from '@/services/devotionals'

export default {
  name: 'DetailRenungan',
  components: {
    DetailLayout,
    HeaderWithBack,
    ButtonPrimary
  },
  data() {
    return {
      devotional: null,
      loading: true,
      error: null
    }
  },
  async created() {
    await this.fetchDevotionalDetail()
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

/* Bible Reading Section - SESUAI WIREFRAME */
.bible-reading-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.bible-reading-title {
  font-family: 'Inter';
  font-size: 14px;
  font-weight: 700;
  color: #41442A;
  margin: 0 0 12px 0;
  text-align: left;
  letter-spacing: 0.5px;
}

.bible-verse-container {
  background: #f8f9fa;
  border-left: 4px solid #41442A;
  padding: 16px;
  border-radius: 8px;
}

.bible-verse {
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
  color: #41442A;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  font-style: italic;
}

/* Responsive */
@media (max-width: 360px) {
  .bible-reading-section {
    padding: 16px;
    margin: 12px 0;
  }
  
  .bible-reading-title {
    font-size: 13px;
  }
  
  .bible-verse {
    font-size: 14px;
  }
  
  .bible-verse-container {
    padding: 12px;
  }
}
</style>