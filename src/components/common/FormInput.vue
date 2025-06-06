<template>
  <div class="form-group" :class="{ 'has-error': hasError }">
    <!-- Label dengan required indicator -->
    <label :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="required-indicator" aria-hidden="true">*</span>
    </label>
    
    <!-- Input wrapper untuk icon dan states -->
    <div class="input-wrapper" :class="{ 'focused': isFocused, 'disabled': disabled }">
      <input 
        :id="id"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        :aria-describedby="hasError ? `${id}-error` : null"
        :aria-invalid="hasError"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="inputRef"
      />
      
      <!-- Success icon -->
      <div v-if="showSuccessIcon" class="input-icon success-icon">
        <CheckIcon />
      </div>
      
      <!-- Error icon -->
      <div v-if="hasError" class="input-icon error-icon">
        <AlertCircleIcon />
      </div>
      
      <!-- Loading spinner -->
      <div v-if="loading" class="input-icon loading-icon">
        <div class="spinner"></div>
      </div>
    </div>
    
    <!-- Helper text -->
    <p v-if="helperText && !hasError" class="helper-text">
      {{ helperText }}
    </p>
    
    <!-- Error message -->
    <p v-if="hasError" :id="`${id}-error`" class="error-text" role="alert">
      {{ error }}
    </p>
  </div>
</template>
  
<script>
// ⭐ Simple icons as components
const CheckIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20,6 9,17 4,12"></polyline>
    </svg>
  `
}

const AlertCircleIcon = {
  template: `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  `
}

export default {
  name: 'FormInput',
  
  components: {
    CheckIcon,
    AlertCircleIcon
  },
  
  props: {
    // ⭐ Required props
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    
    // ⭐ Input behavior
    type: {
      type: String,
      default: 'text',
      validator: (value) => [
        'text', 'email', 'password', 'number', 
        'tel', 'url', 'search', 'date', 'time'
      ].includes(value)
    },
    placeholder: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    
    // ⭐ Validation
    error: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    
    // ⭐ States
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    
    // ⭐ Additional features
    helperText: {
      type: String,
      default: ''
    },
    showSuccessIcon: {
      type: Boolean,
      default: false
    },
    
    // ⭐ Input size
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    }
  },
  
  emits: ['update:modelValue', 'focus', 'blur'],
  
  data() {
    return {
      isFocused: false
    }
  },
  
  computed: {
    // ⭐ Check if input has error
    hasError() {
      return !!this.error
    },
    
    // ⭐ Check if input has value
    hasValue() {
      return this.modelValue !== '' && this.modelValue != null
    },
    
    // ⭐ Dynamic input classes
    inputClasses() {
      return [
        'form-input',
        `input-${this.size}`,
        {
          'filled': this.hasValue,
          'error': this.hasError,
          'success': this.showSuccessIcon,
          'loading': this.loading,
          'disabled': this.disabled,
          'readonly': this.readonly
        }
      ]
    }
  },
  
  methods: {
    // ⭐ Handle input changes
    handleInput(event) {
      const value = event.target.value
      this.$emit('update:modelValue', value)
    },
    
    // ⭐ Handle focus
    handleFocus(event) {
      this.isFocused = true
      this.$emit('focus', event)
    },
    
    // ⭐ Handle blur
    handleBlur(event) {
      this.isFocused = false
      this.$emit('blur', event)
    },
    
    // ⭐ Public method to focus input
    focus() {
      this.$refs.inputRef?.focus()
    },
    
    // ⭐ Public method to blur input
    blur() {
      this.$refs.inputRef?.blur()
    }
  }
}
</script>
  
<style scoped>
/* ⭐ FORM GROUP */
.form-group {
  width: 100%;
  max-width: 360px;
  margin-bottom: 16px;
  position: relative;
}

.form-group.has-error {
  margin-bottom: 20px; /* Extra space for error message */
}

/* ⭐ LABEL */
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.required-indicator {
  color: #dc3545;
  margin-left: 2px;
}

/* ⭐ INPUT WRAPPER */
.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ⭐ BASE INPUT STYLES */
.form-input {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  border: 2px solid #41442A;
  border-radius: 6px;
  background-color: #fcfcf7;
  box-sizing: border-box;
  transition: all 0.2s ease;
  color: #777;
  outline: none;
}

/* ⭐ INPUT SIZES */
.input-small {
  height: 36px;
  padding: 8px 12px;
  font-size: 13px;
}

.input-medium {
  height: 44px;
  padding: 12px;
  font-size: 14px;
}

.input-large {
  height: 52px;
  padding: 16px;
  font-size: 16px;
}

/* ⭐ INPUT STATES */
.form-input:focus {
  border-color: #5a5e3d;
  box-shadow: 0 0 0 3px rgba(65, 68, 42, 0.1);
}

.form-input.filled {
  color: #333;
}

.form-input.error {
  border-color: #dc3545;
  color: #333;
}

.form-input.error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-input.success {
  border-color: #28a745;
  color: #333;
}

.form-input.success:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.form-input:disabled {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  cursor: not-allowed;
}

.form-input:readonly {
  background-color: #f8f9fa;
  cursor: default;
}

.form-input.loading {
  padding-right: 40px; /* Space for loading icon */
}

/* ⭐ INPUT ICONS */
.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.success-icon {
  color: #28a745;
}

.error-icon {
  color: #dc3545;
}

.loading-icon {
  color: #6c757d;
}

/* ⭐ LOADING SPINNER */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e9ecef;
  border-top: 2px solid #6c757d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ⭐ HELPER TEXT */
.helper-text {
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
  margin-bottom: 0;
  font-family: 'Inter', sans-serif;
  line-height: 1.4;
}

/* ⭐ ERROR TEXT */
.error-text {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  margin-bottom: 0;
  font-family: 'Inter', sans-serif;
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

/* ⭐ PLACEHOLDER STYLES */
.form-input::placeholder {
  color: #adb5bd;
  opacity: 1;
}

.form-input:disabled::placeholder {
  color: #ced4da;
}

/* ⭐ RESPONSIVE DESIGN */
@media (max-width: 360px) {
  .form-group {
    max-width: 100%;
  }
  
  .input-small {
    height: 32px;
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .input-medium {
    height: 40px;
    padding: 10px;
    font-size: 13px;
  }
  
  .input-large {
    height: 48px;
    padding: 14px;
    font-size: 15px;
  }
  
  .form-label {
    font-size: 13px;
  }
  
  .helper-text,
  .error-text {
    font-size: 11px;
  }
}

/* ⭐ ACCESSIBILITY - High contrast mode */
@media (prefers-contrast: high) {
  .form-input {
    border-width: 3px;
  }
  
  .form-input:focus {
    outline: 2px solid;
    outline-offset: 2px;
  }
}

/* ⭐ ACCESSIBILITY - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .form-input,
  .spinner {
    transition: none;
    animation: none;
  }
}

/* ⭐ PRINT STYLES */
@media print {
  .form-input {
    border: 1px solid #000 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
  
  .input-icon {
    display: none;
  }
}
</style>