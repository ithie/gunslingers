<template>
  <Card :type="CARD_TYPES.CHARACTER">
    <div
      class="character"
      :style="{ backgroundImage: 'url(' + src + ')' }"
    ></div>
  </Card>
</template>
<script setup lang="ts">
import Card from '../Card/Card.vue'
import src from './assets/gunslinger.png'
import { CARD_TYPES } from '../../enums'
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
