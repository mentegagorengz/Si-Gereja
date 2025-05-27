// src/services/news.js
import { db } from './firebase';
import { 
  collection, doc, getDocs, getDoc, 
  addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, where 
} from 'firebase/firestore';

// Mendapatkan semua news, diurutkan dari yang terbaru
export async function getNews(limitCount = 10) {
  try {
    console.log('🔍 [getNews] Fetching news...');
    
    const newsRef = collection(db, "news");
    const q = query(
      newsRef, 
      orderBy("createdAt", "desc"), // Urutkan dari terbaru
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const news = [];
    
    querySnapshot.forEach((doc) => {
      news.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ [getNews] Found', news.length, 'news');
    return news;
  } catch (error) {
    console.error("❌ [getNews] Error:", error);
    throw error;
  }
}

// Mendapatkan satu news berdasarkan ID
export async function getNewsById(id) {
  try {
    console.log('🔍 [getNewsById] Fetching news with ID:', id);
    
    const docRef = doc(db, "news", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const newsData = {
        id: docSnap.id,
        ...docSnap.data()
      };
      
      console.log('✅ [getNewsById] Found news:', newsData.title);
      return newsData;
    } else {
      throw new Error("News tidak ditemukan");
    }
  } catch (error) {
    console.error("❌ [getNewsById] Error:", error);
    throw error;
  }
}

// Mendapatkan news berdasarkan kategori
export async function getNewsByCategory(category) {
  try {
    console.log('🔍 [getNewsByCategory] Fetching news for category:', category);
    
    const newsRef = collection(db, "news");
    const q = query(
      newsRef, 
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const news = [];
    
    querySnapshot.forEach((doc) => {
      news.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ [getNewsByCategory] Found', news.length, 'news for', category);
    return news;
  } catch (error) {
    console.error("❌ [getNewsByCategory] Error:", error);
    throw error;
  }
}

// Menambahkan news baru (untuk admin)
export async function addNews(newsData) {
  try {
    console.log('🔍 [addNews] Adding new news:', newsData.title);
    
    const newsRef = collection(db, "news");
    const newDoc = await addDoc(newsRef, {
      ...newsData,
      createdAt: new Date()
    });
    
    console.log('✅ [addNews] News added with ID:', newDoc.id);
    return newDoc.id;
  } catch (error) {
    console.error("❌ [addNews] Error:", error);
    throw error;
  }
}

// Mengupdate news (untuk admin)
export async function updateNews(id, updateData) {
  try {
    console.log('🔍 [updateNews] Updating news:', id);
    
    const newsRef = doc(db, "news", id);
    await updateDoc(newsRef, updateData);
    
    console.log('✅ [updateNews] News updated successfully');
    return true;
  } catch (error) {
    console.error("❌ [updateNews] Error:", error);
    throw error;
  }
}

// Menghapus news (untuk admin)
export async function deleteNews(id) {
  try {
    console.log('🔍 [deleteNews] Deleting news:', id);
    
    const newsRef = doc(db, "news", id);
    await deleteDoc(newsRef);
    
    console.log('✅ [deleteNews] News deleted successfully');
    return true;
  } catch (error) {
    console.error("❌ [deleteNews] Error:", error);
    throw error;
  }
}