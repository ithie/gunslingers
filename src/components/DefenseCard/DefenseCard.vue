<template>
  <div class="container">
    <div :class="itemStyles" v-if="ruleLabel">{{ $t(ruleLabel) }}</div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import useCard from '../Card/useCard'

const { ruleLabel, playerIndex, name, hasEffect } = defineProps<{
  ruleLabel?: string
  playerIndex: number
  name: string
  hasEffect?: boolean
}>()

useCard(playerIndex, hasEffect, name)

const itemStyles = computed(() => ({
  'long-text': ruleLabel?.includes('timeDistortion'),
}))
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
  & > div {
    width: 80%;
    text-align: center;
    &.long-text {
      font-size: 10px;
    }
  }
}
</style>
