<!-- HomePage.vue - Clean & Optimized Responsive Layout dengan Unified Announcement System -->
<template>
  <div class="home-page">
    
    <!-- === DESKTOP LAYOUT (≥769px) === -->
    <div class="desktop-layout">
      
      <!-- Top Navigation Bar -->
      <nav class="top-navbar">
        <div class="navbar-content">
          <div class="navbar-brand">
            <img src="@/assets/logos/logo-MyRajawali.png" alt="MyRajawali" class="navbar-logo"/>
            <span class="brand-text">MyRajawali</span>
          </div>
          
          <div class="navbar-menu">
            <router-link to="/home" class="nav-link" exact>Home</router-link>
            <router-link to="/jadwal" class="nav-link">Kalender</router-link>
            <router-link to="/notifikasi" class="nav-link">Notifikasi</router-link>
            <router-link to="/account" class="nav-link">Profile</router-link>
          </div>
        </div>
      </nav>

      <!-- Main Content Container -->
      <div class="main-content">
        <div class="content-container">
          
          <!-- Welcome Hero Section -->
          <section class="welcome-section">
            <div class="welcome-left">
              <h1 class="welcome-title">Selamat datang, {{ namaUser }}!</h1>
              <p class="welcome-subtitle">Semoga hari Anda diberkati</p>
              <div class="streak-display">
                <span class="streak-label">Streak login:</span>
                <span class="streak-count">{{ streakCount }} hari</span>
              </div>
            </div>
            <div class="welcome-right">
              <div class="daily-verse-desktop">
                <img :src="ayatGambar" alt="Ayat Hari Ini" class="verse-image"/>
              </div>
            </div>
          </section>

          <!-- Features Grid Section -->
          <section class="feature-section">
            <h2 class="section-title">Fitur Aplikasi</h2>
            <div class="feature-grid-desktop">
              <FeatureBox
                v-for="feature in featureList"
                :key="`desktop-${feature.name}`"
                :name="feature.name"
                :iconName="feature.icon"
                class="feature-box-desktop"
                @click="navigateToFeature(feature)"
              />
            </div>
          </section>

          <!-- Announcements Section -->
          <section class="announcement-section">
            <h2 class="section-title">Pengumuman Terbaru</h2>
            <div class="announcement-grid">
              <AnnouncementCard
                v-for="(item, index) in announcementList" 
                :key="`desktop-${index}`"
                :title="item.title"
                :desc="item.desc"
                :icon="item.icon"
                :category="item.category"
                :time="item.time"
                :date="item.date"
                :location="item.location"
                :clickable="true"
                class="announcement-card-desktop"
                @click="navigateToAnnouncement(item)"
              />
            </div>
          </section>

        </div>
      </div>
    </div>

    <!-- === MOBILE LAYOUT (≤768px) === -->
    <div class="mobile-layout">
      <div class="home-wrapper">

        <!-- Mobile Header with User Info -->
        <HeaderHome :namaUser="namaUser" :streakCount="streakCount" />

        <!-- Daily Bible Verse -->
        <DailyVerse :ayatGambar="ayatGambar" />

        <!-- Mobile Features Grid -->
        <div class="feature-grid">
          <FeatureBox
            v-for="feature in featureList"
            :key="`mobile-${feature.name}`"
            :name="feature.name"
            :iconName="feature.icon"
            @click="navigateToFeature(feature)"
          />
        </div>

        <!-- Mobile Announcements Title -->
        <h2 class="section-title-mobile">Pengumuman Terbaru</h2>

        <!-- Mobile Announcements List -->
        <AnnouncementCard
          v-for="(item, index) in announcementList"
          :key="`mobile-${index}`"
          :title="item.title"
          :desc="item.desc"
          :icon="item.icon"
          :category="item.category"
          :time="item.time"
          :date="item.date"
          :location="item.location"
          :clickable="true"
          @click="navigateToAnnouncement(item)"
        />

        <!-- Bottom Navigation Bar -->
        <BottomNavbar />
      </div>
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
import { getDailyVerseUrl } from '@/utils/imageUtils'
import { getCurrentJemaat } from '@/services/auth'
// Import unified announcement system
import { getUnifiedAnnouncements } from '@/services/announcements'

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
      ayatGambar: null,
      // 📋 Static feature list configuration
      featureList: [
        { name: "News", icon: "news" },
        { name: "Jadwal", icon: "jadwal" },
        { name: "Giving", icon: "giving" },
        { name: "Tentang Gereja", icon: "tentang-gereja" },
        { name: "Renungan", icon: "renungan" },
        { name: "Prayer Request", icon: "prayer" }
      ],
      announcementList: [],
      currentUserId: null
    }
  },

  async created() {
    await this.initializePageData()
  },

  methods: {
    /**
     * 🚀 Initialize all page data on component creation
     * Centralized initialization for better error handling
     */
    async initializePageData() {
      try {
        await this.loadUserData()
        this.loadDailyVerse()
        this.loadUserStreak()
        await this.loadUnifiedAnnouncements()
      } catch (error) {
        console.error('❌ [HomePage] Failed to initialize page data:', error)
      }
    },

    /**
     * 👤 Load current user information
     * Tries userStore first, then getCurrentJemaat service
     */
    async loadUserData() {
      try {
        const userStore = useUserStore()
        
        if (userStore.nama) {
          this.namaUser = userStore.nama
          this.currentUserId = userStore.id
          return
        }

        const currentUser = await getCurrentJemaat()
        if (currentUser?.id) {
          this.namaUser = currentUser.nama || 'Jemaat'
          this.currentUserId = currentUser.id
        }
      } catch (error) {
        console.error('❌ [HomePage] Error loading user data:', error)
      }
    },

    /**
     * 📖 Load daily Bible verse image
     * Uses utility function to get today's verse URL
     */
    loadDailyVerse() {
      this.ayatGambar = getDailyVerseUrl()
    },

    /**
     * 🔥 Load user's login streak from localStorage
     * Initializes streak if none exists
     */
    loadUserStreak() {
      if (!this.currentUserId) {
        this.streakCount = 1
        return
      }

      try {
        const userStreakKey = `streakData_${this.currentUserId}`
        const savedStreak = localStorage.getItem(userStreakKey)
        
        if (savedStreak) {
          const streakData = JSON.parse(savedStreak)
          this.streakCount = streakData.streakCount || 1
        } else {
          this.streakCount = 1
          this.initializeUserStreak()
        }
      } catch (error) {
        console.error('❌ [HomePage] Error loading streak:', error)
        this.streakCount = 1
      }
    },

    /**
     * 🎯 Initialize first-time user streak
     * Creates streak data in localStorage
     */
    initializeUserStreak() {
      if (!this.currentUserId) return

      const today = new Date().toDateString()
      const userStreakKey = `streakData_${this.currentUserId}`
      
      const streakData = {
        lastLoginDate: today,
        streakCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'HomePage_FirstTime'
      }
      
      localStorage.setItem(userStreakKey, JSON.stringify(streakData))
    },

    /**
     * 📢 Load unified announcements from new system
     * Combines news, schedule, and announcements as preview cards
     * Limits to 6 items for performance
     */
    async loadUnifiedAnnouncements() {
      try {
        console.log('🔍 [HomePage] Loading unified announcements...')
        const announcements = await getUnifiedAnnouncements(6)
        
        console.log('✅ [HomePage] Unified announcements loaded:', announcements.length)
        this.announcementList = announcements
      } catch (error) {
        console.error('❌ [HomePage] Error loading unified announcements:', error)
        this.announcementList = []
        
        // Fallback: Load data dummy jika API error
        this.loadDummyAnnouncements()
      }
    },

    /**
     * 🎭 Load dummy announcements as fallback
     * Provides sample data when API fails
     */
    loadDummyAnnouncements() {
      console.log('🎭 [HomePage] Loading dummy announcements as fallback...')
      
      this.announcementList = [
        {
          id: 'news_Z6NtgDMXfZ8RL01jaZ0P',
          originalId: 'Z6NtgDMXfZ8RL01jaZ0P', // ID yang benar tanpa prefix
          title: 'Perkemahan Favored Camp 2025',
          desc: 'Perkemahan Rohani Pemuda dan Remaja kembali hadir tahun ini dengan tema "Favored..."',
          category: 'event',
          type: 'news',
          sourceCollection: 'news'
        },
        {
          id: 'announcement_birthday_123',
          originalId: 'birthday_123',
          title: 'Selamat Ulang Tahun Gembala!',
          desc: 'Hari ini adalah hari spesial untuk Bapak Gembala. Mari kita doakan semoga diberkati...',
          category: 'birthday',
          type: 'announcement',
          sourceCollection: 'announcements'
        },
        {
          id: 'schedule_pelprap_456',
          originalId: 'pelprap_456',
          title: 'Undangan Ibadah PELPRAP Wilayah LX',
          desc: 'Undangan untuk seluruh ibu-ibu GPdI Rajawali Kanonang dari Komisi Pelayanan Wanita...',
          category: 'ibadah',
          type: 'schedule',
          sourceCollection: 'schedules'
        }
      ]
    },

    /**
     * 🧭 Navigate to feature page
     * Maps feature names to route paths
     */
    navigateToFeature(feature) {
      const routeMap = {
        'News': '/news',
        'Jadwal': '/jadwal',
        'Giving': '/giving',
        'Tentang Gereja': '/tentang-gereja',
        'Renungan': '/renungan',
        'Prayer Request': '/prayer-request'
      }
      
      const route = routeMap[feature.name]
      if (route) {
        this.$router.push(route)
      }
    },

    /**
     * 🎯 Navigate to announcement detail page
     * Routes to different pages based on announcement source
     */
    // ✅ PERBAIKAN untuk function navigateToAnnouncement di HomePage.vue

    navigateToAnnouncement(item) {
      console.log('🎯 [HomePage] Navigating to announcement:', item)
      
      try {
        // ⭐ GUNAKAN originalId yang TANPA PREFIX untuk navigasi
        const actualId = item.originalId || item.id.replace(/^(news_|schedule_|announcement_)/, '')
        
        let targetRoute = ''
        
        if (item.sourceCollection === 'news' || item.type === 'news') {
          // ✅ Navigate ke news detail dengan ID asli (tanpa prefix)
          targetRoute = `/news/${actualId}`
        } else if (item.sourceCollection === 'schedules' || item.type === 'schedule') {
          // ✅ Navigate ke schedule detail dengan ID asli (tanpa prefix)
          targetRoute = `/jadwal/${actualId}`
        } else if (item.sourceCollection === 'announcements' || item.type === 'announcement') {
          // ✅ Navigate ke announcement detail
          targetRoute = `/news?category=announcements&id=${actualId}`
        } else {
          // Default fallback
          targetRoute = '/news'
        }
        
        console.log('🧭 [HomePage] Navigating to:', targetRoute)
        console.log('🔍 [HomePage] Using ID:', actualId)
        
        this.$router.push(targetRoute)
        
      } catch (error) {
        console.error('❌ [HomePage] Error navigating to announcement:', error)
        // Fallback navigation
        this.$router.push('/news')
      }
    }
  }
}
</script>

<style scoped>
/* ========================================
   BASE STYLES
========================================= */
.home-page {
  background: #fcfcf7;
  min-height: 100vh;
}

/* Default: Show mobile, hide desktop */
.desktop-layout {
  display: none;
}

.mobile-layout {
  display: block;
}

/* ========================================
   DESKTOP LAYOUT (≥769px)
========================================= */
@media (min-width: 769px) {
  .desktop-layout {
    display: block;
    min-height: 100vh;
    background: #fcfcf7;
  }
  
  .mobile-layout {
    display: none;
  }

  /* === TOP NAVIGATION === */
  .top-navbar {
    background: white;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .navbar-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .navbar-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .brand-text {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #41442A;
  }

  .navbar-menu {
    display: flex;
    gap: 32px;
  }

  .nav-link {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 500;
    color: #666;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    color: #41442A;
    background: rgba(65, 68, 42, 0.05);
  }

  .nav-link.router-link-active {
    color: #41442A;
    background: rgba(65, 68, 42, 0.1);
    font-weight: 600;
  }

  /* === MAIN CONTENT === */
  .main-content {
    padding: 40px;
  }

  .content-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* === WELCOME HERO === */
  .welcome-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    margin-bottom: 48px;
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .welcome-left {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .welcome-title {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #41442A;
    margin: 0;
    line-height: 1.2;
  }

  .welcome-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  .streak-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #41442A, #5a5e3d);
    border-radius: 12px;
    color: white;
    width: fit-content;
  }

  .streak-label {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 500;
  }

  .streak-count {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 700;
  }

  .welcome-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .daily-verse-desktop {
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .verse-image {
    width: 100%;
    height: auto;
    display: block;
  }

  /* === FEATURES GRID === */
  .feature-section {
    margin-bottom: 48px;
  }

  .section-title {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #41442A;
    margin: 0 0 20px 0;
  }

  .feature-grid-desktop {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
    margin: 0 -20px;
  }

  .feature-box-desktop {
    cursor: pointer;
    transition: transform 0.2s ease;
    transform: scale(1.2);
  }

  .feature-box-desktop:hover {
    transform: scale(1.25) translateY(-2px);
  }

  /* === ANNOUNCEMENTS GRID === */
  .announcement-section {
    margin-bottom: 48px;
  }

  .announcement-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .announcement-card-desktop {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }

  .announcement-card-desktop:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
}

/* ========================================
   MOBILE LAYOUT (≤768px)
========================================= */
@media (max-width: 768px) {
  .home-wrapper {
    padding: 16px;
    max-width: 360px;
    margin: 0 auto;
    padding-bottom: 80px;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin: 20px 0;
  }

  .section-title-mobile {
    font-family: 'Inter';
    font-size: 18px;
    font-weight: 600;
    color: #41442A;
    margin: 24px 0 16px 0;
  }
}

/* ========================================
   TABLET RESPONSIVE (769px - 1024px)
========================================= */
@media (max-width: 1024px) and (min-width: 769px) {
  .navbar-content {
    padding: 0 24px;
  }

  .main-content {
    padding: 24px;
  }

  .welcome-section {
    padding: 24px;
    gap: 24px;
  }

  .welcome-title {
    font-size: 20px;
  }

  .welcome-subtitle {
    font-size: 13px;
  }

  .feature-grid-desktop {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin: 0 -10px;
  }

  .feature-box-desktop {
    transform: scale(1.1);
  }

  .feature-box-desktop:hover {
    transform: scale(1.15) translateY(-2px);
  }

  /* Keep 3 columns for announcements on tablet */
  .announcement-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

/* ========================================
   SMALL DESKTOP (769px - 1200px)
========================================= */
@media (max-width: 1200px) and (min-width: 769px) {
  .announcement-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .feature-grid-desktop {
    grid-template-columns: repeat(3, 1fr);
    margin: 0;
  }

  .feature-box-desktop {
    transform: scale(1.05);
  }

  .feature-box-desktop:hover {
    transform: scale(1.1) translateY(-2px);
  }
}
</style>