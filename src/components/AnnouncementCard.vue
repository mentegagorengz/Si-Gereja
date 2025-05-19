<template>
  <div class="announcement-card" :class="getCardClass(title)">
    <div class="card-icon">
      <img :src="iconSrc" alt="icon" class="icon-img" />
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-desc">{{ desc }}</p>
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
  },
  methods: {
    getCardClass(title) {
      if (title.toLowerCase().includes('birthday')) {
        return 'birthday-card'
      } else if (title.toLowerCase().includes('ibadah')) {
        return 'service-card'
      } else {
        return 'default-card'
      }
    }
  }
}
</script>

<style scoped>
.announcement-card {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.announcement-card:active {
  transform: scale(0.98);
}

.card-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.25);
  margin-right: 14px;
}

.icon-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #fff;
}

.card-desc {
  font-size: 13px;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.birthday-card {
  background: linear-gradient(135deg, #41442A, #738045);
}

.birthday-card::before {
  content: "🎂";
  position: absolute;
  right: -10px;
  top: -10px;
  font-size: 50px;
  opacity: 0.15;
  transform: rotate(15deg);
}

.service-card {
  background: linear-gradient(135deg, #4A4D33, #41442A);
}
.service-card::before {
  content: "🙏";
  position: absolute;
  right: -10px;
  top: -10px;
  font-size: 50px;
  opacity: 0.15;
  transform: rotate(15deg);
}

.default-card {
  background: linear-gradient(135deg, #5A5D3F, #41442A);
}
</style>