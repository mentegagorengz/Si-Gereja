<template>
    <div class="form-group">
      <label :for="id">{{ label }}</label>
      <input 
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="{ 'filled': modelValue }"
      />
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormInput',
    props: {
      id: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: ''
      },
      modelValue: {
        type: String,
        default: ''
      },
      error: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue']
  }
  </script>
  
  <style scoped>
  .form-group {
    width: 100%;
    max-width: 360px;
    margin-bottom: 16px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 6px;
    font-family: 'Inter';
    font-size: 14px;
  }
  
  input {
    width: 100%;
    height: 44px;
    padding: 12px;
    font-size: 14px;
    font-family: 'Inter';
    border: 2px solid #41442A;
    border-radius: 6px;
    background-color: #fcfcf7;
    box-sizing: border-box;
  }
  
  input.filled {
    color: #333;
  }
  
  input:not(.filled) {
    color: #777;
  }
  
  .error-text {
    color: red;
    font-size: 12px;
    margin-top: 4px;
    margin-bottom: 0;
    font-family: 'Inter';
  }
  </style>