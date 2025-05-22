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

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Tambahkan route guard
router.beforeEach((to, from, next) => {
  // Daftar route yang membutuhkan autentikasi
  const requiresAuth = ['/home'];
  const currentUser = getCurrentJemaat();
  
  if (requiresAuth.includes(to.path) && !currentUser) {
    next('/');
  }
  else {
    next();
  }
});

export default router