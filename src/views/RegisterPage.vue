<template>
  <div class="register-container">
    <div class="form-wrapper">
      <!-- Header with Back Icon -->
      <HeaderWithBack title="Registrasi MyRajawali" />

      <!-- Nama -->
      <FormInput
        id="register-name"
        label="Nama"
        placeholder="Ketik nama lengkap Anda"
        v-model="nama"
        :error="namaError"
      />

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
      <SelectDropdown
        id="status"
        label="Status"
        placeholder="Pilih salah satu"
        :options="statusOptions"
        v-model="status"
        :error="statusError"
      />

      <!-- Sektor -->
      <div class="form-group">
        <label>Sektor</label>
        <div class="radio-group">
          <label><input type="radio" value="Tesalonika" v-model="sektor" /> Sektor Tesalonika</label>
          <label><input type="radio" value="Anugerah" v-model="sektor" /> Sektor Anugerah</label>
        </div>
      </div>

      <!-- Password -->
      <PasswordInput
        id="password"
        label="Password"
        placeholder="Masukan kata sandi Anda"
        v-model="password"
        :error="passwordError"
      />

      <!-- Konfirmasi Password -->
      <PasswordInput
        id="confirmPassword"
        label="Konfirmasi Password"
        placeholder="Konfirmasi kata sandi Anda"
        v-model="confirmPassword"
        :error="confirmPasswordError"
      />

      <!-- Warning -->
      <p v-if="errorMsg" class="warning-text">{{ errorMsg }}</p>

      <!-- Tombol Registrasi -->
      <ButtonPrimary @click="register">Registrasi Akun</ButtonPrimary>
    </div>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import FormInput from '@/components/common/FormInput.vue'
import PasswordInput from '@/components/common/PasswordInput.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import SelectDropdown from '@/components/common/SelectDropdown.vue'
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'

export default {
  name: 'RegisterPage',
  components: {
    VueDatePicker,
    FormInput,
    PasswordInput,
    ButtonPrimary,
    SelectDropdown,
    HeaderWithBack
  },
  data() {
    return {
      // Data fields
      nama: '',
      tanggalLahir: '',
      status: '',
      sektor: '',
      password: '',
      confirmPassword: '',
      
      // Error messages
      namaError: '',
      passwordError: '',
      confirmPasswordError: '',
      errorMsg: '',

      // Options untuk dropdown
      statusOptions: ['Menikah', 'Single', 'Janda/Duda']
    }
  },
  methods: {
    register() {
      // Reset semua error
      this.namaError = ''
      this.passwordError = ''
      this.confirmPasswordError = ''
      this.errorMsg = ''

      // Validasi semua field
      let isValid = true

      if (!this.nama) {
        this.namaError = 'Nama wajib diisi'
        isValid = false
      }
      
      if (!this.tanggalLahir) {
        this.errorMsg = 'Semua field wajib diisi.'
        isValid = false
      }

      if (!this.status) {
        this.errorMsg = 'Semua field wajib diisi.'
        isValid = false
      }

      if (!this.sektor) {
        this.errorMsg = 'Semua field wajib diisi.'
        isValid = false
      }
      
      if (!this.password) {
        this.passwordError = 'Password wajib diisi'
        isValid = false
      }

      if (!this.confirmPassword) {
        this.confirmPasswordError = 'Konfirmasi password wajib diisi'
        isValid = false
      }
      
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Password dan konfirmasi password tidak sama'
        isValid = false
      }

      if (!isValid) return

      // Jika valid, simpan data ke localStorage
      const userData = {
        nama: this.nama,
        tanggalLahir: this.tanggalLahir,
        status: this.status,
        sektor: this.sektor,
        password: this.password
      }
      localStorage.setItem("user", JSON.stringify(userData))

      // Arahkan ke halaman sukses
      this.$router.push('/success-register')
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
</style>
