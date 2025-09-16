<template>
  <div class="currentPlayer">{{ currentPlayer }}</div>
  <div class="table">
    <PlayerZone v-for="(_, index) in players" :key="index" :index="index" />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import useGameTable from '../../composables/useGameTable'
import { gamblerData, gunslingerData } from '../../rules/charactersheet'
import PlayerZone from './PlayerZone.vue'

const { init, gameTable } = useGameTable()

init(
  [
    { name: 'Player One', character: gunslingerData },
    { name: 'Player Two', character: gamblerData },
  ],
  {
    startHand: 7,
    zoneCards: { alwaysFull: false, maxZoneCards: 5 },
  },
)

const currentPlayer = computed(
  () => gameTable.value.turnStats.activePlayerIndex,
)
const players = computed(() => gameTable.value.players)
</script>

<style lang="scss">
.table {
  width: 100;
}

.currentPlayer {
  width: 100%;
}
</style>
