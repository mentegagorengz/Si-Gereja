import { db } from './firebase';
import { 
  collection, doc, getDoc, updateDoc, 
  query, where, getDocs 
} from 'firebase/firestore';
import CryptoJS from 'crypto-js';

// ⭐ TAMBAHAN BARU: Function untuk AutoComplete
export async function getAllJemaatNames() {
  try {
    console.log('🔍 [getAllJemaatNames] Fetching all jemaat names for autocomplete...');
    
    const jemaatRef = collection(db, "jemaat");
    const querySnapshot = await getDocs(jemaatRef);
    
    const namesList = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.nama) {
        namesList.push({
          id: doc.id,
          nama: data.nama,
          sektor: data.sektor || null,
          status: data.status || null,
          isRegistered: data.isRegistered || false
        });
      }
    });
    
    // Sort alphabetically
    namesList.sort((a, b) => a.nama.localeCompare(b.nama));
    
    console.log('✅ [getAllJemaatNames] Loaded', namesList.length, 'names for autocomplete');
    return namesList;
    
  } catch (error) {
    console.error("❌ [getAllJemaatNames] Error:", error);
    throw error;
  }
}

export async function checkJemaatExists(nama) {
  try {
    if (!nama || typeof nama !== 'string') {
      console.error('❌ [checkJemaatExists] Invalid nama parameter:', nama);
      return false;
    }

    const cleanNama = nama.trim();
    console.log('🔍 [checkJemaatExists] Checking nama:', `"${cleanNama}"`);
    
    const jemaatRef = collection(db, "jemaat");
    
    // ⭐ DEBUGGING: Cek semua data di collection
    console.log('🔍 [checkJemaatExists] Fetching all documents for debugging...');
    const allSnapshot = await getDocs(jemaatRef);
    console.log('🔍 [checkJemaatExists] Total documents in collection:', allSnapshot.size);
    
    // Print semua nama yang ada di database
    const availableNames = [];
    allSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.nama) {
        availableNames.push(data.nama);
        console.log(`🔍 [checkJemaatExists] Available name: "${data.nama}"`);
      }
    });
    
    // ⭐ FIX 1: Exact match first
    const exactQuery = query(jemaatRef, where("nama", "==", cleanNama));
    const exactSnapshot = await getDocs(exactQuery);
    
    if (!exactSnapshot.empty) {
      console.log('✅ [checkJemaatExists] EXACT MATCH found for:', cleanNama);
      return true;
    }
    
    // ⭐ FIX 2: Case-insensitive fallback
    console.log('🔄 [checkJemaatExists] Exact match not found, trying case-insensitive...');
    
    const foundMatch = availableNames.find(dbName => 
      dbName.toLowerCase().trim() === cleanNama.toLowerCase()
    );
    
    if (foundMatch) {
      console.log('✅ [checkJemaatExists] CASE-INSENSITIVE MATCH found:', foundMatch);
      return true;
    }
    
    // ⭐ FIX 3: Partial match untuk debugging
    const partialMatches = availableNames.filter(dbName => 
      dbName.toLowerCase().includes(cleanNama.toLowerCase()) ||
      cleanNama.toLowerCase().includes(dbName.toLowerCase())
    );
    
    if (partialMatches.length > 0) {
      console.log('⚠️ [checkJemaatExists] PARTIAL MATCHES found:', partialMatches);
      console.log('💡 [checkJemaatExists] Did you mean one of these names?');
    }
    
    console.log('❌ [checkJemaatExists] NO MATCH found for:', cleanNama);
    console.log('📋 [checkJemaatExists] Available names in database:', availableNames);
    
    return false;
    
  } catch (error) {
    console.error("❌ [checkJemaatExists] Error:", error);
    throw error;
  }
}

export async function getJemaatDocId(nama) {
  try {
    if (!nama || typeof nama !== 'string') {
      throw new Error("Nama parameter tidak valid");
    }

    const cleanNama = nama.trim();
    console.log('🔍 [getJemaatDocId] Getting doc ID for nama:', `"${cleanNama}"`);
    
    const jemaatRef = collection(db, "jemaat");
    
    // Try exact match first
    const exactQuery = query(jemaatRef, where("nama", "==", cleanNama));
    const exactSnapshot = await getDocs(exactQuery);
    
    if (!exactSnapshot.empty) {
      const docId = exactSnapshot.docs[0].id;
      console.log('✅ [getJemaatDocId] Found exact match, doc ID:', docId);
      return docId;
    }
    
    // Fallback: case-insensitive search
    console.log('🔄 [getJemaatDocId] Exact match not found, trying case-insensitive...');
    const allSnapshot = await getDocs(jemaatRef);
    
    let foundDoc = null;
    allSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.nama && data.nama.toLowerCase().trim() === cleanNama.toLowerCase()) {
        foundDoc = doc;
        console.log('✅ [getJemaatDocId] Found case-insensitive match:', data.nama);
      }
    });
    
    if (foundDoc) {
      return foundDoc.id;
    }
    
    throw new Error(`Nama "${nama}" tidak ditemukan di database`);
    
  } catch (error) {
    console.error("❌ [getJemaatDocId] Error:", error);
    throw error;
  }
}


export async function registerJemaat(nama, password, userData) {
  try {
    if (!nama || !password) {
      throw new Error("Nama dan password harus diisi");
    }

    console.log('🔍 [registerJemaat] Starting registration for:', `"${nama}"`);
    
    // ⭐ FIX: Cek dulu apakah nama exists
    const nameExists = await checkJemaatExists(nama);
    if (!nameExists) {
      throw new Error("Nama anda belum terdaftar, segera hubungi gembala/admin");
    }
    
    const docId = await getJemaatDocId(nama);
    
    const jemaatRef = doc(db, "jemaat", docId);
    const jemaatDoc = await getDoc(jemaatRef);
    
    if (!jemaatDoc.exists()) {
      throw new Error("Data jemaat tidak ditemukan");
    }
    
    const jemaatData = jemaatDoc.data();
    
    // ⭐ FIX: Cek apakah sudah terdaftar
    if (jemaatData.isRegistered === true) {
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
      sektor: userData.sektor,
      registeredAt: new Date() // ⭐ TAMBAH: timestamp registrasi
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
    // Validasi input
    if (!nama || typeof nama !== 'string') {
      throw new Error("Nama harus diisi dengan benar");
    }
    
    if (!password || typeof password !== 'string') {
      throw new Error("Password harus diisi dengan benar");
    }

    console.log('🔍 [loginJemaat] Starting login for nama:', `"${nama}"`);
    
    const jemaatRef = collection(db, "jemaat");
    const cleanNama = nama.trim();
    
    // Try exact match first
    const exactQuery = query(jemaatRef, where("nama", "==", cleanNama));
    const exactSnapshot = await getDocs(exactQuery);
    
    let jemaatDoc = null;
    let jemaatData = null;
    
    if (!exactSnapshot.empty) {
      jemaatDoc = exactSnapshot.docs[0];
      jemaatData = jemaatDoc.data();
      console.log('✅ [loginJemaat] Found exact match:', jemaatData.nama);
    } else {
      // Fallback: case-insensitive search
      console.log('🔄 [loginJemaat] Exact match not found, trying case-insensitive...');
      const allSnapshot = await getDocs(jemaatRef);
      
      allSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nama && data.nama.toLowerCase().trim() === cleanNama.toLowerCase()) {
          jemaatDoc = doc;
          jemaatData = data;
          console.log('✅ [loginJemaat] Found case-insensitive match:', data.nama);
        }
      });
      
      if (!jemaatDoc) {
        throw new Error(`Nama "${nama}" tidak ditemukan di database`);
      }
    }
    
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
  
  if (jemaatData.password !== encryptedPassword) {
    console.log('❌ [verifyAndLogin] Password mismatch');
    throw new Error("Password tidak sesuai");
  }
  
  console.log('✅ [verifyAndLogin] Password verified, login successful!');
  
  // Return data jemaat (hapus password untuk keamanan)
  const userData = {
    id: jemaatDoc.id,
    ...jemaatData
  };
  
  delete userData.password;
  
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