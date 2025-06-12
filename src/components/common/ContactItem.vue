<!-- src/components/common/ContactItem.vue -->
<template>
    <div class="contact-item">
      <component :is="iconComponent" class="contact-icon" />
      <div class="contact-text">
        <h4 class="contact-title">{{ title }}</h4>
        <div class="contact-content">
          <slot>
            <p v-if="typeof content === 'string'">{{ content }}</p>
            <div v-else-if="Array.isArray(content)">
              <p v-for="(item, index) in content" :key="index">{{ item }}</p>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ContactItem',
    
    props: {
      title: {
        type: String,
        required: true
      },
      content: {
        type: [String, Array],
        default: ''
      },
      iconComponent: {
        type: [String, Object],
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .contact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  
  .contact-item:hover {
    background: #e9ecef;
  }
  
  .contact-icon {
    width: 20px;
    height: 20px;
    color: #41442A;
    margin-top: 2px;
    flex-shrink: 0;
  }
  
  .contact-title {
    font-size: 14px;
    font-weight: 600;
    color: #41442A;
    margin: 0 0 4px 0;
    font-family: 'Inter';
  }
  
  .contact-content p {
    font-size: 13px;
    color: #333;
    margin: 0;
    font-family: 'Inter';
    line-height: 1.4;
  }
  
  .contact-content p + p {
    margin-top: 2px;
  }
  
  /* Responsive */
  @media (max-width: 360px) {
    .contact-item {
      padding: 10px;
    }
    
    .contact-title {
      font-size: 13px;
    }
    
    .contact-content p {
      font-size: 12px;
    }
  }
  </style>