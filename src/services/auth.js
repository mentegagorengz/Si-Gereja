import { db } from './firebase';
import { 
  collection, doc, getDoc, updateDoc, 
  query, where, getDocs 
} from 'firebase/firestore';
import { sha256 } from 'crypto-js'; // Tambahkan library ini untuk enkripsi password

// Fungsi untuk mencari jemaat berdasarkan nama
export async function checkJemaatExists(nama) {
  try {
    // Query untuk mencari dokumen jemaat dengan nama tertentu
    const jemaatRef = collection(db, "jemaat");
    const q = query(jemaatRef, where("nama", "==", nama));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty; // Return true jika ditemukan
  } catch (error) {
    console.error("Error checking jemaat:", error);
    throw error;
  }
}

// Fungsi untuk mendapatkan ID dokumen berdasarkan nama
export async function getJemaatDocId(nama) {
  try {
    const jemaatRef = collection(db, "jemaat");
    const q = query(jemaatRef, where("nama", "==", nama));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Nama tidak ditemukan");
    }
    
    // Return ID dokumen jemaat
    return querySnapshot.docs[0].id;
  } catch (error) {
    console.error("Error getting jemaat doc ID:", error);
    throw error;
  }
}

// Fungsi untuk registrasi jemaat
export async function registerJemaat(nama, password, userData) {
  try {
    // Cari ID dokumen jemaat berdasarkan nama
    const docId = await getJemaatDocId(nama);
    
    // Dapatkan data jemaat
    const jemaatRef = doc(db, "jemaat", docId);
    const jemaatDoc = await getDoc(jemaatRef);
    
    if (!jemaatDoc.exists()) {
      throw new Error("Nama anda belum terdaftar, segera hubungi gembala/admin");
    }
    
    const jemaatData = jemaatDoc.data();
    
    // Cek apakah sudah terdaftar
    if (jemaatData.isRegistered) {
      throw new Error("Akun dengan nama ini sudah terdaftar");
    }
    
    // Enkripsi password
    const encryptedPassword = sha256(password).toString();
    
    // Update data jemaat
    await updateDoc(jemaatRef, {
      password: encryptedPassword,
      isRegistered: true,
      tanggalLahir: userData.tanggalLahir,
      status: userData.status,
      sektor: userData.sektor
    });
    
    return true;
  } catch (error) {
    console.error("Error registering jemaat:", error);
    throw error;
  }
}

// Fungsi untuk login
export async function loginJemaat(nama, password) {
  try {
    // Cari jemaat berdasarkan nama
    const jemaatRef = collection(db, "jemaat");
    const q = query(jemaatRef, where("nama", "==", nama));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Nama tidak ditemukan");
    }
    
    const jemaatDoc = querySnapshot.docs[0];
    const jemaatData = jemaatDoc.data();
    
    // Cek apakah sudah terdaftar
    if (!jemaatData.isRegistered) {
      throw new Error("Akun belum terdaftar. Silakan registrasi terlebih dahulu.");
    }
    
    // Verifikasi password
    const encryptedPassword = sha256(password).toString();
    
    if (jemaatData.password !== encryptedPassword) {
      throw new Error("Password tidak sesuai");
    }
    
    // Return data jemaat
    return {
      id: jemaatDoc.id,
      ...jemaatData
    };
  } catch (error) {
    console.error("Error login jemaat:", error);
    throw error;
  }
}