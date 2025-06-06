<!-- src/views/AccountPage.vue - UPDATED FOR NEW USERSTORE -->
<template>
  <div class="account-container">
    <div class="account-wrapper">
      <!-- Header -->
      <div class="account-header">
        <h1 class="page-title">Profile</h1>
      </div>

      <!-- User Info Section -->
      <div class="user-info-section">
        <div class="user-avatar">
          <span class="avatar-text">{{ userInitial }}</span>
        </div>
        
        <div class="user-details">
          <h2 class="user-name">{{ userName }}</h2>
          <p class="user-subtitle">{{ userStore.roleDisplayName }}</p>
          <!-- ⭐ DEBUG INFO (development only) -->
          <div v-if="isDevelopment" class="debug-info">
            <p>Role: {{ userStore.userRole }}</p>
            <p>isPengurus: {{ userStore.isPengurus }}</p>
            <p>isAdmin: {{ userStore.isAdmin }}</p>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="menu-list">
        <!-- ⭐ PENGURUS MODE (only for pengurus/admin) -->
        <div 
          v-if="userStore.isPengurus" 
          class="menu-item pengurus-mode" 
          @click="switchToPengurusMode"
        >
          <div class="menu-icon">👨‍💼</div>
          <span class="menu-text">Beralih ke mode Pengurus</span>
          <div class="menu-arrow">></div>
        </div>

        <!-- ⭐ DEVELOPMENT TOOLS -->
        <div v-if="isDevelopment" class="debug-section">
          <p class="debug-title">🧪 Development Tools:</p>
          <div class="debug-buttons">
            <button @click="setRoleAdmin" class="debug-btn admin-btn">Admin</button>
            <button @click="setRolePengurus" class="debug-btn pengurus-btn">Pengurus</button>
            <button @click="setRoleJemaat" class="debug-btn jemaat-btn">Jemaat</button>
          </div>
          <button @click="userStore.debugUser()" class="debug-btn debug-btn-full">Debug User Info</button>
        </div>

        <!-- Regular Menu Items -->
        <div class="menu-item" @click="goToBookmarks">
          <div class="menu-icon">🔖</div>
          <span class="menu-text">Bookmark Renungan</span>
          <div class="menu-arrow">></div>
        </div>

        <div class="menu-item" @click="goToScheduleSettings">
          <div class="menu-icon">📅</div>
          <span class="menu-text">Jadwal Pelayan Altar</span>
          <div class="menu-arrow">></div>
        </div>

        <div class="menu-item" @click="goToPasswordChange">
          <div class="menu-icon">🔒</div>
          <span class="menu-text">Ganti password</span>
          <div class="menu-arrow">></div>
        </div>

        <div class="menu-item" @click="goToReportsHelp">
          <div class="menu-icon">📊</div>
          <span class="menu-text">Laporan dan Bantuan</span>
          <div class="menu-arrow">></div>
        </div>

        <!-- ⭐ DEVELOPMENT: Firebase Test -->
        <div v-if="isDevelopment" class="menu-item" @click="goToFirebaseTest">
          <div class="menu-icon">🔧</div>
          <span class="menu-text">Test Koneksi Firebase</span>
          <div class="menu-arrow">></div>
        </div>

        <div class="menu-item logout-item" @click="showLogoutConfirm = true">
          <div class="menu-icon">🚪</div>
          <span class="menu-text">Keluar</span>
          <div class="menu-arrow">></div>
        </div>
      </div>

      <!-- Bottom Navbar -->
      <BottomNavbar forceActiveRoute="/account" />
    </div>

    <!-- Logout Modal (same as before) -->
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
import BottomNavbar from '@/components/BottomNavbar.vue'
import { LogOut } from 'lucide-vue-next'

export default {
  name: 'AccountPage',
  components: {
    BottomNavbar,
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
    
    userName() {
      return this.userStore.namaUser
    },
    
    userInitial() {
      return this.userName.charAt(0).toUpperCase()
    },

    isDevelopment() {
      return process.env.NODE_ENV === 'development'
    }
  },
  created() {
    console.log('🔍 [AccountPage] User data on load:', this.userStore.getDebugInfo())
  },
  methods: {
    // ⭐ PENGURUS MODE
    switchToPengurusMode() {
      console.log('🚀 [AccountPage] Switching to pengurus mode...')
      
      if (!this.userStore.isPengurus) {
        alert('❌ Anda tidak memiliki akses sebagai pengurus!')
        return
      }
      
      this.$router.push('/pengurus/mode')
    },

    // ⭐ DEVELOPMENT TOOLS (Simplified)
    setRoleAdmin() {
      this.userStore.setAsAdmin()
      this.$forceUpdate() // Force UI update
      alert('✅ Role set to Admin!')
    },

    setRolePengurus() {
      this.userStore.setAsPengurus()
      this.$forceUpdate() // Force UI update  
      alert('✅ Role set to Pengurus!')
    },

    setRoleJemaat() {
      this.userStore.setAsJemaat()
      this.$forceUpdate() // Force UI update
      alert('✅ Role set to Jemaat!')
    },

    // ⭐ NAVIGATION
    goToBookmarks() {
      this.$router.push('/renungan/bookmarks')
    },
    
    goToScheduleSettings() {
      alert('📅 Fitur Jadwal Pelayan Altar akan tersedia setelah development selesai!')
    },
    
    goToPasswordChange() {
      alert('🔒 Fitur Ganti Password akan tersedia setelah development selesai!')
    },
    
    goToReportsHelp() {
      alert('📊 Fitur Laporan dan Bantuan akan tersedia setelah development selesai!')
    },

    goToFirebaseTest() {
      this.$router.push('/firebase-test')
    },

    // ⭐ LOGOUT
    cancelLogout() {
      this.showLogoutConfirm = false
      this.isLoggingOut = false
    },
    
    async confirmLogout() {
      if (this.isLoggingOut) return
      
      try {
        this.isLoggingOut = true
        this.userStore.logout()
        this.showLogoutConfirm = false
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
/* Same CSS as before, with additions for debug section */
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

.user-info-section {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #E8E8E8;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
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

/* ⭐ DEBUG INFO */
.debug-info {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #41442A;
  background: rgba(65, 68, 42, 0.1);
  padding: 6px 8px;
  border-radius: 4px;
  margin: 6px 0 0 0;
}

.debug-info p {
  margin: 2px 0;
}

/* ⭐ DEBUG SECTION */
.debug-section {
  background: #fff3cd;
  border: 1px dashed #ffc107;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.debug-title {
  font-family: 'Inter';
  font-size: 12px;
  font-weight: 600;
  color: #856404;
  margin: 0 0 8px 0;
}

.debug-buttons {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.debug-btn {
  flex: 1;
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  font-family: 'Inter';
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.debug-btn-full {
  width: 100%;
  background: #6c757d;
  color: white;
}

.admin-btn {
  background: #dc3545;
  color: white;
}

.pengurus-btn {
  background: #ffc107;
  color: #333;
}

.jemaat-btn {
  background: #28a745;
  color: white;
}

.debug-btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

/* Menu List */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #E8E8E8;
}

.menu-item:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.menu-item.pengurus-mode {
  background: #FFF9C4;
  border: 1px solid #FFE082;
}

.menu-item.pengurus-mode:hover {
  background: #FFF59D;
  box-shadow: 0 2px 12px rgba(255, 193, 7, 0.3);
}

.menu-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-family: 'Inter';
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.menu-arrow {
  font-size: 14px;
  color: #999;
  font-weight: bold;
}

.menu-item.logout-item:hover {
  background: #ffebee;
}

/* Modal styles (same as before) */
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

@media (max-width: 360px) {
  .account-wrapper {
    padding: 12px;
  }
  
  .user-info-section {
    padding: 12px;
  }
  
  .menu-item {
    padding: 12px;
  }
}
</style>