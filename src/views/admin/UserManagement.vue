<template>
    <div class="user-management">
      <div class="admin-wrapper">
        <div class="admin-header">
          <button @click="goBack" class="back-btn">←</button>
          <h1 class="page-title">👥 Kelola User</h1>
        </div>
  
        <div class="placeholder-content">
          <div class="placeholder-icon">🚧</div>
          <h2>User Management</h2>
          <p>Halaman kelola user akan tersedia setelah development selesai.</p>
          
          <div class="features-list">
            <div class="feature-item">✅ Lihat daftar jemaat</div>
            <div class="feature-item">✅ Edit role user</div>
            <div class="feature-item">✅ Tambah user baru</div>
            <div class="feature-item">✅ Hapus user</div>
          </div>
          
          <button @click="goBack" class="back-button">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserManagement',
    methods: {
      goBack() {
        this.$router.push('/admin/dashboard')
      }
    }
  }
  </script>
  
  <style scoped>
  .user-management {
    background: #f8f9fa;
    min-height: 100vh;
    padding: 16px;
  }
  
  .admin-wrapper {
    max-width: 360px;
    margin: 0 auto;
  }
  
  .admin-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  
  .back-btn {
    width: 32px;
    height: 32px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .page-title {
    font-family: 'Inter';
    font-size: 18px;
    font-weight: 600;
    color: #dc3545;
    margin: 0;
  }
  
  .placeholder-content {
    background: white;
    border-radius: 12px;
    padding: 32px 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .placeholder-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .placeholder-content h2 {
    font-family: 'Inter';
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0 0 8px 0;
  }
  
  .placeholder-content p {
    font-family: 'Inter';
    font-size: 14px;
    color: #666;
    margin: 0 0 24px 0;
    line-height: 1.5;
  }
  
  .features-list {
    text-align: left;
    margin: 24px 0;
  }
  
  .feature-item {
    font-family: 'Inter';
    font-size: 14px;
    color: #333;
    margin: 8px 0;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 6px;
  }
  
  .back-button {
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-family: 'Inter';
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .back-button:hover {
    background: #c82333;
  }
  </style>