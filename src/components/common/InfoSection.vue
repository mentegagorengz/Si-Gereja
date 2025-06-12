<!-- src/components/common/InfoSection.vue -->
<template>
    <div class="info-section">
      <!-- Header Section -->
      <div class="section-header">
        <component :is="iconComponent" class="section-icon" />
        <h2 class="section-title">{{ title }}</h2>
      </div>
      
      <!-- Content Section -->
      <div class="section-content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InfoSection',
    
    props: {
      title: {
        type: String,
        required: true
      },
      iconComponent: {
        type: [String, Object],
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .info-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f0f0f0;
  }
  
  .section-icon {
    width: 24px;
    height: 24px;
    color: #41442A;
  }
  
  .section-title {
    font-family: 'Inter';
    font-size: 18px;
    font-weight: 600;
    color: #41442A;
    margin: 0;
  }
  
  .section-content {
    font-family: 'Inter';
    line-height: 1.6;
  }
  
  /* Responsive */
  @media (max-width: 360px) {
    .info-section {
      padding: 16px;
    }
    
    .section-title {
      font-size: 16px;
    }
  }
  </style>