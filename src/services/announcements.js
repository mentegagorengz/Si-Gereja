import { db } from './firebase';
import { 
  collection, doc, getDocs, getDoc, 
  addDoc, updateDoc, deleteDoc,
  query, orderBy, limit 
} from 'firebase/firestore';

// Mendapatkan semua pengumuman, diurutkan dari yang terbaru
export async function getAnnouncements(limitCount = 10) {
  try {
    const announcementsRef = collection(db, "announcements");
    const q = query(
      announcementsRef, 
      orderBy("date", "desc"), 
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const announcements = [];
    
    querySnapshot.forEach((doc) => {
      announcements.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return announcements;
  } catch (error) {
    console.error("Error getting announcements:", error);
    throw error;
  }
}

// Mendapatkan satu pengumuman berdasarkan ID
export async function getAnnouncement(id) {
  try {
    const docRef = doc(db, "announcements", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error("Pengumuman tidak ditemukan");
    }
  } catch (error) {
    console.error("Error getting announcement:", error);
    throw error;
  }
}

// Menambahkan pengumuman baru
export async function addAnnouncement(announcementData) {
  try {
    const announcementsRef = collection(db, "announcements");
    const newDoc = await addDoc(announcementsRef, {
      ...announcementData,
      date: new Date()
    });
    
    return newDoc.id;
  } catch (error) {
    console.error("Error adding announcement:", error);
    throw error;
  }
}

// Mengupdate pengumuman
export async function updateAnnouncement(id, updateData) {
  try {
    const announcementRef = doc(db, "announcements", id);
    await updateDoc(announcementRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
}

// Menghapus pengumuman
export async function deleteAnnouncement(id) {
  try {
    const announcementRef = doc(db, "announcements", id);
    await deleteDoc(announcementRef);
    return true;
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
}