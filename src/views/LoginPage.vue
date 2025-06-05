<template>
  <div class="login-container">
          <!-- Logo -->
          <img src="@/assets/logos/logo-MyRajawali.png" alt="Logo" class="logo-img"/>

          <!-- Teks Welcome -->
          <h2 class="welcome-text">Welcome to MyRajawali</h2>

          <!-- Input Nama -->
          <FormInput
           id="name"
           label="Nama"
           placeholder="Ketik nama Anda"
           v-model="nama"
           :error="errorNama"
          />

          <!-- Input Password -->
          <PasswordInput
            id="password"
            label="Password"
            placeholder="Masukan password Anda"
            v-model="password"
            :error="errorPassword"
          />

          <!-- Link Buat Akun -->
          <p class="signup-text">
              Belum punya akun?
              <router-link to="/register">Buat sekarang!</router-link>
          </p>

          <!-- Tombol Login -->
          <ButtonPrimary @click="login">Masuk</ButtonPrimary>
      </div>
</template>

<script>
import FormInput from '@/components/common/FormInput.vue'
import PasswordInput from '@/components/common/PasswordInput.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { useUserStore } from '@/stores/userStore';

export default {
name: 'LoginPage',
components: {
  FormInput,
  PasswordInput,
  ButtonPrimary
},
data() {
  return {
    nama: '',
    password: '',
    errorNama: '',
    errorPassword: ''
  }
},
methods: {
  async login() {
    try {
      // Reset error
      this.errorNama = ''
      this.errorPassword = ''

      // Validasi input kosong
      if (!this.nama) {
        this.errorNama = 'Nama harus diisi'
        return
      }

      if (!this.password) {
        this.errorPassword = 'Password harus diisi'
        return
      }

      console.log('🔍 [LoginPage] === STARTING LOGIN PROCESS ===');
      console.log('🔍 [LoginPage] Login attempt for:', this.nama);

      const userStore = useUserStore();
      
      // ⭐ STEP 1: Login dan dapatkan data user lengkap
      const userData = await userStore.login(this.nama, this.password);
      console.log('✅ [LoginPage] Login successful, userData:', userData);

      // ⭐ STEP 2: Update streak untuk returning user
      this.updateStreakForReturningUser(userData);

      // ⭐ STEP 3: Navigate to home
      console.log('🚀 [LoginPage] Navigating to home...');
      this.$router.push('/home');
      
    } catch (error) {
      console.error('❌ [LoginPage] Login failed:', error);
      
      if (error.message.includes('Nama')) {
        this.errorNama = error.message;
      } else if (error.message.includes('Password')) {
        this.errorPassword = error.message;
      } else {
        this.errorNama = error.message;
      }
    }
  },

  // ⭐ NEW: Update streak for returning user (bukan reset!)
  updateStreakForReturningUser(userData) {
    console.log('🔥 [LoginPage] === UPDATING STREAK FOR RETURNING USER ===');
    console.log('🔍 [LoginPage] User data:', userData);
    
    try {
      if (!userData || !userData.id) {
        console.log('⚠️ [LoginPage] No user ID, cannot update streak');
        return;
      }

      const userId = userData.id;
      const today = new Date().toDateString();
      const userStreakKey = `streakData_${userId}`;
      
      // ⭐ CHECK: Existing streak data
      const existingStreak = localStorage.getItem(userStreakKey);
      console.log('🔍 [LoginPage] Existing streak data:', existingStreak);
      
      if (existingStreak) {
        const streakData = JSON.parse(existingStreak);
        console.log('✅ [LoginPage] Found existing streak for user:', streakData);
        
        // ⭐ IMPORTANT: Calculate jika perlu update based on last login
        const daysDifference = this.calculateDaysDifference(streakData.lastLoginDate, today);
        console.log('📊 [LoginPage] Days since last login:', daysDifference);
        
        if (daysDifference === 0) {
          // Same day - tidak perlu update
          console.log('✅ [LoginPage] Same day login, keeping streak:', streakData.streakCount);
        } else if (daysDifference === 1) {
          // Consecutive - increment streak
          const newStreakCount = streakData.streakCount + 1;
          console.log('🔥 [LoginPage] Consecutive login! Updating streak:', streakData.streakCount, '→', newStreakCount);
          
          this.saveUserStreak(userId, newStreakCount, today);
        } else {
          // Gap - reset to 1
          console.log('💔 [LoginPage] Gap detected! Resetting streak from', streakData.streakCount, 'to 1');
          this.saveUserStreak(userId, 1, today);
        }
      } else {
        // ⭐ NEW USER: First time login (tidak ada existing streak)
        console.log('🎉 [LoginPage] New user login, initializing streak = 1');
        this.saveUserStreak(userId, 1, today);
      }
      
    } catch (error) {
      console.error('❌ [LoginPage] Error updating streak:', error);
      
      // ⭐ FALLBACK: Initialize streak = 1 jika ada error
      if (userData?.id) {
        this.saveUserStreak(userData.id, 1, new Date().toDateString());
      }
    }
  },

  // ⭐ HELPER: Calculate days difference
  calculateDaysDifference(lastLoginDateStr, todayStr) {
    try {
      const lastLogin = new Date(lastLoginDateStr);
      const today = new Date(todayStr);
      
      // Reset time untuk perhitungan yang akurat
      lastLogin.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const timeDifference = today.getTime() - lastLogin.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      
      console.log('🔍 [LoginPage] Date calculation:', {
        lastLogin: lastLogin.toDateString(),
        today: today.toDateString(),
        daysDifference: daysDifference
      });
      
      return daysDifference;
      
    } catch (error) {
      console.error('❌ [LoginPage] Error calculating days difference:', error);
      return 999; // Force reset if calculation fails
    }
  },

  // ⭐ HELPER: Save user streak
  saveUserStreak(userId, streakCount, lastLoginDate) {
    const userStreakKey = `streakData_${userId}`;
    const streakData = {
      lastLoginDate: lastLoginDate,
      streakCount: streakCount,
      updatedAt: new Date().toISOString(),
      updatedBy: 'LoginPage'
    };
    
    localStorage.setItem(userStreakKey, JSON.stringify(streakData));
    console.log('✅ [LoginPage] Streak updated:', userStreakKey, streakData);
  }
}
}
</script>

<style scoped>
.login-container {
display: flex;
flex-direction: column;
align-items: center;
padding: 24px 16px 64px;
min-height: 100vh;
background-color: #fcfcf7;
box-sizing: border-box;
}

.logo-img {
width: 100px;
height: 100px;
object-fit: contain;
margin-top: 60px;
margin-bottom: 15px;
}

.welcome-text {
width: 300px;
height: 27px;
padding: 4px 8px;
text-align: center;
font-family: 'Inter';
font-size: 20px;
font-weight: 600;
}

.signup-text {
  font-size: 14px;
  margin-top: 32px;
  margin-bottom: 63px;
  text-align: center;
}

.signup-text a {
font-weight: bold;
color: black;
text-decoration: underline;
}
</style>