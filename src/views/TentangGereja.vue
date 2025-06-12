<!-- src/views/TentangGerejaPage.vue - ESLINT FIXED VERSION -->
<template>
    <div class="tentang-gereja-container">
      <div class="tentang-gereja-wrapper">
        <!-- Header dengan tombol back -->
        <HeaderWithBack title="Tentang Gereja" />
  
        <!-- Loading state -->
        <div v-if="loading" class="loading-container">
          <p>Memuat informasi gereja...</p>
        </div>
  
        <!-- Error state -->
        <div v-else-if="error" class="error-container">
          <p class="error-text">{{ error }}</p>
          <ButtonPrimary @click="fetchChurchInfo">Coba Lagi</ButtonPrimary>
        </div>
  
        <!-- Content ketika ada data -->
        <div v-else class="content-sections">
          
          <!-- Hero Section - Foto Gereja -->
          <div class="hero-section">
            <div class="hero-placeholder">
              <h1 class="church-name">Gereja Rajawali</h1>
              <p class="church-subtitle">Melayani dengan Kasih Kristus</p>
            </div>
          </div>
  
          <!-- Section: Sejarah Singkat -->
          <div class="info-section">
            <div class="section-header">
              <History class="section-icon" />
              <h2 class="section-title">Sejarah Singkat</h2>
            </div>
            
            <div class="section-content">
              <p class="history-text">{{ churchInfo.sejarah }}</p>
              
              <div class="milestone-item">
                <span class="milestone-year">{{ churchInfo.tahunBerdiri }}</span>
                <span class="milestone-desc">Gereja Rajawali didirikan</span>
              </div>
            </div>
          </div>
  
          <!-- Section: Visi & Misi -->
          <div class="info-section">
            <div class="section-header">
              <Target class="section-icon" />
              <h2 class="section-title">Visi & Misi</h2>
            </div>
            
            <div class="section-content">
              <div class="vision-mission-box">
                <h3 class="vm-title">🎯 Visi</h3>
                <p class="vm-text">{{ churchInfo.visi }}</p>
              </div>
              
              <div class="vision-mission-box">
                <h3 class="vm-title">🚀 Misi</h3>
                <ul class="vm-list">
                  <li v-for="(misi, index) in churchInfo.misi" :key="index">{{ misi }}</li>
                </ul>
              </div>
            </div>
          </div>
  
          <!-- Section: Fasilitas -->
          <div class="info-section">
            <div class="section-header">
              <Building class="section-icon" />
              <h2 class="section-title">Fasilitas</h2>
            </div>
            
            <div class="section-content">
              <div class="facilities-grid">
                <div v-for="fasilitas in facilitiesList" :key="fasilitas.name" class="facility-item">
                  <div class="facility-icon">{{ fasilitas.icon }}</div>
                  <span class="facility-name">{{ fasilitas.name }}</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Section: Kontak & Alamat -->
          <div class="info-section">
            <div class="section-header">
              <MapPin class="section-icon" />
              <h2 class="section-title">Kontak & Alamat</h2>
            </div>
            
            <div class="section-content">
              <div class="contact-item">
                <MapPin class="contact-icon" />
                <div class="contact-text">
                  <h4>Alamat</h4>
                  <p>{{ churchInfo.alamat }}</p>
                </div>
              </div>
              
              <div class="contact-item">
                <Phone class="contact-icon" />
                <div class="contact-text">
                  <h4>Telepon</h4>
                  <p>{{ churchInfo.telepon }}</p>
                </div>
              </div>
              
              <div class="contact-item">
                <Mail class="contact-icon" />
                <div class="contact-text">
                  <h4>Email</h4>
                  <p>{{ churchInfo.email }}</p>
                </div>
              </div>
              
              <div class="contact-item">
                <Clock class="contact-icon" />
                <div class="contact-text">
                  <h4>Jadwal Ibadah</h4>
                  <div class="schedule-list">
                    <p><strong>Minggu:</strong> {{ churchInfo.jadwalMinggu }}</p>
                    <p><strong>Rabu (PELPRAP):</strong> {{ churchInfo.jadwalPelprap }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Section: Struktur Pengurus -->
          <div class="info-section">
            <div class="section-header">
              <Users class="section-icon" />
              <h2 class="section-title">Struktur Pengurus</h2>
            </div>
            
            <div class="section-content">
              <div class="leadership-grid">
                <div v-for="pengurus in leadershipList" :key="pengurus.position" class="leadership-item">
                  <div class="leadership-avatar">
                    <span>{{ getInitials(pengurus.name) }}</span>
                  </div>
                  <div class="leadership-info">
                    <h4 class="leadership-name">{{ pengurus.name }}</h4>
                    <p class="leadership-position">{{ pengurus.position }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
  import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
  import { getChurchDisplayData } from '@/services/church.js'
  import { 
    History, 
    Target, 
    Building, 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Users 
  } from 'lucide-vue-next'
  
  export default {
    name: 'TentangGerejaPage',
    components: {
      HeaderWithBack,
      ButtonPrimary,
      // ⭐ USED COMPONENTS: Semua icon dipakai di template
      History,
      Target,
      Building,
      MapPin,
      Phone,
      Mail,
      Clock,
      Users
    },
    
    data() {
      return {
        loading: false,
        error: null,
        
        // Data gereja
        churchInfo: {
          sejarah: '',
          tahunBerdiri: '',
          visi: '',
          misi: [],
          alamat: '',
          telepon: '',
          email: '',
          jadwalMinggu: '',
          jadwalPelprap: ''
        },
        
        // Data fasilitas
        facilitiesList: [
          { name: 'Ruang Ibadah Utama', icon: '⛪' },
          { name: 'Ruang Anak', icon: '🧸' },
          { name: 'Ruang Remaja', icon: '🎵' },
          { name: 'Dapur', icon: '🍽️' },
          { name: 'Parkir', icon: '🚗' },
          { name: 'Sound System', icon: '🎤' }
        ],
        
        // Data pengurus
        leadershipList: [
          { name: 'Pdt. John Doe', position: 'Pendeta' },
          { name: 'Jane Smith', position: 'Ketua Majelis' },
          { name: 'Bob Wilson', position: 'Sekretaris' },
          { name: 'Mary Johnson', position: 'Bendahara' },
          { name: 'David Lee', position: 'Koordinator Ibadah' },
          { name: 'Sarah Brown', position: 'Koordinator Anak' }
        ]
      }
    },
    
    async created() {
      await this.fetchChurchInfo()
    },
    
    methods: {
      async fetchChurchInfo() {
        try {
          this.loading = true
          this.error = null
          
          console.log('🔍 [TentangGereja] Fetching church info from service...')
          
          // ⭐ MENGGUNAKAN SERVICE: Aktifkan service call
          const churchData = await getChurchDisplayData()
          
          // ⭐ FIX: Gunakan churchData yang sudah di-fetch
          this.updateChurchInfo(churchData)
          
          console.log('✅ [TentangGereja] Church info loaded successfully from service')
          
        } catch (error) {
          console.error('❌ [TentangGereja] Error loading church info:', error)
          this.error = 'Gagal memuat informasi gereja. Pastikan koneksi internet Anda stabil.'
          
          // ⭐ FALLBACK: Gunakan data dummy jika service gagal
          console.log('🔄 [TentangGereja] Using fallback dummy data')
          this.useFallbackData()
        } finally {
          this.loading = false
        }
      },
      
      // ⭐ NEW METHOD: Update church info dari service data
      updateChurchInfo(churchData) {
        this.churchInfo = {
          sejarah: churchData.sejarah || 'Gereja Rajawali didirikan dengan visi untuk menyebarkan kasih Kristus kepada seluruh jemaat dan masyarakat sekitar.',
          tahunBerdiri: churchData.tahunBerdiri || '1995',
          visi: churchData.visi || 'Menjadi gereja yang bertumbuh dalam kasih Kristus dan melayani dengan sukacita.',
          misi: churchData.misi || [
            'Memberitakan Injil kepada semua orang',
            'Membangun persekutuan yang kuat antar jemaat',
            'Melayani masyarakat dengan kasih Kristus',
            'Mendidik generasi muda dalam iman'
          ],
          alamat: churchData.alamat || 'Jl. Sam Ratulangi No. 123, Wenang, Manado, Sulawesi Utara',
          telepon: churchData.telepon || '(0431) 123-4567',
          email: churchData.email || 'info@gerejarajawali.org',
          jadwalMinggu: churchData.jadwalMinggu || '08:00 & 17:00 WITA',
          jadwalPelprap: churchData.jadwalPelprap || '19:00 WITA'
        }
        
        // Update fasilitas dan leadership dari service jika ada
        if (churchData.facilitiesList && churchData.facilitiesList.length > 0) {
          this.facilitiesList = churchData.facilitiesList
        }
        
        if (churchData.leadershipList && churchData.leadershipList.length > 0) {
          this.leadershipList = churchData.leadershipList
        }
      },
      
      // ⭐ Fallback data method
      useFallbackData() {
        this.churchInfo = {
          sejarah: 'Gereja Rajawali didirikan dengan visi untuk menyebarkan kasih Kristus kepada seluruh jemaat dan masyarakat sekitar.',
          tahunBerdiri: '1995',
          visi: 'Menjadi gereja yang bertumbuh dalam kasih Kristus dan melayani dengan sukacita.',
          misi: [
            'Memberitakan Injil kepada semua orang',
            'Membangun persekutuan yang kuat antar jemaat',
            'Melayani masyarakat dengan kasih Kristus',
            'Mendidik generasi muda dalam iman'
          ],
          alamat: 'Jl. Sam Ratulangi No. 123, Wenang, Manado, Sulawesi Utara',
          telepon: '(0431) 123-4567',
          email: 'info@gerejarajawali.org',
          jadwalMinggu: '08:00 & 17:00 WITA',
          jadwalPelprap: '19:00 WITA'
        }
      },
      
      getInitials(name) {
        return name
          .split(' ')
          .map(word => word.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
    }
  }
  </script>
  
  <style scoped>
  .tentang-gereja-container {
    background: #fcfcf7;
    min-height: 100vh;
  }
  
  .tentang-gereja-wrapper {
    padding: 16px;
    max-width: 360px;
    margin: 0 auto;
  }
  
  /* Loading & Error States */
  .loading-container, .error-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-family: 'Inter';
    color: #666;
    gap: 16px;
    text-align: center;
  }
  
  .error-text {
    color: #d32f2f;
    font-size: 14px;
    margin: 0;
  }
  
  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, #41442A, #5a5e3d);
    border-radius: 16px;
    padding: 32px 16px;
    margin-bottom: 24px;
    text-align: center;
    color: white;
  }
  
  .church-name {
    font-family: 'Inter';
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
  }
  
  .church-subtitle {
    font-family: 'Inter';
    font-size: 14px;
    margin: 0;
    opacity: 0.9;
  }
  
  /* Content Sections */
  .content-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .info-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
  }
  
  .section-icon {
    width: 24px;
    height: 24px;
    color: #41442A;
  }
  
  .section-title {
    font-family: 'Inter';
    font-size: 18px;
    font-weight: 600;
    color: #41442A;
    margin: 0;
  }
  
  .section-content {
    font-family: 'Inter';
    line-height: 1.6;
  }
  
  /* Sejarah Section */
  .history-text {
    font-size: 14px;
    color: #333;
    margin-bottom: 16px;
  }
  
  .milestone-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .milestone-year {
    font-weight: 700;
    color: #41442A;
    font-size: 16px;
  }
  
  .milestone-desc {
    font-size: 14px;
    color: #666;
  }
  
  /* Visi Misi Section */
  .vision-mission-box {
    margin-bottom: 16px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .vm-title {
    font-size: 16px;
    font-weight: 600;
    color: #41442A;
    margin: 0 0 8px 0;
  }
  
  .vm-text {
    font-size: 14px;
    color: #333;
    margin: 0;
  }
  
  .vm-list {
    margin: 0;
    padding-left: 20px;
    font-size: 14px;
    color: #333;
  }
  
  .vm-list li {
    margin-bottom: 4px;
  }
  
  /* Fasilitas Section */
  .facilities-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .facility-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .facility-icon {
    font-size: 20px;
  }
  
  .facility-name {
    font-size: 13px;
    color: #333;
    font-weight: 500;
  }
  
  /* Kontak Section */
  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .contact-icon {
    width: 20px;
    height: 20px;
    color: #41442A;
    margin-top: 2px;
    flex-shrink: 0;
  }
  
  .contact-text h4 {
    font-size: 14px;
    font-weight: 600;
    color: #41442A;
    margin: 0 0 4px 0;
  }
  
  .contact-text p {
    font-size: 13px;
    color: #333;
    margin: 0;
  }
  
  .schedule-list p {
    margin: 2px 0;
  }
  
  /* Leadership Section */
  .leadership-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .leadership-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .leadership-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #41442A;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .leadership-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 2px 0;
  }
  
  .leadership-position {
    font-size: 12px;
    color: #666;
    margin: 0;
  }
  
  /* Responsive */
  @media (max-width: 360px) {
    .tentang-gereja-wrapper {
      padding: 12px;
    }
    
    .info-section {
      padding: 16px;
    }
    
    .facilities-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>