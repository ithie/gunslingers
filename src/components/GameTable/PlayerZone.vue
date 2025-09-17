<template>
  <div class="playerZone">
    {{ name }} {{ activeTurn }}
    <div class="section">
      <div class="handCardsContainer">
        <div class="cardsContainer">
          <div
            class="cardItem"
            v-for="(zoneCard, index) in zoneCards"
            :key="index"
          >
            <Card
              v-if="zoneCard"
              :index="index"
              clickable
              :type="CARD_TYPES.ZONE"
              :name="zoneCard.name"
            >
              <ZoneCard :zones="zoneCard.zones" :index="index" />
            </Card>
            <Card
              v-else
              :index="index"
              :type="CARD_TYPES.EMPTY_STACK"
              name=""
            />
          </div>
        </div>
        <div>
          <button v-if="!activeTurn.cardsPlayed" @click="playCards">
            Karten legen
          </button>
          <button v-if="activeTurn.cardsPlayed" @click="attack">
            Angreifen
          </button>
          <button v-if="activeTurn.cardsPlayed" @click="endTurn">
            Zug beenden
          </button>
        </div>
        <div class="cardsContainer">
          <div class="cardItem" v-for="(handCard, index) in hand" :key="index">
            <Card
              v-if="handCard"
              :index="index"
              clickable
              :type="handCard.type"
              :name="handCard.name"
            >
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
            <Card
              v-else
              :index="index"
              :type="CARD_TYPES.EMPTY_STACK"
              name=""
            />
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
            :index="index"
          >
            <Gunslinger v-if="stackItem?.name === 'gunslinger'" />
            <Gambler v-if="stackItem?.name === 'gambler'" />
            <Headhunter v-if="stackItem?.name === 'headhunter'" />
          </Card>
          <Card
            v-else-if="stackItem && stackItem.type"
            :name="stackItem.name"
            :type="stackItem.type"
            :index="index"
          >
            <ModificationCard
              v-if="stackItem.type === CARD_TYPES.MODIFICATION"
              v-bind="stackItem"
            />
            <DefenseCard
              v-else-if="stackItem.type === CARD_TYPES.DEFENSE"
              v-bind="stackItem"
            />
            <EventCard
              v-else-if="stackItem.type === CARD_TYPES.EVENT"
              v-bind="stackItem"
            />
          </Card>
          <Card v-else :type="CARD_TYPES.EMPTY_STACK" :index="index"></Card>
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
import Gunslinger from '../Characters/Gunslinger.vue'
import Gambler from '../Characters/Gambler.vue'
import Headhunter from '../Characters/Headhunter.vue'

const { index } = defineProps<{
  index: number
}>()

const { gameTable, playCards, attack, endTurn, calculateStats } = useGameTable()

// calculateStats()

const player = computed(() => gameTable.value.players[index])

const activeTurn = computed(() => gameTable.value.activeTurn)
const name = computed(() => player.value.name)
const zoneCards = computed(() => player.value.zoneCards)
const boardStack = computed(() => player.value.boardStack)
const hand = computed(() => player.value.hand)

const renderBoardStack = computed(() => {
  return boardStack.value
    .map((stack, index) => {
      const visibleStackItem: unknown[] = [
        stack.length > 0 ? stack[stack.length - 1] : [''],
      ]
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
  gap: 15px 50px;
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
