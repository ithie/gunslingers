<template>
  <div class="character" :style="{ backgroundImage: 'url(' + src + ')' }"></div>
</template>
<script setup lang="ts">
import src from './assets/gunslinger.png'
</script>
<style lang="scss">
.character {
  position: relative;
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
