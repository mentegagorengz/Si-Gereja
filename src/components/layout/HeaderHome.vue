<!-- HeaderHome.vue -->
<template>
    <div class="header">
      <p class="greeting">Halo, {{ namaUser }}!</p>
      <div class="streak">
        <span>{{ streakCount }}</span>
        <Flame class="icon-flame" />
      </div>
    </div>
  </template>
  
  <script>
  import { Flame } from 'lucide-vue-next'
  
  export default {
    name: 'HeaderHome',
    components: {
      Flame
    },
    props: {
      namaUser: {
        type: String,
        default: 'Jemaat'
      },
      streakCount: {
        type: Number,
        default: 0
      }
    }
  }
  </script>