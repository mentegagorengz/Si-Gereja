import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    login(userData) {
      this.user = userData;
      this.isLoggedIn = true;
      
      // Simpan juga di localStorage untuk persistence
      localStorage.setItem('user', JSON.stringify(userData));
    },
    
    logout() {
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem('user');
    },
    
    // Check if user is logged in when app starts
    checkLoginStatus() {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) {
        this.user = savedUser;
        this.isLoggedIn = true;
      }
    }
  },
  
  getters: {
    namaUser: (state) => state.user?.nama || 'Jemaat',
    sektorUser: (state) => state.user?.sektor || '',
    statusUser: (state) => state.user?.status || '',
  }
});