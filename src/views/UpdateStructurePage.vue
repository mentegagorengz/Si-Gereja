<template>
    <div class="update-structure-page">
      <div class="container">
        
        <!-- Header -->
        <div class="header-section">
          <h1 class="page-title">🔧 Database Structure Update</h1>
          <p class="page-subtitle">
            Tool untuk menambahkan field baru ke collection news secara otomatis
          </p>
        </div>
  
        <!-- Status Section -->
        <div class="status-section" v-if="updateStatus">
          <div class="status-card" :class="updateStatus.type">
            <div class="status-icon">
              <span v-if="updateStatus.type === 'loading'">⏳</span>
              <span v-else-if="updateStatus.type === 'success'">✅</span>
              <span v-else-if="updateStatus.type === 'error'">❌</span>
              <span v-else>ℹ️</span>
            </div>
            <div class="status-content">
              <h3 class="status-title">{{ updateStatus.title }}</h3>
              <p class="status-message">{{ updateStatus.message }}</p>
              <div v-if="updateStatus.details" class="status-details">
                <p><strong>Total Documents:</strong> {{ updateStatus.details.totalDocuments }}</p>
                <p><strong>Berhasil Diupdate:</strong> {{ updateStatus.details.updatedCount }}</p>
                <p><strong>Gagal Diupdate:</strong> {{ updateStatus.details.errorCount }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Action Section -->
        <div class="action-section">
          
          <!-- Update All Documents -->
          <div class="action-card">
            <div class="card-header">
              <h3 class="card-title">📊 Update All News Documents</h3>
              <p class="card-description">
                Menambahkan field <code>isEvent</code>, <code>showInAnnouncement</code>, 
                <code>priority</code> ke semua document di collection news.
              </p>
            </div>
            
            <div class="card-content">
              <div class="field-preview">
                <h4>Field yang akan ditambahkan:</h4>
                <ul>
                  <li><code>isEvent: boolean</code> - Apakah ini event atau news biasa</li>
                  <li><code>showInAnnouncement: boolean</code> - Tampil di announcement homepage</li>
                  <li><code>priority: number</code> - Prioritas tampil (1=tinggi, 3=rendah)</li>
                  <li><code>eventEndDate: string</code> - Tanggal selesai event (opsional)</li>
                  <li><code>updatedAt: timestamp</code> - Waktu update</li>
                  <li><code>updatedBy: string</code> - "AutoUpdateScript"</li>
                </ul>
              </div>
            </div>
            
            <div class="card-actions">
              <button 
                class="btn btn-primary" 
                @click="updateAllDocuments"
                :disabled="isProcessing"
              >
                <span v-if="isProcessing">⏳ Processing...</span>
                <span v-else>🚀 Update All Documents</span>
              </button>
            </div>
          </div>
  
          <!-- Test Single Document -->
          <div class="action-card">
            <div class="card-header">
              <h3 class="card-title">🧪 Test Single Document</h3>
              <p class="card-description">
                Test update pada satu document terlebih dahulu untuk memastikan script bekerja.
              </p>
            </div>
            
            <div class="card-content">
              <div class="input-group">
                <label for="docId">Document ID:</label>
                <input 
                  type="text" 
                  id="docId"
                  v-model="testDocId" 
                  placeholder="Masukkan ID document (contoh: Z6NtgDMXfZ8RL01jaZ0P)"
                  class="form-input"
                />
              </div>
            </div>
            
            <div class="card-actions">
              <button 
                class="btn btn-secondary" 
                @click="testSingleDocument"
                :disabled="isProcessing || !testDocId"
              >
                <span v-if="isProcessing">⏳ Testing...</span>
                <span v-else>🧪 Test Update</span>
              </button>
            </div>
          </div>
  
          <!-- Rollback -->
          <div class="action-card danger">
            <div class="card-header">
              <h3 class="card-title">🔄 Rollback Changes</h3>
              <p class="card-description">
                Menghapus semua field yang ditambahkan (jika terjadi kesalahan).
                <strong>Gunakan dengan hati-hati!</strong>
              </p>
            </div>
            
            <div class="card-actions">
              <button 
                class="btn btn-danger" 
                @click="rollbackChanges"
                :disabled="isProcessing"
              >
                <span v-if="isProcessing">⏳ Rolling back...</span>
                <span v-else>🗑️ Rollback Changes</span>
              </button>
            </div>
          </div>
  
        </div>
  
        <!-- Preview Section -->
        <div class="preview-section">
          <h3 class="section-title">📋 Preview Field Logic</h3>
          <div class="logic-table">
            <table>
              <thead>
                <tr>
                  <th>Category/Title</th>
                  <th>isEvent</th>
                  <th>showInAnnouncement</th>
                  <th>priority</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>event, ibadah, pelprap</td>
                  <td>✅ true</td>
                  <td>✅ true</td>
                  <td>1 (high)</td>
                  <td>Event/kegiatan gereja</td>
                </tr>
                <tr>
                  <td>birthday, ulang tahun</td>
                  <td>✅ true</td>
                  <td>✅ true</td>
                  <td>1 (high)</td>
                  <td>Ulang tahun jemaat</td>
                </tr>
                <tr>
                  <td>hasScheduleInfo: true</td>
                  <td>✅ true</td>
                  <td>✅ true</td>
                  <td>1 (high)</td>
                  <td>Ada info jadwal</td>
                </tr>
                <tr>
                  <td>announcement, info</td>
                  <td>❌ false</td>
                  <td>❌ false</td>
                  <td>2 (medium)</td>
                  <td>News biasa</td>
                </tr>
                <tr>
                  <td>default/lainnya</td>
                  <td>❌ false</td>
                  <td>❌ false</td>
                  <td>3 (low)</td>
                  <td>News general</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
      </div>
    </div>
  </template>
  
  <script>
  // Import script update
  import { 
    updateAllNewsDocuments, 
    updateSingleNewsDocument, 
    rollbackNewsStructure 
  } from '../utils/updateNewsStructure.js'
  
  export default {
    name: 'UpdateStructurePage',
    
    data() {
      return {
        isProcessing: false,
        testDocId: '',
        updateStatus: null
      }
    },
    
    methods: {
      /**
       * Update semua documents di collection news
       */
      async updateAllDocuments() {
        if (!confirm('Apakah Anda yakin ingin mengupdate SEMUA documents di collection news? Proses ini tidak bisa di-undo dengan mudah.')) {
          return
        }
        
        this.isProcessing = true
        this.updateStatus = {
          type: 'loading',
          title: 'Memproses Update...',
          message: 'Sedang mengupdate semua documents di collection news. Mohon tunggu...'
        }
        
        try {
          const result = await updateAllNewsDocuments()
          
          this.updateStatus = {
            type: 'success',
            title: 'Update Berhasil!',
            message: 'Semua documents berhasil diupdate dengan field baru.',
            details: result
          }
          
          // Auto-hide status setelah 10 detik
          setTimeout(() => {
            this.updateStatus = null
          }, 10000)
          
        } catch (error) {
          console.error('Error updating documents:', error)
          this.updateStatus = {
            type: 'error',
            title: 'Update Gagal!',
            message: `Terjadi error: ${error.message}`
          }
        } finally {
          this.isProcessing = false
        }
      },
      
      /**
       * Test update pada satu document
       */
      async testSingleDocument() {
        if (!this.testDocId.trim()) {
          alert('Masukkan Document ID terlebih dahulu')
          return
        }
        
        this.isProcessing = true
        this.updateStatus = {
          type: 'loading',
          title: 'Testing Update...',
          message: `Sedang mengupdate document: ${this.testDocId}`
        }
        
        try {
          const newFields = await updateSingleNewsDocument(this.testDocId)
          
          this.updateStatus = {
            type: 'success',
            title: 'Test Update Berhasil!',
            message: `Document ${this.testDocId} berhasil diupdate.`,
            details: {
              newFields: JSON.stringify(newFields, null, 2)
            }
          }
          
        } catch (error) {
          console.error('Error testing document:', error)
          this.updateStatus = {
            type: 'error',
            title: 'Test Update Gagal!',
            message: `Error: ${error.message}`
          }
        } finally {
          this.isProcessing = false
        }
      },
      
      /**
       * Rollback semua perubahan
       */
      async rollbackChanges() {
        if (!confirm('PERINGATAN: Ini akan menghapus semua field yang ditambahkan (isEvent, showInAnnouncement, dll) dari SEMUA documents. Apakah Anda yakin?')) {
          return
        }
        
        if (!confirm('Konfirmasi sekali lagi: Rollback akan menghapus semua field baru. Lanjutkan?')) {
          return
        }
        
        this.isProcessing = true
        this.updateStatus = {
          type: 'loading',
          title: 'Melakukan Rollback...',
          message: 'Menghapus field baru dari semua documents...'
        }
        
        try {
          await rollbackNewsStructure()
          
          this.updateStatus = {
            type: 'success',
            title: 'Rollback Berhasil!',
            message: 'Semua field baru telah dihapus dari collection news.'
          }
          
        } catch (error) {
          console.error('Error rollback:', error)
          this.updateStatus = {
            type: 'error',
            title: 'Rollback Gagal!',
            message: `Error: ${error.message}`
          }
        } finally {
          this.isProcessing = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .update-structure-page {
    background: #fcfcf7;
    min-height: 100vh;
    padding: 20px;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  /* Header */
  .header-section {
    text-align: center;
    margin-bottom: 32px;
  }
  
  .page-title {
    font-family: 'Inter';
    font-size: 28px;
    font-weight: 700;
    color: #41442A;
    margin: 0 0 8px 0;
  }
  
  .page-subtitle {
    font-family: 'Inter';
    font-size: 16px;
    color: #666;
    margin: 0;
  }
  
  /* Status Section */
  .status-section {
    margin-bottom: 32px;
  }
  
  .status-card {
    display: flex;
    gap: 16px;
    padding: 20px;
    border-radius: 12px;
    border-left: 4px solid;
  }
  
  .status-card.loading {
    background: #fff3cd;
    border-color: #ffc107;
  }
  
  .status-card.success {
    background: #d4edda;
    border-color: #28a745;
  }
  
  .status-card.error {
    background: #f8d7da;
    border-color: #dc3545;
  }
  
  .status-icon {
    font-size: 24px;
    flex-shrink: 0;
  }
  
  .status-title {
    font-family: 'Inter';
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }
  
  .status-message {
    font-family: 'Inter';
    margin: 0 0 12px 0;
  }
  
  .status-details {
    font-family: 'Inter';
    font-size: 14px;
  }
  
  .status-details p {
    margin: 4px 0;
  }
  
  /* Action Section */
  .action-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
  }
  
  .action-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .action-card.danger {
    border: 2px solid #dc3545;
  }
  
  .card-header {
    margin-bottom: 16px;
  }
  
  .card-title {
    font-family: 'Inter';
    font-size: 20px;
    font-weight: 600;
    color: #41442A;
    margin: 0 0 8px 0;
  }
  
  .card-description {
    font-family: 'Inter';
    color: #666;
    margin: 0;
  }
  
  .card-content {
    margin-bottom: 20px;
  }
  
  .field-preview h4 {
    font-family: 'Inter';
    font-size: 16px;
    color: #41442A;
    margin: 0 0 12px 0;
  }
  
  .field-preview ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .field-preview li {
    font-family: 'Inter';
    margin: 4px 0;
  }
  
  .field-preview code {
    background: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .input-group label {
    font-family: 'Inter';
    font-weight: 500;
    color: #41442A;
  }
  
  .form-input {
    font-family: 'Inter';
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    transition: border-color 0.2s ease;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #41442A;
  }
  
  .card-actions {
    display: flex;
    gap: 12px;
  }
  
  /* Buttons */
  .btn {
    font-family: 'Inter';
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-primary {
    background: #41442A;
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    background: #5a5e3d;
  }
  
  .btn-secondary {
    background: #6c757d;
    color: white;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background: #545b62;
  }
  
  .btn-danger {
    background: #dc3545;
    color: white;
  }
  
  .btn-danger:hover:not(:disabled) {
    background: #c82333;
  }
  
  /* Preview Section */
  .preview-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .section-title {
    font-family: 'Inter';
    font-size: 20px;
    font-weight: 600;
    color: #41442A;
    margin: 0 0 16px 0;
  }
  
  .logic-table {
    overflow-x: auto;
  }
  
  .logic-table table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Inter';
  }
  
  .logic-table th,
  .logic-table td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .logic-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #41442A;
  }
  
  .logic-table td {
    font-size: 14px;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 0 16px;
    }
    
    .action-card {
      padding: 20px;
    }
    
    .card-actions {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
    }
  }
  </style>