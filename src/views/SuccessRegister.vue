<template>
  <div class="success-container">
    <div class="content-wrapper">
      <img src="@/assets/logos/logo-MyRajawali.png" alt="Logo MyRajawali" class="logo-img" />
      
      <!-- ⭐ DYNAMIC: Welcome message dengan nama user yang benar -->
      <h2>Welcome to MyRajawali{{ userName ? `, ${userName}` : '' }}!</h2>
      
      <p class="desc-text">
        Akun MyRajawali Anda telah <strong>BERHASIL</strong> dibuat.<br />
        Klik lanjutkan untuk jelajahi aplikasi MyRajawali.<br />
        Tuhan Yesus Memberkati
      </p>
      
      <!-- ⭐ DEBUG INFO (hanya di development) -->
      <div v-if="showDebugInfo" class="debug-info">
        <p><strong>Debug Info:</strong></p>
        <p>User: {{ userName || 'No user found' }}</p>
        <p>Streak: {{ userStreak }}</p>
        <p>Registered: {{ registrationTime }}</p>
      </div>
    </div>
    
    <ButtonPrimary @click="goToHome">Lanjutkan</ButtonPrimary>
  </div>
</template>

<script>
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import { useUserStore } from '@/stores/userStore'
import { getCurrentJemaat } from '@/services/auth'

export default {
  name: 'SuccessRegister',
  components: {
    ButtonPrimary
  },
  data() {
    return {
      userName: '',
      userStreak: 0,
      registrationTime: '',
      showDebugInfo: process.env.NODE_ENV === 'development'
    }
  },
  created() {
    // ⭐ VALIDATE: Pastikan user benar-benar sudah registrasi
    this.validateUserRegistration()
  },
  methods: {
    // ⭐ VALIDATION: Check apakah user memang baru saja registrasi
    validateUserRegistration() {
      console.log('🔍 [SuccessRegister] Validating user registration...')
      
      try {
        // ⭐ CHECK 1: UserStore
        const userStore = useUserStore()
        if (userStore.isLoggedIn && userStore.user?.nama) {
          this.userName = userStore.user.nama
          console.log('✅ [SuccessRegister] User from store:', this.userName)
        }
        
        // ⭐ CHECK 2: localStorage sebagai backup
        if (!this.userName) {
          const savedUser = getCurrentJemaat()
          if (savedUser?.nama) {
            this.userName = savedUser.nama
            console.log('✅ [SuccessRegister] User from localStorage:', this.userName)
          }
        }
        
        // ⭐ CHECK 3: Streak data
        const streakData = JSON.parse(localStorage.getItem('streakData')) || {}
        this.userStreak = streakData.streakCount || 1
        
        // ⭐ CHECK 4: Registration timestamp
        if (userStore.user?.registeredAt) {
          this.registrationTime = new Date(userStore.user.registeredAt).toLocaleString('id-ID')
        }
        
        console.log('✅ [SuccessRegister] Validation complete:', {
          userName: this.userName,
          streak: this.userStreak,
          registrationTime: this.registrationTime
        })
        
        // ⭐ SECURITY: Jika tidak ada user data, redirect ke login
        if (!this.userName) {
          console.log('⚠️ [SuccessRegister] No user data found, redirecting to login...')
          this.$router.push('/')
        }
        
      } catch (error) {
        console.error('❌ [SuccessRegister] Validation error:', error)
        // Jika error, tetap biarkan user lanjut ke home
        this.userName = 'User'
      }
    },
    
    goToHome() {
      console.log('🚀 [SuccessRegister] Navigating to home...')
      
      // ⭐ FINAL CHECK: Pastikan user session valid sebelum ke home
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.log('⚠️ [SuccessRegister] User not logged in, re-checking...')
        userStore.checkLoginStatus()
      }
      
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.success-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  background-color: #fcfcf7;
  padding: 64px 16px;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
}

.logo-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-top: 40px;
}

h2 {
  font-family: 'Inter';
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #41442A;
}

.desc-text {
  font-family: 'Inter';
  font-size: 14px;
  line-height: 1.6;
  color: black;
}

/* ⭐ DEBUG: Development info styling */
.debug-info {
  background-color: #f0f8ff;
  border: 1px solid #41442A;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  text-align: left;
  max-width: 280px;
}

.debug-info p {
  margin: 4px 0;
  color: #333;
}

.debug-info strong {
  color: #41442A;
}

/* Responsive */
@media (max-width: 360px) {
  .success-container {
    padding: 48px 12px;
  }
  
  .debug-info {
    font-size: 11px;
    padding: 10px;
  }
}
</style>