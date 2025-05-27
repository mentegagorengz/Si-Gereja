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
    path: '/renungan/:id',
    name: 'DetailRenungan',
    component: DetailRenungan
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Tambahkan route guard
router.beforeEach((to, from, next) => {
  // Daftar route yang membutuhkan autentikasi
  const requiresAuth = ['/home', '/jadwal'];
  const currentUser = getCurrentJemaat();
  
  if (requiresAuth.includes(to.path) && !currentUser) {
    next('/');
  }
  else {
    next();
  }
});

export default router