import { defineStore } from 'pinia'
import { loginJemaat, logoutJemaat, getCurrentJemaat } from '@/services/auth'
import { useStreakStore } from './streakStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    userRole: 'jemaat'
  }),
  
  getters: {
    /**
     * Get user name, with fallback to default
     * @returns {string} User name or default 'Jemaat'
     */
    namaUser: (state) => {
      return state.user?.nama || 'Jemaat'
    },
    
    /**
     * Get consistent user ID (id or nama as fallback)
     * @returns {string|null} User ID or null
     */
    userId: (state) => {
      return state.user?.id || state.user?.nama || null
    },
    
    /**
     * Get user sector
     * @returns {string} User sector or empty string
     */
    sektorUser: (state) => state.user?.sektor || '',
    
    /**
     * Get user status
     * @returns {string} User status or empty string
     */
    statusUser: (state) => state.user?.status || '',

    /**
     * Check if user is admin
     * @returns {boolean} True if user is admin
     */
    isAdmin: (state) => {
      return state.userRole === 'admin' || state.user?.role === 'admin'
    },

    /**
     * Check if user is pengurus
     * @returns {boolean} True if user is pengurus or admin
     */
    isPengurus: (state) => {
      const role = state.userRole || state.user?.role
      return role === 'pengurus' || role === 'admin'
    },

    /**
     * Check if user is jemaat (basic role)
     * @returns {boolean} True if user is jemaat
     */
    isJemaat: (state) => {
      const role = state.userRole || state.user?.role || 'jemaat'
      return ['jemaat', 'pengurus', 'admin'].includes(role)
    },

    /**
     * Get user role display name
     * @returns {string} Human readable role name
     */
    roleDisplayName: (state) => {
      const role = state.userRole || state.user?.role || 'jemaat'
      const roleMap = {
        'admin': 'Administrator',
        'pengurus': 'Pengurus',
        'jemaat': 'Jemaat'
      }
      return roleMap[role] || 'Jemaat'
    },

    /**
     * Get current user role
     * @returns {string} Current role
     */
    currentRole: (state) => {
      return state.userRole || state.user?.role || 'jemaat'
    }
  },
  
  actions: {
    /**
     * Login user with credentials
     * @param {string} nama - User name
     * @param {string} password - User password
     * @returns {Promise<Object>} User data
     */
    async login(nama, password) {
      try {
        // Clear any existing data first
        this.clearUserData()

        // Authenticate user
        const userData = await loginJemaat(nama, password)
        
        // Set user data
        this.user = userData
        this.isLoggedIn = true
        
        this.userRole = userData.role || 'jemaat'
        console.log('✅ [UserStore] User role set to:', this.userRole)

        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Initialize user-specific data
        this.initializeUserData(userData.id || userData.nama)
        
        return userData
      } catch (error) {
        console.error('Login failed:', error)
        
        // Clear data if login failed
        this.clearUserData()
        throw error
      }
    },
    
    /**
     * Logout current user
     */
    logout() {
      // Clear user-specific data
      if (this.user) {
        this.clearUserSpecificData(this.user.id || this.user.nama)
      }
      
      // Call auth logout
      logoutJemaat()
      
      // Clear store data
      this.clearUserData()
    },
    
    /**
     * Set user data from existing data (e.g., from localStorage)
     * @param {Object} userData - User data object
     * @returns {boolean} Success status
     */
    setUser(userData) {
      if (!this.validateUserData(userData)) {
        console.error('Invalid user data provided')
        this.clearUserData()
        return false
      }
      
      this.user = userData
      this.isLoggedIn = true

      this.userRole = userData.role || 'jemaat'
      console.log('✅ [UserStore] User role set to:', this.userRole)
      
      // Initialize user-specific data
      this.initializeUserData(userData.id || userData.nama)
      
      return true
    },
    
    /**
     * Check and restore login status from localStorage
     * @returns {boolean} Login status
     */
    checkLoginStatus() {
      try {
        const savedUser = getCurrentJemaat()
        
        if (savedUser && savedUser.nama) {
          // Validate saved user data
          if (this.validateUserData(savedUser)) {
            this.setUser(savedUser)
            return true
          } else {
            // Clear invalid data
            this.clearUserData()
            localStorage.removeItem('user')
            return false
          }
        } else {
          this.clearUserData()
          return false
        }
      } catch (error) {
        console.error('Error checking login status:', error)
        this.clearUserData()
        localStorage.removeItem('user')
        return false
      }
    },
    
    // 👈 TAMBAHAN BARU - Role Management Actions:
    /**
     * Set user role
     * @param {string} role - New role for user
     */
    setUserRole(role) {
      const validRoles = ['jemaat', 'pengurus', 'admin']
      
      if (!validRoles.includes(role)) {
        console.error('Invalid role:', role)
        return false
      }
      
      console.log(`🔄 [UserStore] Setting user role from ${this.userRole} to ${role}`)
      
      this.userRole = role
      
      // Update user object if exists
      if (this.user) {
        this.user.role = role
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(this.user))
      }
      
      console.log('✅ [UserStore] Role updated successfully')
      return true
    },

    /**
     * Switch user role (for development/testing)
     * @param {string} newRole - New role to switch to
     */
    switchRole(newRole) {
      console.log(`🔄 [UserStore] === ROLE SWITCHING ===`)
      console.log(`👤 User: ${this.namaUser}`)
      console.log(`🔄 Switching from: ${this.userRole} → ${newRole}`)
      
      const success = this.setUserRole(newRole)
      
      if (success) {
        console.log(`✅ [UserStore] Role switch successful!`)
        console.log(`🎯 New role: ${this.userRole}`)
        console.log(`🔍 Permissions:`, {
          isAdmin: this.isAdmin,
          isPengurus: this.isPengurus,
          isJemaat: this.isJemaat
        })
      } else {
        console.error(`❌ [UserStore] Role switch failed!`)
      }
      
      return success
    },

    /**
     * Reset role to default based on user data
     */
    resetRole() {
      const defaultRole = this.user?.role || 'jemaat'
      console.log(`🔄 [UserStore] Resetting role to default: ${defaultRole}`)
      this.setUserRole(defaultRole)
    },

    /**
     * Initialize user-specific data
     * @param {string} userId - User ID
     */
    initializeUserData(userId) {
      if (!userId) return
      
      // Initialize streak data for this user
      const streakStore = useStreakStore()
      streakStore.loadUserStreak(userId)
      
      // Future: Initialize other user-specific data
      // Example: bookmarks, preferences, etc.
    },
    
    /**
     * Clear user-specific data from memory (preserve localStorage)
     * @param {string} userId - User ID
     */
    clearUserSpecificData(userId) {
      if (!userId) return
      
      // Clear streak data from memory (keep localStorage)
      const streakStore = useStreakStore()
      streakStore.clearUserStreak(userId)
      
      // Future: Clear other user-specific data
    },
    
    /**
     * Clear all user data from memory
     */
    clearUserData() {
      this.user = null
      this.isLoggedIn = false
      this.userRole = 'jemaat'
      
      // Clear all store data from memory
      const streakStore = useStreakStore()
      streakStore.clearAllStreaks()
      
      // Note: localStorage is preserved for session restore
    },
    
    /**
     * Clear user data for new login attempt (used by router)
     */
    clearUserDataForNewLogin() {
      // Clear memory state
      this.user = null
      this.isLoggedIn = false
      
      // Clear streak data from memory
      const streakStore = useStreakStore()
      streakStore.clearAllStreaks()
      
      // localStorage is preserved for session restore
    },
    
    /**
     * Validate user data structure
     * @param {Object} userData - User data to validate
     * @returns {boolean} Validation result
     */
    validateUserData(userData) {
      if (!userData || typeof userData !== 'object') {
        return false
      }
      
      const requiredFields = ['nama', 'sektor']
      
      for (const field of requiredFields) {
        if (!userData[field]) {
          console.warn(`Missing required field: ${field}`)
          return false
        }
      }
      
      return true
    }
  }
})