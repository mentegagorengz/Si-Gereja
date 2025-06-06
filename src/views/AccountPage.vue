<template>
  <div class="account-container">
    <div class="account-wrapper">
      <!-- Header -->
      <div class="account-header">
        <h1 class="page-title">Profile</h1>
      </div>

      <!-- User Info Card -->
      <div class="user-info-card">
        <!-- Avatar/Initial -->
        <div class="user-avatar">
          <span class="avatar-text">{{ userInitial }}</span>
        </div>
        
        <!-- User Details -->
        <div class="user-details">
          <h2 class="user-name">{{ userName }}</h2>
          <p class="user-sektor">{{ userSektor }}</p>
          <p class="user-status">{{ userStatus }}</p>
        </div>
      </div>

      <!-- Stats Card -->
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <span class="stat-value">{{ streakCount }}</span>
            <span class="stat-label">Hari Berturut-turut</span>
          </div>
        </div>
      </div>

      <!-- Menu Options -->
      <div class="menu-section">
        <div class="menu-item" @click="goToBookmarks">
          <Bookmark class="menu-icon" />
          <span class="menu-text">Bookmark Renungan</span>
          <ChevronRight class="menu-arrow" />
        </div>
        
        <!-- Development Only - Firebase Test -->
        <div v-if="isDevelopment" class="menu-item" @click="goToFirebaseTest">
          <Database class="menu-icon" />
          <span class="menu-text">Test Koneksi</span>
          <ChevronRight class="menu-arrow" />
        </div>
      </div>

      <!-- Logout Section -->
      <div class="logout-section">
        <button class="logout-button" @click="showLogoutConfirm = true">
          <LogOut class="logout-icon" />
          <span>Keluar dari Akun</span>
        </button>
      </div>

      <!-- Bottom Navbar -->
      <BottomNavbar forceActiveRoute="/account" />
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutConfirm" class="modal-overlay" @click="cancelLogout">
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
          <button class="cancel-btn" @click="cancelLogout">Batal</button>
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
import { useStreakStore } from '@/stores/streakStore'
import BottomNavbar from '@/components/BottomNavbar.vue'
import { Bookmark, ChevronRight, Database, LogOut } from 'lucide-vue-next'

export default {
  name: 'AccountPage',
  components: {
    BottomNavbar,
    Bookmark,
    ChevronRight, 
    Database,
    LogOut
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
    
    streakStore() {
      return useStreakStore()
    },
    
    userName() {
      return this.userStore.namaUser || 'Jemaat'
    },
    
    userSektor() {
      const sektor = this.userStore.sektorUser
      return sektor ? `Sektor ${sektor}` : 'Sektor tidak diketahui'
    },
    
    userStatus() {
      return this.userStore.statusUser || 'Status tidak diketahui'
    },
    
    userInitial() {
      return this.userName.charAt(0).toUpperCase()
    },
    
    streakCount() {
      const userId = this.userStore.userId
      return userId ? this.streakStore.currentStreak(userId) : 0
    },
    
    isDevelopment() {
      return process.env.NODE_ENV === 'development'
    }
  },
  methods: {
    goToBookmarks() {
      this.$router.push('/renungan/bookmarks')
    },
    
    goToFirebaseTest() {
      if (this.isDevelopment) {
        this.$router.push('/firebase-test')
      }
    },
    
    cancelLogout() {
      this.showLogoutConfirm = false
      this.isLoggingOut = false
    },
    
    async confirmLogout() {
      if (this.isLoggingOut) return
      
      try {
        this.isLoggingOut = true
        
        // Call userStore logout
        this.userStore.logout()
        
        // Close modal
        this.showLogoutConfirm = false
        
        // Navigate to login with replace (prevent going back)
        await this.$router.replace('/')
        
      } catch (error) {
        console.error('Logout error:', error)
        
        // Force logout even on error
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
  padding-bottom: 80px;
}

.account-wrapper {
  padding: 16px;
  max-width: 360px;
  margin: 0 auto;
}

/* Header */
.account-header {
  padding: 20px 0;
  text-align: center;
}

.page-title {
  font-family: 'Inter';
  font-size: 24px;
  font-weight: 600;
  color: #41442A;
  margin: 0;
}

/* User Info Card */
.user-info-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #41442A, #5a5e3d);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: white;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Inter';
}

.user-details {
  flex: 1;
}

.user-name {
  font-family: 'Inter';
  font-size: 20px;
  font-weight: 600;
  color: #41442A;
  margin: 0 0 4px 0;
}

.user-sektor, 
.user-status {
  font-family: 'Inter';
  font-size: 14px;
  color: #666;
  margin: 2px 0;
}

/* Stats Card */
.stats-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(65, 68, 42, 0.1);
  border-radius: 12px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: 'Inter';
  font-size: 24px;
  font-weight: bold;
  color: #41442A;
  line-height: 1;
}

.stat-label {
  font-family: 'Inter';
  font-size: 14px;
  color: #666;
  margin-top: 2px;
}

/* Menu Section */
.menu-section {
  background: white;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-item:active {
  background-color: #e9ecef;
}

.menu-icon {
  width: 20px;
  height: 20px;
  color: #41442A;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-family: 'Inter';
  font-size: 16px;
  color: #333;
}

.menu-arrow {
  width: 16px;
  height: 16px;
  color: #999;
}

/* Logout Section */
.logout-section {
  margin-top: 24px;
}

.logout-button {
  width: 100%;
  background: #dc3545;
  border: none;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.logout-button:hover {
  background: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.logout-button:active {
  transform: translateY(0);
}

.logout-icon {
  width: 20px;
  height: 20px;
}

/* Modal */
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
  
  .user-info-card {
    padding: 20px;
  }
  
  .user-avatar {
    width: 56px;
    height: 56px;
  }
  
  .avatar-text {
    font-size: 20px;
  }
  
  .user-name {
    font-size: 18px;
  }
}
</style>