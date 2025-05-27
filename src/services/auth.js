import { db } from './firebase';
import { 
  collection, doc, getDoc, updateDoc, 
  query, where, getDocs 
} from 'firebase/firestore';
import CryptoJS from 'crypto-js';

export async function checkJemaatExists(nama) {
  try {
    console.log('🔍 [checkJemaatExists] Checking nama:', `"${nama}"`);
    
    const jemaatRef = collection(db, "jemaat");
    const q = query(jemaatRef, where("nama", "==", nama.trim()));
    const querySnapshot = await getDocs(q);
    
    console.log('🔍 [checkJemaatExists] Result:', !querySnapshot.empty);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("❌ [checkJemaatExists] Error:", error);
    throw error;
  }
}

export async function getJemaatDocId(nama) {
  try {
    console.log('🔍 [getJemaatDocId] Getting doc ID for nama:', `"${nama}"`);
    
    const jemaatRef = collection(db, "jemaat");
    const q = query(jemaatRef, where("nama", "==", nama.trim()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Nama tidak ditemukan");
    }
    
    const docId = querySnapshot.docs[0].id;
    console.log('✅ [getJemaatDocId] Found doc ID:', docId);
    
    return docId;
  } catch (error) {
    console.error("❌ [getJemaatDocId] Error:", error);
    throw error;
  }
}

export async function registerJemaat(nama, password, userData) {
  try {
    console.log('🔍 [registerJemaat] Starting registration for:', `"${nama}"`);
    
    const docId = await getJemaatDocId(nama);
    
    const jemaatRef = doc(db, "jemaat", docId);
    const jemaatDoc = await getDoc(jemaatRef);
    
    if (!jemaatDoc.exists()) {
      throw new Error("Nama anda belum terdaftar, segera hubungi gembala/admin");
    }
    
    const jemaatData = jemaatDoc.data();
    
    if (jemaatData.isRegistered) {
      throw new Error("Akun dengan nama ini sudah terdaftar");
    }
    
    const encryptedPassword = CryptoJS.SHA256(password).toString();
    console.log('🔍 [registerJemaat] Password encrypted');
    
    // Update data jemaat
    await updateDoc(jemaatRef, {
      password: encryptedPassword,
      isRegistered: true,
      tanggalLahir: userData.tanggalLahir,
      status: userData.status,
      sektor: userData.sektor
    });
    
    console.log('✅ [registerJemaat] Registration successful');
    return true;
  } catch (error) {
    console.error("❌ [registerJemaat] Error:", error);
    throw error;
  }
}

// Fungsi untuk login
export async function loginJemaat(nama, password) {
  try {
    // ✅ PERBAIKAN: Validasi input dengan syntax yang benar
    if (!nama || typeof nama !== 'string') {
      console.error('❌ [loginJemaat] Invalid nama parameter:', nama);
      throw new Error("Nama harus diisi dengan benar");
    }
    
    if (!password || typeof password !== 'string') {
      console.error('❌ [loginJemaat] Invalid password parameter:', password);
      throw new Error("Password harus diisi dengan benar");
    } // ✅ PERBAIKAN: Tambah closing brace yang hilang

    console.log('🔍 [loginJemaat] Starting login for nama:', `"${nama}"`);
    
    const jemaatRef = collection(db, "jemaat");
    
    // Debug - Tampilkan semua data di collection untuk troubleshooting
    console.log('🔍 [loginJemaat] Fetching all documents for debugging...');
    const allSnapshot = await getDocs(jemaatRef);
    console.log('🔍 [loginJemaat] Total documents in collection:', allSnapshot.size);
    
    allSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`🔍 [loginJemaat] Doc ${index + 1}:`, {
        id: doc.id,
        nama: `"${data.nama}"`,
        isRegistered: data.isRegistered,
        hasPassword: !!data.password,
        sektor: data.sektor || 'N/A'
      });
    });
    
    // Query dengan trim dan coba case-insensitive jika perlu
    const cleanNama = nama.trim();
    const q = query(jemaatRef, where("nama", "==", cleanNama));
    
    console.log('🔍 [loginJemaat] Searching for exact match with nama:', `"${cleanNama}"`);
    const querySnapshot = await getDocs(q);
    
    // Jika tidak ditemukan, coba case-insensitive search
    if (querySnapshot.empty) {
      console.log('⚠️ [loginJemaat] Exact match not found, trying case-insensitive search...');
      
      let foundDoc = null;
      allSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nama && data.nama.toLowerCase().trim() === cleanNama.toLowerCase()) {
          foundDoc = { id: doc.id, ...data };
          console.log('✅ [loginJemaat] Found case-insensitive match:', data.nama);
        }
      });
      
      if (!foundDoc) {
        console.log('❌ [loginJemaat] No match found even with case-insensitive search');
        console.log('🔍 [loginJemaat] Available names in database:');
        allSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`   - "${data.nama}"`);
        });
        throw new Error(`Nama "${nama}" tidak ditemukan di database`);
      }
      
      // Gunakan dokumen yang ditemukan dengan case-insensitive
      const jemaatData = foundDoc;
      const jemaatDoc = { id: foundDoc.id };
      
      // Lanjutkan ke verifikasi
      return await verifyAndLogin(jemaatDoc, jemaatData, password);
    }
    
    // Jika ditemukan dengan exact match
    const jemaatDoc = querySnapshot.docs[0];
    const jemaatData = jemaatDoc.data();
    
    console.log('✅ [loginJemaat] Found exact match for nama:', jemaatData.nama);
    
    return await verifyAndLogin(jemaatDoc, jemaatData, password);
    
  } catch (error) {
    console.error("❌ [loginJemaat] Error:", error);
    throw error;
  }
}

// Helper function untuk verifikasi dan login
async function verifyAndLogin(jemaatDoc, jemaatData, password) {
  console.log('🔍 [verifyAndLogin] Verifying user data...');
  
  // Cek apakah sudah terdaftar
  if (!jemaatData.isRegistered) {
    console.log('❌ [verifyAndLogin] User not registered yet');
    throw new Error("Akun belum terdaftar. Silakan registrasi terlebih dahulu.");
  }
  
  console.log('✅ [verifyAndLogin] User is registered, checking password...');
  
  // Verifikasi password
  const encryptedPassword = CryptoJS.SHA256(password).toString();
  
  console.log('🔍 [verifyAndLogin] Password hash comparison:');
  console.log('   - Input password hash:', encryptedPassword.substring(0, 20) + '...');
  console.log('   - Database password hash:', (jemaatData.password || 'MISSING').substring(0, 20) + '...');
  
  if (jemaatData.password !== encryptedPassword) {
    console.log('❌ [verifyAndLogin] Password mismatch');
    throw new Error("Password tidak sesuai");
  }
  
  console.log('✅ [verifyAndLogin] Password verified, login successful!');
  
  // Return data jemaat
  const userData = {
    id: jemaatDoc.id,
    ...jemaatData
  };
  
  // Jangan return password hash untuk keamanan
  delete userData.password;
  
  console.log('✅ [verifyAndLogin] Returning user data (password removed for security)');
  
  return userData;
}

// Fungsi untuk logout
export async function logoutJemaat() {
  console.log('🔍 [logoutJemaat] Logging out user');
  localStorage.removeItem('user');
  console.log('✅ [logoutJemaat] User logged out successfully');
  return true;
}

// Fungsi untuk mendapatkan data jemaat yang sedang login
export async function getCurrentJemaat() {
  try {
    console.log('🔍 [getCurrentJemaat] Checking localStorage...');
    
    const userDataString = localStorage.getItem('user');
    console.log('🔍 [getCurrentJemaat] Raw localStorage data:', userDataString);
    
    if (!userDataString) {
      console.log('❌ [getCurrentJemaat] No user data in localStorage');
      return null;
    }
    
    const userData = JSON.parse(userDataString);
    console.log('✅ [getCurrentJemaat] Parsed user data:', userData);
    
    // Validasi data
    if (!userData.nama) {
      console.log('❌ [getCurrentJemaat] User data invalid - no nama field');
      return null;
    }
    
    console.log('✅ [getCurrentJemaat] Returning valid user:', userData.nama);
    return userData;
  } catch (error) {
    console.error('❌ [getCurrentJemaat] Error parsing user data:', error);
    // Clear corrupted data
    localStorage.removeItem('user');
    return null;
  }
}