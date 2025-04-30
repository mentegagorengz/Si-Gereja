<template>
    <div class="login-container">
            <!-- Logo -->
            <img src="@/assets/logo-MyRajawali.png" alt="Logo" class="logo-img"/>

            <!-- Teks Welcome -->
            <h2 class="welcome-text">Welcome to MyRajawali</h2>

            <!-- Input Nama -->
            <div class="form-group">
              <label for="name">Nama</label>
              <input 
                id="name"
                v-model="nama"
                type="text"
                placeholder="Ketik nama Anda"
              />
              <p v-if="errorNama" class="error-text">{{ errorNama }}</p>
            </div>
          
            <!-- Input Password -->
            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-box">
                <input
                  :type="lihatPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Masukan password Anda"
                />
                
                <!-- Icon Eye -->
                <Eye v-if="!lihatPassword" @click="togglePassword" class="icon-eye" />
                <EyeOff v-else @click="togglePassword" class="icon-eye" />
              </div>
              <p v-if="errorPassword" class="error-text">{{ errorPassword }}</p>
            </div>
                      

            <!-- Link Buat Akun -->
            <p class="signup-text">
                Belum punya akun?
                <router-link to="/register">Buat sekarang!</router-link>
            </p>

            <!-- Tombol Login -->
            <button @click="login">Masuk</button>
        </div>
</template>

<script>
import { Eye, EyeOff } from 'lucide-vue-next'

export default {
  name: 'LoginPage',
  components: {
    Eye,
    EyeOff
  },
  data() {
    return {
      nama: '',
      password: '',
      lihatPassword: false,
      errorNama: '',
      errorPassword: ''
    }
  },
  methods: {
    togglePassword() {
      this.lihatPassword = !this.lihatPassword
    },
    login() {
      // Reset error
      this.errorNama = ''
      this.errorPassword = ''

      // Dummy data
      const dummyUser = {
        nama: 'christy potabuga',
        password: 'christy123' 
      }

      // Validasi input kosong
      if (!this.nama) {
        this.errorNama = 'Nama harus diisi'
        return
      }

      if (!this.password) {
        this.errorPassword = 'Password harus diisi'
        return
      }

      // Validasi nama
      if (this.nama.toLowerCase !== dummyUser.nama.toLowerCase) {
        this.errorNama = 'Nama tidak ditemukan'
        return
      }
      
      // Validasi Password
      if (this.password !== dummyUser.password) {
        this.errorPassword = 'Password tidak sesuai'
        return
      }

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

label {
  display: block;
  font-weight: bold;
  margin-bottom: 6px;
  font-family: 'Inter';
  font-size: 14px;
}

input {
    width: 100%;
    height: 44px;
    padding: 12px;
    font-size: 14px;
    font-family: 'Inter';
    border: 2px solid #41442A;
    border-radius: 6px;
    background-color: #fcfcf7;
    box-sizing: border-box;
  }

.password-box {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 360px;
    height: 44px;
    border: 2px solid #41442A;
    background-color: #fcfcf7;
    border-radius: 6px;
    padding: 0 12px;
    box-sizing: border-box;
  }
  
.password-box input {
    flex: 1;
    height: 100%;
    font-size: 14px;
    font-family: 'Inter';
    line-height: 44px; /* INI PENTING */
    border: none;
    background: transparent;
    outline: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

.password-box input::placeholder {
    color: #777;
    opacity: 1; /* biar warnanya kelihatan jelas */
  }

.icon-eye {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: #777;
    cursor: pointer;
  }
  
.form-group {
    width: 100%;
    max-width: 360px;
    margin-bottom: 16px;
  }

.error-text {
  color: red;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
  font-family: 'Inter';
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

button {
  width: 100%;
  max-width: 360px;
  padding: 12px;
  background-color: #41442A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Inter';
  cursor: pointer;
  margin-top: 0;
}
</style>