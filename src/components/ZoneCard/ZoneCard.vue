<template>
  <div class="matrixContainer">
    <div
      :class="`matrixItem ${item}`"
      v-for="(item, index) in zoneMatrix"
      :key="index"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const { zones } = defineProps<{ zones: number[] }>()

const matrix: string[] = new Array(8).fill('white')

const zoneMatrix = computed(() => {
  return matrix
    .map((_, index) => {
      const returnValue = []
      if (zones.includes(index)) {
        returnValue.push('black')
      } else {
        returnValue.push('white')
      }

      if (index === 3) {
        returnValue.push('center')
      }

      return returnValue
    })
    .flat()
})
</script>
<style lang="scss">
.matrixContainer {
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: auto auto auto;
  gap: 2px;
}
.matrixItem {
  display: inline;
  border: 1px solid black;
  width: 20px;
  height: 20px;
  &.white {
    background-color: white;
  }
  &.black {
    background-color: black;
  }
  &.center {
    background-color: none;
    border: none;
  }
}
</style>
