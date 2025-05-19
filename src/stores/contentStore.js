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
          title: 'Happy Birthday, Kak Irene!',
          desc: '09 Agustus – Tuhan berkati selalu!',
          icon: 'cake.png'
        },
        {
          title: 'Ibadah PELPRAP',
          desc: 'Pukul 17.00 WITA – Gedung Gereja',
          icon: 'ibadah.png'
        }
      ],
      features: [
        { name: "News", icon: "N" },
        { name: "Jadwal", icon: "J" },
        { name: "Giving", icon: "G" },
        { name: "Alkitab Setahun", icon: "A" },
        { name: "Renungan", icon: "R" },
        { name: "Prayer Request", icon: "P" }
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