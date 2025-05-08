// src/stores/streakStore.js
import { defineStore } from 'pinia'

export const useStreakStore = defineStore('streak', {
  state: () => {
    return {
      streakData: JSON.parse(localStorage.getItem('streakData')) || {
        lastLoginDate: '',
        streakCount: 0
      }
    }
  },
  
  getters: {
    currentStreak: (state) => state.streakData.streakCount || 0
  },
  
  actions: {
    checkStreak() {
      const today = new Date().toDateString()
      
      if (this.streakData.lastLoginDate === today) {
        // Sudah login hari ini
        return this.streakData.streakCount
      }
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (this.streakData.lastLoginDate === yesterdayStr) {
        // Login berturut-turut
        this.streakData.streakCount++
      } else {
        // Lewat sehari, reset streak
        this.streakData.streakCount = 1
      }
      
      // Update localStorage
      this.streakData.lastLoginDate = today
      localStorage.setItem('streakData', JSON.stringify(this.streakData))
      
      return this.streakData.streakCount
    }
  }
})