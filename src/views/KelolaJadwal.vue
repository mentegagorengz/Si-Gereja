<template>
  <div class="schedule-container">
    <!-- Header -->
    <header class="schedule-header">    
        <HeaderWithBack title="Kelola Jadwal" />
    </header>

    <!-- Schedule List -->
    <main class="schedule-list">
      <div
        v-for="schedule in schedules"
        :key="schedule.id"
        :class="['schedule-item', schedule.type]"
        @click="goToScheduleDetail(schedule)" Tambahkan event click di sini
      >
        <div class="status-indicator"></div>
        <div class="schedule-details">
          <span class="schedule-status">{{ schedule.status }}</span>
          <p class="schedule-event">{{ schedule.event }}</p>
        </div>
      </div>
    </main>

    <!-- Floating Action Button -->
    <button class="fab-button" @click="handleFabClick">
      <Plus class="fab-icon" />
    </button>

    <!-- Bottom Navigation Bar -->
    <BottomNavbar forceActiveRoute="/notifikasi" />
  </div>
</template>

<script>
// Mengimpor ikon yang dibutuhkan dari Lucide Vue Next
import { Plus } from 'lucide-vue-next';
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue';
import BottomNavbar from '@/components/BottomNavbar.vue'

export default {
  name: 'KelolaJadwal', // Nama komponen Vue

  components: {
    BottomNavbar,
    HeaderWithBack,
    // Mendaftarkan semua ikon Lucide sebagai komponen
    Plus,
  },

  data() {
    return {
      // Mock data untuk daftar jadwal
      schedules: [
        {
          id: 1,
          status: 'Menunggu Persetujuan',
          event: 'Ibadah Raya 13 Juli 2025',
          type: 'pending', // Untuk styling warna
        },
        {
          id: 2,
          status: 'Telah disetujui',
          event: 'Ibadah Raya 06 Juli 2025',
          type: 'approved', // Untuk styling warna
        },
        {
          id: 3,
          status: 'Terpublish',
          event: 'Ibadah PELPRAP 07 November 2024',
          type: 'published', // Untuk styling warna
        },
        {
          id: 4,
          status: 'Terpublish',
          event: 'Ibadah PELWAP 02 November 2024',
          type: 'published', // Untuk styling warna
        },
      ],
    };
  },

  methods: {
    /**
     * Handle klik pada Floating Action Button (FAB).
     * Menampilkan alert sebagai simulasi aksi.
     */
    handleFabClick() {
      // Navigasi ke halaman TambahJadwal
      this.$router.push({ name: 'TambahJadwal' });
    },

    /**
     * Navigasi ke detail jadwal saat item diklik.
     * @param {Object} schedule - Data jadwal yang diklik.
     */
    goToScheduleDetail(schedule) {
      this.$router.push({
        name: 'DetailJadwaltest',
        params: {
          id: schedule.id,
          schedule: schedule
        }
      });
    },
  },
};
</script>

<style scoped>
/* Variabel CSS untuk warna */
:root {
  --light-bg-primary: #f0f2f5;
  --light-bg-card: #ffffff;
  --text-dark: #333333;
  --text-medium: #666666;
  --border-light: #e0e0e0;

  /* Warna status indikator (sesuai permintaan baru) */
  --status-pending-indicator: #DED5B7; /* Warna baru untuk Menunggu Persetujuan */
  --status-approved-indicator: #BBCFBA; /* Warna baru untuk Telah disetujui */
  --status-published-indicator: #C0CBDC; /* Warna baru untuk Terpublish */

  /* Warna teks status (tetap gelap agar mudah dibaca, sesuai gambar) */
  --status-text-color: #333333; /* Warna default gelap untuk teks status */
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--light-bg-primary);
}

.schedule-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* background-color: var(--light-bg-primary); */
  padding-bottom: 70px; /* Space for bottom nav */
  box-sizing: border-box;
}

/* === Header === */
.schedule-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--light-bg-card);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* === Schedule List === */
.schedule-list {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.schedule-item {
  display: flex;
  align-items: center;
  background-color: var(--light-bg-card);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Status item colors */
.schedule-item.pending {
  background-color: #FFF9C4;   /* Kuning muda */
}
.schedule-item.approved {
  background-color: #E8F5E9;   /* Hijau muda */
}
.schedule-item.published {
  background-color: #E3F2FD;   /* Biru muda */
}

.schedule-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.status-indicator {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  flex-shrink: 0;
  margin-right: 15px;
}

/* Specific status colors for indicator */
.schedule-item.pending .status-indicator {
  background-color: var(--status-pending-indicator);
}
.schedule-item.approved .status-indicator {
  background-color: var(--status-approved-indicator);
}
.schedule-item.published .status-indicator {
  background-color: var(--status-published-indicator);
}

.schedule-details {
  flex-grow: 1;
}

.schedule-status {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  display: block; /* Make it a block to separate from event */
  color: var(--status-text-color); /* Menggunakan warna teks default gelap */
}

.schedule-event {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

/* === Floating Action Button === */
.fab-button {
  position: fixed;
  bottom: 90px; /* Above the bottom nav */
  right: 20px;
  background-color: #4285F4; /* Google Blue */
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
  z-index: 200;
}

.fab-button:hover {
  transform: translateY(-3px);
  background-color: #357ae8;
}

.fab-icon {
  width: 28px;
  height: 28px;
}

/* === Bottom Navigation Bar === */
/* Catatan: BottomNavbar adalah komponen terpisah, jadi styling untuk nav-item, nav-icon, nav-label
   mungkin ada di dalam komponen BottomNavbar.vue itu sendiri.
   Saya akan hapus styling bottom-nav, nav-item, nav-icon, nav-label dari sini karena sudah di handle BottomNavbar.vue
*/
.bottom-nav {
  /* Ini adalah styling dasar jika BottomNavbar tidak memiliki styling internal */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--light-bg-card);
  border-top: 1px solid var(--border-light);
  padding: 10px 0;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
  z-index: 150;
}

/* === Responsive Adjustments === */
@media (max-width: 480px) {
  .schedule-header {
    padding: 10px 15px;
  }
  /* header-title dan back-button styling dihapus karena dihandle HeaderWithBack */
  .schedule-list {
    padding: 15px;
    gap: 10px;
  }
  .schedule-item {
    padding: 12px;
  }
  .schedule-status {
    font-size: 13px;
  }
  .schedule-event {
    font-size: 15px;
  }
  .fab-button {
    width: 50px;
    height: 50px;
    bottom: 80px;
    right: 15px;
  }
  .fab-icon {
    width: 24px;
    height: 24px;
  }
  /* bottom-nav styling dihapus karena dihandle BottomNavbar */
}

/* Desktop adjustments (if needed, though this design is mobile-first) */
@media (min-width: 768px) {
  .schedule-container {
    max-width: 450px; /* Keep it narrow like a mobile app */
    margin: 0 auto;
    border-left: 1px solid var(--border-light);
    border-right: 1px solid var(--border-light);
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  }
  .schedule-header {
    border-radius: 0; /* No border-radius for header on desktop */
  }
  .fab-button {
    right: calc(50% - 450px/2 + 20px); /* Adjust FAB position for centered container */
  }
}
</style>
