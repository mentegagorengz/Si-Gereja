// src/stores/contentStore.js
import { defineStore } from 'pinia'
import ayatImg from '@/assets/Ayat.png'

export const useContentStore = defineStore('content', {
  state: () => {
    return {
      ayatHarian: {
        gambar: ayatImg,
        tanggal: new Date().toISOString().split('T')[0]
      },
      announcements: [
        {
          title: 'Happy Birthday, Gembala!',
          desc: '13 Juli – Tuhan berkati selalu!',
          icon: 'birthday.png', // Optional - bisa diabaikan
          category: 'birthday' // ⭐ INI YANG PENTING - akan jadi birthday.png
        },
        {
          title: 'Ibadah PELPRAP',
          desc: 'Pukul 17.00 WITA – Gedung Gereja',
          icon: 'ibadah.png', // Optional
          category: 'pelprap' // ⭐ akan jadi ibadah.png (karena mapping)
        },
        {
          title: 'Pembekalan Pelatar',
          desc: 'Pukul 19.00 WITA – Gedung Gereja',
          icon: 'event.png', // Optional
          category: 'pelatar' // ⭐ akan jadi event.png (karena mapping)
        }
      ],
      features: [
        { name: "News", icon: "news" },
        { name: "Jadwal", icon: "jadwal" },
        { name: "Giving", icon: "giving" },
        { name: "Alkitab Setahun", icon: "alkitab" },
        { name: "Renungan", icon: "renungan" },
        { name: "Prayer Request", icon: "prayer" }
      ]
    }
  },
  
  actions: {
    // Method untuk memuat data konten dari API (future use)
    async loadContent() {
      // Di masa depan bisa digunakan untuk load dari API
      // contoh: const response = await api.get('/content/announcements')
    }
  }
})