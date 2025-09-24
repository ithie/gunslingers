<template>
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
        :player-index="playerIndex"
        :clickable="false"
      >
        <component :is="CARD_MAP[stackItem.type!]" v-bind="stackItem" />
      </Card>
      <Card
        v-else
        :player-index="playerIndex"
        :type="CARD_TYPES.EMPTY_STACK"
        :index="index"
      ></Card>
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
import ICard from '../../interfaces/ICard'

const { playerIndex } = defineProps<{
  playerIndex: number
}>()

const CARD_MAP = {
  [CARD_TYPES.EVENT]: EventCard,
  [CARD_TYPES.MODIFICATION]: ModificationCard,
  [CARD_TYPES.DEFENSE]: DefenseCard,
  [CARD_TYPES.CHARACTER]: Characters,
  [CARD_TYPES.ZONE]: ZoneCard,
}

const { gameTable } = useGameTable()

const player = computed(() => gameTable.value.players[playerIndex])

const boardStack = computed(() => player.value.boardStack)

const renderBoardStack = computed(() => {
  return boardStack.value
    .map((stack, stackIndex) => {
      const visibleStackItem: unknown[] = [
        stack.length > 0 ? stack[stack.length - 1] : [''],
      ]
      if (stackIndex === 3) {
        visibleStackItem.push({
          ...player.value.character,
          HP: player.value.vCharacter.HP,
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
</style>
