<template>
  <div class="currentPlayer">Aktiver Spieler: {{ currentPlayerName }}</div>
  <div>Ablageortkarten: {{ zoneDraftDeckLeft }}</div>
  <div>
    Nachziehstapel: {{ draftDeckLeft }} &mdash; Nächste: {{ nextCardOnDraftDeck }}
  </div>
  <div class="table" v-if="gameRunning">
    <!--
      Anzeigereihenfolge: lokaler Spieler immer unten (zuletzt gerendert).
      Für den Host: [0, 1] — für den Guest: [1, 0].
      playerIndex bleibt korrekt, nur die Darstellungsreihenfolge ändert sich.
    -->
    <PlayerZone
      v-for="idx in displayOrder"
      :key="idx"
      :player-index="idx"
      :is-local-player="idx === localPlayerIndex"
    />
  </div>
  <div v-else class="game-over">{{ $t('player.won', [winnerName]) }}</div>

  <LayerManager />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import useGameTable from '../../composables/useGameTable/useGameTable'
import useGameSession from '../../composables/useGameSession/useGameSession'
import PlayerZone from './PlayerZone.vue'
import LayerManager from '../LayerManager/LayerManager.vue'

const { gameTable, localPlayerIndex } = useGameTable()
const { session } = useGameSession()

const gameRunning = computed(() => !gameTable.value.gameEnds)
const zoneDraftDeckLeft = computed(() => gameTable.value.zoneDraftDeck.length)
const draftDeckLeft = computed(() => gameTable.value.draftDeck.length)
const nextCardOnDraftDeck = computed(
  () => gameTable.value.draftDeck[gameTable.value.draftDeck.length - 1]?.type ?? '—',
)
const players = computed(() => gameTable.value.players)

// Gegner oben, eigene Zone unten — unabhängig davon wer Host/Guest ist
const displayOrder = computed(() => {
  const indices = players.value.map((_, i) => i)
  // Lokaler Spieler soll unten stehen (letzter Eintrag)
  if (localPlayerIndex.value !== -1) {
    const sorted = indices.filter((i) => i !== localPlayerIndex.value)
    sorted.push(localPlayerIndex.value)
    return sorted
  }
  return indices
})
const currentPlayerName = computed(
  () => gameTable.value.players[gameTable.value.turnStats.activePlayerIndex]?.name ?? '',
)
const winnerName = computed(
  () => gameTable.value.players.find((p) => p.vCharacter.HP > 0)?.name ?? '',
)
</script>

<style lang="scss">
.table {
  width: 100%;
}

.currentPlayer {
  width: 100%;
  font-weight: bold;
  padding: 0.5rem;
}

.game-over {
  font-size: 2rem;
  text-align: center;
  padding: 3rem;
  color: #b5420a;
}

body {
  margin: 0;
  padding: 0;
}
</style>
