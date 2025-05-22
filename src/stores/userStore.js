import { defineStore } from 'pinia';
import { loginJemaat, logoutJemaat, getCurrentJemaat } from '@/services/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),
  
  actions: {
    async login(nama, password) {
      try {
        console.log('🔍 [UserStore] login called with:', { 
          nama: nama, 
          namaType: typeof nama,
          password: password ? '[HIDDEN]' : 'undefined',
          passwordType: typeof password
        });

         // Validasi parameter
        if (!nama || !password) {
          throw new Error('Nama dan password harus diisi');
        }
        
        const userData = await loginJemaat(nama, password);
        
        console.log('✅ [UserStore] Login successful, userData:', userData);
        
        this.user = userData;
        this.isLoggedIn = true;
        
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } catch (error) {
        console.error('❌ [UserStore] login error:', error);
        throw error;
      }
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