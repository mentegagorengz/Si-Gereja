<template>
  <div class="announcement-card" :class="getCardClass(category)" @click="handleClick">
    <!-- Icon dengan loading state -->
    <div class="card-icon" :class="{ 'loading': isLoading, 'error': iconError }">
      <div v-if="isLoading" class="icon-loading"></div>
      <img 
        v-else-if="iconSrc && !iconError"
        :src="iconSrc" 
        :alt="category" 
        class="icon-img" 
        @error="onIconError"
        @load="onIconLoad"
      />
      <span v-else class="icon-fallback">{{ getIconFallback() }}</span>
    </div>
    
    <!-- Content -->
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script>
// ⭐ IMPORT OPTIMIZED HELPER
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
  data() {
    return {
      iconError: false,
      iconLoaded: false,
      isLoading: true
    }
  },
  computed: {
    iconSrc() {
      if (this.iconError) return null
      
      try {
        // Prioritas: category > icon prop > fallback
        const iconKey = this.category || this.icon || 'default'
        const iconUrl = getAnnouncementIconUrl(iconKey)
        
        return iconUrl
      } catch (err) {
        console.warn('❗ [AnnouncementCard] Gagal load icon:', this.category || this.icon, err)
        // JANGAN ubah data di computed property - biarkan onIconError yang handle
        return null
      }
    }
  },
  mounted() {
    // Delay loading untuk UX yang lebih smooth
    setTimeout(() => {
      if (!this.iconLoaded && !this.iconError) {
        this.isLoading = false
      }
    }, 200)
  },
  methods: {
    getCardClass(category) {
      // ⭐ MAPPING CATEGORY KE CSS CLASS - 4 kategori utama
      const classMap = {
        'pengumuman': 'pengumuman-card',
        'birthday': 'birthday-card',
        'ibadah': 'ibadah-card',
        'event': 'event-card',
        
        // Alias untuk compatibility
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
      
      return classMap[category?.toLowerCase()] || classMap['default']
    },
    
    getIconFallback() {
      // ⭐ EMOJI FALLBACK BERDASARKAN 4 CATEGORY UTAMA
      const emojiMap = {
        'pengumuman': '📢',
        'birthday': '🎂',
        'ibadah': '⛪',
        'event': '✨',
        
        // Alias untuk compatibility
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
    },
    
    onIconError() {
      console.warn('❗ [AnnouncementCard] Icon failed to load for category:', this.category)
      this.iconError = true
      this.iconLoaded = false
      this.isLoading = false
    },
    
    onIconLoad() {
      console.log('✅ [AnnouncementCard] Icon loaded successfully for:', this.category)
      this.iconLoaded = true
      this.iconError = false
      this.isLoading = false
    },
    
    handleClick() {
      if (this.clickable) {
        console.log('🔍 [AnnouncementCard] Card clicked:', this.title)
        // Emit event untuk parent component handle
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
  cursor: default;
}

.announcement-card.clickable {
  cursor: pointer;
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
  position: relative;
  transition: all 0.2s ease;
}

.card-icon.loading {
  background: rgba(255, 255, 255, 0.4);
}

.card-icon.error {
  background: rgba(255, 255, 255, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.5);
}

.icon-loading {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.card-content {
  flex: 1;
  min-width: 0; /* Untuk text truncation */
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #fff;
  font-family: 'Inter', sans-serif;
  line-height: 1.3;
  /* Text truncation with fallback */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* Modern browsers */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal; /* Override for multi-line */
  /* Fallback for older browsers */
  max-height: calc(1.3em * 2); /* line-height * max lines */
}

.card-desc {
  font-size: 13px;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Inter', sans-serif;
  line-height: 1.4;
  /* Text truncation with fallback */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* Modern browsers */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal; /* Override for multi-line */
  /* Fallback for older browsers */
  max-height: calc(1.4em * 2); /* line-height * max lines */
}

/* ⭐ CATEGORY-SPECIFIC STYLES - 4 Kategori Utama */
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

/* Hover effects per category */
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

/* Responsive */
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
  
  .icon-loading {
    width: 16px;
    height: 16px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .card-desc {
    font-size: 12px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .announcement-card,
  .card-icon,
  .icon-img,
  .icon-loading {
    animation: none;
    transition: none;
  }
  
  .announcement-card:hover {
    transform: none;
  }
}
</style>