<template>
  <div class="currentPlayer">{{ currentPlayer }}</div>
  <div>Ablageortkarten: {{ zoneDraftDeckLeft }}</div>
  <div>
    Nachziehstapel: {{ draftDeckLeft }} => Nächste: {{ nextCardOnDraftDeck }}
  </div>
  <div class="table" v-if="gameRunning">
    <PlayerZone
      v-for="(_, index) in players"
      :key="index"
      :player-index="index"
    />
  </div>
  <div v-else>{{ $t('player.won', [playerName]) }}</div>

  <LayerManager />
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import useGameTable from '../../composables/useGameTable/useGameTable'
import { gamblerData, gunslingerData } from '../../rules/charactersheet'
import PlayerZone from './PlayerZone.vue'
import LayerManager from '../LayerManager/LayerManager.vue'

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

const gameRunning = computed(() => !gameTable.value.gameEnds)

const zoneDraftDeckLeft = computed(() => gameTable.value.zoneDraftDeck.length)
const draftDeckLeft = computed(() => gameTable.value.draftDeck.length)
const nextCardOnDraftDeck = computed(
  () => gameTable.value.draftDeck[gameTable.value.draftDeck.length - 1].type,
)

const currentPlayer = computed(
  () => gameTable.value.turnStats.activePlayerIndex,
)
const players = computed(() => gameTable.value.players)

const playerName = computed(
  () =>
    gameTable.value.players.filter((player) => player.vCharacter.HP > 0)[0]
      .name,
)
</script>

<style lang="scss">
.table {
  width: 100;
}

.currentPlayer {
  width: 100%;
}

body {
  margin: 0;
  padding: 0;
}
</style>
