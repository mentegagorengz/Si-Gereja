<!-- src/views/AccountPage.vue - SIMPLE UI LIKE WIREFRAME -->
<template>
  <div class="account-container">
    <div class="account-wrapper">
      <!-- Header -->
      <div class="account-header">
        <h1 class="page-title">Profile</h1>
      </div>

      <!-- User Info Section (Style Lama - Clickable) -->
      <div class="user-info-section" @click="goToProfileDetail">
        <div class="user-avatar">
          <span class="avatar-text">{{ userInitial }}</span>
        </div>
        
        <div class="user-details">
          <h2 class="user-name">{{ userName }}</h2>
          <p class="user-subtitle">Lihat dan edit Profil</p>
        </div>
        
        <ChevronRight class="profile-arrow" />
      </div>

      <!-- Mode Pengurus (Terpisah dengan style colorful) -->
      <div 
        v-if="userStore.isPengurus" 
        class="pengurus-card" 
        @click="switchToPengurusMode"
      >
        <div class="pengurus-icon">👨‍💼</div>
        <span class="pengurus-text">Beralih ke mode Pengurus</span>
        <ChevronRight class="pengurus-arrow" />
      </div>

      <!-- Menu List (Style Baru - Simple) -->
      <div class="menu-container">
        <div class="menu-item" @click="goToScheduleSettings">
          <div class="menu-left">
            <Calendar class="menu-icon" />
            <span class="menu-text">Jadwal Pelayan Altar</span>
          </div>
          <ChevronRight class="menu-arrow" />
        </div>

        <div class="menu-item" @click="goToPasswordChange">
          <div class="menu-left">
            <Lock class="menu-icon" />
            <span class="menu-text">Ganti password</span>
          </div>
          <ChevronRight class="menu-arrow" />
        </div>

        <div class="menu-item" @click="goToReportsHelp">
          <div class="menu-left">
            <HelpCircle class="menu-icon" />
            <span class="menu-text">Laporan dan Bantuan</span>
          </div>
          <ChevronRight class="menu-arrow" />
        </div>

        <div class="menu-item" @click="showLogoutModal">
          <div class="menu-left">
            <LogOut class="menu-icon" />
            <span class="menu-text">Keluar</span>
          </div>
          <ChevronRight class="menu-arrow" />
        </div>
      </div>

      <!-- Bottom Navbar -->
      <BottomNavbar forceActiveRoute="/account" />
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutConfirm" class="modal-overlay" @click="hideLogoutModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <LogOut class="modal-icon" />
          <h3>Keluar dari Akun?</h3>
        </div>
        
        <p class="modal-message">
          Apakah kamu yakin ingin keluar dari akun <strong>{{ userName }}</strong>?
          <br><br>
          Data streak dan bookmark akan tetap tersimpan untuk login berikutnya.
        </p>
        
        <div class="modal-actions">
          <button class="cancel-btn" @click="hideLogoutModal">Batal</button>
          <button class="logout-confirm-btn" @click="confirmLogout" :disabled="isLoggingOut">
            <span v-if="isLoggingOut">Keluar...</span>
            <span v-else>Ya, Keluar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import BottomNavbar from '@/components/BottomNavbar.vue'
import { LogOut, ChevronRight, Calendar, Lock, HelpCircle } from 'lucide-vue-next'

export default {
  name: 'AccountPage',
  components: {
    BottomNavbar,
    LogOut,
    ChevronRight,
    Calendar,
    Lock,
    HelpCircle
  },
  
  data() {
    return {
      showLogoutConfirm: false,
      isLoggingOut: false
    }
  },
  
  computed: {
    userStore() {
      return useUserStore()
    },
    
    userName() {
      return this.userStore.namaUser
    },
    
    userInitial() {
      return this.userName.charAt(0).toUpperCase()
    }
  },
  
  methods: {
    // Navigation ke Profile Detail
    goToProfileDetail() {
      this.$router.push('/detail-profile')
    },

    // Navigation ke Mode Pengurus
    switchToPengurusMode() {
      if (!this.userStore.isPengurus) {
        alert('❌ Anda tidak memiliki akses sebagai pengurus!')
        return
      }
      
      this.$router.push('/pengurus/mode')
    },

    // Navigation ke halaman lain
    goToScheduleSettings() {
      alert('📅 Fitur Jadwal Pelayan Altar akan tersedia setelah development selesai!')
    },
    
    goToPasswordChange() {
      alert('🔒 Fitur Ganti Password akan tersedia setelah development selesai!')
    },
    
    goToReportsHelp() {
      alert('📊 Fitur Laporan dan Bantuan akan tersedia setelah development selesai!')
    },

    // Logout functions
    showLogoutModal() {
      this.showLogoutConfirm = true
    },
    
    hideLogoutModal() {
      this.showLogoutConfirm = false
      this.isLoggingOut = false
    },
    
    async confirmLogout() {
      if (this.isLoggingOut) return
      
      try {
        this.isLoggingOut = true
        this.userStore.logout()
        this.hideLogoutModal()
        await this.$router.replace('/')
      } catch (error) {
        console.error('Logout error:', error)
        this.userStore.logout()
        await this.$router.replace('/')
      } finally {
        this.isLoggingOut = false
      }
    }
  }
}
</script>

<style scoped>
.account-container {
  background: #fcfcf7;
  min-height: 100vh;
  padding-bottom: 64px; /* Dikurangi dari 80px ke 64px sesuai navbar height */
  box-sizing: border-box; /* Ensure padding included in height calculation */
}

.account-wrapper {
  padding: 16px;
  max-width: 360px;
  margin: 0 auto;
}

/* Header */
.account-header {
  text-align: center;
  padding: 20px 0;
}

.page-title {
  font-family: 'Inter';
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* User Info Section (Style Lama - Clickable) */
.user-info-section {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #E8E8E8;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-info-section:hover {
  background: #ddd;
  transform: translateY(-1px);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: white;
  font-size: 20px;
  font-weight: bold;
  font-family: 'Inter';
}

.user-details {
  flex: 1;
}

.user-name {
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.user-subtitle {
  font-family: 'Inter';
  font-size: 12px;
  color: #666;
  margin: 0;
}

.profile-arrow {
  width: 16px;
  height: 16px;
  color: #999;
  flex-shrink: 0;
}

/* Pengurus Card (Style Colorful) */
.pengurus-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FFF9C4;
  border: 1px solid #FFE082;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pengurus-card:hover {
  background: #FFF59D;
  transform: translateY(-1px);
  box-shadow: 0 2px 12px rgba(255, 193, 7, 0.3);
}

.pengurus-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.pengurus-text {
  flex: 1;
  font-family: 'Inter';
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.pengurus-arrow {
  width: 16px;
  height: 16px;
  color: #999;
  flex-shrink: 0;
}

/* Menu Container (Style Simple dengan icon) */
.menu-container {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item:first-child {
  border-radius: 8px 8px 0 0;
}

.menu-item:last-child {
  border-radius: 0 0 8px 8px;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-icon {
  width: 20px;
  height: 20px;
  color: #666;
  flex-shrink: 0;
}

.menu-text {
  font-family: 'Inter';
  font-size: 16px;
  color: #333;
  font-weight: 400;
}

.menu-arrow {
  width: 20px;
  height: 20px;
  color: #999;
  flex-shrink: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  width: 100%;
  text-align: center;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.modal-icon {
  width: 48px;
  height: 48px;
  color: #dc3545;
  margin-bottom: 12px;
}

.modal-header h3 {
  font-family: 'Inter';
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-message {
  font-family: 'Inter';
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 24px 0;
  text-align: left;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn, 
.logout-confirm-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-family: 'Inter';
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.logout-confirm-btn {
  background: #dc3545;
  color: white;
}

.logout-confirm-btn:hover:not(:disabled) {
  background: #c82333;
}

.logout-confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 360px) {
  .account-wrapper {
    padding: 12px;
  }
  
  .profile-section {
    padding: 16px 0;
  }
  
  .menu-item {
    padding: 14px 16px;
  }
  
  .menu-text {
    font-size: 15px;
  }
}
</style>