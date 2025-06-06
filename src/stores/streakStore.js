import { defineStore } from 'pinia'

export const useStreakStore = defineStore('streak', {
  state: () => ({
    streakData: {},
    migrationCompleted: false
  }),
  
  getters: {
    /**
     * Get current streak count for a user
     * @param {string} userId - User ID
     * @returns {number} Current streak count
     */
    currentStreak: (state) => (userId) => {
      if (!userId) return 0
      return state.streakData[userId]?.streakCount || 0
    },

    /**
     * Get last login date for a user
     * @param {string} userId - User ID  
     * @returns {string|null} Last login date or null
     */
    lastLoginDate: (state) => (userId) => {
      if (!userId) return null
      return state.streakData[userId]?.lastLoginDate || null
    }
  },
  
  actions: {
    /**
     * Migrate old streak data format to new user-specific format
     * This handles backward compatibility for existing users
     */
    migrateOldStreakData() {
      // Check if migration already completed
      const migrationFlag = localStorage.getItem('streakMigrationCompleted')
      if (migrationFlag === 'true') {
        this.migrationCompleted = true
        return
      }
      
      // Check for old streak data
      const oldStreakData = localStorage.getItem('streakData')
      
      if (oldStreakData) {
        try {
          const parsedOldData = JSON.parse(oldStreakData)
          
          // Check for current user to migrate data
          const currentUserData = localStorage.getItem('user')
          
          if (currentUserData) {
            const userData = JSON.parse(currentUserData)
            const userId = userData.id || userData.nama
            
            if (userId) {
              const newStreakKey = `streakData_${userId}`
              const existingNewData = localStorage.getItem(newStreakKey)
              
              if (!existingNewData) {
                // Migrate old data to new format
                localStorage.setItem(newStreakKey, JSON.stringify(parsedOldData))
              }
            }
          } else {
            // Save as backup if no current user
            localStorage.setItem('streakData_backup', oldStreakData)
          }
          
          // Optional: Remove old data (uncomment if needed)
          // localStorage.removeItem('streakData')
          
        } catch (error) {
          console.error('Error during streak data migration:', error)
        }
      }
      
      // Mark migration as completed
      localStorage.setItem('streakMigrationCompleted', 'true')
      this.migrationCompleted = true
    },
    
    /**
     * Load streak data for a specific user
     * @param {string} userId - User ID
     */
    loadUserStreak(userId) {
      if (!userId) return
      
      // Run migration if not completed
      if (!this.migrationCompleted) {
        this.migrateOldStreakData()
      }
      
      // Load user-specific streak data
      const userStreakKey = `streakData_${userId}`
      const savedStreak = localStorage.getItem(userStreakKey)
      
      if (savedStreak) {
        try {
          this.streakData[userId] = JSON.parse(savedStreak)
        } catch (error) {
          console.error('Error parsing streak data:', error)
          this.streakData[userId] = this.getDefaultStreakData()
        }
      } else {
        this.streakData[userId] = this.getDefaultStreakData()
      }
    },
    
    /**
     * Check and update streak for a user
     * @param {string} userId - User ID
     * @returns {number} Updated streak count
     */
    checkStreak(userId) {
      if (!userId) {
        console.error('No userId provided for checkStreak')
        return 0
      }
      
      // Ensure user data is loaded
      if (!this.streakData[userId]) {
        this.loadUserStreak(userId)
      }
      
      const today = new Date().toDateString()
      const userStreak = this.streakData[userId]
      
      // Same day login - no change
      if (userStreak.lastLoginDate === today) {
        return userStreak.streakCount
      }
      
      // Check if consecutive day
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (userStreak.lastLoginDate === yesterdayStr) {
        // Consecutive day - increment streak
        userStreak.streakCount++
      } else {
        // Gap detected - reset to 1
        userStreak.streakCount = 1
      }
      
      userStreak.lastLoginDate = today
      userStreak.updatedAt = new Date().toISOString()
      
      // Save to localStorage
      this.saveUserStreak(userId)
      
      return userStreak.streakCount
    },
    
    /**
     * Save user streak data to localStorage
     * @param {string} userId - User ID
     */
    saveUserStreak(userId) {
      if (!userId || !this.streakData[userId]) return
      
      const userStreakKey = `streakData_${userId}`
      localStorage.setItem(userStreakKey, JSON.stringify(this.streakData[userId]))
    },
    
    /**
     * Clear streak data for a specific user from memory
     * @param {string} userId - User ID
     */
    clearUserStreak(userId) {
      if (!userId) return
      
      if (this.streakData[userId]) {
        delete this.streakData[userId]
      }
    },
    
    /**
     * Clear all streak data from memory
     */
    clearAllStreaks() {
      this.streakData = {}
    },

    /**
     * Get default streak data structure
     * @returns {Object} Default streak data
     */
    getDefaultStreakData() {
      return {
        lastLoginDate: '',
        streakCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    },

    /**
     * Manual data recovery - force migration again
     * Use this if streak data seems corrupted
     */
    forceDataRecovery() {
      localStorage.removeItem('streakMigrationCompleted')
      this.migrationCompleted = false
      this.migrateOldStreakData()
    }
  }
})