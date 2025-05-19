import { defineStore } from 'pinia';
import { loginJemaat, logoutJemaat, getCurrentJemaat } from '@/services/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    async login(nama, password) {
      const userData = await loginJemaat(nama, password);
      this.user = userData;
      this.isLoggedIn = true;
      
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    },
    
    logout() {
      logoutJemaat();
      this.user = null;
      this.isLoggedIn = false;
    },
    
    checkLoginStatus() {
      const savedUser = getCurrentJemaat();
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