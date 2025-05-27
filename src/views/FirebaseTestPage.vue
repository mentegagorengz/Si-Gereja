<template>
  <div class="firebase-test">
    <HeaderWithBack title="Firebase Test" />
    
    <div class="test-results">
      <h3>Status Koneksi Firebase</h3>
      
      <div class="status-item">
        <span class="label">Koneksi Firebase:</span>
        <span :class="['status', initStatus === 'success' ? 'success' : 'error']">
          {{ initStatus === 'success' ? 'Berhasil' : initStatus === 'loading' ? 'Mengecek...' : 'Gagal' }}
        </span>
      </div>
      
      <div class="status-item">
        <span class="label">Firestore:</span>
        <span :class="['status', firestoreStatus === 'success' ? 'success' : 'error']">
          {{ firestoreStatus === 'success' ? 'Berhasil' : firestoreStatus === 'loading' ? 'Mengecek...' : 'Gagal' }}
        </span>
      </div>
      
      <div v-if="errorMessage" class="error-message">
        <p>Error message: {{ errorMessage }}</p>
      </div>
      
      <div v-if="testData.length > 0" class="test-data">
        <h4>Sample Data dari Firestore:</h4>
        <pre>{{ JSON.stringify(testData, null, 2) }}</pre>
      </div>
      
      <ButtonPrimary @click="runTest">Uji Koneksi Lagi</ButtonPrimary>
    </div>
  </div>
</template>

<script>
import { db } from '@/services/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import HeaderWithBack from '@/components/layout/HeaderWithBack.vue';
import ButtonPrimary from '@/components/common/ButtonPrimary.vue';

export default {
  name: 'FirebaseTestPage',
  components: {
    HeaderWithBack,
    ButtonPrimary
  },
  data() {
    return {
      initStatus: 'loading',
      firestoreStatus: 'loading', 
      errorMessage: '',
      testData: []
    };
  },
  mounted() {
    this.runTest();
  },
  methods: {
    async runTest() {
      // Reset status dan error
      this.initStatus = 'loading';
      this.firestoreStatus = 'loading';
      this.errorMessage = '';
      this.testData = [];
      
      try {
        // Test Firebase initialization
        if (!db) {
          throw new Error('Firebase DB tidak terinstansiasi dengan benar');
        }
        this.initStatus = 'success';
        
        // Test Firestore connection by fetching data
        try {
          // ===== UPDATE DIMULAI DARI SINI ===== 
          
          // Test collection jemaat
          const jemaatQuery = query(collection(db, 'jemaat'), limit(1));
          const jemaatSnapshot = await getDocs(jemaatQuery);
          
          if (jemaatSnapshot.empty) {
            this.testData.push({ collection: 'jemaat', message: 'Tidak ada data dalam collection jemaat' });
          } else {
            jemaatSnapshot.forEach(doc => {
              const data = doc.data();
              if (data.password) delete data.password;
              
              this.testData.push({
                collection: 'jemaat',
                id: doc.id,
                ...data
              });
            });
          }

          // Test collection schedules (INI YANG BARU DITAMBAH!)
          const schedulesQuery = query(collection(db, 'schedules'), limit(3));
          const schedulesSnapshot = await getDocs(schedulesQuery);
          
          if (schedulesSnapshot.empty) {
            this.testData.push({ collection: 'schedules', message: 'Tidak ada data dalam collection schedules' });
          } else {
            schedulesSnapshot.forEach(doc => {
              this.testData.push({
                collection: 'schedules',
                id: doc.id,
                ...doc.data()
              });
            });
          }

          // Test collection news (BARU DITAMBAH!)
          const newsQuery = query(collection(db, 'news'), limit(3));
          const newsSnapshot = await getDocs(newsQuery);
          
          if (newsSnapshot.empty) {
            this.testData.push({ collection: 'news', message: 'Tidak ada data dalam collection news' });
          } else {
            newsSnapshot.forEach(doc => {
              this.testData.push({
                collection: 'news',
                id: doc.id,
                ...doc.data()
              });
            });
          }
          
          // ===== UPDATE SELESAI SAMPAI SINI =====
          
          this.firestoreStatus = 'success';
        } catch (firestoreError) {
          this.firestoreStatus = 'error';
          this.errorMessage = `Error Firestore: ${firestoreError.message}`;
          throw firestoreError;
        }
      } catch (error) {
        this.initStatus = 'error';
        this.errorMessage = `Error: ${error.message}`;
        console.error('Firebase test error:', error);
      }
    }
  }
};
</script>

<style scoped>
.firebase-test {
  padding: 16px;
  background-color: #fcfcf7;
  min-height: 100vh;
}

.test-results {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-top: 0;
  color: #41442A;
  font-family: 'Inter';
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.label {
  font-weight: 600;
  color: #333;
}

.status {
  font-weight: 600;
}

.success {
  color: #2e7d32;
}

.error {
  color: #d32f2f;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background-color: #ffebee;
  border-radius: 4px;
  color: #d32f2f;
}

.test-data {
  margin-top: 16px;
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow: auto;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
}
</style>