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
import { registerJemaat, checkJemaatExists } from '@/services/auth'
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
      statusOptions: ['Menikah', 'Single', 'Janda/Duda'],

      namaExists: false
    }
  },
  methods: {
    async checkNama() {
      if (!this.nama) return;
      
      try {
        const exists = await checkJemaatExists(this.nama);
        this.namaExists = exists;
        
        if (!exists) {
          this.errorMsg = "Nama anda belum terdaftar, segera hubungi gembala/admin";
        } else {
          this.errorMsg = "";
        }
      } catch (error) {
        console.error("Error checking nama:", error);
      }
    },
    async register() {
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
      
      if (!this.namaExists) {
        this.errorMsg = 'Nama anda belum terdaftar, segera hubungi gembala/admin';
        return;
      }

      try {
        // Data tambahan jemaat
        const userData = {
          tanggalLahir: this.tanggalLahir,
          status: this.status,
          sektor: this.sektor
        };
        
        // Register jemaat
        await registerJemaat(this.nama, this.password, userData);

      // Arahkan ke halaman sukses
      this.$router.push('/success-register')
      } catch (error) {
        // Tangani pesan error dari Firebase
        if (error.message.includes('Nama')) {
          this.namaError = error.message
        } else if (error.message.includes('Password')) {
          this.passwordError = error.message
        } else {
          this.errorMsg = error.message
        }
      }
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
