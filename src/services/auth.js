import { db } from './firebase';
import { 
  collection, doc, getDoc, updateDoc, 
  query, where, getDocs 
} from 'firebase/firestore';
import { sha256 } from 'crypto-js';

export async function checkJemaatExists(nama) {
  try {
    const jemaatRef = collection(db, "jemaat");
    const q = query(jemaatRef, where("nama", "==", nama));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking jemaat:", error);
    throw error;
  }
}

export async function getJemaatDocId(nama) {
  try {
    const jemaatRef = collection(db, "jemaat");
    const q = query(jemaatRef, where("nama", "==", nama));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Nama tidak ditemukan");
    }
    
    return querySnapshot.docs[0].id;
  } catch (error) {
    console.error("Error getting jemaat doc ID:", error);
    throw error;
  }
}

export async function registerJemaat(nama, password, userData) {
  try {
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

// Fungsi untuk logout
export async function logoutJemaat() {
  localStorage.removeItem('user');
  return true;
}

// Fungsi untuk mendapatkan data jemaat yang sedang login
export async function getCurrentJemaat() {
  return JSON.parse(localStorage.getItem('user'));
}