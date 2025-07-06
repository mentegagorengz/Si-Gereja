<template>
  <div class="tambah-jadwal-container">
    <!-- Header dengan tombol kembali dan judul -->
    <header class="tambah-jadwal-header">
      <HeaderWithBack title="Jadwal Baru" />
    </header>

    <!-- Form untuk mengisi detail jadwal -->
    <main class="form-content">
      <form @submit.prevent="handleSubmit">
        <!-- Field Ibadah -->
        <div class="form-group">
          <label for="ibadah">Ibadah</label>
          <div class="input-with-icon">
            <input
              type="text"
              id="ibadah"
              v-model="form.ibadah"
              placeholder="Pilih jadwal ibadah"
              required
            />
            <span class="input-suffix"></span> <!-- Placeholder untuk ikon dropdown -->
          </div>
        </div>

        <!-- Field Pengkhotbah -->
        <div class="form-group">
          <label for="pengkhotbah">Pengkhotbah</label>
          <input
            type="text"
            id="pengkhotbah"
            v-model="form.pengkhotbah"
            placeholder="Masukkan nama"
            required
          />
        </div>

        <!-- Field Worship Leader -->
        <div class="form-group">
          <label for="worshipLeader">Worship Leader</label>
          <input
            type="text"
            id="worshipLeader"
            v-model="form.worshipLeader"
            placeholder="Masukkan nama"
            required
          />
        </div>

        <!-- Field Singers -->
        <div class="form-group">
          <label for="singers">Singers</label>
          <input
            type="text"
            id="singers"
            v-model="form.singers"
            placeholder="Masukkan nama"
            required
          />
        </div>

        <!-- Field Music -->
        <div class="form-group">
          <label for="music">Music</label>
          <input
            type="text"
            id="music"
            v-model="form.music"
            placeholder="Masukkan nama"
            required
          />
        </div>

        <!-- Field Tambourine -->
        <div class="form-group">
          <label for="tambourine">Tambourine</label>
          <input
            type="text"
            id="tambourine"
            v-model="form.tambourine"
            placeholder="Masukkan nama"
            required
          />
        </div>

        <!-- Field Banners -->
        <div class="form-group">
          <label for="banners">Banners</label>
          <input
            type="text"
            id="banners"
            v-model="form.banners"
            placeholder="Masukkan nama"
            required
          />
        </div>

        <!-- Field Multimedia -->
        <div class="form-group">
          <label for="multimedia">Multimedia</label>
          <input
            type="text"
            id="multimedia"
            v-model="form.multimedia"
            placeholder="Masukkan nama"
            required
          />
        </div>

        <!-- Tombol Kirim -->
        <button type="submit" class="submit-button">Kirim</button>
      </form>
    </main>

    <!-- Bottom Navigation Bar (tetap ada) -->
    <BottomNavbar forceActiveRoute="/notifikasi" />
  </div>
</template>

<script>
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue';
import BottomNavbar from '@/components/BottomNavbar.vue';

export default {
  name: 'TambahJadwal',
  components: {
    HeaderWithBack,
    BottomNavbar,
  },
  data() {
    return {
      // Data form untuk setiap input field
      form: {
        ibadah: '',
        pengkhotbah: '',
        worshipLeader: '',
        singers: '',
        music: '',
        tambourine: '',
        banners: '',
        multimedia: '',
      },
    };
  },
  methods: {
    /**
     * Menangani submit form.
     * Dalam preview ini, data akan ditampilkan di alert dan kemudian kembali ke halaman sebelumnya.
     * Di aplikasi nyata, data ini akan dikirim ke API/database.
     */
    handleSubmit() {
      // Simulasi pengiriman data
      const newScheduleData = {
        id: Date.now(), // ID unik sederhana
        status: 'Menunggu Persetujuan', // Status default untuk jadwal baru
        event: this.form.ibadah,
        type: 'pending',
        preacher: this.form.pengkhotbah,
        worshipLeader: this.form.worshipLeader,
        singers: this.form.singers.split(',').map(s => s.trim()), // Pisahkan dengan koma
        musicTeam: this.form.music.split(',').map(s => s.trim()),
        tambourine: this.form.tambourine.split(',').map(s => s.trim()),
        banners: this.form.banners.split(',').map(s => s.trim()),
        multimedia: this.form.multimedia,
      };

      alert('Jadwal baru berhasil ditambahkan (simulasi):\n' + JSON.stringify(newScheduleData, null, 2));

      // Setelah data disubmit (simulasi), kembali ke halaman Kelola Jadwal
      this.$router.back(); 
      // Atau bisa juga: this.$router.push({ name: 'KelolaJadwal' });
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
  --input-border: #cccccc;
  --button-primary: #4285F4; /* Google Blue */
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--light-bg-primary);
}

.tambah-jadwal-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--light-bg-primary);
  padding-bottom: 70px; /* Space for bottom nav */
  box-sizing: border-box;
}

/* === Header === */
.tambah-jadwal-header {
  background-color: var(--light-bg-card);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* === Form Content === */
.form-content {
  flex-grow: 1;
  padding: 20px;
  background-color: var(--light-bg-primary); /* Latar belakang halaman form */
}

.form-content form {
  background-color: var(--light-bg-card); /* Latar belakang form putih */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 15px; /* Jarak antar form-group */
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.form-group input {
  padding: 12px;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  font-size: 16px;
  color: var(--text-dark);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input::placeholder {
  color: var(--text-medium);
}

.form-group input:focus {
  border-color: var(--button-primary);
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon input {
  flex-grow: 1;
  padding-right: 40px; /* Ruang untuk ikon */
}

.input-suffix {
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
  background-color: #e0e0e0; /* Placeholder untuk kotak ikon */
  border-radius: 4px;
}

.submit-button {
  padding: 14px;
  background-color: var(--button-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  margin-top: 20px; /* Jarak dari form fields */
}

.submit-button:hover {
  background-color: #357ae8;
  transform: translateY(-1px);
}

.submit-button:active {
  transform: translateY(0);
}

/* === Responsive Adjustments === */
@media (max-width: 480px) {
  .form-content {
    padding: 15px;
  }
  .form-content form {
    padding: 15px;
    gap: 10px;
  }
  .form-group label {
    font-size: 13px;
  }
  .form-group input {
    padding: 10px;
    font-size: 14px;
  }
  .submit-button {
    padding: 12px;
    font-size: 15px;
  }
}

@media (min-width: 768px) {
  .tambah-jadwal-container {
    max-width: 450px; /* Tetap sempit seperti aplikasi mobile */
    margin: 0 auto;
    border-left: 1px solid var(--border-light);
    border-right: 1px solid var(--border-light);
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  }
  .tambah-jadwal-header {
    border-radius: 0;
  }
  .form-content form {
    padding: 30px;
    gap: 20px;
  }
  .form-group label {
    font-size: 15px;
  }
  .form-group input {
    padding: 14px;
    font-size: 16px;
  }
  .submit-button {
    padding: 16px;
    font-size: 17px;
  }
}
</style>
