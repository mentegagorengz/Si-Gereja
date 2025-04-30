import { createRouter, createWebHistory } from 'vue-router'

// Import halaman-halaman
import LoginPage from '../views/Login.vue'
import RegisterPage from '../views/Register.vue'
import HomePage from '../views/Home.vue'
import SuccessRegister from '../views/SuccessRegister.vue'

const routes = [
  { 
    path: '/', 
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
