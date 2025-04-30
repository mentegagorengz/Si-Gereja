<template>
    <div class="announcement-box">
      <img v-if="icon" :src="iconSrc" alt="icon" class="announcement-icon" />
      <div class="announcement-text">
        <p class="judul">{{ title }}</p>
        <p class="desc">{{ desc }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AnnouncementCard',
    props: {
      title: String,
      desc: String,
      icon: String
    },
    computed: {
        iconSrc() {
            try {
            return require(`@/assets/icons/${this.icon}`)
            } catch (err) {
            console.warn('❗ Gagal load icon:', this.icon)
            return 'https://via.placeholder.com/32'
            }
        }
    }
  }
  </script>
  
  <style scoped>
  .announcement-box {
    display: flex;
    align-items: center;
    gap: 12px;
    border: 2px solid #ccc; /* Stroke 2px sesuai permintaan */
    border-radius: 12px;
    padding: 12px;
    background: #fff;
    margin-bottom: 12px;
  }
  
  .announcement-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
  
  .announcement-text {
    display: flex;
    flex-direction: column;
  }
  
  .judul {
    font-weight: bold;
    font-size: 14px;
    margin: 0;
  }
  
  .desc {
    font-size: 12px;
    color: #333;
    margin: 0;
    margin-top: 6px;
  }
  </style>
  