<template>
  <div class="playerZone">
    <div class="section">
      <HandCardsContainer>
        <HandCards :player-index="playerIndex" type="zone" />
        <HandCards
          :player-index="playerIndex"
          type="hand"
          :hide-cards="!isOwnHand"
        />
      </HandCardsContainer>
      <Playground :player-index="playerIndex" />
    </div>

    <!-- Aktions-Buttons: nur für den lokalen Spieler wenn er dran ist -->
    <div v-if="isLocalPlayer && isActivePlayer">
      <!-- Optionaler Charakter-Effekt (z.B. Gunslinger, Gambler) -->
      <button
        v-if="optionalEffect && !effectUsedThisTurn && !cardsPlayed"
        class="btn-effect"
        @click="onActivateEffect"
      >
        ✨ {{ optionalEffect.actionLabel }}
      </button>

      <button v-if="!cardsPlayed" @click="onPlayCards">
        Karten legen
      </button>
      <button v-if="cardsPlayed && canAttack" @click="onAttack">
        Angreifen
      </button>
      <button v-if="cardsPlayed" @click="onEndTurn">
        Zug beenden
      </button>
    </div>
    <div v-else-if="isActivePlayer && !isLocalPlayer" class="waiting">
      Gegner ist am Zug…
    </div>
  </div>
</template>

<script lang="ts" setup>
import Playground from '../Playground/Playground.vue'
import HandCards from '../HandCards/HandCards.vue'
import useGameTable, { type GuestAction } from '../../composables/useGameTable/useGameTable'
import useWebRTC from '../../composables/useWebRTC/useWebRTC'
import useCharacterEffect from '../../composables/useCharacterEffect/useCharacterEffect'
import { computed, ref, watch } from 'vue'
import ICard from '../../../../interfaces/src/ICard'
import { CARD_TYPES } from '../../../../interfaces/src/constants'
import HandCardsContainer from '../HandCardsContainer/HandCardsContainer.vue'
import usePlayground from '../Playground/usePlayground'
import makeComparable from '../../utils/makeComparable'

const { playerIndex, isLocalPlayer } = defineProps<{
  playerIndex: number
  isLocalPlayer: boolean
}>()

const { gameTable, playCards, attack, endTurn, localPlayerIndex } = useGameTable()
const webrtc = useWebRTC()
const charEffect = useCharacterEffect()

const isActivePlayer = computed(
  () => gameTable.value.turnStats.activePlayerIndex === playerIndex,
)

// Handkarten sichtbar: im Netzwerkspiel nur die eigene Hand,
// im lokalen Hot-Seat-Modus nur die Hand des aktiven Spielers
const isOwnHand = computed(() =>
  localPlayerIndex.value === -1 ? isActivePlayer.value : isLocalPlayer,
)

const cardsPlayed = computed(
  () => gameTable.value.players[playerIndex]?.cardsPlayed,
)

// Optionaler Charakter-Effekt für diesen Spieler (nur TURN_START)
const optionalEffect = computed(() =>
  isLocalPlayer && isActivePlayer.value && !cardsPlayed.value
    ? charEffect.getOptionalTurnStartEffect(playerIndex)
    : null,
)
const effectUsedThisTurn = ref(false)

watch(isActivePlayer, (active) => {
  if (active) effectUsedThisTurn.value = false
})

const { boardStack } = usePlayground().get(playerIndex)

const canAttack = ref(true)
watch(
  () => boardStack.value,
  (curr, prev) => {
    if (makeComparable(curr) !== makeComparable(prev)) {
      canAttack.value = !curr.some(
        (stack: unknown[]) =>
          stack?.length > 0 &&
          (stack[0] as ICard)?.name === 'card.event.headButt',
      )
    }
  },
)

// Aktion senden oder direkt ausführen, je nach Rolle
function sendOrCall(action: GuestAction, localFn: () => void) {
  if (localPlayerIndex.value === 1) {
    // Gast: Aktion an Host senden
    webrtc.sendMessage({ type: 'ACTION', action })
  } else {
    // Host oder lokales Spiel: direkt ausführen
    localFn()
  }
}

function onPlayCards() {
  const { zoneCard, handCardIndex } = (() => {
    const sel = gameTable.value.players[playerIndex].selectedCards
    return { zoneCard: sel.zoneCard, handCardIndex: sel.handCard }
  })()

  if (zoneCard === null || handCardIndex === null) return

  sendOrCall(
    { type: 'PLAY_CARDS', zoneCardIndex: zoneCard, handCardIndex },
    () => playCards(playerIndex),
  )
}

function onAttack() {
  sendOrCall({ type: 'ATTACK' }, attack)
}

function onActivateEffect() {
  effectUsedThisTurn.value = true
  charEffect.activateOptionalEffect(playerIndex)
}

function onEndTurn() {
  // Zug beenden läuft immer lokal – der Host synchronisiert danach
  endTurn()
  if (localPlayerIndex.value === 1) {
    // Gast informiert Host (damit der seinen State aktuell hält)
    // endTurn wird nach dem Angriff ohnehin vom Host ausgelöst;
    // ein explizites "Zug beenden ohne Angriff" muss ebenfalls übermittelt werden
    webrtc.sendMessage({ type: 'ACTION', action: { type: 'END_TURN' } as unknown as GuestAction })
  }
}
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
.waiting {
  color: #888;
  font-style: italic;
  padding: 4px 0;
}
.btn-effect {
  background: #5c2d82;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 4px;
}
.btn-effect:hover {
  background: #4a2268;
}
</style>
