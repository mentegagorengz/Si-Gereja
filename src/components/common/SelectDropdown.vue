<template>
    <div class="form-group">
      <label :for="id">{{ label }}</label>
      <div class="select-wrapper">
        <select
          :id="id"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :required="required"
          :disabled="disabled"
          :class="{ 'has-value': modelValue }"
        >
          <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
          <option 
            v-for="option in options" 
            :key="option.value || option" 
            :value="option.value || option"
          >
            {{ option.label || option }}
          </option>
        </select>
        <ChevronDown class="select-icon" />
      </div>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { ChevronDown } from 'lucide-vue-next'
  
  export default {
    name: 'SelectDropdown',
    components: {
      ChevronDown
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
        default: 'Pilih salah satu'
      },
      options: {
        type: Array,
        required: true,
      },
      modelValue: {
        type: [String, Number],
        default: ''
      },
      required: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
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
  
  .select-wrapper {
    position: relative;
    width: 100%;
  }
  
  select {
    width: 100%;
    height: 44px;
    padding: 12px;
    font-size: 14px;
    font-family: 'Inter';
    border: 2px solid #41442A;
    border-radius: 6px;
    background-color: #fcfcf7;
    box-sizing: border-box;
    color: #777;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 36px;
    cursor: pointer;
  }
  
  select:focus {
    outline: none;
    border-color: #5a5e3d;
  }
  
  select.has-value {
    color: #333;
  }
  
  select:required:invalid {
    color: #777;
  }
  
  .select-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #41442A;
    pointer-events: none;
  }
  
  .error-text {
    color: red;
    font-size: 12px;
    margin-top: 4px;
    margin-bottom: 0;
    font-family: 'Inter';
  }
  
  select:disabled {
    background-color: #f3f3f0;
    border-color: #ccc;
    cursor: not-allowed;
  }

    :deep(option) {
    color: #41442A !important;
        font-family: 'Inter';
    }
  
  :deep(option:hover) {
    background-color: #f0f0e8;
  }

    :deep(option:checked) {
        background-color: #e8e8e0;
        font-weight: bold;
    }
</style>