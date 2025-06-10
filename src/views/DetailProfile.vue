<!-- src/views/DetailProfile.vue - USING EXISTING COMPONENTS -->
<template>
    <div class="profile-detail-container">
      <div class="profile-wrapper">
        <!-- Header dengan tombol back -->
        <HeaderWithBack title="Profile" />
  
        <!-- Profile Photo Section -->
        <div class="photo-section">
          <div class="profile-photo">
            <span class="photo-text">{{ userInitial }}</span>
          </div>
          <button class="change-photo-btn" @click="changePhoto">
            Ubah Foto Profil
          </button>
        </div>
  
        <!-- Form Fields menggunakan component yang ada -->
        <div class="form-section">
          <!-- Nama -->
          <FormInput
            id="profile-nama"
            label="Nama"
            v-model="profileData.nama"
            placeholder="Masukkan nama lengkap"
            type="text"
            :disabled="!isEditing"
            :required="true"
          />
  
          <!-- Tanggal Lahir -->
          <FormInput
            id="profile-tanggal-lahir"
            label="Tanggal lahir"
            v-model="profileData.tanggalLahir"
            type="date"
            :disabled="!isEditing"
          />
  
          <!-- Status -->
          <SelectDropdown
            id="profile-status"
            label="Status"
            v-model="profileData.status"
            :disabled="!isEditing"
            :options="statusOptions"
            placeholder="Pilih status"
          />
  
          <!-- Sektor -->
          <SelectDropdown
            id="profile-sektor"
            label="Sektor"
            v-model="profileData.sektor"
            :disabled="!isEditing"
            :options="sektorOptions"
            placeholder="Pilih sektor"
          />
  
          <!-- Jenis Kelamin -->
          <SelectDropdown
            id="profile-jenis-kelamin"
            label="Jenis Kelamin"
            v-model="profileData.jenisKelamin"
            :disabled="!isEditing"
            :options="jenisKelaminOptions"
            placeholder="Pilih jenis kelamin"
          />
  
          <!-- No. Telepon -->
          <FormInput
            id="profile-no-telp"
            label="No. Telp"
            v-model="profileData.noTelp"
            placeholder="08xxxxxxxxxx"
            type="tel"
            :disabled="!isEditing"
          />
        </div>
  
        <!-- Action Buttons -->
        <div class="action-buttons">
          <ButtonPrimary 
            v-if="!isEditing" 
            @click="startEditing"
            :fullWidth="true"
          >
            <Edit class="btn-icon" />
            Edit Profile
          </ButtonPrimary>
          
          <div v-else class="edit-actions">
            <ButtonPrimary 
              @click="cancelEditing"
              variant="secondary"
              :fullWidth="false"
            >
              <X class="btn-icon" />
              Batal
            </ButtonPrimary>
            <ButtonPrimary 
                @click="saveProfile"
                :fullWidth="false"
                :loading="isLoading"
                :disabled="isLoading"
            >
                <Check class="btn-icon" />
                {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import HeaderWithBack from '@/components/layout/HeaderWithBack.vue'
  import FormInput from '@/components/common/FormInput.vue'
  import SelectDropdown from '@/components/common/SelectDropdown.vue'
  import ButtonPrimary from '@/components/common/ButtonPrimary.vue'
  import { Edit, Check, X } from 'lucide-vue-next'
  import { useUserStore } from '@/stores/userStore'
  import { updateUserProfile } from '@/services/profileService'
  
  export default {
    name: 'DetailProfile',
    components: {
      HeaderWithBack,
      FormInput,
      SelectDropdown,
      ButtonPrimary,
      Edit,
      Check,
      X
    },
    
    data() {
      return {
        isEditing: false,
        isLoading: false,
        profileData: {
          nama: '',
          tanggalLahir: '',
          status: '',
          sektor: '',
          jenisKelamin: '',
          noTelp: ''
        },
        originalData: {}, // Backup data untuk cancel
        
        // Options untuk dropdown
        statusOptions: ['Menikah', 'Single', 'Janda/Duda'],
        sektorOptions: ['Tesalonika', 'Anugerah'],
        jenisKelaminOptions: ['Laki-laki', 'Perempuan']
      }
    },
    
    computed: {
      userStore() {
        return useUserStore()
      },
      
      userInitial() {
        return this.profileData.nama.charAt(0).toUpperCase() || 'U'
      }
    },
    
    created() {
      this.loadUserProfile()
    },
    
    methods: {
      loadUserProfile() {
        console.log('📋 [DetailProfile] Loading user profile...')
        
        // Ambil data asli dari userStore tanpa default values
        const user = this.userStore.user
        
        if (user) {
          console.log('👤 [DetailProfile] Raw user data:', user)
          
          this.profileData = {
            // Ambil nama dari berbagai kemungkinan field
            nama: user.nama || user.namaUser || '',
            
            // Format tanggal lahir dari database
            tanggalLahir: this.formatDateForInput(user.tanggalLahir) || '',
            
            // Ambil status dari database
            status: user.status || '',
            
            // Ambil sektor dari database
            sektor: user.sektor || '',
            
            // Ambil jenis kelamin dari database
            jenisKelamin: user.jenisKelamin || '',
            
            // Ambil nomor telepon dari database
            noTelp: user.noTelp || ''
          }
          
          console.log('✅ [DetailProfile] Profile data loaded:', this.profileData)
        } else {
          console.log('❌ [DetailProfile] No user data found in store')
          // Jika tidak ada user data, semua field tetap kosong
        }
      },
      
      formatDateForInput(dateValue) {
        if (!dateValue) return ''
        
        try {
          // Jika dateValue adalah Firestore Timestamp
          if (dateValue.toDate && typeof dateValue.toDate === 'function') {
            const date = dateValue.toDate()
            return date.toISOString().split('T')[0]
          }
          
          // Jika dateValue adalah string atau Date object
          const date = new Date(dateValue)
          if (isNaN(date.getTime())) {
            console.warn('⚠️ [DetailProfile] Invalid date format:', dateValue)
            return ''
          }
          
          return date.toISOString().split('T')[0]
        } catch (error) {
          console.error('❌ [DetailProfile] Error formatting date:', error)
          return ''
        }
      },
      
      startEditing() {
        this.isEditing = true
        // Backup original data untuk cancel
        this.originalData = { ...this.profileData }
        console.log('✏️ [DetailProfile] Started editing mode')
      },
      
      cancelEditing() {
        this.isEditing = false
        // Restore original data
        this.profileData = { ...this.originalData }
        console.log('❌ [DetailProfile] Cancelled editing, restored original data')
      },
      
      async saveProfile() {
        try {
            console.log('💾 [DetailProfile] Saving profile...', this.profileData)
            
            // Validasi basic
            if (!this.profileData.nama.trim()) {
            alert('❌ Nama harus diisi!')
            return
            }
            
            // Tampilkan loading state
            this.isLoading = true
            
            // ⭐ UPDATE KE FIREBASE DATABASE dengan history tracking
            // Gunakan ID yang tersedia (prioritas: id > documentId > nama sebagai fallback)
            const userId = this.userStore.user.id || 
                        this.userStore.user.documentId || 
                        this.userStore.user.nama
            
            if (!userId) {
            throw new Error('User identifier tidak ditemukan. Silakan login ulang.')
            }
            
            console.log('🔍 [DetailProfile] Using userId:', userId)
            
            const result = await updateUserProfile(userId, {
            nama: this.profileData.nama,
            tanggalLahir: this.profileData.tanggalLahir,
            status: this.profileData.status,
            sektor: this.profileData.sektor,
            jenisKelamin: this.profileData.jenisKelamin,
            noTelp: this.profileData.noTelp
            }, 'user') // 'user' = diupdate oleh user sendiri
            
            console.log('🔥 [DetailProfile] Firebase update result:', result)
            
            // Update local userStore dan localStorage
            const updatedUser = {
            ...this.userStore.user,
            nama: this.profileData.nama,
            namaUser: this.profileData.nama,
            tanggalLahir: this.profileData.tanggalLahir,
            status: this.profileData.status,
            sektor: this.profileData.sektor,
            jenisKelamin: this.profileData.jenisKelamin,
            noTelp: this.profileData.noTelp,
            lastUpdated: new Date().toISOString()
            }
            
            // Set user data ke store
            this.userStore.setUser(updatedUser)
            
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser))
            
            this.isEditing = false
            this.isLoading = false
            
            console.log('✅ [DetailProfile] Profile saved successfully')
            console.log('📋 [DetailProfile] Updated user data:', updatedUser)
            
            // Tampilkan pesan sukses dengan info changes
            const changesCount = result.changesCount || 0
            if (changesCount > 0) {
            alert(`✅ Profile berhasil disimpan!\n🔄 ${changesCount} perubahan tersimpan di database`)
            } else {
            alert('ℹ️ Tidak ada perubahan yang terdeteksi')
            }
            
        } catch (error) {
            console.error('❌ [DetailProfile] Error saving profile:', error)
            this.isLoading = false
            
            // Handle specific errors
            if (error.message.includes('User tidak ditemukan')) {
            alert('❌ User tidak ditemukan di database!')
            } else if (error.message.includes('permission')) {
            alert('❌ Tidak memiliki permission untuk mengubah data!')
            } else {
            alert('❌ Gagal menyimpan profile ke database!\n\nError: ' + error.message)
            }
        }
        },
      
      changePhoto() {
        // TODO: Implementasi change photo
        alert('📷 Fitur ubah foto akan tersedia setelah development selesai!')
      }
    }
  }
  </script>
  
  <style scoped>
  .profile-detail-container {
    background: #fcfcf7;
    min-height: 100vh;
  }
  
  .profile-wrapper {
    padding: 16px;
    max-width: 360px;
    margin: 0 auto;
  }
  
  /* Photo Section */
  .photo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 0;
    margin-bottom: 24px;
  }
  
  .profile-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .photo-text {
    color: white;
    font-size: 36px;
    font-weight: bold;
    font-family: 'Inter';
  }
  
  .change-photo-btn {
    background: none;
    border: none;
    color: #007AFF;
    font-family: 'Inter';
    font-size: 16px;
    cursor: pointer;
    padding: 8px;
  }
  
  .change-photo-btn:hover {
    text-decoration: underline;
  }
  
  /* Form Section */
  .form-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
  }
  
  /* Action Buttons */
  .action-buttons {
    padding: 20px 0;
  }
  
  .edit-actions {
    display: flex;
    gap: 12px;
  }
  
  .edit-actions .btn-icon {
    width: 18px;
    height: 18px;
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
  
  /* Responsive */
  @media (max-width: 360px) {
    .profile-wrapper {
      padding: 12px;
    }
    
    .photo-section {
      padding: 24px 0;
    }
    
    .profile-photo {
      width: 80px;
      height: 80px;
    }
    
    .photo-text {
      font-size: 28px;
    }
  }
  </style>