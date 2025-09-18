<template>
  <div class="playerZone">
    {{ name }} {{ activeTurn }} isActive? {{ isPlayerActive }}
    <div class="section">
      <div class="handCardsContainer">
        <div class="cardsContainer">
          <div
            class="cardItem"
            v-for="(zoneCard, index) in zoneCards"
            :key="index"
          >
            <Card
              v-if="zoneCard && zoneCard?.zones"
              :index="index"
              clickable
              :type="CARD_TYPES.ZONE"
              :name="zoneCard.name"
            >
              <ZoneCard v-bind="zoneCard" />
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
              v-if="handCard && handCard.type"
              :index="index"
              :clickable="
                isPlayerActive && handCard.type !== CARD_TYPES.DEFENSE
              "
              :type="handCard.type"
              :name="isPlayerActive ? handCard.name : ''"
            >
              <component
                v-if="isPlayerActive"
                :is="CARD_MAP[handCard.type!]"
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
            v-if="stackItem && stackItem.type"
            :name="stackItem.name"
            :type="stackItem.type"
            :index="index"
          >
            <component :is="CARD_MAP[stackItem.type!]" v-bind="stackItem" />
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
import Characters from '../Characters/Characters.vue'

const { index } = defineProps<{
  index: number
}>()

const CARD_MAP = {
  [CARD_TYPES.EVENT]: EventCard,
  [CARD_TYPES.MODIFICATION]: ModificationCard,
  [CARD_TYPES.DEFENSE]: DefenseCard,
  [CARD_TYPES.CHARACTER]: Characters,
}

const { gameTable, playCards, attack, endTurn, calculateStats } = useGameTable()

const player = computed(() => gameTable.value.players[index])

const activeTurn = computed(() => gameTable.value.activeTurn)
const name = computed(() => player.value.name)
const zoneCards = computed(() => player.value.zoneCards)
const boardStack = computed(() => player.value.boardStack)
const hand = computed(() => player.value.hand)

const isPlayerActive = computed(
  () => index === gameTable.value.turnStats.activePlayerIndex,
)

const renderBoardStack = computed(() => {
  return boardStack.value
    .map((stack, stackIndex) => {
      const visibleStackItem: unknown[] = [
        stack.length > 0 ? stack[stack.length - 1] : [''],
      ]
      if (stackIndex === 3) {
        visibleStackItem.push({
          ...player.value.character,
          ATK: player.value.vCharacter.ATK,
          DEF: player.value.vCharacter.DEF,
          SPD: player.value.vCharacter.SPD,
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
