<template>
  <div class="playerZone">
    <div class="section">
      <HandCards :player-index="playerIndex" />
      <Playground :player-index="playerIndex" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Playground from '../Playground/Playground.vue'
import HandCards from '../HandCards/HandCards.vue'

const { playerIndex } = defineProps<{
  playerIndex: number
}>()
</script>
<style lang="scss">
.playerZone {
  width: 100%;
  border: 1px solid black;
  padding: 5px;
}
.section {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
}
</style>
