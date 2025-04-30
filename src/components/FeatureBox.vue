<template>
    <div class="feature-box" @click="goToPage">
      <div class="icon-placeholder">
        <!-- Bisa ganti nanti dengan icon SVG atau gambar -->
        <span>{{ firstLetter }}</span>
      </div>
      <p class="label">{{ name }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FeatureBox',
    props: {
      name: {
        type: String,
        required: true
      }
    },
    computed: {
      firstLetter() {
        return this.name.charAt(0)
      }
    },
    methods: {
      goToPage() {
        const path = '/' + this.name.toLowerCase().replace(/ /g, '-')
        this.$router.push(path)
      }
    }
  }
  </script>
  
  <style scoped>
  .feature-box {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .icon-placeholder {
    width: 64px;
    height: 64px;
    background: #ccc;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
    color: white;
  }
  
  .label {
    font-size: 14px;
    margin-top: 8px;
    font-family: 'Inter';
  }
  </style>
  