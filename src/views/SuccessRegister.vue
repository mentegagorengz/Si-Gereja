<template>
    <div class="success-container">
      <div class="content-wrapper">
        <img src="@/assets/logo-MyRajawali.png" alt="Logo MyRajawali" class="logo-img" />
        <h2>Welcome to MyRajawali</h2>
        <p class="desc-text">
          Akun MyRajawali Anda telah <strong>BERHASIL</strong> dibuat.<br />
          Klik lanjutkan untuk jelajahi aplikasi MyRajawali.<br />
          Tuhan Yesus Memberkati
        </p>
      </div>
      <button class="next-button" @click="goToHome">Lanjutkan</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SuccessRegister',
    methods: {
      goToHome() {
        this.$router.push('/home')
      }
    }
  }
  </script>
  
  <style scoped>
  .success-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    background-color: #fcfcf7;
    padding: 64px 16px;
    box-sizing: border-box;
  }
  
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
  }
  
  .logo-img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-top: 40px;
  }
  
  h2 {
    font-family: 'Inter';
    font-size: 20px;
    font-weight: bold;
    margin: 0;
  }
  
  .desc-text {
    font-family: 'Inter';
    font-size: 14px;
    line-height: 1.6;
    color: black;
  }
  
  .next-button {
    width: 100%;
    padding: 16px;
    background-color: #41442A;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-family: 'Inter';
    font-weight: bold;
    position: fixed;
    bottom: 64px;
    left: 0;
    right: 0;
    margin: 0 auto;
    max-width: 360px;
  }
  </style>
  