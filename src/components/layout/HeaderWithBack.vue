<template>
    <div class="header-container">
      <div class="header-inner">
        <button class="back-button" @click="goBack" :aria-label="backLabel">
          <ChevronLeft class="icon-back" />
        </button>
        <h2 class="header-title">{{ title }}</h2>
      </div>
    </div>
  </template>
  
  <script>
  import { ChevronLeft } from 'lucide-vue-next'
  
  export default {
    name: 'HeaderWithBack',
    components: {
      ChevronLeft
    },
    props: {
      title: {
        type: String,
        required: true
      },
      backLabel: {
        type: String,
        default: 'Kembali'
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      }
    }
  }
  </script>
  
  <style scoped>
  .header-container {
    width: 100%;
    max-width: 360px;
    margin-bottom: 18px;
  }
  
  .header-inner {
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
  
  .header-title {
    font-family: 'Inter';
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
  }
</style>