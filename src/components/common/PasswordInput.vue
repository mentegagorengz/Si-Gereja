<template>
    <div class="form-group">
      <label :for="id">{{ label }}</label>
      <div class="password-box">
        <input
          :id="id"
          :type="showPassword ? 'text' : 'password'"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="placeholder"
        />
        
        <Eye v-if="!showPassword" @click="togglePassword" class="icon-eye" />
        <EyeOff v-else @click="togglePassword" class="icon-eye" />
      </div>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { Eye, EyeOff } from 'lucide-vue-next'
  
  export default {
    name: 'PasswordInput',
    components: {
      Eye,
      EyeOff
    },
    props: {
      id: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
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
    data() {
      return {
        showPassword: false
      }
    },
    methods: {
      togglePassword() {
        this.showPassword = !this.showPassword
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
  
  .password-box {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 360px;
    height: 44px;
    border: 2px solid #41442A;
    background-color: #fcfcf7;
    border-radius: 6px;
    padding: 0 12px;
    box-sizing: border-box;
  }
    
  .password-box input {
    flex: 1;
    height: 100%;
    font-size: 14px;
    font-family: 'Inter';
    line-height: 44px;
    border: none;
    background: transparent;
    outline: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  
  .password-box input::placeholder {
    color: #777;
    opacity: 1;
  }
  
  .icon-eye {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: #777;
    cursor: pointer;
  }
  
  .error-text {
    color: red;
    font-size: 12px;
    margin-top: 4px;
    margin-bottom: 0;
    font-family: 'Inter';
  }
</style>