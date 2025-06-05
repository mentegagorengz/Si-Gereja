import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentJemaat } from '../services/auth';

// Import halaman-halaman
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import HomePage from '../views/HomePage.vue'
import SuccessRegister from '../views/SuccessRegister.vue'
import FirebaseTestPage from '../views/FirebaseTestPage.vue'
import JadwalPage from '../views/JadwalPage.vue'
import DetailJadwal from '../views/DetailJadwal.vue'
import NewsPage from '../views/NewsPage.vue'
import DetailNews from '../views/DetailNews.vue'
import RenunganPage from '../views/RenunganPage.vue'
import DetailRenungan from '../views/DetailRenungan.vue'
import BookmarksPage from '../views/BookmarksPage.vue'
// ⭐ TAMBAH: Import AccountPage
import AccountPage from '../views/AccountPage.vue'

const routes = [
  { 
    path: '/', 
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/success-register',
    name: 'SuccessRegister',
    component: SuccessRegister
  },
  {
    path: '/firebase-test',
    name: 'FirebaseTestPage',
    component: FirebaseTestPage
  },
  {
    path: '/jadwal',
    name: 'JadwalPage',
    component: JadwalPage
  },
  {
    path: '/jadwal/:id',
    name: 'DetailJadwal',
    component: DetailJadwal
  },
  {
    path: '/news',
    name: 'NewsPage',
    component: NewsPage
  },
  {
    path: '/news/:id',
    name: 'DetailNews',
    component: DetailNews
  },
  {
    path: '/renungan',
    name: 'RenunganPage',
    component: RenunganPage
  },
  {
    path: '/renungan/bookmarks',
    name: 'BookmarksPage',
    component: BookmarksPage
  },
  {
    path: '/renungan/:id',
    name: 'DetailRenungan',
    component: DetailRenungan
  },
  // ⭐ TAMBAH: Route untuk Account
  {
    path: '/account',
    name: 'AccountPage',
    component: AccountPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ⭐ PERBAIKAN: Update route guard dengan logout otomatis
router.beforeEach((to, from, next) => {
  console.log('🔍 [Router] Navigation:', from.path, '→', to.path)
  
  // Daftar route yang membutuhkan autentikasi
  const requiresAuth = ['/home', '/jadwal', '/renungan', '/account', '/news']
  const currentUser = getCurrentJemaat();
  
  // ⭐ PERBAIKAN: Jika ke login page, clear semua data dulu
  if (to.path === '/') {
    console.log('🔍 [Router] Going to login page, clearing user data...')
    
    // Import userStore dan clear data
    import('@/stores/userStore').then(({ useUserStore }) => {
      const userStore = useUserStore()
      userStore.clearUserData() // Clear memory tapi jangan hapus localStorage
      console.log('✅ [Router] User data cleared for fresh login')
    })
  }
  
  if (requiresAuth.some(route => to.path.startsWith(route)) && !currentUser) {
    console.log('❌ [Router] No authenticated user, redirecting to login')
    next('/');
  } else {
    console.log('✅ [Router] Navigation allowed')
    next();
  }
});

export default router