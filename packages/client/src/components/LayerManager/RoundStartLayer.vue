<template>
  <div class="roundStart">
    <div class="round">Runde {{ roundNumber }}</div>
    <div class="initiative">
      Initiative: <strong>{{ playerName }}</strong>
      <span class="ges">(GES {{ ges }})</span>
    </div>
    <div class="bar">
      <div class="fill" :style="{ width: progress + '%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ILayerData } from './useLayerManager'

const { props, next } = defineProps<ILayerData>()

const roundNumber = computed(() => props.roundNumber as number)
const playerName  = computed(() => props.initiativePlayerName as string)
const ges         = computed(() => props.ges as number)

const DURATION = 3000
const progress = ref(100)
let start = 0
let raf = 0

function tick(ts: number) {
  if (!start) start = ts
  const elapsed = ts - start
  progress.value = Math.max(0, 100 - (elapsed / DURATION) * 100)
  if (elapsed < DURATION) {
    raf = requestAnimationFrame(tick)
  } else {
    next()
  }
}

onMounted(() => { raf = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<style scoped>
.roundStart {
  background: #1a1a1a;
  color: #f5deb3;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  text-align: center;
  min-width: 320px;
}
.round {
  font-size: 1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 0.5rem;
}
.initiative {
  font-size: 1.6rem;
  margin-bottom: 1.25rem;
}
.ges {
  font-size: 1rem;
  color: #aaa;
  margin-left: 0.5rem;
}
.bar {
  height: 4px;
  background: #333;
  border-radius: 2px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: #b5420a;
  transition: width 0.1s linear;
}
</style>
