<template>
  <div class="damageContainer">
    {{ $t('damage') }}: {{ damage }}<br /><br />
    <HandCardsContainer>
      <HandCards :player-index="nextPlayer" type="zone" />
      <HandCards
        :player-index="nextPlayer"
        type="hand"
        :filter="CARD_TYPES.DEFENSE"
      />
    </HandCardsContainer>

    <div class="buttonContainer">
      <button
        v-if="!cannotDefend"
        :disabled="noDefendCardsSelected"
        @click="callDefend"
      >
        {{ $t('defend') }}
      </button>
      <button v-if="!cannotDefend" @click="callNext">
        {{ $t('noDefense') }}
      </button>
      <button v-if="cannotDefend" @click="callNext">
        {{ $t('endTurn') }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import HandCards from '../HandCards/HandCards.vue'
import { ILayerData } from './useLayerManager'
import useGameTable from '../../composables/useGameTable/useGameTable'
import { CARD_TYPES } from '../../constants'
import useHandCards from '../HandCards/useHandCards'
import HandCardsContainer from '../HandCardsContainer/HandCardsContainer.vue'

const { props, next } = defineProps<ILayerData>()

const damage = computed(() => props.damage as number)
const nextPlayer = computed(() => props.nextPlayer as number)

const { gameTable, playCards } = useGameTable()
const { handCards } = useHandCards()

const callNext = () => {
  next()
}

const cannotDefend = computed(() => {
  return (
    handCards.value.hand[nextPlayer.value].filter(
      (handCard): boolean =>
        !!(handCard && handCard.type === CARD_TYPES.DEFENSE),
    ).length <= 0
  )
})

const callDefend = () => {
  const { handCard } = gameTable.value.players[nextPlayer.value].selectedCards

  let defenseCard

  if (handCard) {
    defenseCard = handCards.value.hand[nextPlayer.value][handCard]
  }

  playCards(nextPlayer.value)

  if (gameTable.value.showDamage) {
    next(defenseCard)
  }
}

const noDefendCardsSelected = computed(() => {
  const { handCard, zoneCard } =
    gameTable.value.players[nextPlayer.value].selectedCards

  return !handCard && !zoneCard
})
</script>

<style lang="scss">
.damageContainer {
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: 100%;
  background-color: beige;
  margin: 0 auto;
}
.buttonContainer {
  display: block;
  width: 100%;
  padding: 2px;
}
</style>
