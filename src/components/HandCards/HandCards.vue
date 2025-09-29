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
        <component
          v-if="!hideCards"
          :is="getCardComponent(card.type)"
          v-bind="{ ...(card as CardProps) }"
          :player-index="playerIndex"
        />
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
import useGameTable from '../../composables/useGameTable'
import useHandCards from './useHandCards'
import getCardComponent, { CardProps } from '../../utils/getCardComponent'

const { playerIndex, type, filter } = defineProps<{
  playerIndex: number
  type: 'zone' | 'hand'
  filter?: Exclude<CARD_TYPES, CARD_TYPES.EMPTY_STACK>
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
