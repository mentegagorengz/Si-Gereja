<template>
  <div class="home-container">
    <div class="home-wrapper">

      <!-- Header: Greeting + Streak -->
      <HeaderHome :namaUser="namaUser" :streakCount="streakCount" />

      <!-- Ayat Hari Ini -->
      <DailyVerse :ayatGambar="ayatGambar" />

      <!-- Menu Fitur -->
      <div class="feature-grid">
        <FeatureBox
          v-for="feature in featureList"
          :key="feature.name"
          :name="feature.name"
          :iconName="feature.icon"
        />
      </div>

      <!-- Title untuk Announcement -->
      <h2 class="section-title">Announcements</h2>

      <!-- Announcement Cards -->
      <AnnouncementCard
        v-for="(item, index) in announcementList"
        :key="index"
        :title="item.title"
        :desc="item.desc"
        :icon="item.icon"
        :category="item.category"
      />

      <!-- Bottom Navbar -->
      <BottomNavbar />
    </div>
  </div>
</template>

<script>
// BAGIAN SCRIPT HomePage.vue yang diperbaiki:

import HeaderHome from '@/components/layout/HeaderHome.vue'
import DailyVerse from '@/components/DailyVerse.vue'
import FeatureBox from '@/components/FeatureBox.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import { useUserStore } from '@/stores/userStore'
import ayatImg from '@/assets/Ayat.png'
import { getCurrentJemaat } from '@/services/auth' // ⭐ TAMBAH: Import langsung
import { getAnnouncements } from '@/services/announcements'

export default {
  name: 'HomePage',
  components: {
    HeaderHome,
    DailyVerse,
    FeatureBox,
    BottomNavbar,
    AnnouncementCard
  },
  data() {
    return {
      namaUser: 'Jemaat', // Default fallback
      streakCount: 0,
      ayatGambar: ayatImg,
      featureList: [
        { name: "News", icon: "news.png" },
        { name: "Jadwal", icon: "jadwal.png" },
        { name: "Giving", icon: "giving.png" },
        { name: "Alkitab Setahun", icon: "alkitab.png" },
        { name: "Renungan", icon: "renungan.png" },
        { name: "Prayer Request", icon: "prayer.png" }
      ],
      announcementList: []
    }
  },
  async created() {
    // ⭐ PERBAIKI: Urutan yang benar dengan await
    await this.initializeUserData()
    this.checkStreak()
    this.fetchAnnouncements()
  },
  methods: {
    // ⭐ PERBAIKI: Method baru dengan debug lengkap
    async initializeUserData() {
      console.log('🔍 [HomePage] === INITIALIZING USER DATA ===');
      
      try {
        // 1. Cek localStorage langsung dulu
        const savedUser = await getCurrentJemaat();
        console.log('🔍 [HomePage] getCurrentJemaat result:', savedUser);
        
        if (savedUser && savedUser.nama) {
          // 2. Set ke component data
          this.namaUser = savedUser.nama;
          console.log('✅ [HomePage] Set namaUser from localStorage:', this.namaUser);
          
          // 3. Update userStore juga
          const userStore = useUserStore();
          userStore.setUser(savedUser);
          console.log('✅ [HomePage] Updated userStore with saved user');
        } else {
          console.log('❌ [HomePage] No valid saved user, keeping default "Jemaat"');
          this.namaUser = 'Jemaat';
        }
        
        console.log('🔍 [HomePage] Final namaUser value:', this.namaUser);
        
      } catch (error) {
        console.error('❌ [HomePage] Error in initializeUserData:', error);
        this.namaUser = 'Jemaat';
      }
    },

    checkStreak() {
      const today = new Date().toDateString()
      const saved = JSON.parse(localStorage.getItem('streakData')) || {}

      if (saved.lastLoginDate === today) {
        this.streakCount = saved.streakCount || 1
      } else {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()

        if (saved.lastLoginDate === yesterdayStr) {
          this.streakCount = (saved.streakCount || 0) + 1
        } else {
          this.streakCount = 1
        }

        localStorage.setItem('streakData', JSON.stringify({
          lastLoginDate: today,
          streakCount: this.streakCount
        }))
      }
    },
    
    async fetchAnnouncements() {
      try {
        this.announcementList = await getAnnouncements(5);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 16px;
  background: #fcfcf7;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 80px;
  overflow-x: hidden;
}

.home-wrapper {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  margin: 24px 0;
}

.section-title {
  font-family: 'Inter';
  font-size: 18px;
  font-weight: 600;
  color: #41442A;
  margin-top: 24px;
  margin-bottom: 12px;
  text-align: left;
  width: 100%;
}
</style>
