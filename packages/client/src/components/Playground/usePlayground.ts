import { computed, ref } from 'vue'
import ICard from '../../../../interfaces/src/ICard'

const boardStack = ref<Array<Array<ICard | undefined>[]>>([])

export default () => {
  return {
    boardStack,
    initStack: (players: number) => {
      boardStack.value = []
      new Array(players).fill('').forEach(() => {
        boardStack.value.push([[], [], [], [], [], [], [], []])
      })
    },
    loadStack: (stack: Array<Array<(ICard | undefined)[]>>) => {
      boardStack.value = stack
    },
    set: (playerIndex: number, stackIndex: number, card: ICard) => {
      boardStack.value[playerIndex][stackIndex].push(card)
    },
    get: (playerIndex: number) => ({
      boardStack: computed(() => boardStack.value[playerIndex] ?? [[]]),
    }),
  }
}
