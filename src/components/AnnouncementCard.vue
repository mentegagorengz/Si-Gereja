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
            return require(`@/assets/icons/cross.png`)
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
    border-radius: 8px;
    padding: 12px;
    background: #41442A;
    margin-bottom: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
    color: #fff;
    margin: 0;
  }
  
  .desc {
    font-size: 12px;
    color: #fff;
    margin: 0;
    margin-top: 6px;
  }
  </style>
  