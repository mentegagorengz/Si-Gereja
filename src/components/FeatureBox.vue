<template>
    <div class="feature-box" @click="goToPage">
      <div class="icon-placeholder">
        <img v-if="iconName" :src="iconSrc" alt="icon" class="feature-icon" />
        <span v-else>{{ firstLetter }}</span>
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
      },
        iconName: {
        type: String,
        default: '' // nama file icon, misalnya "news.png"
      }
    },
    computed: {
      firstLetter() {
        return this.name.charAt(0)
      },
      iconSrc() {
        try {
          // Mencoba memuat icon dari assets/icons
          return require(`@/assets/icons/${this.iconName}`)
        } catch (err) {
          console.warn(`❗ Gagal memuat icon: ${this.iconName}`, err)
          return null
        }
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
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
    color: rgb(32, 32, 32);
    overflow: hidden; /* Untuk gambar yang mungkin lebih besar */
  }  
  
  .feature-icon {
    width: 40px; /* Sesuaikan ukuran sesuai kebutuhan */
    height: auto;
    object-fit: contain;
  }

  .label {
    font-size: 14px;
    margin-top: 8px;
    font-family: 'Inter';
  }
  </style>
  