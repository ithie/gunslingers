<template>
  <div class="playerZone">
    <div class="section">
      <HandCardsContainer>
        <HandCards :player-index="playerIndex" type="zone" />
        <HandCards
          :player-index="playerIndex"
          type="hand"
          :hide-cards="!isActivePlayer"
        />
      </HandCardsContainer>
      <Playground :player-index="playerIndex" />
    </div>
    <div>
      <button v-if="!cardsPlayed" @click="() => playCards(playerIndex)">
        Karten legen
      </button>
      <button v-if="cardsPlayed && canAttack" @click="attack">Angreifen</button>
      <button v-if="cardsPlayed" @click="endTurn">Zug beenden</button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Playground from '../Playground/Playground.vue'
import HandCards from '../HandCards/HandCards.vue'
import useGameTable from '../../composables/useGameTable/useGameTable'
import { computed, ref, watch } from 'vue'
import ICard from '../../interfaces/ICard'
import { CARD_TYPES } from '../../enums'
import HandCardsContainer from '../HandCardsContainer/HandCardsContainer.vue'
import usePlayground from '../Playground/usePlayground'
import makeComparable from '../../utils/makeComparable'

const { playerIndex } = defineProps<{
  playerIndex: number
}>()
const { gameTable, playCards, attack, endTurn } = useGameTable()

const isActivePlayer = computed(
  () => gameTable.value.turnStats.activePlayerIndex === playerIndex,
)
const cardsPlayed = computed(
  () => gameTable.value.players[playerIndex]?.cardsPlayed,
)

const { boardStack } = usePlayground().get(playerIndex)

const canAttack = ref(true)

watch(
  () => boardStack.value,
  (curr, prev) => {
    if (makeComparable(curr) !== makeComparable(prev)) {
      let noHeadButt = true

      curr.forEach((handCard: unknown[]) => {
        if (
          handCard &&
          handCard.length > 0 &&
          (handCard[0] as ICard)?.type === CARD_TYPES.EVENT
        ) {
          if ((handCard[0] as ICard)?.name === 'card.event.headButt') {
            noHeadButt = false
          }
        }
      })

      canAttack.value = noHeadButt
    }
  },
)
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
