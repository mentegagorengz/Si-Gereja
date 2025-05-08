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

<style scoped>
.verse-wrapper {
  width: calc(100% + 32px); /* 100% + 16px kiri + 16px kanan */
  margin-left: -16px;
  margin-right: -16px;
}

.ayat-full {
  width: 100%;
  height: auto;
  display: block;
}
</style>