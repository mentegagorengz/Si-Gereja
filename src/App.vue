<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

* {
  font-family: 'Inter';
}

:root {
  --dp-font-family: 'Inter';
}

html, body {
  height: 100%;
  background-color: #fcfcf7;
}
body {
  font-family: 'Inter';
  margin: 0;
  padding: 0;
}
</style>
