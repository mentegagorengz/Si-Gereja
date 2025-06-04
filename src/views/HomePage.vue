// src/views/HomePage.vue - LOCAL ASSETS VERSION
<template>
  <div class="home-container">
    <div class="home-wrapper">

      <!-- Header: Greeting + Streak -->
      <HeaderHome :namaUser="namaUser" :streakCount="streakCount" />

      <!-- Ayat Hari Ini - PAKAI LOCAL ASSET -->
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
import HeaderHome from '@/components/layout/HeaderHome.vue'
import DailyVerse from '@/components/DailyVerse.vue'
import FeatureBox from '@/components/FeatureBox.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import { useUserStore } from '@/stores/userStore'
// ⭐ IMPORT LOCAL HELPER  
import { getDailyVerseUrl } from '@/utils/imageUtils'
import { getCurrentJemaat } from '@/services/auth'
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
      namaUser: 'Jemaat',
      streakCount: 0,
      // ⭐ PAKAI LOCAL ASSET HELPER
      ayatGambar: null,
      featureList: [
        // ⭐ SIMPLIFIED - cuma nama, icon akan di-handle otomatis
        { name: "News", icon: "news" },
        { name: "Jadwal", icon: "jadwal" },
        { name: "Giving", icon: "giving" },
        { name: "Alkitab Setahun", icon: "alkitab" },
        { name: "Renungan", icon: "renungan" },
        { name: "Prayer Request", icon: "prayer" }
      ],
      announcementList: []
    }
  },
  async created() {
    await this.initializeUserData()
    this.loadDailyVerse()
    this.checkStreak()
    this.fetchAnnouncements()
  },
  methods: {
    async initializeUserData() {
      console.log('🔍 [HomePage] === INITIALIZING USER DATA ===');
      
      try {
        const savedUser = await getCurrentJemaat();
        console.log('🔍 [HomePage] getCurrentJemaat result:', savedUser);
        
        if (savedUser && savedUser.nama) {
          this.namaUser = savedUser.nama;
          console.log('✅ [HomePage] Set namaUser from localStorage:', this.namaUser);
          
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

    // ⭐ LOAD DAILY VERSE FROM LOCAL
    loadDailyVerse() {
      try {
        const ayatUrl = getDailyVerseUrl()
        this.ayatGambar = ayatUrl
        console.log('✅ [HomePage] Daily verse loaded:', ayatUrl)
      } catch (error) {
        console.error('❌ [HomePage] Error loading daily verse:', error)
        // Fallback ke placeholder
        this.ayatGambar = this.createPlaceholderAyat()
      }
    },

    // ⭐ FALLBACK AYAT PLACEHOLDER
    createPlaceholderAyat() {
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 200
      const ctx = canvas.getContext('2d')
      
      // Background
      ctx.fillStyle = '#41442A'
      ctx.fillRect(0, 0, 400, 200)
      
      // Text
      ctx.fillStyle = 'white'
      ctx.font = '24px Inter, Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('AYAT HARI INI', 200, 100)
      
      return canvas.toDataURL()
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
        // Fallback ke data static
        this.announcementList = [
          {
            title: 'Happy Birthday, Kak Irene!',
            desc: '09 Agustus – Tuhan berkati selalu!',
            icon: 'cake.png',
            category: 'birthday'
          },
          {
            title: 'Ibadah PELPRAP',
            desc: 'Pukul 17.00 WITA – Gedung Gereja',
            icon: 'ibadah.png',
            category: 'pelprap'
          }
        ];
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