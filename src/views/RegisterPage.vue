<template>
  <div class="register-container">
    <div class="form-wrapper">
      <!-- Header with Back Icon -->
      <HeaderWithBack title="Registrasi MyRajawali" />

      <!-- AutoCompleteInput -->
      <AutoCompleteInput
        id="register-name"
        label="Nama"
        placeholder="Ketik nama lengkap Anda"
        v-model="nama"
        :error="namaError"
        @suggestion-selected="onSuggestionSelected"
        @nama-validated="onNamaValidated"
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

      <!-- Error message -->
      <p v-if="errorMsg" class="warning-text">{{ errorMsg }}</p>

      <!-- Submit button -->
      <ButtonPrimary 
        @click="register"
        :disabled="!canSubmit"
        :class="{ 'disabled': !canSubmit }"
      >
        {{ submitButtonText }}
      </ButtonPrimary>
    </div>
  </div>
</template>

<script>
import { registerJemaat } from '@/services/auth'
import { useUserStore } from '@/stores/userStore' // ⭐ TAMBAH: Import userStore
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import AutoCompleteInput from '@/components/common/AutoCompleteInput.vue'
import PasswordInput from '@/components/common/PasswordInput.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
import SelectDropdown from '@/components/common/SelectDropdown.vue'
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'

export default {
  name: 'RegisterPage',
  components: {
    VueDatePicker,
    AutoCompleteInput,
    PasswordInput,
    ButtonPrimary,
    SelectDropdown,
    HeaderWithBack
  },
  data() {
    return {
      nama: '',
      tanggalLahir: '',
      status: '',
      sektor: '',
      password: '',
      confirmPassword: '',
      
      namaError: '',
      statusError: '',
      passwordError: '',
      confirmPasswordError: '',
      errorMsg: '',

      statusOptions: ['Menikah', 'Single', 'Janda/Duda'],

      selectedUserData: null,
      namaExists: false,
      isSubmitting: false
    }
  },
  
  computed: {
    canSubmit() {
      return (
        this.nama.trim().length > 0 &&
        this.namaExists &&
        this.tanggalLahir &&
        this.status &&
        this.sektor &&
        this.password.length >= 6 &&
        this.confirmPassword.length >= 6 &&
        this.password === this.confirmPassword &&
        !this.isSubmitting
      )
    },
    
    submitButtonText() {
      if (this.isSubmitting) return 'Mendaftarkan...'
      if (!this.canSubmit) return 'Lengkapi Data'
      return 'Registrasi Akun'
    }
  },

  methods: {
    onSuggestionSelected(suggestion) {
      console.log('✅ [RegisterPage] Suggestion selected:', suggestion);
      
      this.selectedUserData = suggestion;
      this.nama = suggestion.nama;
      
      // Auto-fill sektor jika ada
      if (suggestion.sektor) {
        this.sektor = suggestion.sektor;
      }
      
      // Clear errors jika nama valid
      this.namaError = '';
      this.errorMsg = '';
    },
    
    onNamaValidated(validation) {
      console.log('🔍 [RegisterPage] Nama validation:', validation);
      
      this.namaExists = validation.exists;
      
      if (validation.exists) {
        this.selectedUserData = validation.userData;
        this.namaError = '';
        this.errorMsg = '';
        
        // Check jika sudah registrasi
        if (validation.userData.isRegistered) {
          this.namaError = 'Nama ini sudah terdaftar. Silakan langsung login.';
        }
      } else {
        this.selectedUserData = null;
        this.namaError = 'Nama anda belum terdaftar, segera hubungi gembala/admin';
      }
    },

    // ⭐ FIXED: Registration dengan proper user save
    async register() {
      try {
        this.isSubmitting = true;
        this.clearAllErrors();
        
        // Validasi basic
        if (!this.validateAllFields()) {
          return;
        }
        
        // Check nama exists
        if (!this.namaExists || !this.selectedUserData) {
          this.errorMsg = 'Silakan pilih nama dari suggestion yang tersedia';
          return;
        }
        
        // Check sudah registrasi
        if (this.selectedUserData.isRegistered) {
          this.namaError = 'Nama ini sudah terdaftar. Silakan langsung login.';
          return;
        }
        
        console.log('✅ [RegisterPage] Starting registration...');
        
        const userData = {
          tanggalLahir: this.tanggalLahir,
          status: this.status,
          sektor: this.sektor
        };
        
        // ⭐ STEP 1: Register user di Firebase
        await registerJemaat(this.nama, this.password, userData);
        console.log('🎉 [RegisterPage] Registration successful in Firebase!');
        
        // ⭐ STEP 2: Prepare complete user data
        const completeUserData = {
          id: this.selectedUserData.id,
          nama: this.nama,
          tanggalLahir: this.tanggalLahir,
          status: this.status,
          sektor: this.sektor,
          isRegistered: true,
          registeredAt: new Date().toISOString()
        };
        
        // ⭐ STEP 3: Save to localStorage
        localStorage.setItem('user', JSON.stringify(completeUserData));
        console.log('✅ [RegisterPage] User data saved to localStorage:', completeUserData);
        
        // ⭐ STEP 4: Update userStore
        const userStore = useUserStore();
        userStore.setUser(completeUserData);
        console.log('✅ [RegisterPage] UserStore updated');
        
        // ⭐ STEP 5: Initialize streak for new user
        this.initializeNewUserStreak();
        
        // ⭐ STEP 6: Redirect
        console.log('🚀 [RegisterPage] Redirecting to success page...');
        this.$router.push('/success-register');
        
      } catch (error) {
        console.error('❌ [RegisterPage] Registration failed:', error);
        this.handleRegistrationError(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    
    // ⭐ NEW: Initialize streak untuk user baru
    initializeNewUserStreak() {
      console.log('🔥 [RegisterPage] Initializing streak for new user...');
      
      const today = new Date().toDateString();
      const newStreakData = {
        lastLoginDate: today,
        streakCount: 1 // Start dengan streak 1 untuk user baru
      };
      
      localStorage.setItem('streakData', JSON.stringify(newStreakData));
      console.log('✅ [RegisterPage] New user streak initialized:', newStreakData);
    },
    
    handleRegistrationError(error) {
      if (error.message.includes('Nama') || error.message.includes('belum terdaftar')) {
        this.namaError = error.message;
      } else if (error.message.includes('Password')) {
        this.passwordError = error.message;
      } else if (error.message.includes('sudah terdaftar')) {
        this.namaError = error.message;
      } else {
        this.errorMsg = error.message || 'Terjadi kesalahan saat registrasi. Coba lagi.';
      }
    },

    validateAllFields() {
      let isValid = true;
      
      if (!this.nama || this.nama.trim().length === 0) {
        this.namaError = 'Nama harus diisi';
        isValid = false;
      }
      
      if (!this.tanggalLahir) {
        this.errorMsg = 'Tanggal lahir harus diisi';
        isValid = false;
      }
      
      if (!this.status) {
        this.statusError = 'Status harus dipilih';
        isValid = false;
      }
      
      if (!this.sektor) {
        this.errorMsg = 'Sektor harus dipilih';
        isValid = false;
      }
      
      if (!this.password || this.password.length < 6) {
        this.passwordError = 'Password minimal 6 karakter';
        isValid = false;
      }
      
      if (!this.confirmPassword) {
        this.confirmPasswordError = 'Konfirmasi password harus diisi';
        isValid = false;
      }
      
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Password dan konfirmasi password tidak sama';
        isValid = false;
      }
      
      if (!isValid) {
        this.errorMsg = 'Semua field wajib diisi dengan benar.';
      }
      
      return isValid;
    },

    clearAllErrors() {
      this.namaError = '';
      this.statusError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
      this.errorMsg = '';
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

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.warning-text {
  font-size: 12px;
  color: red;
  margin-top: -10px;
  margin-bottom: 12px;
  font-family: 'Inter';
  text-align: center;
  padding: 8px;
  background-color: #ffebee;
  border-radius: 4px;
  border-left: 4px solid #d32f2f;
}

/* Responsive */
@media (max-width: 360px) {
  .register-container {
    padding: 16px 12px 64px;
  }
  
  .warning-text {
    font-size: 11px;
    padding: 6px;
  }
}
</style>