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
    
    // ⭐ TAMBAH: Method untuk set user dari localStorage
    setUser(userData) {
      console.log('✅ [UserStore] Setting user from localStorage:', userData.nama);
      this.user = userData;
      this.isLoggedIn = true;
    },
    
    // ⭐ PERBAIKI: Method untuk cek login status
    checkLoginStatus() {
      console.log('🔍 [UserStore] Checking login status...');
      
      const savedUser = getCurrentJemaat();
      if (savedUser) {
        console.log('✅ [UserStore] Found saved user:', savedUser.nama);
        this.user = savedUser;
        this.isLoggedIn = true;
        return true;
      } else {
        console.log('❌ [UserStore] No saved user found');
        this.user = null;
        this.isLoggedIn = false;
        return false;
      }
    }
  },
  
  getters: {
    namaUser: (state) => {
      // ⭐ PERBAIKI: Always return nama, dengan fallback
      const nama = state.user?.nama || 'Jemaat';
      console.log('🔍 [UserStore] namaUser getter:', nama);
      return nama;
    },
    sektorUser: (state) => state.user?.sektor || '',
    statusUser: (state) => state.user?.status || '',
  }
});