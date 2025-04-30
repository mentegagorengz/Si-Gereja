<template>
  <div class="register-container">
    <div class="form-wrapper">
      <!-- Header with Back Icon -->
      <div class="form-header">
        <div class="form-header-inner">
          <button class="back-button" @click="goBack" aria-label="Kembali">
            <ChevronLeft class="icon-back" />
          </button>
          <h2 class="register-title">Registrasi MyRajawali</h2>
        </div>
      </div>

      <!-- Nama -->
      <div class="form-group">
        <label for="name">Nama</label>
        <input
          id="name"
          v-model="nama"
          type="text"
          placeholder="Ketik nama Anda"
          :class="{ 'filled': nama !== '' }"
        />
      </div>

      <!-- Tanggal Lahir -->
      <div class="form-group">
        <label for="tanggalLahir">Tanggal lahir</label>
        <VueDatePicker
          v-model="tanggalLahir"
          :format="formatDate"
          input-class-name="date-input"
          placeholder="mm/dd/yyyy"
          :enable-time-picker="false"
          :teleport="false"
          :hide-input-icon="true"
        />
      </div>

      <!-- Status -->
      <div class="form-group">
        <label for="status">Status</label>
        <select
          id="status"
          v-model="status"
          required
        >
          <option disabled value="">Pilih salah satu</option>
          <option>Menikah</option>
          <option>Single</option>
          <option>Janda/Duda</option>
        </select>
      </div>

      <!-- Sektor -->
      <div class="form-group">
        <label>Sektor</label>
        <div class="radio-group">
          <label><input type="radio" value="Tesalonika" v-model="sektor" /> Sektor Tesalonika</label>
          <label><input type="radio" value="Anugerah" v-model="sektor" /> Sektor Anugerah</label>
        </div>
      </div>

      <!-- Password -->
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password"
          v-model="password"
          type="password"
          placeholder="Masukan kata sandi Anda"
          :class="{ 'filled': password !== '' }"
        />
      </div>

      <!-- Konfirmasi Password -->
      <div class="form-group">
        <label for="confirmPassword">Konfirmasi Password</label>
        <input 
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          placeholder="Konfirmasi kata sandi Anda"
          :class="{ 'filled': confirmPassword !== '' }"
        />
      </div>

      <!-- Warning -->
      <p v-if="errorMsg" class="warning-text">{{ errorMsg }}</p>

      <!-- Tombol Registrasi -->
      <button @click="register">Registrasi Akun</button>
    </div>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ChevronLeft } from 'lucide-vue-next'

export default {
  name: 'RegisterPage',
  components: {
    VueDatePicker,
    ChevronLeft
  },
  data() {
    return {
      nama: '',
      tanggalLahir: '',
      status: '',
      sektor: '',
      password: '',
      confirmPassword: '',
      errorMsg: ''
    }
  },
  methods: {
    register() {
      if (
        !this.nama ||
        !this.tanggalLahir ||
        !this.status ||
        !this.sektor ||
        !this.password ||
        !this.confirmPassword
      ) {
        this.errorMsg = 'Semua field wajib diisi.';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.errorMsg = 'Password dan konfirmasi password tidak sama.';
        return;
      }

      this.errorMsg = '';
      console.log('Register sukses:', this.nama, this.tanggalLahir, this.status, this.sektor);
      // Lanjutkan ke proses registrasi...
      this.$router.push('/success-register');
    },
    goBack() {
      this.$router.go(-1)
    },
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${mm}/${dd}/${yyyy}`
    }
  }
}
</script>

<style scoped>
.register-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 64px;
  min-height: 100vh;
  background-color: #fcfcf7;
  box-sizing: border-box;
}

.form-wrapper {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.form-header {
  width: 100%;
  max-width: 360px;
  margin-bottom: 18px;
}

.form-header-inner {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-button {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-back {
  width: 20px;
  height: 20px;
  display: block;
  color: #333;
}

.register-title {
  font-family: 'Inter';
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
}

.form-group {
  width: 100%;
  max-width: 360px;
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
  font-family: 'Inter';
  font-size: 14px;
}

.date-input {
  width: 100%;
  height: 44px;
  padding: 12px;
  font-size: 14px;
  font-family: 'Inter';
  border: 2px solid #41442A;
  border-radius: 6px;
  background-color: #fcfcf7;
  color: #777;
  box-sizing: border-box;
}

:deep(.date-input::placeholder) {
  font-family: 'Inter';
  font-size: 14px;
  color: #777;
}

input,
select,
textarea,
.date-input,
:deep(.dp__input) {
  width: 100%;
  height: 44px;
  padding: 12px;
  font-size: 14px;
  font-family: 'Inter' !important;
  border: 2px solid #41442A;
  border-radius: 6px;
  background-color: #fcfcf7;
  box-sizing: border-box;
  color: #777 !important;
}

:deep(.dp__input:not(:placeholder-shown)) {
  color: #333 !important;
}

:deep(input.filled) {
  color: #333 !important;
}

:deep(.dp__input::placeholder) {
  font-family: 'Inter' !important;
  font-size: 14px !important;
  color: #777 !important;
  opacity: 1;
}

:deep(.dp__input_icon) {
  display: none !important;
}

select {
  color: #777;
}

:deep(select:valid) {
  color: #333 !important;
}

input[readonly].empty-input,
select:invalid {
  color: #777;
}

input:not(:placeholder-shown) {
  color: #333;
}

.radio-group {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-left: 4px;
}

.radio-group label {
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter';
  font-size: 14px;
}

.radio-group input[type="radio"] {
  width: 20px;
  height: 20px;
  accent-color: #41442A;
}

.warning-text {
  font-size: 12px;
  color: red;
  margin-top: -10px;
  margin-bottom: 12px;
  font-family: 'Inter';
}

button {
  width: 100%;
  max-width: 360px;
  padding: 12px;
  background-color: #41442A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter';
  font-weight: bold;
  cursor: pointer;
  margin-top: auto;
}
</style>
