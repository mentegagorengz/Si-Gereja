<template>
  <div class="home-container">
    <div class="home-wrapper">

      <!-- Header: Greeting + Streak -->
      <div class="header">
        <p class="greeting">Halo, {{ namaUser }}!</p>
        <div class="streak">
          <span>{{ streakCount }}</span>
          <Flame class="icon-flame" />
        </div>
      </div>

      <!-- Ayat Hari Ini -->
      <div class="verse-wrapper">
        <img :src="ayatGambar" alt="Ayat Hari Ini" class="ayat-full" />
      </div>

      <!-- Menu Fitur -->
      <div class="feature-grid">
        <FeatureBox name="News" />
        <FeatureBox name="Jadwal" />
        <FeatureBox name="Giving" />
        <FeatureBox name="Alkitab Setahun" />
        <FeatureBox name="Renungan" />
        <FeatureBox name="Prayer Request" />
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
import { Flame } from 'lucide-vue-next'
import FeatureBox from '@/components/FeatureBox.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import ayatImg from '@/assets/Ayat.png'

export default {
  name: 'HomePage',
  components: {
    Flame,
    FeatureBox,
    BottomNavbar,
    AnnouncementCard
  },
  data() {
    const savedUser = JSON.parse(localStorage.getItem("user")) || {}
    return {
      namaUser: savedUser.nama || 'Jemaat',
      streakCount: 11,
      ayatGambar: ayatImg,
      announcementList: [
        {
          title: 'Happy Birthday, Kak Irene!',
          desc: '09 Agustus – Tuhan berkati selalu!',
          icon: 'cake.png'
        },
        {
          title: 'Ibadah PELPRAP',
          desc: 'Pukul 17.00 WITA – Gedung Gereja',
          icon: 'ibadah.png'
        }
      ]
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
