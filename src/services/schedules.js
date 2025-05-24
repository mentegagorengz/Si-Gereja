// src/services/schedules.js
import { db } from './firebase';
import { 
  collection, doc, getDocs, getDoc, 
  addDoc, updateDoc, deleteDoc,
  query, orderBy, limit, where 
} from 'firebase/firestore';

// Mendapatkan semua jadwal, diurutkan dari tanggal terbaru
export async function getSchedules(limitCount = 10) {
  try {
    console.log('🔍 [getSchedules] Fetching schedules...');
    
    const schedulesRef = collection(db, "schedules");
    const q = query(
      schedulesRef, 
      orderBy("date", "asc"), // Urutkan dari tanggal terlama ke terbaru
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const schedules = [];
    
    querySnapshot.forEach((doc) => {
      schedules.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ [getSchedules] Found', schedules.length, 'schedules');
    return schedules;
  } catch (error) {
    console.error("❌ [getSchedules] Error:", error);
    throw error;
  }
}

// Mendapatkan satu jadwal berdasarkan ID
export async function getSchedule(id) {
  try {
    console.log('🔍 [getSchedule] Fetching schedule with ID:', id);
    
    const docRef = doc(db, "schedules", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const schedule = {
        id: docSnap.id,
        ...docSnap.data()
      };
      
      console.log('✅ [getSchedule] Found schedule:', schedule.title);
      return schedule;
    } else {
      throw new Error("Jadwal tidak ditemukan");
    }
  } catch (error) {
    console.error("❌ [getSchedule] Error:", error);
    throw error;
  }
}

// Mendapatkan jadwal berdasarkan kategori
export async function getSchedulesByCategory(category) {
  try {
    console.log('🔍 [getSchedulesByCategory] Fetching schedules for category:', category);
    
    const schedulesRef = collection(db, "schedules");
    const q = query(
      schedulesRef, 
      where("category", "==", category),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const schedules = [];
    
    querySnapshot.forEach((doc) => {
      schedules.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ [getSchedulesByCategory] Found', schedules.length, 'schedules for', category);
    return schedules;
  } catch (error) {
    console.error("❌ [getSchedulesByCategory] Error:", error);
    throw error;
  }
}

// Mendapatkan jadwal untuk tanggal tertentu
export async function getSchedulesByDate(date) {
  try {
    console.log('🔍 [getSchedulesByDate] Fetching schedules for date:', date);
    
    const schedulesRef = collection(db, "schedules");
    const q = query(
      schedulesRef, 
      where("date", "==", date),
      orderBy("time", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const schedules = [];
    
    querySnapshot.forEach((doc) => {
      schedules.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ [getSchedulesByDate] Found', schedules.length, 'schedules for', date);
    return schedules;
  } catch (error) {
    console.error("❌ [getSchedulesByDate] Error:", error);
    throw error;
  }
}

// Menambahkan jadwal baru (untuk admin)
export async function addSchedule(scheduleData) {
  try {
    console.log('🔍 [addSchedule] Adding new schedule:', scheduleData.title);
    
    const schedulesRef = collection(db, "schedules");
    const newDoc = await addDoc(schedulesRef, {
      ...scheduleData,
      createdAt: new Date()
    });
    
    console.log('✅ [addSchedule] Schedule added with ID:', newDoc.id);
    return newDoc.id;
  } catch (error) {
    console.error("❌ [addSchedule] Error:", error);
    throw error;
  }
}

// Mengupdate jadwal (untuk admin)
export async function updateSchedule(id, updateData) {
  try {
    console.log('🔍 [updateSchedule] Updating schedule:', id);
    
    const scheduleRef = doc(db, "schedules", id);
    await updateDoc(scheduleRef, updateData);
    
    console.log('✅ [updateSchedule] Schedule updated successfully');
    return true;
  } catch (error) {
    console.error("❌ [updateSchedule] Error:", error);
    throw error;
  }
}

// Menghapus jadwal (untuk admin)
export async function deleteSchedule(id) {
  try {
    console.log('🔍 [deleteSchedule] Deleting schedule:', id);
    
    const scheduleRef = doc(db, "schedules", id);
    await deleteDoc(scheduleRef);
    
    console.log('✅ [deleteSchedule] Schedule deleted successfully');
    return true;
  } catch (error) {
    console.error("❌ [deleteSchedule] Error:", error);
    throw error;
  }
}