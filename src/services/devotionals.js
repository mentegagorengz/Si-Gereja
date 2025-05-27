// src/services/devotionals.js
import { db } from './firebase';
import { 
  collection, doc, getDocs, getDoc, 
  addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, where 
} from 'firebase/firestore';

// Mendapatkan semua devotionals, diurutkan dari tanggal terbaru
export async function getDevotionals(limitCount = 10) {
  try {
    console.log('🔍 [getDevotionals] Fetching devotionals...');
    
    const devotionalsRef = collection(db, "devotionals");
    const q = query(
      devotionalsRef, 
      orderBy("date", "asc"), // Urutkan dari tanggal terlama ke terbaru
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const devotionals = [];
    
    querySnapshot.forEach((doc) => {
      devotionals.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ [getDevotionals] Found', devotionals.length, 'devotionals');
    return devotionals;
  } catch (error) {
    console.error("❌ [getDevotionals] Error:", error);
    throw error;
  }
}

// Mendapatkan satu devotional berdasarkan ID
export async function getDevotional(id) {
  try {
    console.log('🔍 [getDevotional] Fetching devotional with ID:', id);
    
    const docRef = doc(db, "devotionals", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const devotional = {
        id: docSnap.id,
        ...docSnap.data()
      };
      
      console.log('✅ [getDevotional] Found devotional:', devotional.title);
      return devotional;
    } else {
      throw new Error("Devotional tidak ditemukan");
    }
  } catch (error) {
    console.error("❌ [getDevotional] Error:", error);
    throw error;
  }
}

// Mendapatkan devotionals berdasarkan kategori
export async function getDevotionalsByCategory(category) {
  try {
    console.log('🔍 [getDevotionalsByCategory] Fetching devotionals for category:', category);
    
    const devotionalsRef = collection(db, "devotionals");
    const q = query(
      devotionalsRef, 
      where("category", "==", category),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const devotionals = [];
    
    querySnapshot.forEach((doc) => {
      devotionals.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ [getDevotionalsByCategory] Found', devotionals.length, 'devotionals for', category);
    return devotionals;
  } catch (error) {
    console.error("❌ [getDevotionalsByCategory] Error:", error);
    throw error;
  }
}

// Mendapatkan devotionals untuk tanggal tertentu
export async function getDevotionalsByDate(date) {
  try {
    console.log('🔍 [getDevotionalsByDate] Fetching devotionals for date:', date);
    
    const devotionalsRef = collection(db, "devotionals");
    const q = query(
      devotionalsRef, 
      where("date", "==", date),
      orderBy("createdAt", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const devotionals = [];
    
    querySnapshot.forEach((doc) => {
      devotionals.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ [getDevotionalsByDate] Found', devotionals.length, 'devotionals for', date);
    return devotionals;
  } catch (error) {
    console.error("❌ [getDevotionalsByDate] Error:", error);
    throw error;
  }
}

// Menambahkan devotional baru (untuk admin)
export async function addDevotional(devotionalData) {
  try {
    console.log('🔍 [addDevotional] Adding new devotional:', devotionalData.title);
    
    const devotionalsRef = collection(db, "devotionals");
    const newDoc = await addDoc(devotionalsRef, {
      ...devotionalData,
      createdAt: new Date()
    });
    
    console.log('✅ [addDevotional] Devotional added with ID:', newDoc.id);
    return newDoc.id;
  } catch (error) {
    console.error("❌ [addDevotional] Error:", error);
    throw error;
  }
}

// Mengupdate devotional (untuk admin)
export async function updateDevotional(id, updateData) {
  try {
    console.log('🔍 [updateDevotional] Updating devotional:', id);
    
    const devotionalRef = doc(db, "devotionals", id);
    await updateDoc(devotionalRef, updateData);
    
    console.log('✅ [updateDevotional] Devotional updated successfully');
    return true;
  } catch (error) {
    console.error("❌ [updateDevotional] Error:", error);
    throw error;
  }
}

// Menghapus devotional (untuk admin)
export async function deleteDevotional(id) {
  try {
    console.log('🔍 [deleteDevotional] Deleting devotional:', id);
    
    const devotionalRef = doc(db, "devotionals", id);
    await deleteDoc(devotionalRef);
    
    console.log('✅ [deleteDevotional] Devotional deleted successfully');
    return true;
  } catch (error) {
    console.error("❌ [deleteDevotional] Error:", error);
    throw error;
  }
}