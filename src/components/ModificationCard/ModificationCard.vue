<template>
  <div class="container">
    <div class="image" :style="{ backgroundImage: 'url(' + imgSrc + ')' }" />
    <div class="item" v-for="(modification, key) in modifications" :key="key">
      {{ modification.key }} {{ modification.value }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ComputedRef } from 'vue'
import firmGrip from './assets/firm-grip.png'
import nimbleFinger from './assets/nimble-finger.png'
import rodeFaster from './assets/rode-faster.png'
import steelVest from './assets/steel-vest.png'
import unleashedRage from './assets/unleashed-rage.png'

const { name, ATK, DEF, SPD } = defineProps<{
  name: string
  ATK?: number
  DEF?: number
  SPD?: number
}>()

const imageMap: Record<string, unknown> = {
  'Flinker Finger': nimbleFinger,
  'Fester Griff': firmGrip,
  'Schneller Ritt': rodeFaster,
  Stahlweste: steelVest,
  'Entfesselte Wut': unleashedRage,
}

const imgSrc = computed(() => imageMap[name])

const modifications: ComputedRef<{ key: string; value: number | undefined }[]> =
  computed(() =>
    [
      {
        key: 'ATK',
        value: ATK,
      },
      {
        key: 'DEF',
        value: DEF,
      },
      {
        key: 'SPD',
        value: SPD,
      },
    ].filter((item) => !!item.value),
  )
</script>
<style lang="scss">
.container {
  position: relative;
  height: 100%;
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.item {
  position: relative;
  z-index: 2;
}
.image {
  position: absolute;
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.4;
}
</style>
