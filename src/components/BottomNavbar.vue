<template>
  <nav class="bottom-navbar">
    <router-link to="/home" class="nav-item" exact aria-label="Beranda">
      <House :class="['icon', route.path === '/home' ? 'icon-active' : '']" />
      <span :class="{ 'text-active': route.path === '/home' }">Home</span>
    </router-link>
    <router-link to="/jadwal" class="nav-item" aria-label="Kalender">
      <Calendar :class="['icon', route.path === '/jadwal' ? 'icon-active' : '']" />
      <span :class="{ 'text-active': route.path === '/jadwal' }">Kalender</span>
    </router-link>
    <router-link to="/notifikasi" class="nav-item" aria-label="Notifikasi">
      <Bell :class="['icon', route.path === '/notifikasi' ? 'icon-active' : '']" />
      <span :class="{ 'text-active': route.path === '/notifikasi' }">Notifikasi</span>
    </router-link>
    <router-link to="/account" class="nav-item" aria-label="Akun">
      <User :class="['icon', route.path === '/account' ? 'icon-active' : '']" />
      <span :class="{ 'text-active': route.path === '/account' }">Profile</span>
    </router-link>
  </nav>
</template>

<script setup>
import { House, Calendar, Bell, User } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #fcfcf7;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 25%;
  height: 64px;
  text-align: center;
  font-size: 12px;
  color: #777;
  font-family: 'Inter';
  text-decoration: none;
  gap: 4px;
  transition: all 0.3s ease;
}

.icon {
  width: 20px;
  height: 20px;
  color: #777;
  transition: all 0.3s ease;
}

.icon-active {
  color: #41442A;
  transform: scale(1.2);
}

.text-active {
  color: #41442A;
  font-weight: bold;
}
</style>