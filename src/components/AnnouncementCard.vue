<!-- AnnouncementCard.vue - Modern Elevated Design dengan Kategori Warna -->
<template>
  <div class="announcement-card elevated-card" :class="cardTheme" @click="handleClick">
    <!-- Header: Category Badge + Read More -->
    <div class="card-header">
      <div class="card-category" :style="{ background: categoryGradient }">
        {{ getCategoryLabel }}
      </div>
      <div class="read-more">
        Selengkapnya →
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="card-content">
      <!-- Title -->
      <h3 class="card-title">{{ title }}</h3>
      
      <!-- Description -->
      <p class="card-desc">{{ desc }}</p>
      
      <!-- Meta Info (Date, Time, Location) -->
      <div class="card-meta">
        <span v-if="formattedDate">📅 {{ formattedDate }}</span>
        <span v-if="time">🕘 {{ time }}</span>
        <span v-if="location">📍 {{ location }}</span>
      </div>
    </div>

    <!-- Shimmer Effect -->
    <div class="shimmer-overlay"></div>
  </div>
</template>

<script>
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
    },
    time: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    }
  },
  
  emits: ['click'],
  
  computed: {
    /**
     * 🎨 Get gradient color berdasarkan kategori
     */
    categoryGradient() {
      const gradients = {
        // === KATEGORI JADWAL (High Contrast) ===
        'minggu raya': 'linear-gradient(135deg, #4c51bf 0%, #553c9a 100%)',        // Deep blue-purple
        'pelprap': 'linear-gradient(135deg, #e53e3e 0%, #d53f8c 100%)',           // Deep red-pink
        'sektor tesalonika': 'linear-gradient(135deg, #2b6cb0 0%, #1e40af 100%)', // Deep blue
        'sektor anugerah': 'linear-gradient(135deg, #047857 0%, #059669 100%)',   // Deep green
        'pelnap': 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',            // Deep red-orange
        'pendalaman alkitab': 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)', // Deep purple
        'doa dan puasa': 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',     // Deep cyan
        'pelwap': 'linear-gradient(135deg, #be185d 0%, #be123c 100%)',            // Deep pink-red
        'pelprip': 'linear-gradient(135deg, #92400e 0%, #a16207 100%)',           // Deep brown-yellow
        'doa membangunkan fajar': 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)', // Deep orange-red
        
        // === KATEGORI NEWS (High Contrast) ===
        'undangan': 'linear-gradient(135deg, #4c51bf 0%, #553c9a 100%)',          // Deep blue-purple
        'birthday': 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',          // Deep red-orange
        'event': 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',             // Deep pink
        'pengumuman': 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',        // Deep cyan
        'kegiatan': 'linear-gradient(135deg, #059669 0%, #047857 100%)',          // Deep green
        'ibadah': 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',            // Deep purple
        
        // === FALLBACKS ===
        'schedule': 'linear-gradient(135deg, #4c51bf 0%, #553c9a 100%)',
        'news': 'linear-gradient(135deg, #2b6cb0 0%, #1e40af 100%)',
        'announcement': 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
        'default': 'linear-gradient(135deg, #4c51bf 0%, #553c9a 100%)'
      }
      
      const categoryKey = this.category?.toLowerCase() || 'default'
      return gradients[categoryKey] || gradients['default']
    },

    /**
     * 🏷️ Get category label untuk display
     */
    getCategoryLabel() {
      const labels = {
        // === KATEGORI JADWAL ===
        'minggu raya': 'Minggu Raya',
        'pelprap': 'PELPRAP',
        'sektor tesalonika': 'Sektor Tesalonika',
        'sektor anugerah': 'Sektor Anugerah', 
        'pelnap': 'PELNAP',
        'pendalaman alkitab': 'Pendalaman Alkitab',
        'doa dan puasa': 'Doa dan Puasa',
        'pelwap': 'PELWAP',
        'pelprip': 'PELPRIP',
        'doa membangunkan fajar': 'Doa Membangunkan Fajar',
        
        // === KATEGORI NEWS ===
        'undangan': 'Undangan',
        'birthday': 'Ulang Tahun',
        'event': 'Event',
        'pengumuman': 'Pengumuman',
        'kegiatan': 'Kegiatan',
        'ibadah': 'Ibadah',
        
        // === FALLBACKS ===
        'schedule': 'Jadwal',
        'news': 'Berita',
        'announcement': 'Pengumuman',
        'default': 'Info'
      }
      
      const categoryKey = this.category?.toLowerCase() || 'default'
      return labels[categoryKey] || labels['default']
    },

    /**
     * 📅 Format tanggal untuk display
     */
    formattedDate() {
      if (!this.date) return ''
      
      try {
        const dateObj = new Date(this.date)
        const options = { 
          day: 'numeric', 
          month: 'short'
        }
        return dateObj.toLocaleDateString('id-ID', options)
      } catch (error) {
        return this.date
      }
    },

    /**
     * 🎨 Card theme based on category type
     */
    cardTheme() {
      const jadwalCategories = [
        'minggu raya', 'pelprap', 'sektor tesalonika', 'sektor anugerah',
        'pelnap', 'pendalaman alkitab', 'doa dan puasa', 'pelwap', 
        'pelprip', 'doa membangunkan fajar'
      ]
      
      const newsCategories = [
        'undangan', 'birthday', 'event', 'pengumuman', 'kegiatan', 'ibadah'
      ]
      
      const categoryKey = this.category?.toLowerCase() || 'default'
      
      if (jadwalCategories.includes(categoryKey)) {
        return 'schedule-theme'
      } else if (newsCategories.includes(categoryKey)) {
        return 'news-theme'
      }
      
      return 'default-theme'
    }
  },
  
  methods: {
    /**
     * 🎯 Handle card click
     */
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
/* ===== BASE ELEVATED CARD STYLES ===== */
.elevated-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.05), 
    0 10px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}

/* ===== HOVER EFFECTS ===== */
.elevated-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 
    0 12px 24px rgba(0, 0, 0, 0.15), 
    0 6px 12px rgba(0, 0, 0, 0.1);
}

/* ===== SHIMMER EFFECT ===== */
.shimmer-overlay {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: left 0.6s ease;
  pointer-events: none;
}

.elevated-card:hover .shimmer-overlay {
  left: 100%;
}

/* ===== HEADER AREA ===== */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* ===== CATEGORY BADGE ===== */
.card-category {
  display: inline-block;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* ===== READ MORE (TOP RIGHT) ===== */
.read-more {
  color: #667eea;
  font-size: 10px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(102, 126, 234, 0.1);
}

.elevated-card:hover .read-more {
  color: #5a67d8;
  background: rgba(90, 103, 216, 0.15);
  transform: translateX(2px);
}

/* ===== CONTENT AREA ===== */
.card-content {
  position: relative;
  z-index: 2;
}

.card-title {
  color: #1a202c;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
  font-family: 'Inter', sans-serif;
  
  /* Text truncation */
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  color: #4a5568;
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 14px;
  font-family: 'Inter', sans-serif;
  
  /* Text truncation */
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== META INFO (DATE, TIME, LOCATION) ===== */
.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  color: #a0aec0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid #f7fafc;
}

.card-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

/* ===== THEME VARIATIONS ===== */
.schedule-theme {
  border-left: 4px solid #667eea;
}

.news-theme {
  border-left: 4px solid #4facfe;
}

.default-theme {
  border-left: 4px solid #a0aec0;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 480px) {
  .elevated-card {
    padding: 16px;
    border-radius: 16px;
    margin-bottom: 12px;
  }
  
  .card-header {
    margin-bottom: 12px;
  }
  
  .card-category {
    font-size: 10px;
    padding: 5px 12px;
  }
  
  .read-more {
    font-size: 10px;
    padding: 3px 6px;
  }
  
  .card-title {
    font-size: 15px;
    margin-bottom: 8px;
  }
  
  .card-desc {
    font-size: 12px;
    margin-bottom: 12px;
  }
  
  .card-meta {
    font-size: 10px;
    gap: 8px;
    padding-top: 10px;
  }
}

@media (max-width: 360px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .read-more {
    align-self: flex-end;
  }
  
  .card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  .elevated-card,
  .shimmer-overlay,
  .read-more {
    transition: none;
  }
  
  .elevated-card:hover {
    transform: none;
  }
  
  .elevated-card:hover .shimmer-overlay {
    left: -100%;
  }
}

/* ===== PRINT STYLES ===== */
@media print {
  .elevated-card {
    box-shadow: none;
    border: 1px solid #e2e8f0;
    break-inside: avoid;
  }
  
  .shimmer-overlay {
    display: none;
  }
}
</style>