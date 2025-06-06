import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentJemaat } from '../services/auth'

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
import AccountPage from '../views/AccountPage.vue'
import PengurusMode from '../views/PengurusMode.vue' // ⭐ TAMBAHAN BARU

const routes = [
  // Public routes (tidak perlu login)
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
    path: '/success-register',
    name: 'SuccessRegister',
    component: SuccessRegister
  },
  
  // Protected routes (perlu login)
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    name: 'AccountPage',
    component: AccountPage,
    meta: { requiresAuth: true }
  },
  
  // ⭐ TAMBAHAN BARU: Pengurus Mode
  {
    path: '/mode',
    name: 'PengurusMode',
    component: PengurusMode,
    meta: { requiresAuth: true, requiresPengurus: true }
  },
  
  // Jadwal routes
  {
    path: '/jadwal',
    name: 'JadwalPage',
    component: JadwalPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/jadwal/:id',
    name: 'DetailJadwal',
    component: DetailJadwal,
    meta: { requiresAuth: true }
  },
  
  // News routes
  {
    path: '/news',
    name: 'NewsPage',
    component: NewsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/news/:id',
    name: 'DetailNews',
    component: DetailNews,
    meta: { requiresAuth: true }
  },
  
  // Renungan routes
  {
    path: '/renungan',
    name: 'RenunganPage',
    component: RenunganPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/renungan/bookmarks',
    name: 'BookmarksPage',
    component: BookmarksPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/renungan/:id',
    name: 'DetailRenungan',
    component: DetailRenungan,
    meta: { requiresAuth: true }
  },
  
  // ⭐ TAMBAHAN BARU: Route Notifikasi (untuk mengatasi error)
  {
    path: '/notifikasi',
    name: 'NotifikasiPage',
    component: () => import('../views/NotifikasiPage.vue'), // Lazy loading
    meta: { requiresAuth: true }
  },
  
  // Development/Testing routes
  {
    path: '/firebase-test',
    name: 'FirebaseTestPage',
    component: FirebaseTestPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard untuk proteksi halaman
router.beforeEach(async (to, from, next) => {
  const currentUser = getCurrentJemaat()
  
  // Jika pergi ke login page, bersihkan data user di memory
  if (to.path === '/') {
    await clearUserDataFromMemory()
  }
  
  // Cek apakah route memerlukan autentikasi
  if (to.meta.requiresAuth && !currentUser) {
    next('/')
  } 
  // ⭐ TAMBAHAN BARU: Cek role pengurus
  else if (to.meta.requiresPengurus && !isPengurus(currentUser)) {
    // Redirect ke home jika bukan pengurus
    next('/home')
  } 
  else {
    next()
  }
})

// ⭐ TAMBAHAN BARU: Helper function untuk cek role pengurus
function isPengurus(user) {
  if (!user) return false
  
  // Cek apakah user memiliki role pengurus
  // Sesuaikan dengan struktur data user di aplikasi kamu
  return user.role === 'pengurus' || user.role === 'admin'
}

// Helper function untuk clear user data dari memory
async function clearUserDataFromMemory() {
  try {
    const { useUserStore } = await import('@/stores/userStore')
    const userStore = useUserStore()
    userStore.clearUserData()
  } catch (error) {
    console.error('Error clearing user data:', error)
  }
}

export default router