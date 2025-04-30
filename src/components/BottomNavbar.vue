<template>
  <nav class="bottom-navbar">
    <router-link to="/home" class="nav-item" exact aria-label="Beranda">
      <House class="icon" />
      <span>Home</span>
    </router-link>
    <router-link to="/jadwal" class="nav-item" aria-label="Kalender">
      <Calendar class="icon" />
      <span>Kalender</span>
    </router-link>
    <router-link to="/notifikasi" class="nav-item" aria-label="Notifikasi">
      <Bell class="icon" />
      <span>Notifikasi</span>
    </router-link>
    <router-link to="/account" class="nav-item" aria-label="Akun">
      <User class="icon" />
      <span>Profile</span>
    </router-link>
  </nav>
</template>

<script setup>
import { House, Calendar, Bell, User } from 'lucide-vue-next'
</script>

<style scoped>
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #fcfcf7;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999;
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
  color: #333;
  font-family: 'Inter';
  text-decoration: none;
  gap: 4px;
}

.icon {
  width: 20px;
  height: 20px;
  color: #333;
}

.router-link-exact-active {
  font-weight: bold;
  color: #41442A;
}
</style>
