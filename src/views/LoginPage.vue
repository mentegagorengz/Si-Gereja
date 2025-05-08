<template>
    <div class="login-container">
            <!-- Logo -->
            <img src="@/assets/logo-MyRajawali.png" alt="Logo" class="logo-img"/>

            <!-- Teks Welcome -->
            <h2 class="welcome-text">Welcome to MyRajawali</h2>

            <!-- Input Nama -->
            <FormInput
             id="name"
             label="Nama"
             placeholder="Ketik nama Anda"
             v-model="nama"
             :error="errorNama"
            />

            <!-- Input Password -->
            <PasswordInput
              id="password"
              label="Password"
              placeholder="Masukan password Anda"
              v-model="password"
              :error="errorPassword"
            />

            <!-- Link Buat Akun -->
            <p class="signup-text">
                Belum punya akun?
                <router-link to="/register">Buat sekarang!</router-link>
            </p>

            <!-- Tombol Login -->
            <ButtonPrimary @click="login">Masuk</ButtonPrimary>
        </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import { useStreakStore } from '@/stores/streakStore'
import FormInput from '@/components/common/FormInput.vue'
import PasswordInput from '@/components/common/PasswordInput.vue'
import ButtonPrimary from '@/components/common/ButtonPrimary.vue'

export default {
  name: 'LoginPage',
  components: {
    FormInput,
    PasswordInput,
    ButtonPrimary
  },
  data() {
    return {
      nama: '',
      password: '',
      errorNama: '',
      errorPassword: ''
    }
  },
  methods: {
    login() {
      // Reset error
      this.errorNama = ''
      this.errorPassword = ''

      // Validasi input kosong
      if (!this.nama) {
        this.errorNama = 'Nama harus diisi'
        return
      }

      if (!this.password) {
        this.errorPassword = 'Password harus diisi'
        return
      }

      // Gunakan userStore untuk login
      const userStore = useUserStore()
      const result = userStore.login(this.nama, this.password)

      if (!result.success) {
        if (result.message.includes('Nama')) {
          this.errorNama = result.message
        } else {
          this.errorPassword = result.message
        }
        return
      }
      
      // Jika login berhasil, periksa streak
      const streakStore = useStreakStore()
      streakStore.checkStreak()

      // Jika valid
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 64px;
  min-height: 100vh;
  background-color: #fcfcf7;
  box-sizing: border-box;
}

.logo-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-top: 60px;
  margin-bottom: 15px;
}

.welcome-text {
  width: 300px;
  height: 27px;
  padding: 4px 8px;
  text-align: center;
  font-family: 'Inter';
  font-size: 20px;
  font-weight: 600;
}

.signup-text {
    font-size: 14px;
    margin-top: 32px; /* dari password */
    margin-bottom: 63px; /* ke tombol */
    text-align: center;
  }

.signup-text a {
  font-weight: bold;
  color: black;
  text-decoration: underline;
}
</style>