<!-- src/views/AddPrayerRequestPage.vue -->
<template>
    <div class="add-prayer-container">
      <div class="add-prayer-wrapper">
        <!-- Header dengan tombol back -->
        <HeaderWithBack title="Permintaan Doa Baru" />
  
        <!-- Form container -->
        <div class="form-container">
          
          <!-- Info banner -->
          <div class="info-banner">
            <div class="banner-icon">🙏</div>
            <div class="banner-text">
              <h3>Berbagi Beban dalam Doa</h3>
              <p>Ceritakan pergumulan Anda, kami akan mendoakan bersama</p>
            </div>
          </div>
  
          <!-- Form fields -->
          <form @submit.prevent="submitPrayerRequest" class="prayer-form">
            
            <!-- Kategori dropdown -->
            <SelectDropdown
              id="prayer-category"
              label="Kategori"
              placeholder="Pilih kategori permintaan doa"
              v-model="formData.category"
              :options="categoryOptions"
              :error="errors.category"
              :required="true"
            />
  
            <!-- Toggle mode anonim -->
            <div class="form-group">
              <div class="toggle-section">
                <div class="toggle-info">
                  <label class="toggle-label">Mode Anonim</label>
                  <p class="toggle-desc">
                    Sembunyikan identitas Anda dalam permintaan doa ini
                  </p>
                </div>
                
                <div class="toggle-container">
                  <input 
                    type="checkbox" 
                    id="anonymous-toggle"
                    v-model="formData.isAnonymous"
                    class="toggle-input"
                  />
                  <label for="anonymous-toggle" class="toggle-switch">
                    <div class="toggle-slider"></div>
                  </label>
                </div>
              </div>
              
              <!-- Anonymous info -->
              <div v-if="formData.isAnonymous" class="anonymous-info">
                <EyeOff class="anonymous-icon" />
                <span>Permintaan ini akan ditampilkan sebagai "Anonim"</span>
              </div>
            </div>
  
            <!-- Textarea permintaan doa -->
            <div class="form-group">
              <label for="prayer-text" class="form-label">
                Permintaan Doa <span class="required">*</span>
              </label>
              <textarea
                id="prayer-text"
                v-model="formData.prayerText"
                placeholder="Tulis permintaan doa Anda di sini..."
                class="prayer-textarea"
                :class="{ 'error': errors.prayerText }"
                rows="6"
                maxlength="1000"
              ></textarea>
              
              <!-- Character counter -->
              <div class="char-counter">
                <span :class="{ 'warning': charCount > 900, 'error': charCount > 1000 }">
                  {{ charCount }}/1000 karakter
                </span>
              </div>
              
              <!-- Error message -->
              <p v-if="errors.prayerText" class="error-text">{{ errors.prayerText }}</p>
            </div>
  
            <!-- Checkbox urgent (optional) -->
            <div class="form-group">
              <div class="checkbox-container">
                <input 
                  type="checkbox" 
                  id="urgent-prayer"
                  v-model="formData.isUrgent"
                  class="checkbox-input"
                />
                <label for="urgent-prayer" class="checkbox-label">
                  <div class="checkbox-box">
                    <Check v-if="formData.isUrgent" class="check-icon" />
                  </div>
                  <span class="checkbox-text">Ini adalah permintaan doa yang mendesak</span>
                </label>
              </div>
            </div>
  
            <!-- Submit button -->
            <div class="submit-section">
              <ButtonPrimary 
                type="submit" 
                :disabled="!canSubmit || isSubmitting"
                :loading="isSubmitting"
              >
                <Send class="btn-icon" />
                {{ isSubmitting ? 'Mengirim...' : 'Kirim Permintaan Doa' }}
              </ButtonPrimary>
            </div>
  
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
  import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
  import SelectDropdown from '@/components/common/SelectDropdown.vue'
  import { EyeOff, Check, Send } from 'lucide-vue-next'
  import { addPrayerRequest, getPrayerCategories } from '@/services/prayerRequests.js'
  import { useUserStore } from '@/stores/userStore.js'
  
  export default {
    name: 'AddPrayerReq',
    components: {
      HeaderWithBack,
      ButtonPrimary,
      SelectDropdown,
      EyeOff,
      Check,
      Send
    },
    
    data() {
      return {
        formData: {
          category: '',
          prayerText: '',
          isAnonymous: false,
          isUrgent: false
        },
        
        errors: {
          category: '',
          prayerText: ''
        },
        
        isSubmitting: false,
        categories: getPrayerCategories()
      }
    },
    
    computed: {
      userStore() {
        return useUserStore()
      },
      
      categoryOptions() {
        return this.categories.map(cat => ({
          value: cat.value,
          label: `${cat.icon} ${cat.label}`
        }))
      },
      
      charCount() {
        return this.formData.prayerText.length
      },
      
      canSubmit() {
        return (
          this.formData.category.trim() !== '' &&
          this.formData.prayerText.trim() !== '' &&
          this.formData.prayerText.length <= 1000 &&
          !this.isSubmitting
        )
      }
    },
    
    methods: {
      async submitPrayerRequest() {
        try {
          if (!this.validateForm()) {
            return
          }
          
          this.isSubmitting = true
          this.clearErrors()
          
          console.log('🙏 [AddPrayer] Submitting prayer request...')
          
          // Get current user data
          const userData = this.userStore.user
          if (!userData) {
            throw new Error('User tidak ditemukan. Silakan login ulang.')
          }
          
          // Submit prayer request
          const prayerId = await addPrayerRequest(this.formData, userData)
          
          console.log('✅ [AddPrayer] Prayer request submitted successfully:', prayerId)
          
          // Show success message
          this.showSuccessMessage()
          
          // Redirect back to prayer list
          this.$router.push('/prayer-request')
          
        } catch (error) {
          console.error('❌ [AddPrayer] Error submitting prayer request:', error)
          this.handleSubmissionError(error)
        } finally {
          this.isSubmitting = false
        }
      },
      
      validateForm() {
        this.clearErrors()
        let isValid = true
        
        // Validate category
        if (!this.formData.category || this.formData.category.trim() === '') {
          this.errors.category = 'Kategori harus dipilih'
          isValid = false
        }
        
        // Validate prayer text
        if (!this.formData.prayerText || this.formData.prayerText.trim() === '') {
          this.errors.prayerText = 'Permintaan doa harus diisi'
          isValid = false
        } else if (this.formData.prayerText.length > 1000) {
          this.errors.prayerText = 'Permintaan doa maksimal 1000 karakter'
          isValid = false
        } else if (this.formData.prayerText.trim().length < 10) {
          this.errors.prayerText = 'Permintaan doa minimal 10 karakter'
          isValid = false
        }
        
        return isValid
      },
      
      clearErrors() {
        this.errors = {
          category: '',
          prayerText: ''
        }
      },
      
      handleSubmissionError(error) {
        if (error.message.includes('Kategori')) {
          this.errors.category = error.message
        } else if (error.message.includes('Permintaan doa') || error.message.includes('karakter')) {
          this.errors.prayerText = error.message
        } else {
          // General error
          alert('❌ Gagal mengirim permintaan doa!\n\nError: ' + error.message)
        }
      },
      
      showSuccessMessage() {
        const anonymousText = this.formData.isAnonymous ? ' (sebagai Anonim)' : ''
        const urgentText = this.formData.isUrgent ? '\n⚡ Ditandai sebagai mendesak' : ''
        
        alert(`✅ Permintaan doa berhasil dikirim${anonymousText}!${urgentText}\n\nTerima kasih telah berbagi. Jemaat akan mendoakan Anda.`)
      }
    }
  }
  </script>
  
  <style scoped>
  .add-prayer-container {
    background: #fcfcf7;
    min-height: 100vh;
  }
  
  .add-prayer-wrapper {
    padding: 16px;
    max-width: 360px;
    margin: 0 auto;
    padding-bottom: 40px;
  }
  
  /* Form container */
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  /* Info banner */
  .info-banner {
    display: flex;
    align-items: center;
    gap: 16px;
    background: linear-gradient(135deg, #41442A, #5a5e3d);
    border-radius: 12px;
    padding: 20px;
    color: white;
  }
  
  .banner-icon {
    font-size: 32px;
    flex-shrink: 0;
  }
  
  .banner-text h3 {
    font-family: 'Inter';
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }
  
  .banner-text p {
    font-family: 'Inter';
    font-size: 13px;
    margin: 0;
    opacity: 0.9;
    line-height: 1.3;
  }
  
  /* Form */
  .prayer-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-label {
    font-family: 'Inter';
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  
  .required {
    color: #dc3545;
  }
  
  /* Toggle section */
  .toggle-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .toggle-info {
    flex: 1;
    margin-right: 16px;
  }
  
  .toggle-label {
    font-family: 'Inter';
    font-size: 14px;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 4px;
  }
  
  .toggle-desc {
    font-family: 'Inter';
    font-size: 12px;
    color: #666;
    margin: 0;
    line-height: 1.3;
  }
  
  /* Toggle switch */
  .toggle-container {
    position: relative;
  }
  
  .toggle-input {
    display: none;
  }
  
  .toggle-switch {
    display: block;
    width: 44px;
    height: 24px;
    background: #ccc;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .toggle-input:checked + .toggle-switch {
    background: #41442A;
  }
  
  .toggle-slider {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .toggle-input:checked + .toggle-switch .toggle-slider {
    transform: translateX(20px);
  }
  
  /* Anonymous info */
  .anonymous-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    font-family: 'Inter';
    font-size: 12px;
    color: #666;
  }
  
  .anonymous-icon {
    width: 14px;
    height: 14px;
  }
  
  /* Textarea */
  .prayer-textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    font-family: 'Inter';
    font-size: 14px;
    border: 2px solid #41442A;
    border-radius: 8px;
    background: white;
    resize: vertical;
    box-sizing: border-box;
    line-height: 1.5;
    transition: border-color 0.2s ease;
  }
  
  .prayer-textarea:focus {
    outline: none;
    border-color: #5a5e3d;
    box-shadow: 0 0 0 3px rgba(65, 68, 42, 0.1);
  }
  
  .prayer-textarea.error {
    border-color: #dc3545;
  }
  
  .prayer-textarea::placeholder {
    color: #aaa;
  }
  
  /* Character counter */
  .char-counter {
    text-align: right;
    margin-top: 6px;
  }
  
  .char-counter span {
    font-family: 'Inter';
    font-size: 12px;
    color: #666;
  }
  
  .char-counter .warning {
    color: #ff9800;
  }
  
  .char-counter .error {
    color: #dc3545;
    font-weight: 600;
  }
  
  /* Checkbox */
  .checkbox-container {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .checkbox-input {
    display: none;
  }
  
  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    font-family: 'Inter';
    font-size: 14px;
    color: #333;
    line-height: 1.4;
  }
  
  .checkbox-box {
    width: 20px;
    height: 20px;
    border: 2px solid #41442A;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    transition: all 0.2s ease;
    flex-shrink: 0;
    margin-top: 1px;
  }
  
  .checkbox-input:checked + .checkbox-label .checkbox-box {
    background: #41442A;
    border-color: #41442A;
  }
  
  .check-icon {
    width: 12px;
    height: 12px;
    color: white;
  }
  
  .checkbox-text {
    font-weight: 500;
  }
  
  /* Submit section */
  .submit-section {
    margin-top: 20px;
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
  
  /* Error text */
  .error-text {
    color: #dc3545;
    font-family: 'Inter';
    font-size: 12px;
    margin-top: 6px;
    margin-bottom: 0;
  }
  
  /* Responsive */
  @media (max-width: 360px) {
    .add-prayer-wrapper {
      padding: 12px;
      padding-bottom: 40px;
    }
    
    .info-banner {
      padding: 16px;
    }
    
    .banner-text h3 {
      font-size: 15px;
    }
    
    .banner-text p {
      font-size: 12px;
    }
    
    .toggle-section,
    .checkbox-container {
      padding: 14px;
    }
    
    .prayer-textarea {
      min-height: 100px;
    }
  }
  
  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .toggle-switch,
    .toggle-slider,
    .checkbox-box,
    .prayer-textarea {
      transition: none;
    }
  }
  </style>