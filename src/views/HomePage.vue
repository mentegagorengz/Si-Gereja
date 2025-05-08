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
        />
      </div>

      <!-- Announcement Cards -->
      <AnnouncementCard
        v-for="(item, index) in announcementList"
        :key="index"
        :title="item.title"
        :desc="item.desc"
        :icon="item.icon"
      />

      <!-- Bottom Navbar -->
      <BottomNavbar />
    </div>
  </div>
</template>

<script>
import FeatureBox from '@/components/FeatureBox.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import HeaderHome from '@/components/layout/HeaderHome.vue'
import DailyVerse from '@/components/DailyVerse.vue'
import { useUserStore } from '@/stores/userStore'
import { useStreakStore } from '@/stores/streakStore'
import { useContentStore } from '@/stores/contentStore'

export default {
  name: 'HomePage',
  components: {
    FeatureBox,
    BottomNavbar,
    AnnouncementCard,
    HeaderHome,
    DailyVerse
  },
  data() {
    // Gunakan store untuk mendapatkan data
    const userStore = useUserStore()
    const streakStore = useStreakStore()
    const contentStore = useContentStore()

    return {
      namaUser: userStore.namaUser,
      streakCount: streakStore.currentStreak,
      ayatGambar: contentStore.ayatHarian.gambar,
      features: contentStore.features,
      announcements: contentStore.announcements
    }
  },
  mounted() {
    // Cek streak hanya sekali saat halaman dimuat
    const streakStore = useStreakStore()
    this.streakCount = streakStore.checkStreak()
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.greeting {
  font-size: 16px;
  font-family: 'Inter';
  font-weight: 600;
}

.streak {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  font-size: 14px;
}

.icon-flame {
  width: 20px;
  height: 20px;
  color: #41442A;
}

.verse-wrapper {
  width: calc(100% + 32px); /* 100% + 16px kiri + 16px kanan */
  margin-left: -16px;
  margin-right: -16px;
}

.ayat-full {
  width: 100%;
  height: auto;
  display: block;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  text-align: center;
  margin: 24px 0;
}
</style>
