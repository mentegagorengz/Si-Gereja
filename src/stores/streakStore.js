// 🔧 PERBAIKAN: Update streakStore.js dengan Migrasi Data Lama
// src/stores/streakStore.js

import { defineStore } from 'pinia'

export const useStreakStore = defineStore('streak', {
  state: () => {
    return {
      streakData: {},
      migrationCompleted: false // ⭐ TAMBAH: Flag untuk tracking migrasi
    }
  },
  
  getters: {
    currentStreak: (state) => (userId) => {
      if (!userId) return 0
      return state.streakData[userId]?.streakCount || 0
    }
  },
  
  actions: {
    // ⭐ TAMBAHAN: Migrasi data lama ke format baru
    migrateOldStreakData() {
      console.log('🔄 [StreakStore] === STARTING MIGRATION ===')
      
      // Cek apakah sudah pernah migrasi
      const migrationFlag = localStorage.getItem('streakMigrationCompleted')
      if (migrationFlag === 'true') {
        console.log('✅ [StreakStore] Migration already completed, skipping')
        return
      }
      
      // Cek data lama dengan key "streakData"
      const oldStreakData = localStorage.getItem('streakData')
      
      if (oldStreakData) {
        try {
          const parsedOldData = JSON.parse(oldStreakData)
          console.log('🔍 [StreakStore] Found old streak data:', parsedOldData)
          
          // Cek apakah ada user yang sedang login
          const currentUserData = localStorage.getItem('user')
          
          if (currentUserData) {
            const userData = JSON.parse(currentUserData)
            const userId = userData.id || userData.nama
            
            if (userId) {
              console.log('🔄 [StreakStore] Migrating data for user:', userId)
              
              // Migrate data lama ke format baru
              const newStreakKey = `streakData_${userId}`
              
              // Cek apakah data baru sudah ada
              const existingNewData = localStorage.getItem(newStreakKey)
              
              if (!existingNewData) {
                // Simpan data lama ke format baru
                localStorage.setItem(newStreakKey, JSON.stringify(parsedOldData))
                console.log('✅ [StreakStore] Migrated old data to new key:', newStreakKey)
                console.log('📊 [StreakStore] Migrated streak count:', parsedOldData.streakCount)
              } else {
                console.log('ℹ️ [StreakStore] New format data already exists, keeping it')
              }
            }
          } else {
            console.log('⚠️ [StreakStore] No current user found for migration')
            
            // Jika tidak ada user login, simpan data untuk kemungkinan user
            // Ini untuk kasus dimana ada data streak tapi tidak tahu milik siapa
            console.log('💡 [StreakStore] Saving old data for potential recovery')
            localStorage.setItem('streakData_backup', oldStreakData)
          }
          
          // ⭐ OPSIONAL: Hapus data lama (uncomment jika mau hapus)
          // localStorage.removeItem('streakData')
          // console.log('🗑️ [StreakStore] Removed old streak data')
          
        } catch (error) {
          console.error('❌ [StreakStore] Error during migration:', error)
        }
      } else {
        console.log('ℹ️ [StreakStore] No old streak data found to migrate')
      }
      
      // Set flag bahwa migrasi sudah selesai
      localStorage.setItem('streakMigrationCompleted', 'true')
      this.migrationCompleted = true
      
      console.log('✅ [StreakStore] === MIGRATION COMPLETED ===')
    },
    
    // ⭐ PERBAIKAN: Load user streak dengan migrasi otomatis
    loadUserStreak(userId) {
      if (!userId) return
      
      console.log('🔍 [StreakStore] Loading streak for user:', userId)
      
      // ⭐ JALANKAN MIGRASI DULU (jika belum)
      if (!this.migrationCompleted) {
        this.migrateOldStreakData()
      }
      
      // Load dari localStorage dengan key yang spesifik per user
      const userStreakKey = `streakData_${userId}`
      const savedStreak = localStorage.getItem(userStreakKey)
      
      if (savedStreak) {
        try {
          this.streakData[userId] = JSON.parse(savedStreak)
          console.log('✅ [StreakStore] Loaded streak:', this.streakData[userId])
        } catch (error) {
          console.error('❌ [StreakStore] Error parsing streak data:', error)
          this.streakData[userId] = { lastLoginDate: '', streakCount: 0 }
        }
      } else {
        console.log('ℹ️ [StreakStore] No saved streak, creating new')
        this.streakData[userId] = { lastLoginDate: '', streakCount: 0 }
      }
    },
    
    // ⭐ FUNCTION YANG SUDAH ADA: Check streak untuk user tertentu
    checkStreak(userId) {
      if (!userId) {
        console.error('❌ [StreakStore] No userId provided for checkStreak')
        return 0
      }
      
      console.log('🔍 [StreakStore] Checking streak for user:', userId)
      
      // Pastikan data user sudah di-load
      if (!this.streakData[userId]) {
        this.loadUserStreak(userId)
      }
      
      const today = new Date().toDateString()
      const userStreak = this.streakData[userId]
      
      if (userStreak.lastLoginDate === today) {
        console.log('✅ [StreakStore] Same day login, keeping streak:', userStreak.streakCount)
        return userStreak.streakCount
      }
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (userStreak.lastLoginDate === yesterdayStr) {
        // Consecutive day - increment streak
        userStreak.streakCount++
        console.log('🔥 [StreakStore] Consecutive day! New streak:', userStreak.streakCount)
      } else {
        // Not consecutive - reset to 1
        userStreak.streakCount = 1
        console.log('🆕 [StreakStore] Non-consecutive day, reset to 1')
      }
      
      userStreak.lastLoginDate = today
      
      // Save ke localStorage dengan key yang spesifik
      const userStreakKey = `streakData_${userId}`
      localStorage.setItem(userStreakKey, JSON.stringify(userStreak))
      
      console.log('💾 [StreakStore] Saved streak to localStorage with key:', userStreakKey)
      
      return userStreak.streakCount
    },
    
    clearUserStreak(userId) {
      if (!userId) return
      
      console.log('🧹 [StreakStore] Clearing streak data for user:', userId)
      
      if (this.streakData[userId]) {
        delete this.streakData[userId]
      }
    },
    
    clearAllStreaks() {
      console.log('🧹 [StreakStore] Clearing all streak data from memory')
      this.streakData = {}
    },
    
    // ⭐ TAMBAHAN: Function untuk manual recovery jika diperlukan
    manualDataRecovery() {
      console.log('🔧 [StreakStore] === MANUAL DATA RECOVERY ===')
      
      // Reset migration flag untuk memaksa migrasi ulang
      localStorage.removeItem('streakMigrationCompleted')
      this.migrationCompleted = false
      
      // Jalankan migrasi lagi
      this.migrateOldStreakData()
      
      console.log('✅ [StreakStore] Manual recovery completed')
    },
    
    // ⭐ TAMBAHAN: Debug function untuk lihat semua data
    debugAllStreakData() {
      console.log('🧪 [StreakStore] === DEBUG ALL STREAK DATA ===')
      
      // Cek data lama
      const oldData = localStorage.getItem('streakData')
      console.log('📄 Old format data (streakData):', oldData)
      
      // Cek backup data
      const backupData = localStorage.getItem('streakData_backup')
      console.log('📄 Backup data (streakData_backup):', backupData)
      
      // Cek semua data format baru
      console.log('📄 New format data:')
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('streakData_') && key !== 'streakData_backup') {
          const value = localStorage.getItem(key)
          console.log(`   - ${key}:`, value)
        }
      }
      
      // Cek data di memory
      console.log('🧠 Memory data:', this.streakData)
      
      console.log('🧪 === DEBUG COMPLETED ===')
    }
  }
})