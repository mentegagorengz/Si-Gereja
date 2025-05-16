import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentJemaat } from '../services/auth';

// Import halaman-halaman
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import HomePage from '../views/HomePage.vue'
import SuccessRegister from '../views/SuccessRegister.vue'
import FirebaseTestPage from '../views/FirebaseTestPage.vue'

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
  }
]

// Tambahkan route guard
router.beforeEach((to, from, next) => {
  // Daftar route yang membutuhkan autentikasi
  const requiresAuth = ['/home'];
  
  // Daftar route untuk user yang sudah login
  const redirectIfLoggedIn = ['/', '/register', '/success-register'];
  
  // Cek apakah user sudah login
  const currentUser = getCurrentJemaat();
  
  // Jika route membutuhkan autentikasi dan user belum login
  if (requiresAuth.includes(to.path) && !currentUser) {
    next('/');
  } 
  // Jika user sudah login dan mencoba mengakses halaman login/register
  else if (currentUser && redirectIfLoggedIn.includes(to.path)) {
    next('/home');
  } 
  // Selain itu, lanjutkan saja
  else {
    next();
  }
});

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router