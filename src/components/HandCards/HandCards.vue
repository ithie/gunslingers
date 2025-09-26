<template>
  <div class="cardsContainer">
    <div class="cardItem" v-for="(card, index) in cards" :key="index">
      <Card
        v-if="card"
        :index="index"
        :player-index="playerIndex"
        :clickable="isPlayerActive"
        :type="card.type"
        :name="isPlayerActive ? card.name : ''"
      >
        <component v-if="!hideCards" :is="CARD_MAP[card.type!]" v-bind="card" />
      </Card>
      <Card
        v-else
        :index="index"
        :player-index="playerIndex"
        :type="CARD_TYPES.EMPTY_STACK"
        name=""
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { CARD_TYPES } from '../../enums'
import Card from '../Card/Card.vue'
import ZoneCard from '../ZoneCard/ZoneCard.vue'
import useGameTable from '../../composables/useGameTable'
import ModificationCard from '../ModificationCard/ModificationCard.vue'
import DefenseCard from '../DefenseCard/DefenseCard.vue'
import EventCard from '../EventCard/EventCard.vue'
import Characters from '../Characters/Characters.vue'
import useHandCards from './useHandCards'

const { playerIndex, type, filter } = defineProps<{
  playerIndex: number
  type: 'zone' | 'hand'
  filter?: CARD_TYPES
  hideCards?: boolean
}>()

const { handCards } = useHandCards()

const cards = computed(() => {
  if (filter) {
    return handCards.value[type][playerIndex].filter(
      (item) => item && item.type === filter,
    )
  }
  return handCards.value[type][playerIndex]
})

const CARD_MAP = {
  [CARD_TYPES.EVENT]: EventCard,
  [CARD_TYPES.MODIFICATION]: ModificationCard,
  [CARD_TYPES.DEFENSE]: DefenseCard,
  [CARD_TYPES.CHARACTER]: Characters,
  [CARD_TYPES.ZONE]: ZoneCard,
}

const { gameTable } = useGameTable()

const isPlayerActive = computed(
  () => playerIndex === gameTable.value.turnStats.activePlayerIndex,
)
</script>
<style lang="scss">
.cardsContainer {
  display: flex;
  gap: 5px;
  flex-direction: row;
  flex-wrap: nowrap;
}
.cardItem {
  display: inline-flex;
}
</style>
