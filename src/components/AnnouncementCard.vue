<template>
  <div class="announcement-card" :class="cardClass" @click="handleClick">
    <!-- Icon -->
    <div class="card-icon" :class="{ 'error': iconError }">
      <img 
        v-if="iconSrc && !iconError"
        :src="iconSrc" 
        :alt="category" 
        class="icon-img" 
        @error="onIconError"
      />
      <span v-else class="icon-fallback">{{ iconFallback }}</span>
    </div>
    
    <!-- Content -->
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script>
import { getAnnouncementIconUrl } from '@/utils/imageUtils'

export default {
  name: 'AnnouncementCard',
  
  props: {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'default'
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['click'],
  
  data() {
    return {
      iconError: false
    }
  },
  
  computed: {
    // ⭐ Dynamic card class based on category
    cardClass() {
      const classMap = {
        'pengumuman': 'pengumuman-card',
        'birthday': 'birthday-card',
        'ibadah': 'ibadah-card',
        'event': 'event-card',
        'announcement': 'pengumuman-card',
        'service': 'ibadah-card',
        'pelprap': 'ibadah-card',
        'worship': 'ibadah-card',
        'ultah': 'birthday-card',
        'ulang_tahun': 'birthday-card',
        'acara': 'event-card',
        'pelatar': 'event-card',
        'default': 'pengumuman-card'
      }
      
      const baseClass = classMap[this.category?.toLowerCase()] || classMap['default']
      
      return [
        baseClass,
        { 'clickable': this.clickable }
      ]
    },
    
    // ⭐ Get icon source URL
    iconSrc() {
      if (this.iconError) return null
      
      try {
        const iconKey = this.category || this.icon || 'default'
        return getAnnouncementIconUrl(iconKey)
      } catch (error) {
        return null
      }
    },
    
    // ⭐ Fallback emoji icon
    iconFallback() {
      const emojiMap = {
        'pengumuman': '📢',
        'birthday': '🎂',
        'ibadah': '⛪',
        'event': '✨',
        'announcement': '📢',
        'service': '⛪',
        'pelprap': '🙏',
        'worship': '⛪',
        'ultah': '🎂',
        'ulang_tahun': '🎂',
        'acara': '🎉',
        'pelatar': '🎓',
        'default': '📢'
      }
      
      return emojiMap[this.category?.toLowerCase()] || emojiMap['default']
    }
  },
  
  methods: {
    // ⭐ Handle icon load error
    onIconError() {
      this.iconError = true
    },
    
    // ⭐ Handle card click
    handleClick() {
      if (this.clickable) {
        this.$emit('click', {
          title: this.title,
          desc: this.desc,
          category: this.category
        })
      }
    }
  }
}
</script>

<style scoped>
/* ⭐ CARD BASE */
.announcement-card {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
  cursor: default;
}

.announcement-card.clickable {
  cursor: pointer;
}

.announcement-card:active {
  transform: scale(0.98);
}

/* ⭐ ICON SECTION */
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
  transition: transform 0.2s ease;
}

.card-icon.error {
  background: rgba(255, 255, 255, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.5);
}

.icon-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.announcement-card:hover .icon-img {
  transform: scale(1.1);
}

.icon-fallback {
  font-size: 24px;
  line-height: 1;
}

/* ⭐ CONTENT SECTION */
.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #fff;
  font-family: 'Inter', sans-serif;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 13px;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Inter', sans-serif;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

/* ⭐ CATEGORY STYLES */
.pengumuman-card {
  background: linear-gradient(135deg, #261b76, #2156a6);
}

.birthday-card {
  background: linear-gradient(135deg, #aa1a64, #b93283);
}

.ibadah-card {
  background: linear-gradient(135deg, #825900, #c7640e);
}

.event-card {
  background: linear-gradient(135deg, #7c6b1d, #e0be00);
}

/* ⭐ HOVER EFFECTS */
.pengumuman-card:hover {
  background: linear-gradient(135deg, #312e81, #3b82f6);
  box-shadow: 0 6px 20px rgba(38, 27, 118, 0.3);
}

.birthday-card:hover {
  background: linear-gradient(135deg, #c21e7a, #d946a6);
  box-shadow: 0 6px 20px rgba(170, 26, 100, 0.3);
}

.ibadah-card:hover {
  background: linear-gradient(135deg, #a66b00, #f59e0b);
  box-shadow: 0 6px 20px rgba(130, 89, 0, 0.3);
}

.event-card:hover {
  background: linear-gradient(135deg, #9a7c1a, #facc15);
  box-shadow: 0 6px 20px rgba(124, 107, 29, 0.3);
}

/* ⭐ RESPONSIVE DESIGN */
@media (max-width: 360px) {
  .announcement-card {
    padding: 12px;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
    min-width: 40px;
    margin-right: 12px;
  }
  
  .icon-img {
    width: 24px;
    height: 24px;
  }
  
  .icon-fallback {
    font-size: 20px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .card-desc {
    font-size: 12px;
  }
}

/* ⭐ ACCESSIBILITY - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .announcement-card,
  .card-icon,
  .icon-img {
    transition: none;
  }
  
  .announcement-card:hover {
    transform: none;
  }
  
  .announcement-card:hover .icon-img {
    transform: none;
  }
}
</style>