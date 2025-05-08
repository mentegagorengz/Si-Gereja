<!-- DailyVerse.vue -->
<template>
    <div class="verse-wrapper">
      <img :src="ayatGambar" alt="Ayat Hari Ini" class="ayat-full" />
    </div>
  </template>
  
  <script>
  export default {
    name: 'DailyVerse',
    props: {
      ayatGambar: {
        type: String,
        required: true
      }
    }
  }
  </script>