<template>
  <div class="damageContainer">
    {{ $t('damage') }}: {{ damage }}<br /><br />

    <!-- Wenn der Host explizit Abwehrkarten geschickt hat (Gast-Verteidigung über Netz),
         zeigen wir nur diese. Ansonsten lesen wir aus der lokalen Hand. -->
    <template v-if="availableDefenseCards">
      <div class="cardsContainer">
        <Card
          v-for="(card, i) in availableDefenseCards"
          :key="i"
          :index="i"
          :player-index="nextPlayer"
          :clickable="true"
          :type="card.type"
          :name="card.name"
        >
          <component
            :is="getCardComponent(card.type)"
            v-bind="{ ...(card as CardProps) }"
            :player-index="nextPlayer"
          />
        </Card>
      </div>
    </template>
    <template v-else>
      <HandCardsContainer>
        <HandCards :player-index="nextPlayer" type="zone" />
        <HandCards
          :player-index="nextPlayer"
          type="hand"
          :filter="CARD_TYPES.DEFENSE"
        />
      </HandCardsContainer>
    </template>

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
import Card from '../Card/Card.vue'
import { ILayerData } from './useLayerManager'
import useGameTable from '../../composables/useGameTable/useGameTable'
import { CARD_TYPES } from '../../../../interfaces/src/constants'
import ICard from '../../../../interfaces/src/ICard'
import useHandCards from '../HandCards/useHandCards'
import HandCardsContainer from '../HandCardsContainer/HandCardsContainer.vue'
import getCardComponent, { CardProps } from '../../utils/getCardComponent'

const { props, next } = defineProps<ILayerData>()

const damage = computed(() => props.damage as number)
const nextPlayer = computed(() => props.nextPlayer as number)
// Vom Host übermittelte, vorgefilterterte Abwehrkarten (Netzwerk-Modus)
const availableDefenseCards = computed(
  () => (props.availableDefenseCards as ICard[] | undefined) ?? null,
)

const { gameTable, playCards } = useGameTable()
const { handCards } = useHandCards()

const callNext = () => next()

const cannotDefend = computed(() => {
  // Headhunter-Effekt: gegnerischer Spieler darf in dieser Runde nicht verteidigen
  if (gameTable.value.players[nextPlayer.value]?.tmpStats?.cannotDefend) return true

  if (availableDefenseCards.value !== null) {
    return availableDefenseCards.value.length === 0
  }
  return (
    handCards.value.hand[nextPlayer.value]?.filter(
      (c): boolean => !!(c && c.type === CARD_TYPES.DEFENSE),
    ).length <= 0
  )
})

const callDefend = () => {
  if (availableDefenseCards.value !== null) {
    // Netzwerk-Modus: ausgewählte Karte aus der vorgegebenen Liste lesen
    const { handCard } = gameTable.value.players[nextPlayer.value].selectedCards
    const defenseCard =
      handCard !== null ? availableDefenseCards.value[handCard] : undefined
    next(defenseCard)
  } else {
    // Lokaler Modus: wie bisher
    const { handCard } = gameTable.value.players[nextPlayer.value].selectedCards
    let defenseCard
    if (handCard !== null) {
      defenseCard = handCards.value.hand[nextPlayer.value][handCard]
    }
    playCards(nextPlayer.value)
    if (gameTable.value.showDamage) {
      next(defenseCard)
    }
  }
}

const noDefendCardsSelected = computed(() => {
  const { handCard, zoneCard } = gameTable.value.players[nextPlayer.value].selectedCards
  return handCard === null && zoneCard === null
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
  padding: 1rem;
}
.buttonContainer {
  display: block;
  width: 100%;
  padding: 2px;
}
.cardsContainer {
  display: flex;
  gap: 5px;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-bottom: 0.5rem;
}
</style>
