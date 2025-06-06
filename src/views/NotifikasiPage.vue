<!-- src/views/NotifikasiPage.vue -->
<template>
  <div class="notifikasi-container">
    <div class="notifikasi-wrapper">
      <!-- Header -->
      <div class="notifikasi-header">
        <h1 class="page-title">Notifikasi</h1>
      </div>

      <!-- Empty state (sementara) -->
      <div class="empty-container">
        <div class="empty-content">
          <Bell class="empty-icon" />
          <h3>Belum Ada Notifikasi</h3>
          <p>Saat ini tidak ada notifikasi baru untuk ditampilkan.</p>
        </div>
      </div>

      <!-- Bottom Navbar -->
      <BottomNavbar forceActiveRoute="/notifikasi" />
    </div>
  </div>
</template>

<script>
import BottomNavbar from '@/components/BottomNavbar.vue'
import { Bell } from 'lucide-vue-next'

export default {
  name: 'NotifikasiPage',
  components: {
    BottomNavbar,
    Bell
  }
}
</script>

<style scoped>
.notifikasi-container {
  background: #fcfcf7;
  min-height: 100vh;
  padding-bottom: 80px;
}

.notifikasi-wrapper {
  padding: 16px;
  max-width: 360px;
  margin: 0 auto;
}

/* Header */
.notifikasi-header {
  padding: 20px 0;
  text-align: center;
}

.page-title {
  font-family: 'Inter';
  font-size: 24px;
  font-weight: 600;
  color: #41442A;
  margin: 0;
}

/* Empty state */
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 32px 16px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  max-width: 280px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #ccc;
  margin-bottom: 8px;
}

.empty-content h3 {
  font-family: 'Inter';
  font-size: 18px;
  font-weight: 600;
  color: #41442A;
  margin: 0;
}

.empty-content p {
  font-family: 'Inter';
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}
</style>