<template>
  <div class="playgroundStack">
    <template
      v-for="(stackItemSet, stackIndex) in renderBoardStack"
      :key="stackIndex"
    >
      <div
        class="field"
        v-for="(stackItem, index) in stackItemSet"
        :key="index"
      >
        <Card
          v-if="stackItem && stackItem.type"
          :name="stackItem.name"
          :type="stackItem.type"
          :index="stackIndex"
          :player-index="playerIndex"
          :clickable="false"
        >
          <component
            :playerIndex="playerIndex"
            v-if="!!stackItem"
            :is="CARD_MAP[stackItem.type!]"
            v-bind="stackItem"
            has-effect
          />
        </Card>
        <Card
          v-else
          :player-index="playerIndex"
          :type="CARD_TYPES.EMPTY_STACK"
          :index="index"
        ></Card>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed, Ref, ref, watch } from 'vue'
import { CARD_TYPES, VALUE_TYPES } from '../../enums'
import Card from '../Card/Card.vue'
import ZoneCard from '../ZoneCard/ZoneCard.vue'
import useGameTable from '../../composables/useGameTable'
import ModificationCard from '../ModificationCard/ModificationCard.vue'
import DefenseCard from '../DefenseCard/DefenseCard.vue'
import EventCard from '../EventCard/EventCard.vue'
import Characters from '../Characters/Characters.vue'
import ICard from '../../interfaces/ICard'
import usePlayground from './usePlayground'
import ICharacterStats from '../../interfaces/ICharacterStats'

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

const { boardStack } = usePlayground().get(playerIndex)

const renderBoardStack = ref<(ICard | ICharacterStats | '')[][]>()

const makeComparable = (
  boardStack: (ICard | undefined)[][],
  vCharacter: ICharacterStats,
) => {
  return `${boardStack
    .map((item, index) =>
      !!item.length ? `${item[0].name}:${item[0].type}.` : `${index}.`,
    )
    .join('-')}_${vCharacter[VALUE_TYPES.HP]}:${vCharacter[VALUE_TYPES.ATK]}:${
    vCharacter[VALUE_TYPES.SPD]
  }:${vCharacter[VALUE_TYPES.DEF]}`
}

watch(
  () => [boardStack.value, player.value.vCharacter],
  (
    [currBoardStack, currVCharacter]: [
      (ICard | undefined)[][],
      ICharacterStats,
    ],
    [prevBoardStack, prevVCharacter]: [
      (ICard | undefined)[][],
      ICharacterStats,
    ] = [[], {} as ICharacterStats],
  ) => {
    const curr = makeComparable(currBoardStack, currVCharacter)
    const prev = makeComparable(prevBoardStack, prevVCharacter)

    if (curr !== prev) {
      renderBoardStack.value = currBoardStack.map((stack, stackIndex) => {
        const visibleStackItem: (ICard | '' | ICharacterStats)[] = [
          stack && stack.length > 0 ? stack[stack.length - 1] ?? '' : '',
        ]
        if (stackIndex === 3) {
          visibleStackItem.push({
            ...player.value.character,
            [VALUE_TYPES.HP]: player.value.vCharacter.HP,
            [VALUE_TYPES.ATK]: player.value.vCharacter.ATK,
            [VALUE_TYPES.DEF]: player.value.vCharacter.DEF,
            [VALUE_TYPES.SPD]: player.value.vCharacter.SPD,
          })
        }

        return visibleStackItem
      })
    }
  },
  {
    immediate: true,
  },
)
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
