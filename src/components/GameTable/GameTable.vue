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

  <div class="damageContainer" v-if="showDamage">
    <div class="innerDamageContainer">
      {{ $t('damage') }}: {{ showDamage.damage }}<br /><br />
      <HandCards :player-index="defendingPlayer" defense />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import useGameTable from '../../composables/useGameTable'
import { gamblerData, gunslingerData } from '../../rules/charactersheet'
import PlayerZone from './PlayerZone.vue'
import HandCards from '../HandCards/HandCards.vue'

const { init, gameTable, getNextPlayer } = useGameTable()

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

const showDamage = computed(() => {
  return gameTable.value.showDamage
})

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
const defendingPlayer = computed(() => {
  return getNextPlayer()
})
const playerName = computed(
  () =>
    gameTable.value.players[gameTable.value.turnStats.activePlayerIndex].name,
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

.damageContainer {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.innerDamageContainer {
  position: relative;
  opacity: 100%;
  background-color: beige;
  margin: 0 auto;
}
</style>
