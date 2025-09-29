import { computed, ref } from 'vue'
import ICard from '../../interfaces/ICard'

const boardStack = ref<Array<Array<ICard | undefined>[]>>([])

export default () => {
  return {
    boardStack,
    initStack: (players: number) => {
      new Array(players).fill('').forEach(() => {
        boardStack.value.push([[], [], [], [], [], [], [], []])
      })
    },
    set: (playerIndex: number, stackIndex: number, card: ICard) => {
      boardStack.value[playerIndex][stackIndex].push(card)
    },
    get: (playerIndex: number) => ({
      boardStack: computed(() => boardStack.value[playerIndex] ?? [[]]),
    }),
  }
}
