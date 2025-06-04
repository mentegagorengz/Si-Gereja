<template>
  <div class="announcement-card" :class="getCardClass(category)">
    <div class="card-icon">
      <img 
        :src="iconSrc" 
        :alt="category" 
        class="icon-img" 
        @error="onIconError"
      />
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script>
// ⭐ IMPORT LOCAL ASSETS HELPER
import { getAnnouncementIconUrl } from '@/utils/imageUtils'

export default {
  name: 'AnnouncementCard',
  props: {
    title: String,
    desc: String,
    icon: String,
    category: String
  },
  data() {
    return {
      iconError: false
    }
  },
  computed: {
    iconSrc() {
      if (this.iconError) {
        // Fallback ke emoji jika error
        return this.createEmojiIcon(this.category || this.icon)
      }
      
      try {
        const iconUrl = getAnnouncementIconUrl(this.category || this.icon)
        console.log('🔍 [AnnouncementCard LOCAL] Icon URL:', iconUrl)
        return iconUrl
      } catch (err) {
        console.warn('❗ Gagal load icon:', this.category || this.icon, err)
        return this.createEmojiIcon(this.category || this.icon)
      }
    }
  },
  methods: {
    getCardClass(category) {
      switch(category) {
        case 'birthday':
          return 'birthday-card'
        case 'service':
          return 'service-card' 
        case 'event':
          return 'event-card'
        case 'pengumuman':
          return 'pengumuman-card'
        case 'pelprap':
          return 'pelprap-card'
        default:
          return 'default-card'
      }
    },
    
    onIconError() {
      console.warn('❗ Announcement icon failed to load')
      this.iconError = true
      this.$forceUpdate()
    },
    
    createEmojiIcon(category) {
      const emojiMap = {
        'birthday': '🎂',
        'service': '⛪',
        'event': '✨',
        'pengumuman': '📢',
        'pelprap': '🙏',
        'pelatar': '🎓',
        'ibadah': '⛪',
        'default': 'ℹ️'
      }
      
      const emoji = emojiMap[category] || emojiMap['default']
      
      // Create emoji as data URL
      const canvas = document.createElement('canvas')
      canvas.width = 28
      canvas.height = 28
      const ctx = canvas.getContext('2d')
      
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emoji, 14, 14)
      
      return canvas.toDataURL()
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
  background: linear-gradient(135deg, #aa1a64, #b93283);
}

.service-card {
  background: linear-gradient(135deg, #825900, #c7640e);
}

.event-card {
  background: linear-gradient(135deg, #7c6b1d, #e0be00);
}

.pengumuman-card {
  background: linear-gradient(135deg, #261b76, #2156a6);
}

.pelprap-card {
  background: linear-gradient(135deg, #4a5d23, #6b8230);
}

.default-card {
  background: linear-gradient(135deg, #5A5D3F, #41442A);
}
</style>