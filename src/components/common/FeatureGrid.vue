<!-- src/components/common/FeatureGrid.vue -->
<template>
    <div class="feature-grid" :class="gridClass">
      <div 
        v-for="item in items" 
        :key="item.id || item.name" 
        class="feature-item"
        :class="itemClass"
        @click="onItemClick(item)"
      >
        <!-- Icon/Emoji -->
        <div class="feature-icon" :class="iconClass">
          <component 
            v-if="item.iconComponent" 
            :is="item.iconComponent" 
            class="icon-svg"
          />
          <span v-else-if="item.icon" class="icon-emoji">{{ item.icon }}</span>
          <span v-else class="icon-fallback">{{ getInitial(item.name) }}</span>
        </div>
        
        <!-- Content -->
        <div class="feature-content">
          <span class="feature-name">{{ item.name }}</span>
          <span v-if="item.description" class="feature-desc">{{ item.description }}</span>
        </div>
        
        <!-- Arrow (optional) -->
        <ChevronRight v-if="clickable" class="feature-arrow" />
      </div>
    </div>
  </template>
  
  <script>
  import { ChevronRight } from 'lucide-vue-next'
  
  export default {
    name: 'FeatureGrid',
    components: {
      ChevronRight
    },
    
    props: {
      items: {
        type: Array,
        required: true
      },
      columns: {
        type: Number,
        default: 2,
        validator: (value) => [1, 2, 3].includes(value)
      },
      clickable: {
        type: Boolean,
        default: false
      },
      variant: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'compact', 'detailed'].includes(value)
      }
    },
    
    emits: ['item-click'],
    
    computed: {
      gridClass() {
        return [
          `grid-${this.columns}-cols`,
          `variant-${this.variant}`
        ]
      },
      
      itemClass() {
        return {
          'clickable': this.clickable,
          'compact': this.variant === 'compact',
          'detailed': this.variant === 'detailed'
        }
      },
      
      iconClass() {
        return {
          'icon-large': this.variant === 'detailed',
          'icon-small': this.variant === 'compact'
        }
      }
    },
    
    methods: {
      onItemClick(item) {
        if (this.clickable) {
          this.$emit('item-click', item)
        }
      },
      
      getInitial(name) {
        return name ? name.charAt(0).toUpperCase() : '?'
      }
    }
  }
  </script>
  
  <style scoped>
  /* Grid Layout */
  .feature-grid {
    display: grid;
    gap: 12px;
  }
  
  .grid-1-cols {
    grid-template-columns: 1fr;
  }
  
  .grid-2-cols {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .grid-3-cols {
    grid-template-columns: repeat(3, 1fr);
  }
  
  /* Feature Item */
  .feature-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.2s ease;
    font-family: 'Inter';
  }
  
  .feature-item.clickable {
    cursor: pointer;
  }
  
  .feature-item.clickable:hover {
    background: #e9ecef;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .feature-item.clickable:active {
    transform: translateY(0);
  }
  
  /* Variants */
  .variant-compact .feature-item {
    padding: 8px;
    gap: 6px;
  }
  
  .variant-detailed .feature-item {
    padding: 16px;
    gap: 12px;
    flex-direction: column;
    text-align: center;
  }
  
  .variant-detailed.grid-1-cols .feature-item {
    flex-direction: row;
    text-align: left;
  }
  
  /* Icon */
  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(65, 68, 42, 0.1);
    flex-shrink: 0;
  }
  
  .feature-icon.icon-small {
    width: 24px;
    height: 24px;
  }
  
  .feature-icon.icon-large {
    width: 40px;
    height: 40px;
  }
  
  .icon-svg {
    width: 18px;
    height: 18px;
    color: #41442A;
  }
  
  .icon-emoji {
    font-size: 16px;
    line-height: 1;
  }
  
  .icon-fallback {
    font-size: 14px;
    font-weight: 600;
    color: #41442A;
  }
  
  .feature-icon.icon-small .icon-svg {
    width: 14px;
    height: 14px;
  }
  
  .feature-icon.icon-small .icon-emoji {
    font-size: 12px;
  }
  
  .feature-icon.icon-large .icon-svg {
    width: 22px;
    height: 22px;
  }
  
  .feature-icon.icon-large .icon-emoji {
    font-size: 20px;
  }
  
  /* Content */
  .feature-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  
  .feature-name {
    font-size: 13px;
    font-weight: 500;
    color: #333;
    word-break: break-word;
    line-height: 1.2;
  }
  
  .feature-desc {
    font-size: 11px;
    color: #666;
    line-height: 1.2;
  }
  
  .variant-compact .feature-name {
    font-size: 12px;
  }
  
  .variant-detailed .feature-name {
    font-size: 14px;
    font-weight: 600;
  }
  
  .variant-detailed .feature-desc {
    font-size: 12px;
  }
  
  /* Arrow */
  .feature-arrow {
    width: 14px;
    height: 14px;
    color: #999;
    flex-shrink: 0;
  }
  
  /* Responsive */
  @media (max-width: 360px) {
    .grid-3-cols {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .feature-item {
      padding: 10px;
    }
    
    .feature-name {
      font-size: 12px;
    }
    
    .feature-desc {
      font-size: 10px;
    }
  }
  </style>