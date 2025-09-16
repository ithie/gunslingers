<template>
  <div class="playerZone">
    {{ name }}
    <div class="section">
      <div class="handCardsContainer">
        <div class="cardsContainer">
          <div
            class="cardItem"
            v-for="(zoneCard, index) in zoneCards"
            :key="index"
          >
            <Card :type="CARD_TYPES.CHARACTER" :name="zoneCard.name">
              <ZoneCard :zones="zoneCard.zones" />
            </Card>
          </div>
        </div>
        <div class="cardsContainer">
          <div class="cardItem" v-for="(handCard, index) in hand" :key="index">
            <Card :type="handCard.type" :name="handCard.name">
              <ModificationCard
                v-if="handCard.type === CARD_TYPES.MODIFICATION"
                v-bind="handCard"
              />
              <DefenseCard
                v-else-if="handCard.type === CARD_TYPES.DEFENSE"
                v-bind="handCard"
              />
              <EventCard
                v-else-if="handCard.type === CARD_TYPES.EVENT"
                v-bind="handCard"
              />
            </Card>
          </div>
        </div>
      </div>
      <div class="playgroundStack">
        <div
          class="field"
          v-for="(stackItem, index) in renderBoardStack"
          :key="index"
        >
          <Card
            v-if="stackItem?.type === CARD_TYPES.CHARACTER"
            :type="CARD_TYPES.CHARACTER"
          >
            {{ stackItem[VALUE_TYPES.ATK] }}<br />
            {{ stackItem[VALUE_TYPES.DEF] }}<br />
            {{ stackItem[VALUE_TYPES.SPD] }}
            <hr />
            {{}}
          </Card>
          <Card v-else :type="CARD_TYPES.EMPTY_STACK"></Card>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { CARD_TYPES, VALUE_TYPES } from '../../enums'
import Card from '../Card/Card.vue'
import ZoneCard from '../ZoneCard/ZoneCard.vue'
import useGameTable from '../../composables/useGameTable'
import ModificationCard from '../ModificationCard/ModificationCard.vue'
import DefenseCard from '../DefenseCard/DefenseCard.vue'
import EventCard from '../EventCard/EventCard.vue'

const { index } = defineProps<{
  index: number
}>()

const { gameTable, calculateStats } = useGameTable()

// calculateStats()

const player = computed(() => gameTable.value.players[index])

const name = computed(() => player.value.name)
const zoneCards = computed(() => player.value.zoneCards)
const boardStack = computed(() => player.value.boardStack)
const hand = computed(() => player.value.hand)
const renderBoardStack = computed(() => {
  return boardStack.value
    .map((stack, index) => {
      const visibleStackItem: unknown[] = [stack]
      if (index === 3) {
        visibleStackItem.push({
          ...player.value.character,
        })
      }

      return visibleStackItem
    })
    .flat()
})
</script>
<style lang="scss">
.playerZone {
  width: 100%;
  border: 1px solid black;
  padding: 5px;
}
.cardsContainer {
  display: flex;
  gap: 5px;
  flex-direction: row;
  flex-wrap: nowrap;
}
.cardItem {
  display: inline-flex;
}
.handCardsContainer {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
.playgroundStack {
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: auto auto auto;
  gap: 5px;
}
.field {
  padding: 5px;
  display: block;
  align-items: center;
}
.section {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
}
</style>
