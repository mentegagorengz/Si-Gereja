import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem('user')) || {
        nama: 'Jemaat',
      }
    }
  },
  
  getters: {
    namaUser: (state) => state.user.nama || 'Jemaat',
    isLoggedIn: (state) => !!state.user.nama && state.user.nama !== 'Jemaat'
  },
  
  actions: {
    login(nama, password) {
      const savedUser = JSON.parse(localStorage.getItem('user'))
      
      if (!savedUser) {
        return { success: false, message: 'Akun belum terdaftar' }
      }
      
      if (nama.trim().toLowerCase() !== savedUser.nama.trim().toLowerCase()) {
        return { success: false, message: 'Nama tidak ditemukan' }
      }
      
      if (password !== savedUser.password) {
        return { success: false, message: 'Password tidak sesuai' }
      }
      
      this.user = savedUser
      return { success: true }
    },
    
    registerUser(userData) {
      this.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
    },

    logout() {
      this.user = { nama: 'Jemaat' }
    }
  }
})