// src/stores/userStore.js - VERSI LENGKAP DENGAN IMPORT YANG BENAR

import { defineStore } from 'pinia';
import { loginJemaat, logoutJemaat, getCurrentJemaat } from '@/services/auth';
// ⭐ TAMBAH: Import useStreakStore yang hilang
import { useStreakStore } from './streakStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    async login(nama, password) {
      try {
        console.log('🔍 [UserStore] === LOGIN PROCESS START ===');
        console.log('🔍 [UserStore] Attempting login for:', nama);

        // ⭐ STEP 1: Clear any existing data first
        this.clearUserData();

        // ⭐ STEP 2: Authenticate user
        const userData = await loginJemaat(nama, password);
        console.log('✅ [UserStore] Authentication successful:', userData.nama);
        
        // ⭐ STEP 3: Set user data
        this.user = userData;
        this.isLoggedIn = true;
        
        // ⭐ STEP 4: Save to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('💾 [UserStore] User data saved to localStorage');
        
        // ⭐ STEP 5: Initialize user-specific data
        this.initializeUserData(userData.id || userData.nama);
        
        console.log('✅ [UserStore] === LOGIN PROCESS COMPLETE ===');
        return userData;
      } catch (error) {
        console.error('❌ [UserStore] Login failed:', error);
        
        // ⭐ PENTING: Clear data jika login gagal
        this.clearUserData();
        throw error;
      }
    },
    
    // ⭐ PERBAIKAN: Proper logout dengan clear semua data
    logout() {
      console.log('🔍 [UserStore] === LOGOUT PROCESS START ===');
      console.log('🔍 [UserStore] Logging out user:', this.user?.nama);
      
      // ⭐ STEP 1: Clear user-specific data
      if (this.user) {
        this.clearUserSpecificData(this.user.id || this.user.nama);
      }
      
      // ⭐ STEP 2: Call auth logout
      logoutJemaat();
      
      // ⭐ STEP 3: Clear store data
      this.clearUserData();
      
      console.log('✅ [UserStore] === LOGOUT PROCESS COMPLETE ===');
    },
    
    // ⭐ TAMBAHAN: Initialize data yang spesifik untuk user
    initializeUserData(userId) {
      console.log('🔧 [UserStore] Initializing user-specific data for:', userId);
      
      // Initialize streak data for this user
      const streakStore = useStreakStore();
      streakStore.loadUserStreak(userId);
      
      // Bisa tambah inisialisasi data lain di sini
      // Contoh: bookmarks, preferences, dll
    },
    
    // ⭐ TAMBAHAN: Clear data spesifik user (saat logout/switch user)
    clearUserSpecificData(userId) {
      console.log('🧹 [UserStore] Clearing user-specific data for:', userId);
      
      // Clear streak data dari memory (tapi biarkan di localStorage)
      const streakStore = useStreakStore();
      streakStore.clearUserStreak(userId);
      
      // Clear data lain yang spesifik user
      // JANGAN hapus localStorage yang penting seperti bookmarks
    },
    
    // ⭐ TAMBAHAN: Clear semua data user
    clearUserData() {
      console.log('🧹 [UserStore] Clearing all user data from memory');
      
      this.user = null;
      this.isLoggedIn = false;
      
      // Clear semua store data dari memory
      const streakStore = useStreakStore();
      streakStore.clearAllStreaks();
      
      // TIDAK hapus localStorage - biar bisa restore session
    },
    
    // ⭐ PERBAIKAN: Method untuk set user dari localStorage dengan validasi
    setUser(userData) {
      if (!userData || !userData.nama) {
        console.error('❌ [UserStore] Invalid user data provided to setUser');
        this.clearUserData();
        return false;
      }
      
      console.log('✅ [UserStore] Setting user from saved data:', userData.nama);
      this.user = userData;
      this.isLoggedIn = true;
      
      // Initialize user-specific data
      this.initializeUserData(userData.id || userData.nama);
      
      return true;
    },
    
    // ⭐ PERBAIKAN: Check login status dengan proper validation
    checkLoginStatus() {
      console.log('🔍 [UserStore] === CHECKING LOGIN STATUS ===');
      
      try {
        const savedUser = getCurrentJemaat();
        
        if (savedUser && savedUser.nama) {
          console.log('✅ [UserStore] Found valid saved user:', savedUser.nama);
          
          // Validate saved user data
          const isValidUser = this.validateUserData(savedUser);
          
          if (isValidUser) {
            this.setUser(savedUser);
            console.log('✅ [UserStore] User session restored successfully');
            return true;
          } else {
            console.log('❌ [UserStore] Saved user data is invalid, clearing...');
            this.clearUserData();
            localStorage.removeItem('user'); // Clear corrupted data
            return false;
          }
        } else {
          console.log('ℹ️ [UserStore] No saved user found');
          this.clearUserData();
          return false;
        }
      } catch (error) {
        console.error('❌ [UserStore] Error checking login status:', error);
        this.clearUserData();
        localStorage.removeItem('user'); // Clear corrupted data
        return false;
      }
    },
    
    // ⭐ TAMBAHAN: Validate user data
    validateUserData(userData) {
      const requiredFields = ['nama', 'sektor'];
      
      for (const field of requiredFields) {
        if (!userData[field]) {
          console.warn(`❌ [UserStore] Missing required field: ${field}`);
          return false;
        }
      }
      
      return true;
    },
    
    // ⭐ TAMBAHAN: Method untuk clear data tanpa logout (untuk router)
    clearUserDataForNewLogin() {
      console.log('🧹 [UserStore] Clearing user data for new login attempt');
      
      // Clear memory state
      this.user = null;
      this.isLoggedIn = false;
      
      // Clear streak data dari memory
      const streakStore = useStreakStore();
      streakStore.clearAllStreaks();
      
      // JANGAN hapus localStorage - biar bisa restore session kalau user yang sama login lagi
      console.log('✅ [UserStore] Memory cleared, localStorage preserved for session restore');
    }
  },
  
  getters: {
    namaUser: (state) => {
      const nama = state.user?.nama || 'Jemaat';
      console.log('🔍 [UserStore] namaUser getter returning:', nama);
      return nama;
    },
    
    // ⭐ TAMBAHAN: Getter untuk user ID yang konsisten
    userId: (state) => {
      return state.user?.id || state.user?.nama || null;
    },
    
    sektorUser: (state) => state.user?.sektor || '',
    statusUser: (state) => state.user?.status || '',
  }
});