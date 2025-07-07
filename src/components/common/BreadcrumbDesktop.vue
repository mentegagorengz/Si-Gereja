<!-- src/components/common/Breadcrumb.vue -->
<template>
  <nav class="breadcrumb-container" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <!-- Home/Root item (selalu ada) -->
      <li class="breadcrumb-item">
        <router-link to="/home" class="breadcrumb-link breadcrumb-home">
          <House class="breadcrumb-icon" />
          <span>Home</span>
        </router-link>
      </li>

      <!-- Breadcrumb items dari props -->
      <li 
        v-for="(item, index) in items" 
        :key="index" 
        class="breadcrumb-item"
      >
        <!-- Separator arrow -->
        <ChevronRight class="breadcrumb-separator" />
        
        <!-- Link item (kalau ada to) -->
        <router-link 
          v-if="item.to && index < items.length - 1"
          :to="item.to" 
          class="breadcrumb-link"
        >
          <!-- Icon kalau ada -->
          <component 
            v-if="item.icon" 
            :is="item.icon" 
            class="breadcrumb-icon" 
          />
          <span>{{ item.text }}</span>
        </router-link>
        
        <!-- Current page (tanpa link) -->
        <span 
          v-else 
          class="breadcrumb-current"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          <!-- Icon kalau ada -->
          <component 
            v-if="item.icon" 
            :is="item.icon" 
            class="breadcrumb-icon" 
          />
          <span>{{ item.text }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script>
import { House, ChevronRight } from 'lucide-vue-next'

export default {
  name: 'BreadcrumbDesktop',
  
  components: {
    House,
    ChevronRight
  },
  
  props: {
    // Array berisi breadcrumb items
    // Format: [{ text: 'Nama', to: '/path', icon: IconComponent }]
    items: {
      type: Array,
      default: () => [],
      validator(items) {
        // Setiap item harus punya text
        return items.every(item => 
          item && typeof item === 'object' && item.text
        )
      }
    }
  }
}
</script>

<style scoped>
/* === BREADCRUMB CONTAINER === */
.breadcrumb-container {
  margin-bottom: 24px;
}

/* === BREADCRUMB LIST === */
.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* === BREADCRUMB ITEM === */
.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* === BREADCRUMB LINKS === */
.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  color: #41442A;
  background: rgba(65, 68, 42, 0.08);
}

/* Home link khusus */
.breadcrumb-home {
  color: #41442A;
  font-weight: 600;
}

.breadcrumb-home:hover {
  background: rgba(65, 68, 42, 0.12);
}

/* === CURRENT PAGE === */
.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #41442A;
  padding: 4px 8px;
}

/* === ICONS === */
.breadcrumb-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* === SEPARATOR === */
.breadcrumb-separator {
  width: 14px;
  height: 14px;
  color: #999;
  flex-shrink: 0;
  margin: 0 2px;
}

/* === RESPONSIVE === */
@media (max-width: 950px) and (min-width: 769px) {
  .breadcrumb-container {
    margin-bottom: 20px;
  }

  .breadcrumb-link,
  .breadcrumb-current {
    font-size: 13px;
    padding: 3px 6px;
  }

  .breadcrumb-icon {
    width: 15px;
    height: 15px;
  }

  .breadcrumb-separator {
    width: 13px;
    height: 13px;
  }
}

/* === ACCESSIBILITY === */
@media (prefers-contrast: high) {
  .breadcrumb-link {
    color: #000;
  }
  
  .breadcrumb-current {
    color: #000;
  }
}

@media (prefers-reduced-motion: reduce) {
  .breadcrumb-link {
    transition: none;
  }
}

/* === PRINT FRIENDLY === */
@media print {
  .breadcrumb-container {
    margin-bottom: 16px;
  }
}</style>