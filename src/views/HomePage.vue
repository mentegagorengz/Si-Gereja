// src/views/HomePage.vue - ROBUST STREAK HANDLING
<template>
  <div class="home-container">
    <div class="home-wrapper">

      <!-- ⭐ ROBUST: Header dengan streak yang preserved -->
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
import HeaderHome from '@/components/layout/HeaderHome.vue'
import DailyVerse from '@/components/DailyVerse.vue'
import FeatureBox from '@/components/FeatureBox.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import AnnouncementCard from '@/components/AnnouncementCard.vue'
import { useUserStore } from '@/stores/userStore'
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
      ayatGambar: null,
      featureList: [
        { name: "News", icon: "news" },
        { name: "Jadwal", icon: "jadwal" },
        { name: "Giving", icon: "giving" },
        { name: "Alkitab Setahun", icon: "alkitab" },
        { name: "Renungan", icon: "renungan" },
        { name: "Prayer Request", icon: "prayer" }
      ],
      announcementList: [],
      currentUserId: null
    }
  },
  async created() {
    await this.initializeUserData()
    this.loadDailyVerse()
    this.loadExistingUserStreak() // ⭐ CHANGED: Load existing, bukan recalculate
    this.fetchAnnouncements()
  },
  methods: {
    async initializeUserData() {
      console.log('🔍 [HomePage] === INITIALIZING USER DATA ===');
      
      try {
        const userStore = useUserStore();
        
        if (userStore.isLoggedIn && userStore.user?.nama) {
          this.namaUser = userStore.user.nama;
          this.currentUserId = userStore.user.id || userStore.user.nama;
          console.log('✅ [HomePage] Using userStore data:', this.namaUser, 'ID:', this.currentUserId);
          return;
        }
        
        console.log('🔍 [HomePage] UserStore empty, checking localStorage...');
        const savedUser = getCurrentJemaat();
        
        if (savedUser && savedUser.nama) {
          this.namaUser = savedUser.nama;
          this.currentUserId = savedUser.id || savedUser.nama;
          console.log('✅ [HomePage] Using localStorage data:', this.namaUser, 'ID:', this.currentUserId);
          
          userStore.setUser(savedUser);
          return;
        }
        
        console.log('⚠️ [HomePage] No valid user data found');
        this.namaUser = 'Jemaat';
        this.$router.push('/');
        
      } catch (error) {
        console.error('❌ [HomePage] Error in initializeUserData:', error);
        this.namaUser = 'Jemaat';
        localStorage.removeItem('user');
        this.$router.push('/');
      }
    },

    // ⭐ NEW: Load existing streak (jangan recalculate otomatis!)
    loadExistingUserStreak() {
      if (!this.currentUserId) {
        console.log('⚠️ [HomePage] No user ID, using default streak = 1');
        this.streakCount = 1;
        return;
      }

      console.log('📊 [HomePage] === LOADING EXISTING USER STREAK ===');
      console.log('🔍 [HomePage] User ID:', this.currentUserId);
      
      try {
        const userStreakKey = `streakData_${this.currentUserId}`;
        const saved = localStorage.getItem(userStreakKey);
        
        console.log('🔍 [HomePage] Streak key:', userStreakKey);
        console.log('🔍 [HomePage] Saved data:', saved);
        
        if (saved) {
          const streakData = JSON.parse(saved);
          this.streakCount = streakData.streakCount || 1;
          
          console.log('✅ [HomePage] Loaded existing streak:', this.streakCount);
          console.log('📊 [HomePage] Streak metadata:', {
            lastLogin: streakData.lastLoginDate,
            updatedAt: streakData.updatedAt,
            updatedBy: streakData.updatedBy
          });
          
          // ⭐ OPTIONAL: Show streak info untuk debugging
          this.displayStreakInfo(streakData);
          
        } else {
          // ⭐ NO EXISTING STREAK: Initialize untuk first time
          console.log('🎉 [HomePage] No existing streak, initializing = 1');
          this.streakCount = 1;
          this.initializeFirstTimeStreak();
        }
        
      } catch (error) {
        console.error('❌ [HomePage] Error loading streak:', error);
        this.streakCount = 1;
      }
    },

    // ⭐ NEW: Initialize first time streak (only if no existing data)
    initializeFirstTimeStreak() {
      if (!this.currentUserId) return;
      
      console.log('🎯 [HomePage] Initializing first time streak...');
      
      const today = new Date().toDateString();
      const userStreakKey = `streakData_${this.currentUserId}`;
      
      const streakData = {
        lastLoginDate: today,
        streakCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'HomePage_FirstTime'
      };
      
      localStorage.setItem(userStreakKey, JSON.stringify(streakData));
      console.log('✅ [HomePage] First time streak initialized:', streakData);
    },

    // ⭐ NEW: Display streak info untuk debugging
    displayStreakInfo(streakData) {
      if (process.env.NODE_ENV !== 'development') return;
      
      const today = new Date().toDateString();
      const daysDiff = this.calculateDaysDifference(streakData.lastLoginDate, today);
      
      console.log('📊 [HomePage] === STREAK INFO ===');
      console.log('👤 User:', this.namaUser);
      console.log('🔥 Current Streak:', this.streakCount);
      console.log('📅 Last Login:', streakData.lastLoginDate);
      console.log('📅 Today:', today);
      console.log('📊 Days Difference:', daysDiff);
      console.log('🎯 Status:', 
        daysDiff === 0 ? 'Same Day' :
        daysDiff === 1 ? 'Consecutive' :
        `Gap of ${daysDiff} days`
      );
      
      if (daysDiff > 1) {
        console.log('⚠️ [HomePage] WARNING: Gap detected but streak not updated');
        console.log('💡 [HomePage] Streak should be updated by LoginPage');
      }
    },

    // ⭐ HELPER: Calculate days difference (same as LoginPage)
    calculateDaysDifference(lastLoginDateStr, todayStr) {
      try {
        const lastLogin = new Date(lastLoginDateStr);
        const today = new Date(todayStr);
        
        lastLogin.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const timeDifference = today.getTime() - lastLogin.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        return daysDifference;
        
      } catch (error) {
        console.error('❌ [HomePage] Error calculating days difference:', error);
        return 999;
      }
    },

    // ⭐ NEW: Force streak recalculation (manual trigger)
    forceStreakRecalculation() {
      if (!this.currentUserId) {
        console.log('⚠️ [HomePage] No user ID for recalculation');
        return;
      }

      console.log('🔄 [HomePage] === FORCE STREAK RECALCULATION ===');
      
      const today = new Date().toDateString();
      const userStreakKey = `streakData_${this.currentUserId}`;
      const saved = localStorage.getItem(userStreakKey);
      
      if (!saved) {
        console.log('❌ [HomePage] No existing streak data to recalculate');
        return;
      }
      
      const streakData = JSON.parse(saved);
      const daysDiff = this.calculateDaysDifference(streakData.lastLoginDate, today);
      
      let newStreakCount;
      if (daysDiff === 0) {
        newStreakCount = streakData.streakCount;
      } else if (daysDiff === 1) {
        newStreakCount = streakData.streakCount + 1;
      } else {
        newStreakCount = 1;
      }
      
      console.log('🔄 [HomePage] Recalculation result:', {
        oldStreak: streakData.streakCount,
        newStreak: newStreakCount,
        daysDiff: daysDiff
      });
      
      // Update component state
      this.streakCount = newStreakCount;
      
      // Save updated data
      const updatedData = {
        ...streakData,
        lastLoginDate: today,
        streakCount: newStreakCount,
        updatedAt: new Date().toISOString(),
        updatedBy: 'HomePage_ForceRecalc'
      };
      
      localStorage.setItem(userStreakKey, JSON.stringify(updatedData));
      console.log('✅ [HomePage] Streak forcefully recalculated and saved');
    },

    // ⭐ DEBUG: Enhanced debugging dengan streak validation
    debugUserStreakComplete() {
      console.log('🧪 [HomePage] === COMPLETE STREAK DEBUG ===');
      
      const userStore = useUserStore();
      const localStorageUser = localStorage.getItem('user');
      
      console.log('UserStore:', {
        isLoggedIn: userStore.isLoggedIn,
        user: userStore.user
      });
      
      console.log('localStorage user:', localStorageUser);
      
      if (this.currentUserId) {
        const userStreakKey = `streakData_${this.currentUserId}`;
        const streakData = localStorage.getItem(userStreakKey);
        
        console.log('User streak data:', streakData);
        
        if (streakData) {
          const parsed = JSON.parse(streakData);
          this.displayStreakInfo(parsed);
        }
      }
      
      console.log('Component state:', {
        namaUser: this.namaUser,
        currentUserId: this.currentUserId,
        streakCount: this.streakCount
      });
      
      // List all streak data
      console.log('All streak data:');
      Object.keys(localStorage)
        .filter(key => key.startsWith('streakData_'))
        .forEach(key => {
          const data = JSON.parse(localStorage.getItem(key));
          const userId = key.replace('streakData_', '');
          console.log(`  ${userId}: Streak ${data.streakCount} (${data.lastLoginDate})`);
        });
    },

    loadDailyVerse() {
      try {
        const ayatUrl = getDailyVerseUrl()
        this.ayatGambar = ayatUrl
      } catch (error) {
        console.error('❌ [HomePage] Failed to load daily verse:', error.message)
        this.ayatGambar = null
      }
    },
    
    async fetchAnnouncements() {
      try {
        this.announcementList = await getAnnouncements(5);
      } catch (error) {
        console.error("Error fetching announcements:", error);
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
  },

  // ⭐ EXPOSE: Enhanced debug functions
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      window.debugHomePage = () => this.debugUserStreakComplete();
      window.forceStreakRecalc = () => this.forceStreakRecalculation();
      window.loadExistingStreak = () => this.loadExistingUserStreak();
      
      console.log('🔧 [HomePage] Enhanced debug functions:');
      console.log('   - window.debugHomePage() // Complete debug');
      console.log('   - window.forceStreakRecalc() // Force recalculation');
      console.log('   - window.loadExistingStreak() // Reload streak data');
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