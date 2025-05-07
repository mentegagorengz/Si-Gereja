<template>
    <div :class="['button-container', { 'centered': centered }]">
        <button 
            :class="['primary-button', { 'full-width': fullWidth }]" 
            :type="type"
            :disabled="disabled"
            @click="$emit('click')"
        >
            <slot></slot>
        </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ButtonPrimary',
    props: {
      fullWidth: {
        type: Boolean,
        default: true
      },
      centered: {
        type: Boolean,
        default: true,
      },
      type: {
        type: String,
        default: 'button',
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    emits: ['click']
  }
 </script>
  
 <style scoped>
  .button-container {
    width: 100%;
    display: flex;
  }
  
  .centered {
    justify-content: center;
  }

  .primary-button {
    padding: 12px;
    background-color: #41442A;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    font-family: 'Inter';
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .primary-button:hover {
    background-color: #535738;
  }
  
  .primary-button:active {
    background-color: #3A3D26;
  }
  
  .primary-button:disabled {
    background-color: #A5A6A0;
    cursor: not-allowed;
  }
  
  .full-width {
    width: 100%;
    max-width: 360px;
  }
  </style>