<template>
  <div class="detail-container">
    <!-- Header dengan tombol kembali dan judul -->
    <header class="detail-header">
      <HeaderWithBack title="Detail Jadwal" />
    </header>

    <!-- Konten Detail Jadwal -->
    <main class="detail-content">
      <div class="detail-section">
        <span class="detail-label">Ibadah</span>
        <p class="detail-value">{{ schedule.event }}</p>
      </div>
      <div class="detail-section">
        <span class="detail-label">Pengkhotbah</span>
        <p class="detail-value">{{ schedule.preacher }}</p>
      </div>
      <div class="detail-section">
        <span class="detail-label">Worship Leader</span>
        <p class="detail-value">{{ schedule.worshipLeader }}</p>
      </div>
      <div class="detail-section">
        <span class="detail-label">Singers</span>
        <p class="detail-value">{{ formatArray(schedule.singers) }}</p>
      </div>
      <div class="detail-section">
        <span class="detail-label">Music</span>
        <p class="detail-value">{{ formatArray(schedule.musicTeam) }}</p>
      </div>
      <div class="detail-section">
        <span class="detail-label">Tambourine</span>
        <p class="detail-value">{{ formatArray(schedule.tambourine) }}</p>
      </div>
      <div class="detail-section">
        <span class="detail-label">Banners</span>
        <p class="detail-value">{{ formatArray(schedule.banners) }}</p>
      </div>
      <div class="detail-section">
        <span class="detail-label">Multimedia</span>
        <p class="detail-value">{{ schedule.multimedia }}</p>
      </div>
    </main>

    <!-- Bottom Navigation Bar (tetap ada di halaman detail) -->
    <BottomNavbar forceActiveRoute="/notifikasi" />
  </div>
</template>

<script>
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'; // Asumsi komponen ini sudah ada
import BottomNavbar from '@/components/BottomNavbar.vue'; // Asumsi komponen ini sudah ada

export default {
  name: 'DetailJadwal', // Nama komponen
  components: {
    HeaderWithBack,
    BottomNavbar,
  },
  props: {
    // Properti 'schedule' akan menerima objek jadwal dari halaman sebelumnya
    schedule: {
      type: Object,
      required: true,
      // Default value jika props tidak diberikan (untuk development/testing)
      default: () => ({
        id: null,
        status: '',
        event: 'Data ibadah tidak tersedia',
        type: '',
        preacher: 'N/A',
        worshipLeader: 'N/A',
        singers: ['N/A'],
        musicTeam: ['N/A'],
        tambourine: ['N/A'],
        banners: ['N/A'],
        multimedia: 'N/A',
      }),
    },
  },
  methods: {
    /**
     * Fungsi helper untuk memformat array menjadi string yang dipisahkan koma.
     * @param {Array} arr - Array yang akan diformat.
     * @returns {string} String hasil format.
     */
    formatArray(arr) {
      return Array.isArray(arr) && arr.length > 0 ? arr.join(', ') : 'N/A';
    },
  },
};
</script>

<style scoped>
/* Variabel CSS untuk warna (sesuai tema light yang sudah ada) */
:root {
  --light-bg-primary: #f0f2f5;
  --light-bg-card: #ffffff;
  --text-dark: #333333;
  --text-medium: #666666;
  --border-light: #e0e0e0;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--light-bg-primary);
}

.detail-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--light-bg-primary);
  padding-bottom: 70px; /* Space for bottom nav */
  box-sizing: border-box;
}

/* === Header === */
.detail-header {
  background-color: var(--light-bg-card);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  /* HeaderWithBack akan menyediakan padding dan layout internalnya */
}

/* === Detail Content === */
.detail-content {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Jarak antar bagian detail */
  background-color: var(--light-bg-card); /* Latar belakang putih untuk konten detail */
  margin: 20px; /* Margin di sekitar konten detail */
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.detail-section {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-medium); /* Warna teks label abu-abu */
  margin-bottom: 4px;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark); /* Warna teks nilai gelap */
  margin: 0;
}

/* === Responsive Adjustments === */
@media (max-width: 480px) {
  .detail-content {
    margin: 15px;
    padding: 15px;
    gap: 15px;
  }
  .detail-label {
    font-size: 13px;
  }
  .detail-value {
    font-size: 15px;
  }
}

@media (min-width: 768px) {
  .detail-container {
    max-width: 450px; /* Tetap sempit seperti aplikasi mobile */
    margin: 0 auto;
    border-left: 1px solid var(--border-light);
    border-right: 1px solid var(--border-light);
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  }
  .detail-content {
    margin: 20px; /* Tetap konsisten di desktop */
    padding: 25px;
    gap: 25px;
  }
  .detail-label {
    font-size: 15px;
  }
  .detail-value {
    font-size: 17px;
  }
}
</style>
